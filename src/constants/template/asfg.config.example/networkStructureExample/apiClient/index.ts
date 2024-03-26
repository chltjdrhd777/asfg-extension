import axios, {
	AxiosInstance,
	AxiosResponse,
	CreateAxiosDefaults,
	InternalAxiosRequestConfig,
} from 'axios';
import {
	baseCreateAxiosDefaults,
	baseOnRequestFullfilled,
	baseOnRequestRejected,
	baseOnResponseFullfiled,
	baseOnResponseRejected,
} from './baseConfig';

interface GetInstanceParams {
	createAxiosDefaults?: CreateAxiosDefaults;

	onRequestFullfilled?: (config: InternalAxiosRequestConfig<any>) => any;
	onRequestRejected?: (error: any) => any;

	onResponseFullfilled?: (response: AxiosResponse<any, any>) => any;
	onResponseRejected?: (error: any) => any;
}

class Axios {
	static instance: AxiosInstance | null = null;

	static getInstance(getInstanceParams?: GetInstanceParams) {
		const {
			createAxiosDefaults,
			onRequestFullfilled,
			onRequestRejected,
			onResponseFullfilled,
			onResponseRejected,
		} = getInstanceParams ?? {};

		if (!this.instance) {
			this.instance = axios.create(createAxiosDefaults ?? baseCreateAxiosDefaults);

			this.instance.interceptors.request.use(
				onRequestFullfilled ?? baseOnRequestFullfilled,
				onRequestRejected ?? baseOnRequestRejected,
			);

			this.instance.interceptors.response.use(
				onResponseFullfilled ?? baseOnResponseFullfiled,
				onResponseRejected ?? baseOnResponseRejected,
			);

			return this.instance;
		} else {
			return this.instance;
		}
	}
}

export const axiosInstance = Axios.getInstance();
export const getAxiosInstance = Axios.getInstance;
