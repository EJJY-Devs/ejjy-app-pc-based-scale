import axios from 'axios';
import { ONLINE_API_URL } from './index';

interface ILogin {
	login: string;
	password: string;
}

interface IAcquireToken {
	username: string;
	password: string;
}

export const service = {
	login: async (body: ILogin, baseURL = null) =>
		axios.post('users/login/', body, { baseURL }),

	loginOnline: async (body: ILogin) =>
		axios.post('users/login_online/', body, { baseURL: ONLINE_API_URL }),

	acquireToken: async (body: IAcquireToken) =>
		axios.post('tokens/acquire/', body, { baseURL: ONLINE_API_URL }),

	getBranch: async (branchId: number) =>
		axios.get(`branches/${branchId}/`, { baseURL: ONLINE_API_URL }),
};
