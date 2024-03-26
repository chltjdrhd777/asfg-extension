/**
 * * ==============================================
 * *  Example Title - Example Description
 *
 * @NamingConvention
 * 1. hook name = `use${fetching type}${hook name}API`
 * - fetching type
 * - Query = Query,
 * - Mutation = Create | Update | Delete
 * 2. hook parameter type = `use${hook name}Params`
 * 3. hook response type = `use{hook name}APIResponseType`
 * * ==============================================
 */

import { useQuery, useMutation } from '@tanstack/react-query';
import { axiosInstance } from '../apiClient';

/** Exmaple Query API */
export interface UseQueryExampleAPIParams {}
export interface UseQueryExampleAPIResponseType {}

export const useQueryExampleAPI = ({}: UseQueryExampleAPIParams) => {
    const queryKey = ``;
    const queryFn = () => axiosInstance.get(queryKey).then(res => res.data);

    return useQuery<UseQueryExampleAPIResponseType>({ queryKey: [queryKey], queryFn });
};

/** Example Mutation(Create) API */
export interface UseCreateExampleAPIParams {}
export interface useCreateExampleAPIResponseType {}

export const useCreateExampleAPI = ({}: UseCreateExampleAPIParams) => {
    const mutationKey = ``;
    const mutationFn = (data: any) => axiosInstance.post(mutationKey, data).then(res => res.data);

    return useMutation<useCreateExampleAPIResponseType>({ mutationKey: [mutationKey], mutationFn });
};

/** Example Mutation(Update) API */
export interface UseUpdateExampleAPIParams {}
export interface useUpdateExampleAPIResponseType {}

export const useUpdateExampleAPI = ({}: UseUpdateExampleAPIParams) => {
    const mutationKey = ``;
    const mutationFn = (data: any) => axiosInstance.put(mutationKey, data).then(res => res.data);

    return useMutation<useUpdateExampleAPIResponseType>({ mutationKey: [mutationKey], mutationFn });
};

/** Example Mutation(Delete) API */
export interface UseDeleteExampleAPIParams {}
export interface useDeleteExampleAPIResponseType {}

export const useDeleteExampleAPI = ({}: UseDeleteExampleAPIParams) => {
    const mutationKey = ``;
    const mutationFn = (data: any) => axiosInstance.delete(mutationKey, data).then(res => res.data);

    return useMutation<useDeleteExampleAPIResponseType>({ mutationKey: [mutationKey], mutationFn });
};
