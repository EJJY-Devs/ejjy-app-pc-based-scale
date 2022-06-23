export const request = {
	NONE: 0,
	REQUESTING: 1,
	SUCCESS: 2,
	ERROR: 3,
};

export const userTypes = {
	ADMIN: 'admin',
	OFFICE_MANAGER: 'office_manager',
	BRANCH_MANAGER: 'branch_manager',
	BRANCH_PERSONNEL: 'branch_personnel',
};

export const productCategoryTypes = {
	GULAY: 'Gulay',
};

export const discountTypes = {
	FIRST: '1',
	SECOND: '2',
	NO_DISCOUNT: '3',
};

export const connectivityTypes = {
	ONLINE_TO_OFFLINE: 'online_to_offline',
	OFFLINE_TO_ONLINE: 'offline_to_online',
};

export const markdownTypes = {
	REGULAR: 'regular',
	WHOLESALE: 'discount_1',
	SPECIAL: 'discount_2',
	CUSTOM: 'custom',
};

export const priceCodes = {
	[markdownTypes.REGULAR]: 'W',
	[markdownTypes.WHOLESALE]: 'X',
	[markdownTypes.SPECIAL]: 'Y',
	[markdownTypes.CUSTOM]: 'Z',
};
