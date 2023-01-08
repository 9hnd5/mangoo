import { CheckOutlined, PlusOutlined } from '@ant-design/icons';
import { Breadcrumb as AntBreadcrumb, Button, Drawer, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { selectTask } from 'pages/tasks/index.slice';
import React, { useContext } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { SubTaskItem } from 'src/components/SubTaskItem';
import { TaskForm, TaskFormType } from 'src/components/TaskForm';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppDispatch } from 'src/hooks/redux';
import * as yup from 'yup';
import {
  Task,
  taskService,
  useCompleteTaskMutation,
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useGetTasksQuery,
  useUpdateTaskMutation,
  useUpdateTaskPartialMutation,
} from 'src/services/taskService';

interface Props {
  task?: Task | null;
  children?: React.ReactNode;
}

interface TaskInfoContext {
  task: Task;
  form: UseFormReturn<TaskFormType, any>;
  parentTasks: Task[];
  setParentTasks: (data: Task[]) => void;
}
const schema = yup.object({
  name: yup.string().required('Name is required'),
});
const Context = React.createContext<TaskInfoContext>({} as any);
const defaultValues = {
  assigneeId: null,
  projectId: null,
  dueDate: null,
  parentId: null,
  priority: null,
  description: null,
  progress: null,
};
const TaskInfo = (props: Props) => {
  const dispatch = useAppDispatch();
  const [updateTask] = useUpdateTaskMutation();
  const [completeTask] = useCompleteTaskMutation();
  const { task, children } = props;
  const open = task ? true : false;
  const formValue = React.useMemo(() => {
    if (!task) return null;
    const { section, assignee, project, startDate, endDate, ...restTask } = task;
    return {
      ...restTask,
      sectionId: section.id,
      assigneeId: assignee && assignee.id,
      projectId: project && project.id,
      dueDate:
        startDate && endDate
          ? ([dayjs(new Date(startDate)), dayjs(new Date(endDate))] as [dayjs.Dayjs, dayjs.Dayjs])
          : null,
    };
  }, [task]);
  const form = useForm<TaskFormType>({
    defaultValues,
    resolver: yupResolver(schema),
    ...(formValue && { values: formValue }),
  });
  const [parentTasks, setParentTasks] = React.useState<Task[]>([]);

  const drawerTitle = () => {
    if (task && task.isComplete) {
      return (
        <Button icon={<CheckOutlined />} type="primary" onClick={() => handleComplete(false)}>
          Completed
        </Button>
      );
    }

    if (task && !task.isComplete) {
      return <Button onClick={() => handleComplete(true)}>Mark Complete</Button>;
    }
  };

  const handleClose = async () => {
    form.handleSubmit((data) => {
      const { id, name, sectionId, assigneeId, projectId, dueDate, description, parentId, priority, progress } = data;
      let startDate = null,
        endDate = null;
      if (dueDate) {
        startDate = dueDate[0].format('YYYY-MM-DD');
        endDate = dueDate[1].format('YYYY-MM-DD');
      }
      updateTask({
        id,
        name,
        sectionId,
        assigneeId,
        projectId,
        parentId,
        progress,
        priority,
        startDate,
        endDate,
        description,
      });
      dispatch(selectTask(null));
      setParentTasks([]);
    })();
  };

  const handleComplete = (isComplete: boolean) => {
    if (task) {
      completeTask({ task, isComplete });
      dispatch(selectTask({ ...task, isComplete }));
    }
  };

  return task ? (
    <Drawer open={open} onClose={handleClose} width={500} title={drawerTitle()}>
      <Context.Provider value={{ task, form, parentTasks, setParentTasks }}>{children}</Context.Provider>
    </Drawer>
  ) : (
    <Drawer open={open} onClose={handleClose} width={500} />
  );
};

const Form = () => {
  const dispatch = useAppDispatch();
  const { task, form } = useContext(Context);
  const { section, assignee, project, startDate, endDate, ...restTask } = task;

  //Manual update task name
  const handleNameChange = (value: string) => {
    dispatch(
      taskService.util.updateQueryData('getTasks', { sectionId: task.section.id }, (draftTasks) => {
        const index = draftTasks.findIndex((x) => x.id === task.id);
        if (index < 0) return draftTasks;
        draftTasks[index].name = value;
      }),
    );
  };

  return <TaskForm form={form} onNameChange={handleNameChange} />;
};

const SubTaskList = () => {
  const { task: parentTask, parentTasks, setParentTasks } = useContext(Context);
  const { data = [] } = useGetTasksQuery({ parentId: parentTask?.id });
  const dispatch = useAppDispatch();
  const [createTask] = useCreateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [updateTaskPartial] = useUpdateTaskPartialMutation();

  const handleSubTaskBlur = async (id: number, name: string) => {
    const {
      id: parentId,
      section: { id: sectionId },
    } = parentTask;

    if (!name)
      dispatch(
        taskService.util.updateQueryData('getTasks', { parentId: parentTask?.id }, (draftTasks) => {
          draftTasks.shift();
          return draftTasks;
        }),
      );
    else {
      if (id) {
        await updateTaskPartial({
          id,
          name,
        });
      } else {
        await createTask({ name, sectionId, parentId });
      }
    }
  };

  const handleSubTaskClick = (task: Task) => {
    dispatch(selectTask(task));
    setParentTasks([...parentTasks, parentTask]);
  };

  const handleSubTaskCreate = () => {
    dispatch(
      taskService.util.updateQueryData('getTasks', { parentId: parentTask.id }, (draftTasks) => {
        const index = draftTasks.findIndex((x) => x.id === 0);
        if (index >= 0) return draftTasks;
        draftTasks.unshift({ id: 0, name: '' } as any);
        return draftTasks;
      }),
    );
  };

  const handleSubTaskDelete = (task: Task) => {
    deleteTask(task);
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Button icon={<PlusOutlined />} onClick={handleSubTaskCreate}>
        Add Subtask
      </Button>
      <Space size={4} direction="vertical" style={{ width: '100%' }}>
        {data.map((item) => (
          <SubTaskItem
            key={item.id}
            task={item}
            onBlur={handleSubTaskBlur}
            onClick={handleSubTaskClick}
            onDelete={handleSubTaskDelete}
          />
        ))}
      </Space>
    </Space>
  );
};

const Breadcrumb = () => {
  const dispatch = useAppDispatch();
  const { parentTasks, setParentTasks } = useContext(Context);

  const handleClick = (item: Task) => {
    const index = parentTasks.findIndex((x) => x.id === item.id);
    if (index < 0) return;
    const cloneParentTasks = [...parentTasks];
    cloneParentTasks.splice(index);
    dispatch(selectTask(item));
    setParentTasks(cloneParentTasks);
  };

  return (
    <AntBreadcrumb style={{ marginBottom: 8 }}>
      {parentTasks.map((item) => (
        <AntBreadcrumb.Item onClick={() => handleClick(item)} key={item.id}>
          <Typography.Link> {item.name}</Typography.Link>
        </AntBreadcrumb.Item>
      ))}
    </AntBreadcrumb>
  );
};

TaskInfo.Form = Form;
TaskInfo.Breadcrumb = Breadcrumb;
TaskInfo.SubTaskList = SubTaskList;
export { TaskInfo };
