import axios from 'axios';

const service = {
	test: async () => axios.get('branches/'),
};

export default service;
