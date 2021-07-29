import { message } from 'antd';
import { isArray, isString, memoize } from 'lodash';
import { ROW_HEIGHT } from '../global/constants';
import { userTypes } from '../global/types';

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const getUserTypeDescription = memoize((userType) => {
	let userTypeDescription = '';

	switch (userType) {
		case userTypes.ADMIN:
			userTypeDescription = 'Admin';
			break;
		case userTypes.BRANCH_MANAGER:
			userTypeDescription = 'Branch Manager';
			break;
		case userTypes.BRANCH_PERSONNEL:
			userTypeDescription = 'Branch Personnel';
			break;
		case userTypes.OFFICE_MANAGER:
			userTypeDescription = 'Office Manager';
			break;
		default:
			break;
	}

	return userTypeDescription;
});

export const calculateTableHeight = (listLength, MAX_ROW_COUNT = 6) =>
	ROW_HEIGHT * (listLength <= MAX_ROW_COUNT ? listLength : MAX_ROW_COUNT);

export const numberWithCommas = (x) =>
	x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');

export const showErrorMessages = (errors) => {
	if (isString(errors)) {
		message.error(errors);
	} else if (isArray(errors)) {
		errors.forEach((error) => message.error(error));
	}
};

export const modifiedExtraCallback =
	(callback, extraCallback = null) =>
	(response) => {
		callback(response);
		if (extraCallback) {
			extraCallback(response);
		}
	};

export const zeroToO = (value) => value?.replace(/0/g, 'O');

export const convertIntoArray = (errors, prefixMessage = null) => {
	const prefix = prefixMessage ? `${prefixMessage}: ` : '';
	let array = [];

	if (isString(errors)) {
		array = [prefix + errors];
	} else if (isArray(errors)) {
		array = errors.map((error) => prefix + error);
	}

	return array;
};

export const formatPrintDetails = (detail) => {
	let formattedDetail = '';

	if (detail) {
		formattedDetail = detail?.replace(/\s/g, '%');
	}

	return formattedDetail;
};
