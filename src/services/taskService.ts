import { notification } from 'antd';
import queryString from 'query-string';
import { baseService } from './baseService';

export interface Task {
  id: number;
  name: string;
  section: {
    id: number;
    name: string;
  };
  assignee: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
  startDate: string | null;
  endDate: string | null;
  project: {
    id: number;
    name: string;
  } | null;
  priority: 'Low' | 'Medium' | 'High' | null;
  progress: 'NotStarted' | 'InProgress' | 'Waiting' | 'Defered' | 'Done' | null;
  parentId: number | null;
  description: string | null;
  isPublic: boolean;
}

interface PostTask {
  name: string;
  sectionId: number;
  parentId?: number;
}
interface PutTask {
  id: number;
  name: string;
  sectionId: number;
  assigneeId?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  projectId?: number | null;
  priority?: 'Low' | 'Medium' | 'High' | null;
  progress?: 'NotStarted' | 'InProgress' | 'Waiting' | 'Defered' | 'Done' | null;
  parentId?: number | null;
  description?: string | null;
}
interface PatchTask {
  id: number;
  name?: string;
}

interface GetTasksQuery {
  sectionId?: number | null;
  parentId?: number | null;
}
export const taskService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], GetTasksQuery | void>({
      query: (params) => {
        return `tasks?${queryString.stringify(params ? params : {})}`;
      },
      providesTags: ['TASKS'],
    }),
    sortTask: builder.mutation<void, { activeId: number; overId: number }>({
      query: (data) => ({ url: 'tasks', method: 'PATCH', body: data }),
      invalidatesTags: ['TASKS'],
    }),
    createTask: builder.mutation<void, PostTask>({
      query: (data) => ({
        url: 'tasks',
        method: 'POST',
        body: data,
      }),
      onQueryStarted(data, { dispatch, queryFulfilled }) {},
      invalidatesTags: ['TASKS'],
    }),
    updateTask: builder.mutation<void, PutTask>({
      query: (data) => {
        return {
          url: `tasks/${data.id}`,
          method: 'PUT',
          body: data,
        };
      },
      async onQueryStarted(data, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.log('err', err);
        }
      },
      invalidatesTags: ['TASKS'],
    }),
    updateTaskPartial: builder.mutation<void, PatchTask>({
      query: (data) => {
        return {
          url: `tasks/${data.id}`,
          method: 'PATCH',
          body: data,
        };
      },
      async onQueryStarted(data, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.log('err', err);
        }
      },
      invalidatesTags: ['TASKS'],
    }),
    deleteTask: builder.mutation<void, Task>({
      query: (task) => {
        const { id } = task;
        return {
          url: `tasks/${id}`,
          method: 'DELETE',
        };
      },
      async onQueryStarted(data, { dispatch, queryFulfilled }) {
        dispatch(
          taskService.util.updateQueryData('getTasks', { parentId: data.parentId }, (draftTasks) => {
            const index = draftTasks.findIndex((x) => x.id === data.id);
            if (index < 0) return draftTasks;
            draftTasks.splice(index, 1);
            notification.success({ message: 'Delete Successfully', placement: 'bottomLeft' });
            return draftTasks;
          }),
        );
        dispatch(
          taskService.util.updateQueryData('getTasks', { sectionId: data.section.id }, (draftTasks) => {
            const index = draftTasks.findIndex((x) => x.id === data.id);
            if (index < 0) return draftTasks;
            draftTasks.splice(index, 1);
            notification.success({ message: 'Delete Successfully', placement: 'bottomLeft' });
            return draftTasks;
          }),
        );
        try {
          await queryFulfilled;
        } catch (err) {
          console.log('err', err);
        }
      },
    }),
  }),
});

export const {
  useGetTasksQuery,
  useSortTaskMutation,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskPartialMutation,
} = taskService;
