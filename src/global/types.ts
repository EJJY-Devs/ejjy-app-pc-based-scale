import { markdownTypes } from 'ejjy-global';

export const productCategoryTypes = {
	GULAY: 'Gulay',
};

export const discountTypes = {
	FIRST: '1',
	SECOND: '2',
	NO_DISCOUNT: '3',
};

export const priceCodes = {
	[markdownTypes.REGULAR]: 'W',
	[markdownTypes.WHOLESALE]: 'X',
	[markdownTypes.SPECIAL]: 'Y',
	[markdownTypes.CUSTOM]: 'Z',
};
