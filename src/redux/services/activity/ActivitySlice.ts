import {API_TOKEN} from '@env';
import { baseApi } from '../BaseApiSlice';

// Define a service using a base URL and expected endpoints
export const activityApi = baseApi.injectEndpoints({
  endpoints: builder => ({

    startDay: builder.mutation<any, void>({
      query: payload => {
        return {
          url: `/api/checkinfield`,
          method: 'POST',
          body: payload,
        };
      },
      invalidatesTags:['startEndDay']
    }),
    endDay: builder.mutation<any, void>({
      query: payload => {
        return {
          url: `/api/checkoutfield`,
          method: 'POST',
          body: payload,
        };
      },
      invalidatesTags:['startEndDay']
    }),
    getStartEndDayDetails: builder.query<any, void>({
      query: () => {
        return {
          url: `/api/latestStatus`,
          method: 'GET',
        };
      },
      transformResponse: response => response?.data,
      providesTags: ['startEndDay'],
    }),
    // /api/tracktime
    getTrackTime: builder.query<any, void>({
      query: () => {
        return {
          url: `/api/tracktime`,
          method: 'GET',
        };
      },
      transformResponse: response => response?.data,
      providesTags: ['startEndDay'],
    }),

  }),
});

export const {
  useStartDayMutation,useEndDayMutation,useGetStartEndDayDetailsQuery,useGetTrackTimeQuery

} = activityApi;
