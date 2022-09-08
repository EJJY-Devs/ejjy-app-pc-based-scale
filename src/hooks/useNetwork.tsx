import { Query } from 'hooks/inteface';
import { useQuery } from 'react-query';
import { NetworkService } from 'services';

const useNetwork = ({ options }: Query) =>
	useQuery<any>(['useNetwork'], NetworkService.test, options);

export default useNetwork;
