import axios from 'axios';
import { IGetRequest } from '.';

export const service = {
	// TODO: Use the online version of the API while we're directly requesting from the Back Office Server
	list: async (params: IGetRequest) =>
		axios.get('/product-categories/', { params }),
};
