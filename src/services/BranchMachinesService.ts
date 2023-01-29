import axios from 'axios';
import { ListRequest } from 'services/interfaces';

interface List extends ListRequest {
	branch_id?: number;
}

interface Ping {
	online_branch_machine_id: number;
	online_api_url_override: string;
}

const service = {
	list: async (params: List, baseURL) =>
		axios.get('/branch-machines/', { baseURL, params }),

	ping: async (body: Ping, baseURL) =>
		axios.post('/offline-branch-machines/ping/', body, { baseURL }),
};

export default service;
