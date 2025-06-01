import { configureStore } from '@reduxjs/toolkit';
import recordsReducer from '../features/tableBlock/recordsSlice';

export const store = configureStore({
  reducer: { records: recordsReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
