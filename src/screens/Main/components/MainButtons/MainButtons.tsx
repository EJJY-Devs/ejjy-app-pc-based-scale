import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Divider, message, Modal } from 'antd';
import cn from 'classnames';
import React, { useCallback, useState } from 'react';
import { EMPTY_CELL, NO_INDEX_SELECTED } from '../../../../global/constants';
import { productCategoryTypes, request, userTypes } from '../../../../global/types';
import { useAuth } from '../../../../hooks/useAuth';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { numberWithCommas, showErrorMessages } from '../../../../utils/function';
import { DiscountAuthModal } from './DiscountAuthModal';
import { MainButton } from './MainButton';
import './style.scss';

const discountTypes = {
	FIRST: '1',
	SECOND: '2',
	NO_DISCOUNT: '3',
};

export const MainButtons = ({ onOpenCheckoutModal, onOpenTemporaryCheckoutModal }) => {
	// STATES
	const [discountAuthModalVisible, setDiscountAuthModalVisible] = useState(false);
	const [selectedDiscountType, setSelectedDiscountType] = useState(null);

	// CUSTOM HOOKS
	const { validateUser, status: authStatus } = useAuth();
	const {
		transactionProducts,
		selectedProductIndex,
		editProduct,
		resetTransaction,
	} = useCurrentTransaction();

	// METHODS
	const onResetConfirmation = () => {
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

	const isTempCheckoutDisabled = useCallback(
		() =>
			!transactionProducts.some(
				(product) =>
					!product.isCheckedOut && product.product_category === productCategoryTypes.GULAY,
			),
		[transactionProducts],
	);

	const getDiscount1 = useCallback(() => {
		const value = transactionProducts?.[selectedProductIndex]?.discounted_price_per_piece1;
		return value >= 0 ? `₱${numberWithCommas(value?.toFixed(2))}` : EMPTY_CELL;
	}, [transactionProducts, selectedProductIndex]);

	const getDiscount2 = useCallback(() => {
		const value = transactionProducts?.[selectedProductIndex]?.discounted_price_per_piece2;
		return value >= 0 ? `₱${numberWithCommas(value?.toFixed(2))}` : EMPTY_CELL;
	}, [transactionProducts, selectedProductIndex]);

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
				currentDiscount > 0 ? newPricePerPiece - currentDiscount : currentDiscount;

			editProduct({
				id: selectedProduct.id,
				discount: newDiscountPerPiece,
				price_per_piece: currentDiscount > 0 ? currentDiscount : newPricePerPiece,
			});

			message.success('Sucessfully applied discount to product.');
		} else {
			message.error('An error occurred while setting discount to a product');
		}

		setDiscountAuthModalVisible(false);
	};

	const onDiscount = (data) => {
		validateUser({ data, userType: userTypes.BRANCH_MANAGER }, ({ status, errors }) => {
			if (status === request.SUCCESS) {
				onDiscountSuccess();
			} else if (status === request.ERROR) {
				showErrorMessages(errors);
			}
		});
	};

	return (
		<div className="MainButtons">
			<div
				className={cn('buttons-wrapper', {
					'with-btn-no-discount':
						selectedProductIndex !== NO_INDEX_SELECTED &&
						transactionProducts?.[selectedProductIndex]?.discount > 0,
				})}
			>
				<MainButton
					title="Reset"
					onClick={onResetConfirmation}
					disabled={!transactionProducts.length}
				/>

				<div className="divider">
					<Divider type="vertical" className="vertical-divider" />
				</div>

				{selectedProductIndex !== NO_INDEX_SELECTED &&
				transactionProducts?.[selectedProductIndex]?.discount > 0 ? (
					<MainButton
						classNames="red"
						title="Remove Discount"
						onClick={() => {
							setSelectedDiscountType(discountTypes.NO_DISCOUNT);
							setDiscountAuthModalVisible(true);
						}}
					/>
				) : (
					<>
						<MainButton
							title={
								<>
									<span>Disc 1</span>
									<span className="shortcut-key">[{getDiscount1()}]</span>
								</>
							}
							onClick={() => {
								setSelectedDiscountType(discountTypes.FIRST);
								setDiscountAuthModalVisible(true);
							}}
							disabled={selectedProductIndex === NO_INDEX_SELECTED}
						/>

						<MainButton
							title={
								<>
									<span>Disc 2</span>
									<span className="shortcut-key">[{getDiscount2()}]</span>
								</>
							}
							onClick={() => {
								setSelectedDiscountType(discountTypes.SECOND);
								setDiscountAuthModalVisible(true);
							}}
							disabled={selectedProductIndex === NO_INDEX_SELECTED}
						/>
					</>
				)}

				<div className="divider">
					<Divider type="vertical" className="vertical-divider" />
				</div>

				<MainButton
					title={
						<span>
							Temp
							<br />
							Checkout
						</span>
					}
					onClick={onOpenTemporaryCheckoutModal}
					disabled={isTempCheckoutDisabled()}
				/>

				<MainButton
					title="Checkout"
					onClick={onOpenCheckoutModal}
					disabled={!transactionProducts.length}
				/>
			</div>

			<DiscountAuthModal
				discount={selectedDiscountType === discountTypes.FIRST ? getDiscount1() : getDiscount2()}
				visible={discountAuthModalVisible}
				isLoading={authStatus === request.REQUESTING}
				onConfirm={onDiscount}
				onClose={() => setDiscountAuthModalVisible(false)}
			/>
		</div>
	);
};
