import {API_TOKEN} from '@env';
import { baseApi } from '../../BaseApiSlice';

// Define a service using a base URL and expected endpoints
export const attendanceSlice = baseApi.injectEndpoints({
  endpoints: builder => ({
    getActivityAttendanceSites: builder.query<any, void>({
      query: () => {
        return {
          url: `GetSite`,
          method: 'GET',
        };
      },
      transformResponse: response => response?.data,
    }),
    activityCheckin: builder.mutation<any, void>({
      query: payload => {
        return {
          url: `checkinsite`,
          method: 'POST',
          body: payload,
        };
      },
      invalidatesTags: ['activityInOut'],
    }),
    activityCheckOut: builder.mutation<any, void>({
      query: payload => {
        return {
          url: `checkoutsite`,
          method: 'POST',
          body: payload,
        };
      },
      invalidatesTags: ['activityInOut'],
    }),
    getActivityLatestInoutDetails: builder.query<any, void>({
      query: () => {
        return {
          url: `inoutdetails`,
          method: 'GET',
        };
      },
      transformResponse: response => response?.data,
      providesTags: ['activityInOut'],
    }),
    getActivitySiteDetails: builder.query<any, void>({
      query: () => {
        return {
          url: `GetSite`,
          method: 'GET',
        };
      },
      transformResponse: response => response?.data,
    }),
    // GetSite
  }),
});

export const {
  useGetActivityAttendanceSitesQuery,
  useActivityCheckOutMutation,
  useActivityCheckinMutation,
  useGetActivityLatestInoutDetailsQuery,
  useGetActivitySiteDetailsQuery,
} = attendanceSlice;
