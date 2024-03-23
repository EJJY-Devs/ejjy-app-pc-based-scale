import { Col, message, Row, Space } from 'antd';
import { ScaleButton } from 'components';
import { ControlledInput, Label } from 'components/elements';
import { formatInPeso, markdownTypes } from 'ejjy-global';
import { discountTypes } from 'global';
import React, { useCallback } from 'react';
import { useCurrentTransactionStore, useWeightStore } from 'stores';
import { formatWeight } from 'utils/function';
import iconPrintAndAddCart from 'assets/images/icon-print-and-add-cart.svg';

type Props = {
	onPrint: (callback?: () => void) => void;
};

export const WeightProductDetails = ({ onPrint }: Props) => {
	// STATES
	// const [discountAuthModalVisible, setDiscountAuthModalVisible] =
	// useState(false);
	// const [selectedDiscountType, setSelectedDiscountType] = useState(null);

	// CUSTOM HOOKS
	// const { validateUser, status: authStatus } = useAuth();
	const { weight } = useWeightStore();
	const { currentProduct, addProduct, setCurrentProduct } =
		useCurrentTransactionStore();
	console.log('currentProduct', currentProduct);
	// METHODS
	const handlePrintAndAddCart = () => {
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

	const handleDiscountSuccess = (discountType) => {
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
			<div>
				<Space className="w-full" direction="vertical" size={20}>
					<div>
						<Label label="Total" spacing />
						<ControlledInput
							className="text-right text-[2.5rem] font-bold text-dark"
							value={formatInPeso(weight * currentProduct.price_per_piece)}
							disabled
							onChange={() => null}
						/>
					</div>

					<div>
						<Label label="Name" spacing />
						<ControlledInput
							className="text-2xl font-bold text-dark"
							value={currentProduct.product.name}
							disabled
							onChange={() => null}
						/>
					</div>

					<div>
						<Label label="Weight" spacing />
						<ControlledInput
							className="text-2xl font-bold text-dark"
							value={formatWeight(weight)}
							disabled
							onChange={() => null}
						/>
					</div>

					<div>
						<Label label="Price" spacing />
						<ControlledInput
							className="text-2xl font-bold text-dark"
							value={formatInPeso(currentProduct.price_per_piece)}
							disabled
							onChange={() => null}
						/>
					</div>

					<Row gutter={15}>
						{isWithDiscount() ? (
							<Col span={24}>
								<ScaleButton
									className="w-full border-b-4 border-[#ab363d] bg-red-500 text-white"
									title="Remove Discount"
									onClick={() => {
										// setSelectedDiscountType(discountTypes.NO_DISCOUNT);
										handleDiscountSuccess(discountTypes.NO_DISCOUNT);
										// setDiscountAuthModalVisible(true);
									}}
								/>
							</Col>
						) : (
							<>
								<Col span={12}>
									<ScaleButton
										className="w-full"
										title="Wholesale"
										onClick={() => {
											// setSelectedDiscountType(discountTypes.FIRST);
											handleDiscountSuccess(discountTypes.FIRST);
											// setDiscountAuthModalVisible(true);
										}}
									/>
								</Col>
								<Col span={12}>
									<ScaleButton
										className="w-full"
										title="Special"
										onClick={() => {
											// setSelectedDiscountType(discountTypes.SECOND);
											handleDiscountSuccess(discountTypes.SECOND);
											// setDiscountAuthModalVisible(true);
										}}
									/>
								</Col>
							</>
						)}
					</Row>

					<ScaleButton
						className="w-full border-2 border-red-500 bg-transparent text-base text-red-500 hover:bg-red-500 hover:text-white hover:opacity-100"
						title="REMOVE SELECTED PRODUCT"
						onClick={() => {
							setCurrentProduct(null);
						}}
					/>
				</Space>

				<div className="absolute bottom-0 grid h-button w-full grid-cols-12 gap-x-3">
					<ScaleButton
						className="col-span-8"
						disabled={weight === 0}
						title="Print"
						onClick={() => onPrint()}
					/>
					<ScaleButton
						className="col-span-4"
						disabled={weight === 0}
						title={<img alt="icon" src={iconPrintAndAddCart} />}
						onClick={handlePrintAndAddCart}
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
