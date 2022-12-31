import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from 'src/services/taskService';

type TaskSelected = Task;
type State = {
  taskSelected: TaskSelected | null;
};
const taskSlice = createSlice({
  name: 'task',
  initialState: { taskSelected: null } as State,
  reducers: {
    selectTask: (state, action: PayloadAction<TaskSelected | null>) => {
      const { payload } = action;
      state.taskSelected = payload;
    },
  },
});

export const { selectTask } = taskSlice.actions;
export default taskSlice.reducer;
