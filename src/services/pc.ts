import axios from 'axios';
import { EXPRESS_API_URL } from '.';

export const service = {
	getWeight: async () => axios.get('/weight', { baseURL: EXPRESS_API_URL }),

	recalibrate: async () =>
		axios.post('/zero', {}, { baseURL: EXPRESS_API_URL }),

	printProduct: async (body) =>
		axios.post('/print-product', body, { baseURL: EXPRESS_API_URL }),

	printTransaction: async (body) =>
		axios.post('/print-transaction', body, { baseURL: EXPRESS_API_URL }),
};
