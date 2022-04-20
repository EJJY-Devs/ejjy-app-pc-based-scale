import axios from 'axios';

const service = {
	initialize: async () => axios.get('/bulk-initialize/'),
};

export default service;
