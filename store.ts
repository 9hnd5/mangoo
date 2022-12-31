import { configureStore } from '@reduxjs/toolkit';
import taskReducer from 'pages/tasks/index.slice';
import { baseService } from 'src/services/baseService';

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
    [baseService.reducerPath]: baseService.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseService.middleware),
  devTools: true,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
