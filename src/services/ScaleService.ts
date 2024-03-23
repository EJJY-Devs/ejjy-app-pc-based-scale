import axios from 'axios';
import { EXPRESS_API_URL } from '.';

export interface PrintProduct {
	branchName: string;
	code: string;
	companyName: string;
	name: string;
	price: string;
	totalPrice: string;
	weight: string;
}

export interface PrintTransaction {
	branchName: string;
	companyName: string;
	totalPrice: string;
	transactionId: string;
}

export interface PrintTotal {
	branchName: string;
	companyName: string;
	totalPrice: string;
}

const service = {
	retrieveWeight: async () => {
		const response = await axios.get('/weight', { baseURL: EXPRESS_API_URL });

		return response.data;
	},

	tare: async () =>
		axios.post<boolean>('/tare', {}, { baseURL: EXPRESS_API_URL }),

	zero: async () =>
		axios.post<boolean>('/zero', {}, { baseURL: EXPRESS_API_URL }),

	printProduct: async (body: PrintProduct) =>
		axios.post<boolean>('/print-product', body, { baseURL: EXPRESS_API_URL }),

	printTransaction: async (body: PrintTransaction) =>
		axios.post<boolean>('/print-transaction', body, {
			baseURL: EXPRESS_API_URL,
		}),

	printTotal: async (body: PrintTotal) =>
		axios.post<boolean>('/print-total', body, { baseURL: EXPRESS_API_URL }),
};

export default service;
