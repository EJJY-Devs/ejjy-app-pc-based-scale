import axios from 'axios';

interface ICreate {
	type: string;
}

const service = {
	create: async (body: ICreate) => axios.post('/connectivity-logs/', body),
};

export default service;
