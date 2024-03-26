import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

/**
 * base config for axios instance creation
 */
export const baseCreateAxiosDefaults = {
	baseURL: process.env.NEXT_PUBLIC_SERVER_BASE_URL,
	timeout: 3000,
	withCredentials: true,
	headers: {
		'Content-type': 'application/json',
	},
};

/**
 * request interceptors
 * @param config request config(baseCreateAxiosDefaults)
 */
export const baseOnRequestFullfilled = (config: InternalAxiosRequestConfig<any>) => {
	console.debug(config);
	return config;
};
export const baseOnRequestRejected = (error: any) => {
	console.debug(error);
	return Promise.reject(error);
};

/**
 * response interceptors
 * @param response response result
 */
export const baseOnResponseFullfiled = (response: AxiosResponse<any, any>) => {
	console.debug(response);
	return response;
};
export const baseOnResponseRejected = (error: any) => {
	switch (error.response.status) {
		// Unauthorized
		case 401:
			console.debug('Unauthorized');
			break;
		// extra
		default:
			console.debug('500 error');
			break;
	}

	return Promise.reject(error);
};
