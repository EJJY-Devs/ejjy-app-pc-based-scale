/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-wrap-multilines */
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { message, Modal } from 'antd';
import React, { useCallback, useState } from 'react';
import { ScaleButton } from '../../../../components';
import { EMPTY_CELL, NO_INDEX_SELECTED } from '../../../../global/constants';
import {
	productCategoryTypes,
	request,
	userTypes,
} from '../../../../global/types';
import { useAuth } from '../../../../hooks/useAuth';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { usePc } from '../../../../hooks/usePc';
import {
	numberWithCommas,
	showErrorMessages,
} from '../../../../utils/function';
import { DiscountAuthModal } from './DiscountAuthModal';
import './style.scss';

const discountTypes = {
	FIRST: '1',
	SECOND: '2',
	NO_DISCOUNT: '3',
};

interface Props {
	onOpenCheckoutModal: any;
	onOpenTemporaryCheckoutModal: any;
}

export const Buttons = ({
	onOpenCheckoutModal,
	onOpenTemporaryCheckoutModal,
}: Props) => {
	// STATES
	const [discountAuthModalVisible, setDiscountAuthModalVisible] =
		useState(false);
	const [selectedDiscountType, setSelectedDiscountType] = useState(null);

	// CUSTOM HOOKS
	const { validateUser, status: authStatus } = useAuth();
	const {
		transactionProducts,
		selectedProductIndex,
		editProduct,
		resetTransaction,
	} = useCurrentTransaction();
	const { recalibrate } = usePc();

	// METHODS
	const isTempCheckoutDisabled = useCallback(
		() =>
			!transactionProducts.some(
				(product) =>
					!product.isCheckedOut &&
					product.product_category === productCategoryTypes.GULAY,
			),
		[transactionProducts],
	);

	const isWithDiscount = useCallback(
		() =>
			// Condition: User selected product in table &&
			// User previously set discount for selected product
			selectedProductIndex !== NO_INDEX_SELECTED &&
			transactionProducts?.[selectedProductIndex]?.discount > 0,
		[selectedProductIndex, transactionProducts],
	);

	const getDiscount = useCallback(() => {
		let discount = 0;
		const product = transactionProducts?.[selectedProductIndex];

		if (product?.discount > 0) {
			discount = product.price_per_piece;
		} else {
			discount =
				selectedDiscountType === discountTypes.FIRST
					? product?.discounted_price_per_piece1
					: product?.discounted_price_per_piece2;
		}

		return discount >= 0
			? `₱${numberWithCommas(discount?.toFixed(2))}`
			: EMPTY_CELL;
	}, [transactionProducts, selectedProductIndex, selectedDiscountType]);

	const onDiscountSuccess = () => {
		const selectedProduct = transactionProducts?.[selectedProductIndex];

		if (selectedProduct) {
			let currentDiscount = 0;

			if (selectedDiscountType === discountTypes.FIRST) {
				currentDiscount = selectedProduct.discounted_price_per_piece1;
			}

			if (selectedDiscountType === discountTypes.SECOND) {
				currentDiscount = selectedProduct.discounted_price_per_piece2;
			}

			const newPricePerPiece =
				selectedProduct?.discount > 0
					? selectedProduct.price_per_piece + selectedProduct.discount
					: selectedProduct.price_per_piece;
			const newDiscountPerPiece =
				currentDiscount > 0
					? newPricePerPiece - currentDiscount
					: currentDiscount;

			editProduct({
				id: selectedProduct.id,
				discount: newDiscountPerPiece,
				price_per_piece:
					currentDiscount > 0 ? currentDiscount : newPricePerPiece,
			});

			message.success('Sucessfully applied discount to product.');
		} else {
			message.error('An error occurred while setting discount to a product');
		}

		setDiscountAuthModalVisible(false);
	};

	const onDiscount = (data, resetForm) => {
		validateUser(
			{ ...data, userType: userTypes.BRANCH_MANAGER },
			({ status, errors }) => {
				if (status === request.SUCCESS) {
					onDiscountSuccess();
					resetForm();
				} else if (status === request.ERROR) {
					showErrorMessages(errors);
				}
			},
		);
	};

	const onReset = () => {
		Modal.confirm({
			className: 'EJJYModal',
			title: 'Reset Confirmation',
			icon: <ExclamationCircleOutlined />,
			content: 'Are you sure you want to reset and clear the product list?',
			okText: 'Reset',
			cancelText: 'Cancel',
			onOk: resetTransaction,
		});
	};

	const onRecalibrate = () => {
		recalibrate(({ status }) => {
			if (status === request.SUCCESS) {
				message.success('Scale recalibrated successfully!');
			} else if (status === request.ERROR) {
				message.error('An error occurred while recalibrating scale.');
			}
		});
	};

	return (
		<>
			<div className="Buttons">
				<ScaleButton
					className="Buttons_btnRecalibrate"
					title="Tare"
					onClick={onRecalibrate}
				/>

				{isWithDiscount() ? (
					<ScaleButton
						className="Buttons_btnRemoveDiscount"
						title="Remove Discount"
						onClick={() => {
							setSelectedDiscountType(discountTypes.NO_DISCOUNT);
							setDiscountAuthModalVisible(true);
						}}
					/>
				) : (
					<>
						<ScaleButton
							title="D1"
							onClick={() => {
								setSelectedDiscountType(discountTypes.FIRST);
								setDiscountAuthModalVisible(true);
							}}
							disabled={
								selectedProductIndex === NO_INDEX_SELECTED ||
								transactionProducts.length === 0
							}
						/>

						<ScaleButton
							title="D2"
							onClick={() => {
								setSelectedDiscountType(discountTypes.SECOND);
								setDiscountAuthModalVisible(true);
							}}
							disabled={
								selectedProductIndex === NO_INDEX_SELECTED ||
								transactionProducts.length === 0
							}
						/>
					</>
				)}

				<ScaleButton
					className="Buttons_btnReset"
					title="Reset"
					onClick={onReset}
					disabled={transactionProducts.length === 0}
				/>

				<ScaleButton
					className="Buttons_btnTempCheckout"
					title="Temp Checkout"
					onClick={onOpenTemporaryCheckoutModal}
					disabled={isTempCheckoutDisabled()}
				/>

				<ScaleButton
					className="Buttons_btnCheckout"
					title="Checkout"
					onClick={onOpenCheckoutModal}
					disabled={transactionProducts.length === 0}
				/>
			</div>

			<DiscountAuthModal
				discount={getDiscount()}
				visible={discountAuthModalVisible}
				isLoading={authStatus === request.REQUESTING}
				onConfirm={onDiscount}
				onClose={() => setDiscountAuthModalVisible(false)}
			/>
		</>
	);
};
