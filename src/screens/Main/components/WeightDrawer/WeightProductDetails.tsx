/* eslint-disable react/jsx-wrap-multilines */
import { Col, message, Row, Space } from 'antd';
import { ScaleButton } from 'components';
import { ControlledInput, Label } from 'components/elements';
import { discountTypes, markdownTypes } from 'global';
import { useCurrentTransaction } from 'hooks';
import React, { useCallback } from 'react';
import { useWeightStore } from 'stores';
import { formatInPeso } from 'utils/function';
import './style.scss';

interface Props {
	onPrint: any;
}

export const WeightProductDetails = ({ onPrint }: Props) => {
	// STATES
	// const [discountAuthModalVisible, setDiscountAuthModalVisible] =
	// useState(false);
	// const [selectedDiscountType, setSelectedDiscountType] = useState(null);

	// CUSTOM HOOKS
	// const { validateUser, status: authStatus } = useAuth();
	const weight = useWeightStore((state: any) => state.weight);
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
	// 				? product?.markdown_price_per_piece1
	// 				: product?.markdown_price_per_piece2;
	// 	}

	// 	return discount >= 0 ? formatInPeso(discount) : EMPTY_CELL;
	// }, [currentProduct, selectedDiscountType]);

	const isWithDiscount = useCallback(
		() => currentProduct?.discount > 0,
		[currentProduct],
	);

	const onDiscountSuccess = (discountType) => {
		const product = currentProduct;

		if (product) {
			let currentDiscount = 0;
			let markdownType = null;

			if (discountType === discountTypes.FIRST) {
				currentDiscount = product.markdown_price_per_piece1;
				markdownType = markdownTypes.WHOLESALE;
			}

			if (discountType === discountTypes.SECOND) {
				currentDiscount = product.markdown_price_per_piece2;
				markdownType = markdownTypes.SPECIAL;
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
							disabled
							onChange={() => null}
						/>
					</div>

					<div className="WeightProductDetails_inputGroup">
						<Label label="Name" spacing />
						<ControlledInput
							className="WeightProductDetails_inputGroup_input"
							value={currentProduct.name}
							disabled
							onChange={() => null}
						/>
					</div>

					<div className="WeightProductDetails_inputGroup">
						<Label label="Weight" spacing />
						<ControlledInput
							className="WeightProductDetails_inputGroup_input"
							value={weight.toFixed(3)}
							disabled
							onChange={() => null}
						/>
					</div>

					<div className="WeightProductDetails_inputGroup">
						<Label label="Price" spacing />
						<ControlledInput
							className="WeightProductDetails_inputGroup_input"
							value={formatInPeso(currentProduct.price_per_piece)}
							disabled
							onChange={() => null}
						/>
					</div>

					<Row gutter={15}>
						{isWithDiscount() ? (
							<Col span={24}>
								<ScaleButton
									className="WeightProductDetails_btnDiscount__remove"
									title="Remove Discount"
									onClick={() => {
										// setSelectedDiscountType(discountTypes.NO_DISCOUNT);
										onDiscountSuccess(discountTypes.NO_DISCOUNT);
										// setDiscountAuthModalVisible(true);
									}}
								/>
							</Col>
						) : (
							<>
								<Col span={12}>
									<ScaleButton
										className="WeightProductDetails_btnDiscount"
										title="Wholesale"
										onClick={() => {
											// setSelectedDiscountType(discountTypes.FIRST);
											onDiscountSuccess(discountTypes.FIRST);
											// setDiscountAuthModalVisible(true);
										}}
									/>
								</Col>
								<Col span={12}>
									<ScaleButton
										className="WeightProductDetails_btnDiscount"
										title="Special"
										onClick={() => {
											// setSelectedDiscountType(discountTypes.SECOND);
											onDiscountSuccess(discountTypes.SECOND);
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
					<ScaleButton
						disabled={weight === 0}
						title="Print"
						onClick={() => onPrint()}
					/>
					<ScaleButton
						disabled={weight === 0}
						title={
							<img
								alt="icon"
								src={require('../../../../assets/images/icon-print-and-add-cart.svg')}
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
