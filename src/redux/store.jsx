
import { configureStore } from '@reduxjs/toolkit';
import fetchData   from './slices/ToDoSlice';

const store = configureStore({
  reducer: {
    data: fetchData,

  },
});

export default store;