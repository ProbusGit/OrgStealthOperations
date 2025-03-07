import { API_TOKEN, REACT_APP_BASE_URL } from '@env';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseApiTags } from '../../common/constants/tags';


// Debugging the environment variables
console.log('REACT_APP_BASE_URL:', REACT_APP_BASE_URL);
console.log('API_TOKEN:', API_TOKEN);

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: REACT_APP_BASE_URL,
    prepareHeaders: (headers) => {
      if (API_TOKEN) {
        headers.set('Authorization', `Bearer ${API_TOKEN}`);
      }
      return headers;
    },
  }),
  tagTypes: baseApiTags,
  endpoints: () => ({}),
});

