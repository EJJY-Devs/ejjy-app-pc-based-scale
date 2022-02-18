import axios from 'axios';
import { IGetRequest } from '.';

export const service = {
	list: async (params: IGetRequest) =>
		axios.get('/offline-product-categories/', { params }),
};
