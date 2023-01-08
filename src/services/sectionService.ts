import { baseService } from 'src/services/baseService';

export type Section = {
  id: number;
  name: string;
};
const sectionService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getSections: builder.query<Section[], void>({
      query: () => 'sections',
      providesTags: ['SECTIONS'],
    }),
  }),
});

export const { useGetSectionsQuery } = sectionService;
export const { getSections } = sectionService.endpoints;
