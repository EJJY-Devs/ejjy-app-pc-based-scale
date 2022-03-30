/* eslint-disable react/jsx-wrap-multilines */
import { Col, message, Row, Space } from 'antd';
import React, { useCallback, useState } from 'react';
import { ScaleButton } from '../../../../components';
import { ControlledInput, Label } from '../../../../components/elements';
import { discountTypes } from '../../../../global/types';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { usePc } from '../../../../hooks/usePc';
import { formatInPeso } from '../../../../utils/function';
import './style.scss';

interface Props {
	onPrint: any;
}

export const WeightProductDetails = ({ onPrint }: Props) => {
	// STATES
	// const [discountAuthModalVisible, setDiscountAuthModalVisible] =
	// useState(false);
	const [selectedDiscountType, setSelectedDiscountType] = useState(null);

	// CUSTOM HOOKS
	const { weight } = usePc();
	// const { validateUser, status: authStatus } = useAuth();
	const { currentProduct, addProduct, setCurrentProduct } =
		useCurrentTransaction();

	// METHODS
	const onPrintAndAddCart = () => {
		onPrint(() => {
			addProduct({ ...currentProduct, weight });
			setCurrentProduct(null);
			message.success('Product successfully added.');
		});
	};

	// const getDiscount = useCallback(() => {
	// 	let discount = 0;
	// 	const product = currentProduct;

	// 	if (product?.discount > 0) {
	// 		discount = product.price_per_piece;
	// 	} else {
	// 		discount =
	// 			selectedDiscountType === discountTypes.FIRST
	// 				? product?.discounted_price_per_piece1
	// 				: product?.discounted_price_per_piece2;
	// 	}

	// 	return discount >= 0 ? formatInPeso(discount) : EMPTY_CELL;
	// }, [currentProduct, selectedDiscountType]);

	const isWithDiscount = useCallback(
		() => currentProduct?.discount > 0,
		[currentProduct],
	);

	const onDiscountSuccess = () => {
		const product = currentProduct;

		if (product) {
			let currentDiscount = 0;

			if (selectedDiscountType === discountTypes.FIRST) {
				currentDiscount = product.discounted_price_per_piece1;
			}

			if (selectedDiscountType === discountTypes.SECOND) {
				currentDiscount = product.discounted_price_per_piece2;
			}

			const newPricePerPiece =
				product?.discount > 0
					? product.price_per_piece + product.discount
					: product.price_per_piece;
			const newDiscountPerPiece =
				currentDiscount > 0
					? newPricePerPiece - currentDiscount
					: currentDiscount;

			setCurrentProduct({
				...currentProduct,
				discount: newDiscountPerPiece,
				price_per_piece:
					currentDiscount > 0 ? currentDiscount : newPricePerPiece,
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

	return (
		<>
			<div className="WeightProductDetails">
				<Space
					className="WeightProductDetails_wrapper"
					direction="vertical"
					size={20}
				>
					<div className="WeightProductDetails_inputGroup">
						<Label label="Total" spacing />
						<ControlledInput
							className="WeightProductDetails_inputGroup_inputAmount"
							value={formatInPeso(weight * currentProduct.price_per_piece)}
							onChange={() => null}
							disabled
						/>
					</div>

					<div className="WeightProductDetails_inputGroup">
						<Label label="Name" spacing />
						<ControlledInput
							className="WeightProductDetails_inputGroup_input"
							value={currentProduct.name}
							onChange={() => null}
							disabled
						/>
					</div>

					<div className="WeightProductDetails_inputGroup">
						<Label label="Weight" spacing />
						<ControlledInput
							className="WeightProductDetails_inputGroup_input"
							value={weight.toFixed(3)}
							onChange={() => null}
							disabled
						/>
					</div>

					<div className="WeightProductDetails_inputGroup">
						<Label label="Price" spacing />
						<ControlledInput
							className="WeightProductDetails_inputGroup_input"
							value={formatInPeso(currentProduct.price_per_piece)}
							onChange={() => null}
							disabled
						/>
					</div>

					<Row gutter={15}>
						{isWithDiscount() ? (
							<Col span={24}>
								<ScaleButton
									className="WeightProductDetails_btnDiscount__remove"
									title="Remove Discount"
									onClick={() => {
										setSelectedDiscountType(discountTypes.NO_DISCOUNT);
										onDiscountSuccess();
										// setDiscountAuthModalVisible(true);
									}}
								/>
							</Col>
						) : (
							<>
								<Col span={12}>
									<ScaleButton
										className="WeightProductDetails_btnDiscount"
										title={`D1 (${formatInPeso(
											currentProduct.discounted_price_per_piece1,
										)})`}
										onClick={() => {
											setSelectedDiscountType(discountTypes.FIRST);
											onDiscountSuccess();
											// setDiscountAuthModalVisible(true);
										}}
									/>
								</Col>
								<Col span={12}>
									<ScaleButton
										className="WeightProductDetails_btnDiscount"
										title={`D2 (${formatInPeso(
											currentProduct.discounted_price_per_piece2,
										)})`}
										onClick={() => {
											setSelectedDiscountType(discountTypes.SECOND);
											onDiscountSuccess();
											// setDiscountAuthModalVisible(true);
										}}
									/>
								</Col>
							</>
						)}
					</Row>

					<ScaleButton
						className="WeightProductDetails_btnClear"
						title="Remove Selected Product"
						onClick={() => {
							setCurrentProduct(null);
						}}
					/>
				</Space>

				<div className="WeightProductDetails_btnGroup">
					<ScaleButton title="Print" onClick={() => onPrint()} />
					<ScaleButton
						title={
							<img
								src={require('../../../../assets/images/icon-print-and-add-cart.svg')}
								alt="icon"
							/>
						}
						onClick={onPrintAndAddCart}
					/>
				</div>
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
