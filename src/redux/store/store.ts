import {configureStore} from '@reduxjs/toolkit';
import {baseApi} from '../services/BaseApiSlice';
import employeeReducer from '../slices/emloyeeSlice';
import snackBarReducer from '../slices/snackbarSlice';


export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    employee: employeeReducer,
    snackBar: snackBarReducer,
  
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
