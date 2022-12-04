import { message } from 'antd';
import dayjs from 'dayjs';
import {
	APP_BRANCH_NAME_KEY,
	APP_BRANCH_SERVER_URL_KEY,
	APP_BRIGHTNESS_KEY,
	APP_COMPANY_NAME_KEY,
	APP_PRICE_CODE_FEATURE_KEY,
	EMPTY_CELL,
	userTypes,
} from 'global';
import _, { isArray, isNaN, isString, memoize, round } from 'lodash';

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Numbers

export const numberWithCommas = (x) =>
	x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');

// Messages

export const showErrorMessages = (errors) => {
	if (isString(errors)) {
		message.error(errors);
	} else if (isArray(errors)) {
		errors.forEach((error) => message.error(error));
	}
};

// Local Storage Getters

export const getBranchName = () => localStorage.getItem(APP_BRANCH_NAME_KEY);

export const getBranchServerUrl = () =>
	localStorage.getItem(APP_BRANCH_SERVER_URL_KEY);

export const getAppBrightness = () => localStorage.getItem(APP_BRIGHTNESS_KEY);

export const getCompanyName = () => localStorage.getItem(APP_COMPANY_NAME_KEY);

export const getPriceCodeFeature = () =>
	Number(localStorage.getItem(APP_PRICE_CODE_FEATURE_KEY));

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

// Callbacks

export const modifiedExtraCallback =
	(callback, extraCallback = null) =>
	(response) => {
		callback(response);
		if (extraCallback) {
			extraCallback(response);
		}
	};

// Formats

export const formatDateTime = memoize((datetime) =>
	dayjs.tz(datetime).format('MM/DD/YYYY h:mma'),
);

export const standardRound = (value) => _.round(round(value, 3), 2).toFixed(2);

export const formatZeroToO = (value) => _.toString(value)?.replace(/0/g, 'O');

export const formatPrintDetails = (detail) => {
	let formattedDetail = '';

	if (detail) {
		formattedDetail = detail?.replace(/\s/g, '%');
	}

	return formattedDetail;
};

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

export const formatInPeso = (value) => {
	const x = Number(value);

	return isNaN(x) ? EMPTY_CELL : `₱${numberWithCommas(standardRound(x))}`;
};

export const formatWeight = (weight) => Number(weight).toFixed(3);
