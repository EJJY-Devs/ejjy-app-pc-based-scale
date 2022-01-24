import { put, retry, takeLatest } from 'redux-saga/effects';
import { actions, types } from '../ducks/product-categories';
import {
	MAX_PAGE_SIZE,
	MAX_RETRY,
	RETRY_INTERVAL_MS,
} from '../global/constants';
import { request } from '../global/types';
import { service } from '../services/product-categories';

/* WORKERS */
function* list({ payload }: any) {
	const { callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield retry(MAX_RETRY, RETRY_INTERVAL_MS, service.list, {
			page: 1,
			page_size: MAX_PAGE_SIZE,
		});

		const sortedData = response.data.results.sort(
			(a, b) => a.priority_level - b.priority_level,
		);

		yield put(
			actions.save({
				productCategories: sortedData,
			}),
		);

		callback({ status: request.SUCCESS, data: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
const listWatcherSaga = function* listWatcherSaga() {
	yield takeLatest(types.LIST_PRODUCT_CATEGORIES, list);
};

export default [listWatcherSaga()];
