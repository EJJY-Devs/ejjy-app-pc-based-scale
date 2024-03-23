import { ExclamationCircleOutlined } from '@ant-design/icons';
import { message, Modal } from 'antd';
import { ScaleButton } from 'components';
import { markdownTypes } from 'ejjy-global';
import { discountTypes, NO_INDEX_SELECTED, productCategoryTypes } from 'global';
import { useTare, useZero } from 'hooks';
import { useCurrentTransactionStore } from 'stores';
import React, { useCallback } from 'react';
import './style.scss';

type Props = {
	onOpenCheckoutModal: () => void;
	onOpenTemporaryCheckoutModal: () => void;
};

export const Buttons = ({
	onOpenCheckoutModal,
	onOpenTemporaryCheckoutModal,
}: Props) => {
	// STATES
	// const [discountAuthModalVisible, setDiscountAuthModalVisible] =
	// useState(false);
	// const [selectedDiscountType, setSelectedDiscountType] = useState(null);

	// CUSTOM HOOKS
	// const { validateUser, status: authStatus } = useAuth();
	const {
		transactionProducts,
		selectedProductIndex,
		updateProduct,
		resetTransaction,
	} = useCurrentTransactionStore();
	const { mutateAsync: tare } = useTare();
	const { mutateAsync: zero } = useZero();

	// METHODS
	const isTempCheckoutDisabled = useCallback(
		() =>
			!transactionProducts.some(
				(tp) =>
					!tp.isCheckedOut &&
					tp.product.product_category === productCategoryTypes.GULAY,
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

	// const getDiscount = useCallback(() => {
	// 	let discount = 0;
	// 	const product = transactionProducts?.[selectedProductIndex];

	// 	if (product?.discount > 0) {
	// 		discount = product.price_per_piece;
	// 	} else {
	// 		discount =
	// 			selectedDiscountType === discountTypes.FIRST
	// 				? product?.markdown_price_per_piece1
	// 				: product?.markdown_price_per_piece2;
	// 	}

	// 	return discount >= 0 ? formatInPeso(discount) : EMPTY_CELL;
	// }, [transactionProducts, selectedProductIndex, selectedDiscountType]);

	const handleDiscountSuccess = (discountType) => {
		const selectedProduct = transactionProducts?.[selectedProductIndex];

		if (selectedProduct) {
			let currentDiscount = 0;
			let markdownType = null;

			if (discountType === discountTypes.FIRST) {
				currentDiscount = selectedProduct.markdown_price_per_piece1;
				markdownType = markdownTypes.WHOLESALE;
			}

			if (discountType === discountTypes.SECOND) {
				currentDiscount = selectedProduct.markdown_price_per_piece2;
				markdownType = markdownTypes.SPECIAL;
			}

			const newPricePerPiece =
				selectedProduct?.discount > 0
					? selectedProduct.price_per_piece + selectedProduct.discount
					: selectedProduct.price_per_piece;
			const newDiscountPerPiece =
				currentDiscount > 0
					? newPricePerPiece - currentDiscount
					: currentDiscount;

			updateProduct(selectedProduct.id, {
				discount: newDiscountPerPiece,
				price_per_piece:
					currentDiscount > 0 ? currentDiscount : newPricePerPiece,
				markdownType,
			});

			message.success('Sucessfully applied discount to product.');
		} else {
			message.error('An error occurred while setting discount to a product');
		}

		// setDiscountAuthModalVisible(false);
	};

	// const onDiscount = (data, resetForm) => {
	// 	validateUser(
	// 		{ ...data, userType: userTypes.BRANCH_MANAGER },
	// 		({ status, errors }) => {
	// 			if (status === request.SUCCESS) {
	// 				onDiscountSuccess();
	// 				resetForm();
	// 			} else if (status === request.ERROR) {
	// 				showErrorMessages(errors);
	// 			}
	// 		},
	// 	);
	// };

	const handleReset = () => {
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

	return (
		<>
			<div className="grid gap-2">
				<div className="flex gap-2">
					<ScaleButton
						className="flex-1 border-b-4 border-red-500 border-b-[#ab363d] bg-red-500 text-white"
						title="Tare"
						onClick={() => {
							tare()
								.then(() => {
									message.success('Scale tare was executed successfully!');
								})
								.catch(() => {
									message.error('An error occurred while recalibrating scale.');
								});
						}}
					/>

					<ScaleButton
						className="flex-1 border-b-4 border-red-500 border-b-[#ab363d] bg-red-500 text-white"
						title="Zero"
						onClick={() => {
							zero()
								.then(() => {
									message.success('Scale zero was executed  successfully!');
								})
								.catch(() => {
									message.error('An error occurred while recalibrating scale.');
								});
						}}
					/>
				</div>

				{isWithDiscount() ? (
					<ScaleButton
						className="border-b-4 border-[#ab363d] bg-red-500 text-white"
						title="Remove Discount"
						onClick={() => {
							// setSelectedDiscountType(discountTypes.NO_DISCOUNT);
							handleDiscountSuccess(discountTypes.NO_DISCOUNT);
						}}
					/>
				) : (
					<>
						<ScaleButton
							disabled={
								selectedProductIndex === NO_INDEX_SELECTED ||
								transactionProducts.length === 0
							}
							title="Wholesale"
							onClick={() => {
								// setSelectedDiscountType(discountTypes.FIRST);
								handleDiscountSuccess(discountTypes.FIRST);
							}}
						/>

						<ScaleButton
							disabled={
								selectedProductIndex === NO_INDEX_SELECTED ||
								transactionProducts.length === 0
							}
							title="Special"
							onClick={() => {
								// setSelectedDiscountType(discountTypes.SECOND);
								handleDiscountSuccess(discountTypes.SECOND);
							}}
						/>
					</>
				)}

				<ScaleButton
					className="Buttons_btnReset"
					disabled={transactionProducts.length === 0}
					title="Reset"
					onClick={handleReset}
				/>

				<ScaleButton
					className="Buttons_btnTempCheckout"
					disabled={isTempCheckoutDisabled()}
					title="Temp Checkout"
					onClick={onOpenTemporaryCheckoutModal}
				/>

				<ScaleButton
					className="Buttons_btnCheckout"
					disabled={transactionProducts.length === 0}
					title="Checkout"
					onClick={onOpenCheckoutModal}
				/>
			</div>

			{/* {discountAuthModalVisible && (
				<DiscountModal
					discount={getDiscount()}
					isLoading={authStatus === request.REQUESTING}
					onConfirm={onDiscount}
					onClose={() => setDiscountAuthModalVisible(false)}
				/>
			)} */}
		</>
	);
};
