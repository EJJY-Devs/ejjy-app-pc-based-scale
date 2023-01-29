import axios from 'axios';
import { ListRequest } from 'services/interfaces';

const service = {
	list: async (params: ListRequest, baseURL) =>
		axios.get('/branches/', { baseURL, params }),
};

export default service;
