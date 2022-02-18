import axios from 'axios';

const service = {
	get: async (baseURL = null) =>
		axios.get('offline-site-settings/single/', { baseURL }),
};

export default service;
