import axios from 'axios';
import { IGetRequest } from '.';

interface IGetShownForScaleList extends IGetRequest {
	is_shown_in_scale_list: boolean;
	search?: string;
}

export const service = {
	list: async (params: IGetShownForScaleList) =>
		axios.get('branches-products/', { params }),
};
