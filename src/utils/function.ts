import {
	APP_BRANCH_ID_KEY,
	APP_BRANCH_MACHINE_ID_KEY,
	APP_BRANCH_MACHINE_KEY,
	APP_BRANCH_NAME_KEY,
	APP_BRANCH_SERVER_URL_KEY,
	APP_BRIGHTNESS_KEY,
	APP_COMPANY_NAME_KEY,
	APP_PRICE_CODE_FEATURE_KEY,
} from 'global';
import _ from 'lodash';

// Local Storage Getters

export const getBranchName = () =>
	localStorage.getItem(APP_BRANCH_NAME_KEY) || 'Test Branch';

export const getBranchId = () => localStorage.getItem(APP_BRANCH_ID_KEY);

export const getBranchMachineId = () =>
	localStorage.getItem(APP_BRANCH_MACHINE_ID_KEY);

export const getBranchMachine = (isParsed = false) => {
	const branchMachine = localStorage.getItem(APP_BRANCH_MACHINE_KEY);
	return isParsed ? JSON.parse(branchMachine || '') : branchMachine;
};

export const getBranchServerUrl = () => {
	console.log('get branch server url');
	return localStorage.getItem(APP_BRANCH_SERVER_URL_KEY) || undefined;
};

export const getAppBrightness = () => localStorage.getItem(APP_BRIGHTNESS_KEY);

export const getCompanyName = () =>
	localStorage.getItem(APP_COMPANY_NAME_KEY) || 'EJJY';

export const getPriceCodeFeature = () =>
	Number(localStorage.getItem(APP_PRICE_CODE_FEATURE_KEY));

// Formats
export const formatZeroToO = (value: number | string) =>
	_.toString(value)?.replace(/0/g, 'O');

export const formatPrintDetails = (detail: string) => {
	let formattedDetail = '';

	if (detail) {
		formattedDetail = detail?.replace(/\s/g, '%');
	}

	return formattedDetail;
};

export const formatWeight = (weight: string | number) =>
	Number(weight).toFixed(3);
