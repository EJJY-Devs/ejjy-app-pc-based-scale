import axios from 'axios';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { actions, selectors, types } from '../ducks/auth';
import { request, userTypes } from '../global/types';
import { service } from '../services/auth';
import { getUserTypeDescription } from '../utils/function';

/* WORKERS */
function* login({ payload }: any) {
	const { login, password, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const loginResponse = yield call(service.loginOnline, { login, password });

		if (loginResponse) {
			if (loginResponse.data.user_type === userTypes.BRANCH_MANAGER) {
				const user = loginResponse.data;
				const tokenResponse = yield call(service.acquireToken, { username: login, password });
				yield put(
					actions.save({
						user: user,
						accessToken: tokenResponse.data.access,
						refreshToken: tokenResponse.data.refresh,
					}),
				);

				const branchResponse = yield call(service.getBranch, user?.branch?.id);
				const localIpAddress = branchResponse.data?.local_ip_address;

				if (localIpAddress) {
					axios.defaults.baseURL = localIpAddress;
					yield put(actions.save({ localIpAddress: localIpAddress }));
					callback({ status: request.SUCCESS });
				} else {
					callback({
						status: request.ERROR,
						errors: ['No local API address set on this branch yet.'],
					});
				}
			} else {
				callback({
					status: request.ERROR,
					errors: ['Only a branch manager is allowed to log in.'],
				});
			}
		} else {
			callback({ status: request.ERROR, errors: ['Username or password is invalid.'] });
		}
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* validateUser({ payload }: any) {
	const { login, password, userType, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const localApiUrl = yield select(selectors.selectLocalIpAddress());
		if (!localApiUrl) {
			callback({ status: request.ERROR, errors: ['Local API URL not found.'] });
		}

		const response = yield call(service.login, { login, password }, localApiUrl);

		if (response.data.user_type === userType) {
			callback({ status: request.SUCCESS });
		} else {
			callback({
				status: request.ERROR,
				errors: [`User is not a ${getUserTypeDescription(userType)}.`],
			});
		}
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
const loginWatcherSaga = function* loginWatcherSaga() {
	yield takeLatest(types.LOGIN, login);
};

const validateUserWatcherSaga = function* validateUserWatcherSaga() {
	yield takeLatest(types.VALIDATE_USER, validateUser);
};

export default [loginWatcherSaga(), validateUserWatcherSaga()];
