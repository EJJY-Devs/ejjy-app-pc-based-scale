import { call, put, takeLatest } from 'redux-saga/effects';
import { actions, types } from '../ducks/auth';
import { request } from '../global/types';
import { LOCAL_API_URL } from '../services';
import { service } from '../services/auth';
import { getUserTypeDescription } from '../utils/function';

/* WORKERS */
function* login({ payload }: any) {
	const { login, password, callback } = payload;
	callback(request.REQUESTING);

	try {
		const loginResponse = yield call(service.login, { login, password }, LOCAL_API_URL);

		if (loginResponse) {
			const tokenResponse = yield call(service.acquireToken, { username: login, password });

			yield put(
				actions.save({
					user: loginResponse.data,
					accessToken: tokenResponse.data.access,
					refreshToken: tokenResponse.data.refresh,
				}),
			);

			callback(request.SUCCESS);
		} else {
			callback(request.ERROR, ['Username or password is invalid.']);
		}
	} catch (e) {
		callback(request.ERROR, e.errors);
	}
}

function* validateUser({ payload }: any) {
	const { login, password, userType, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.login, { login, password }, LOCAL_API_URL);

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
