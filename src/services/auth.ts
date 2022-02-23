import axios from 'axios';

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

	acquireToken: async (body: IAcquireToken) =>
		axios.post('tokens/acquire/', body),

	getBranch: async (branchId: number) => axios.get(`branches/${branchId}/`),
};
