import axios from 'axios';
import { EXPRESS_API_URL } from '.';

export const service = {
	getWeight: async () => axios.get('/weight', { baseURL: EXPRESS_API_URL }),
};
