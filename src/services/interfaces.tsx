export interface ListRequest {
	ordering?: string;
	page?: number;
	page_size?: number;
	fields?: string;
	search?: string;
}
