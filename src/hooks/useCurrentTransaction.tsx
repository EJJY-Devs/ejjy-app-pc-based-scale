import { useSelector } from 'react-redux';
import { actions, selectors } from '../ducks/current-transaction';
import { useActionDispatch } from './useActionDispatch';

export const useCurrentTransaction = () => {
	const transactionProducts = useSelector(selectors.selectProducts());
	const selectedProductIndex = useSelector(selectors.selectSelectedProductIndex());

	const addProduct = useActionDispatch(actions.addProduct);
	const removeProduct = useActionDispatch(actions.removeProduct);
	const editProduct = useActionDispatch(actions.editProduct);
	const resetTransaction = useActionDispatch(actions.resetTransaction);
	const setDiscount = useActionDispatch(actions.setDiscount);
	const setSelectedProduct = useActionDispatch(actions.setSelectedProduct);

	return {
		transactionProducts,
		selectedProductIndex,
		addProduct,
		removeProduct,
		editProduct,
		resetTransaction,
		setDiscount,
		setSelectedProduct,
	};
};
