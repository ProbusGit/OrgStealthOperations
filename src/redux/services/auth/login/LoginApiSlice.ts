import { baseApi } from '../../BaseApiSlice';
import { LoginResponse, LoginApiArgs } from './types';

// Define a service using a base URL and expected endpoints
export const loginApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginApiArgs>({
      query: (payload) => ({
        url: `api/loginOP`,//ops
        // url: `api/loginAttendance`,//atd
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});

export const { useLoginMutation } = loginApi;

