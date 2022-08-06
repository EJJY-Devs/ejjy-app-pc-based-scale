import { useSelector } from 'react-redux';
import { actions, selectors } from '../ducks/current-transaction';
import { useActionDispatch } from './useActionDispatch';

export const useCurrentTransaction = () => {
	const transactionProducts = useSelector(selectors.selectProducts());
	const selectedProductIndex = useSelector(
		selectors.selectSelectedProductIndex(),
	);
	const currentProduct = useSelector(selectors.selectCurrentProduct());

	const addProduct = useActionDispatch(actions.addProduct);
	const removeProduct = useActionDispatch(actions.removeProduct);
	const editProduct = useActionDispatch(actions.editProduct);
	const resetTransaction = useActionDispatch(actions.resetTransaction);
	const setDiscount = useActionDispatch(actions.setDiscount);
	const setSelectedProduct = useActionDispatch(actions.setSelectedProduct);
	const setCurrentProduct = useActionDispatch(actions.setCurrentProduct);

	return {
		transactionProducts,
		selectedProductIndex,
		currentProduct,
		addProduct,
		removeProduct,
		editProduct,
		resetTransaction,
		setDiscount,
		setSelectedProduct,
		setCurrentProduct,
	};
};

export default useCurrentTransaction;
