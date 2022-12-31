import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseService = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001',
    mode: 'cors',
    headers: {
      authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzOWVmYWM5MDk5OTExNzVhYjNkZDE5MyIsInJvbGUiOnsibmFtZSI6ImFkbWluIiwiZGVzY3JpcHRpb24iOiLEkMOieSBsw6Agcm9sZSBj4bunYSBhZG1pbiJ9LCJpYXQiOjE2NzI0ODgxNzAsImV4cCI6MTY3MzA5Mjk3MH0.7j3B0uHjIQLMMQhSoaDbyoWlXaYCV8-kwfTl5_fOnWk`,
    },
  }),
  endpoints: () => ({}),
  tagTypes: ['TASKS', 'SECTIONS'],
});
