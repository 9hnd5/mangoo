import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
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
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action) => {
      console.log('HYDRATE', state, action);
      return {
        ...state,
        ...action,
      };
    });
  },
  // extraReducers: {
  //   [HYDRATE]: (state, action) => {
  //     console.log('HYDRATE', state, action.payload);
  //     return {
  //       ...state,
  //       ...action.payload,
  //     };
  //   },
  // },
});

export const { selectTask } = taskSlice.actions;
export default taskSlice.reducer;
