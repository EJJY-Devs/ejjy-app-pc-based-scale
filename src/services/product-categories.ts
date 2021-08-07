import axios from 'axios';
import { IGetRequest, ONLINE_API_URL } from '.';

export const service = {
	list: async (params: IGetRequest) =>
		axios.get('/product-categories/', { baseURL: ONLINE_API_URL, params }),
};
