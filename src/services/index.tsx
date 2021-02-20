export const ONLINE_API_URL = process.env.REACT_APP_ONLINE_API_URL;

export const LOCAL_API_URL = process.env.REACT_APP_LOCAL_API_URL;

export const API_TIMEOUT = 0;

export const NO_VERIFICATION_NEEDED = 'NO_VERIFICATION_NEEDED';

export const NO_VERIFICATION_CONFIG = { params: NO_VERIFICATION_NEEDED };

export interface IGetRequest {
	ordering?: string;
	page: number;
	page_size: number;
	fields?: string;
}
