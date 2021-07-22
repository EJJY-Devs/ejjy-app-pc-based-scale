import axios from 'axios';

interface ITransactionProduct {
	product_id: number;
	quantity: number;
}

interface ICreateTransaction {
	branch_machine_id?: number;
	teller_id: string;
	products: ITransactionProduct[];
}

export const service = {
	create: async (body: ICreateTransaction) =>
		axios.post('/transactions/', body),
};
