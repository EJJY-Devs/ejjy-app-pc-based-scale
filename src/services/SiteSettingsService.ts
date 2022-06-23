import axios from 'axios';

const service = {
	get: async (baseURL = null) =>
		axios.get('site-settings/single/', { baseURL }),
};

export default service;
