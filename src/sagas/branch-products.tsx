import { put, retry, takeLatest } from 'redux-saga/effects';
import { actions, types } from '../ducks/branch-products';
import { MAX_PAGE_SIZE, MAX_RETRY, RETRY_INTERVAL_MS } from '../global/constants';
import { request } from '../global/types';
import { service } from '../services/branch-products';

/* WORKERS */
function* list({ payload }: any) {
	const { callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield retry(MAX_RETRY, RETRY_INTERVAL_MS, service.list, {
			page: 1,
			page_size: MAX_PAGE_SIZE,
			is_shown_in_scale_list: true,
		});

		yield put(
			actions.save({
				type: types.LIST_BRANCH_PRODUCTS,
				branchProducts: response.data.results,
			}),
		);
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
const listWatcherSaga = function* listWatcherSaga() {
	yield takeLatest(types.LIST_BRANCH_PRODUCTS, list);
};

export default [listWatcherSaga()];
