import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import taskReducer from 'pages/tasks/index.slice';
import { baseService } from 'src/services/baseService';

export const makeStore = () =>
  configureStore({
    reducer: {
      tasks: taskReducer,
      [baseService.reducerPath]: baseService.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseService.middleware),
    devTools: true,
  });

// Infer the `RootState` and `AppDispatch` types from the store itself
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export const wrapper = createWrapper<AppStore>(makeStore, { debug: true });
