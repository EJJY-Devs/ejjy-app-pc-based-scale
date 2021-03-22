import { useSelector } from 'react-redux';
import { actions, selectors } from '../ducks/current-transaction';
import { useActionDispatch } from './useActionDispatch';

export const useCurrentTransaction = () => {
	const transactionProducts = useSelector(selectors.selectProducts());

	const addProduct = useActionDispatch(actions.addProduct);
	const removeProduct = useActionDispatch(actions.removeProduct);
	const editProduct = useActionDispatch(actions.editProduct);
	const resetTransaction = useActionDispatch(actions.resetTransaction);
	const setDiscount = useActionDispatch(actions.setDiscount);

	return {
		transactionProducts,
		addProduct,
		removeProduct,
		editProduct,
		resetTransaction,
		setDiscount,
	};
};
