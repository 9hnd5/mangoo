import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Space } from 'antd';
import { selectTask } from 'pages/tasks/index.slice';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { TaskFormType } from 'src/components/TaskForm';
import { TaskItem, TaskItemProps } from 'src/components/TaskItem';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import { Section } from 'src/services/sectionService';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Task,
  taskService,
  useCompleteTaskMutation,
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useGetTasksQuery,
} from 'src/services/taskService';

type Props = {
  section: Section;
  form?: UseFormReturn<TaskFormType, any>;
};
export const TaskList = (props: Props) => {
  const { section } = props;
  const taskSelected = useAppSelector((s) => s.tasks.taskSelected);
  const dispatch = useAppDispatch();
  const [taskCreate] = useCreateTaskMutation();
  const [completeTask] = useCompleteTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const { data = [] } = useGetTasksQuery({ sectionId: section.id });

  const handleTaskBlur = async (value: string) => {
    if (!value) {
      return dispatch(
        taskService.util.updateQueryData('getTasks', { sectionId: section.id }, (draftTasks) => {
          draftTasks.shift();
          return draftTasks;
        }),
      );
    }

    const data = { name: value, sectionId: section.id };
    try {
      await taskCreate(data);
    } catch (er) {}
  };

  const handleTaskClick = (task: Task) => {
    dispatch(selectTask(task));
  };

  const handleTaskDelete = (task: Task) => {
    deleteTask(task);
  };

  const handleTaskView = (task: Task) => {
    dispatch(selectTask(task));
  };

  const handleComplete = (task: Task) => {
    completeTask({ task, isComplete: true });
  };

  const handleIncomplete = (task: Task) => {
    completeTask({ task, isComplete: false });
  };

  return (
    <React.Fragment>
      <SortableContext id={section.id + ''} items={data} strategy={verticalListSortingStrategy}>
        <Space direction="vertical" style={{ width: '100%' }}>
          {data.map((item) => (
            <TaskItemSortable
              key={item.id}
              isClick={taskSelected?.id === item.id}
              task={item}
              type={item.id ? 'view' : 'create'}
              onBlur={handleTaskBlur}
              onTaskClick={handleTaskClick}
              onDelete={handleTaskDelete}
              onView={handleTaskView}
              onComplete={handleComplete}
              onIncomplete={handleIncomplete}
            />
          ))}
        </Space>
      </SortableContext>
    </React.Fragment>
  );
};

interface TaskItemSortableProps extends TaskItemProps {}
const TaskItemSortable = (props: TaskItemSortableProps) => {
  const { task } = props;
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task.id,
    data: task,
  });
  const containerStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={containerStyle}>
      <TaskItem {...props} drag={{ attributes, listeners }} />
    </div>
  );
};
