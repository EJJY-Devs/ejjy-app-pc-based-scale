import axios from 'axios';
import { EXPRESS_API_URL } from '.';

interface PrintProduct {
	branch: string;
	code: string;
	name: string;
	price: string;
	totalPrice: string;
	weight: string;
}

interface PrintTransaction {
	branch: string;
	totalPrice: string;
	transactionId: number;
}

const service = {
	retrieveWeight: async () =>
		axios.get('/weight', { baseURL: EXPRESS_API_URL }),

	tare: async () => axios.post('/tare', {}, { baseURL: EXPRESS_API_URL }),

	zero: async () => axios.post('/zero', {}, { baseURL: EXPRESS_API_URL }),

	printProduct: async (body: PrintProduct) =>
		axios.post('/print-product', body, { baseURL: EXPRESS_API_URL }),

	printTransaction: async (body: PrintTransaction) =>
		axios.post('/print-transaction', body, { baseURL: EXPRESS_API_URL }),
};

export default service;
