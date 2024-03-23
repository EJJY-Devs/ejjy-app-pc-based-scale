import axios from 'axios';
import {
	GENERIC_ERROR_MESSAGE,
	GENERIC_STATUS_500_MESSAGE,
	NO_VERIFICATION_NEEDED,
} from 'ejjy-global';
import _ from 'lodash';
import { getBranchServerUrl } from 'utils/function';

export default function configureAxios() {
	axios.defaults.timeout = 0;

	// add a request interceptor to all the axios requests
	// that are going to be made in the site. The purpose
	// of this interceptor is to verify if the access token
	// is still valid and renew it if needed and possible
	axios.interceptors.request.use(
		// eslint-disable-next-line func-names
		(config) => {
			// if there's no verification needed, just exit immediately
			if (NO_VERIFICATION_NEEDED === config.params) {
				return config;
			}

			if (!config.baseURL) {
				config.baseURL = getBranchServerUrl();
			}

			return config;
		},
		(error) => Promise.reject(error),
	);

	axios.interceptors.response.use(undefined, (error) => {
		const modifiedError = { ...error };

		if (error.isAxiosError) {
			if (error?.response?.status === 500) {
				modifiedError.errors = [GENERIC_STATUS_500_MESSAGE];
			} else if (typeof error?.response?.data === 'string') {
				modifiedError.errors = [error.response.data];
			} else if (typeof error?.response?.data === 'object') {
				modifiedError.errors = _.flatten(_.values(error?.response?.data));
			} else {
				modifiedError.errors = [GENERIC_ERROR_MESSAGE];
			}
		}

		return Promise.reject(modifiedError);
	});
}
