import { API_TOKEN } from '@env';
import { baseApi } from '../BaseApiSlice';
import { AttendanceLogData, } from './types';

// Define a service using a base URL and expected endpoints
export const attendanceApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // /LocationDetails

    addTrackTime: builder.mutation<any, any>({
      query: (payload: any) => ({
        url: '/api/track',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['locationTracking']
    }),
    getTrackTime:builder.query({
      query:()=>({
        url:'/api/tracktime',
        method:"GET"
      })
    })
  // /api/tracktime
  }),
});

export const {

  useAddTrackTimeMutation,
  useGetTrackTimeQuery

} = attendanceApi;
