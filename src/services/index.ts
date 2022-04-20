export const LOCAL_API_URL = process.env.REACT_APP_LOCAL_API_URL;

export const ONLINE_API_URL = process.env.REACT_APP_ONLINE_API_URL;

export const EXPRESS_API_URL = process.env.REACT_APP_EXPRESS_API_URL;

export const API_TIMEOUT = 0;

export const NO_VERIFICATION_NEEDED = 'NO_VERIFICATION_NEEDED';

export const NO_VERIFICATION_CONFIG = { params: NO_VERIFICATION_NEEDED };

export interface IGetRequest {
	ordering?: string;
	page: number;
	page_size: number;
	fields?: string;
}

export { default as ConnectivityLogsService } from './ConnectivityLogsService';
export { default as DataService } from './DataService';
export { default as SiteSettingsService } from './SiteSettingsService';
