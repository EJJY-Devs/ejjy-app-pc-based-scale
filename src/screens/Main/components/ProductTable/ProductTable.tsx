/* eslint-disable react-hooks/exhaustive-deps */
import { message, Tooltip } from 'antd';
import { floor, throttle } from 'lodash';
import React, { useEffect, useState } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { CancelButtonIcon, TableProducts } from '../../../../components';
import { NO_INDEX_SELECTED, PRODUCT_LENGTH_PER_PAGE } from '../../../../global/constants';
import {
	deleteItemShortcutKeys,
	discountItemShortcutKeys,
	editQuantityShortcutKeys,
} from '../../../../global/options';
import {
	productNavigation,
	request,
	transactionStatusTypes,
	vatTypes,
} from '../../../../global/types';
import { useBranchProducts } from '../../../../hooks/useBranchProducts';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { useTransactions } from '../../../../hooks/useTransactions';
import { getProductQuantity, numberWithCommas } from '../../../../utils/function';
import { DiscountModal } from './DiscountModal';
import { EditProductModal } from './EditProductModal';
import './style.scss';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const columns = [
	{ name: '', width: '1px' },
	{ name: 'Item', width: '40%' },
	{ name: 'Qty', width: '15%', alignment: 'center' },
	{ name: 'Rate', width: '15%', alignment: 'end' },
	{ name: 'Amount', alignment: 'end' },
];

const uneditableStatus = [transactionStatusTypes.FULLY_PAID, transactionStatusTypes.VOID_EDITED];

export const editTypes = {
	ADD: 1,
	DEDUCT: 2,
};

interface Props {
	isLoading: boolean;
}

export const ProductTable = ({ isLoading }: Props) => {
	const {
		transactionId,
		transactionProducts,
		pageNumber,
		transactionStatus: currentTransactionStatus,
		navigateProduct,
		removeProduct,
		setCurrentTransaction,
	} = useCurrentTransaction();
	const { branchProducts } = useBranchProducts();
	const { updateTransaction, status } = useTransactions();

	const [selectedProductIndex, setSelectedProductIndex] = useState(0);
	const [selectedDiscountProduct, setSelectedDiscountProduct] = useState(null);
	const [editProductModalVisible, setEditProductModalVisible] = useState(false);
	const [discountModalVisible, setDiscountModalVisible] = useState(false);
	const [data, setData] = useState([]);

	// Effect: Format product data
	useEffect(() => {
		const formattedProducts = transactionProducts
			.slice((pageNumber - 1) * PRODUCT_LENGTH_PER_PAGE, pageNumber * PRODUCT_LENGTH_PER_PAGE)
			.map((item) => [
				uneditableStatus.includes(currentTransactionStatus) ? null : (
					<CancelButtonIcon tooltip="Remove" onClick={() => onRemoveProductConfirmation(item)} />
				),
				<Tooltip placement="top" title={item.data.description}>
					{item.data.name}
				</Tooltip>,
				getProductQuantity(item.quantity, item.data.unit_of_measurement),
				<div onClick={() => onDiscountProduct(item)}>
					{item?.discountPerPiece > 0 ? (
						<>
							{`₱${numberWithCommas(item.pricePerPiece.toFixed(2))}`}
							<span className="original-price">
								{`₱${numberWithCommas((item.pricePerPiece + item.discountPerPiece).toFixed(2))}`}
							</span>
						</>
					) : (
						`₱${numberWithCommas(item.pricePerPiece.toFixed(2))}`
					)}
				</div>,
				item.data.is_vat_exempted ? vatTypes.VATABLE : vatTypes.VAT_EMPTY,
				`₱${numberWithCommas((item.quantity * item.pricePerPiece).toFixed(2))}`,
			]);

		setData(formattedProducts);
	}, [transactionProducts, currentTransactionStatus, pageNumber]);

	// Effect: Set default active
	useEffect(() => {
		if (!transactionProducts.length) {
			setSelectedProductIndex(NO_INDEX_SELECTED);
			navigateProduct(productNavigation.RESET);
		} else if (transactionProducts.length && selectedProductIndex === NO_INDEX_SELECTED) {
			setSelectedProductIndex(0);
			navigateProduct(productNavigation.RESET);
		}
	}, [transactionProducts, selectedProductIndex]);

	const onRemoveProduct = (id) => {
		if (transactionId) {
			updateTransaction(
				{
					transactionId,
					products: transactionProducts
						.filter((item) => item.id !== id)
						.map((item) => ({
							transaction_product_id: item.transactionProductId,
							product_id: item.productId,
							quantity: item.quantity,
						})),
				},
				({ status, transaction }) => {
					if (status === request.SUCCESS) {
						setCurrentTransaction({ transaction, branchProducts });
					}
				},
			);
		} else {
			removeProduct({ id });
		}
	};

	const onRemoveProductConfirmation = (product) => {
		Modal.confirm({
			title: 'Delete Confirmation',
			icon: <ExclamationCircleOutlined />,
			content: `Are you sure you want to delete ${product.data.name}?`,
			okText: 'Delete',
			cancelText: 'Cancel',
			onOk: () => onRemoveProduct(product.id),
		});
	};

	const onHover = (index) => {
		// setSelectedProductIndex((pageNumber - 1) * PRODUCT_LENGTH_PER_PAGE + index);
	};

	const onExit = () => {
		// if (!editProductModalVisible) {
		// 	setSelectedProductIndex(NO_INDEX_SELECTED);
		// }
	};

	const onDiscountProduct = (product) => {
		if (currentTransactionStatus !== transactionStatusTypes.FULLY_PAID) {
			setSelectedDiscountProduct(product);
			setDiscountModalVisible(true);
		}
	};

	const handleKeyPress = throttle((key, event) => {
		event.preventDefault();
		event.stopPropagation();

		if (selectedProductIndex === NO_INDEX_SELECTED) {
			message.error('Please select a product from the table first.');
			return;
		}

		// Edit
		if (editQuantityShortcutKeys.includes(key)) {
			setEditProductModalVisible(true);
			return;
		}

		// Delete
		if (deleteItemShortcutKeys.includes(key)) {
			onRemoveProductConfirmation(transactionProducts?.[selectedProductIndex]);
			return;
		}

		// Discount
		if (discountItemShortcutKeys.includes(key)) {
			onDiscountProduct(transactionProducts?.[selectedProductIndex]);
			return;
		}

		// Select products
		if ((key === 'up' || key === 'down') && selectedProductIndex === NO_INDEX_SELECTED) {
			setSelectedProductIndex(0);
			return;
		}

		if (key === 'up') {
			const value = selectedProductIndex > 0 ? selectedProductIndex - 1 : selectedProductIndex;
			const newPage = floor(value / PRODUCT_LENGTH_PER_PAGE) + 1;
			if (newPage < pageNumber) {
				navigateProduct(productNavigation.PREV);
			}

			setSelectedProductIndex(value);

			return;
		}

		if (key === 'down') {
			let value = selectedProductIndex;
			if (transactionProducts?.length > 0) {
				value =
					selectedProductIndex < transactionProducts.length - 1
						? selectedProductIndex + 1
						: selectedProductIndex;
			}

			const newPage = floor(value / PRODUCT_LENGTH_PER_PAGE) + 1;
			if (newPage > pageNumber) {
				navigateProduct(productNavigation.NEXT);
			}

			setSelectedProductIndex(value);

			return;
		}
	}, 500);

	return (
		<div className="ProductTable">
			<KeyboardEventHandler
				handleKeys={[
					...editQuantityShortcutKeys,
					...deleteItemShortcutKeys,
					...discountItemShortcutKeys,
					...['up', 'down'],
				]}
				onKeyEvent={handleKeyPress}
				isDisabled={
					selectedProductIndex === NO_INDEX_SELECTED ||
					!transactionProducts.length ||
					uneditableStatus.includes(currentTransactionStatus)
				}
			/>

			<TableProducts
				columns={columns}
				data={data}
				activeRow={selectedProductIndex}
				onHover={onHover}
				onExit={onExit}
				loading={status === request.REQUESTING || isLoading}
			/>

			<EditProductModal
				product={transactionProducts?.[selectedProductIndex]}
				visible={editProductModalVisible}
				onClose={() => setEditProductModalVisible(false)}
			/>

			<DiscountModal
				product={selectedDiscountProduct}
				visible={discountModalVisible}
				onClose={() => setDiscountModalVisible(false)}
			/>
		</div>
	);
};
