import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Space } from 'antd';
import dayjs from 'dayjs';
import { selectTask } from 'pages/tasks/index.slice';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { TaskFormType } from 'src/components/TaskForm';
import { TaskItem } from 'src/components/TaskItem';
import { useAppDispatch } from 'src/hooks/redux';
import { Section } from 'src/services/sectionService';
import {
  Task,
  taskService,
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
  const [taskCreate] = useCreateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const dispatch = useAppDispatch();
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

  return (
    <React.Fragment>
      <SortableContext id={section.id + ''} items={data} strategy={verticalListSortingStrategy}>
        <Space direction="vertical" style={{ width: '100%' }}>
          {data.map((item) => (
            <TaskItem
              key={item.id}
              task={item}
              type={item.id ? 'view' : 'create'}
              onBlur={handleTaskBlur}
              onTaskClick={handleTaskClick}
              onDelete={handleTaskDelete}
            />
          ))}
        </Space>
      </SortableContext>
    </React.Fragment>
  );
};
