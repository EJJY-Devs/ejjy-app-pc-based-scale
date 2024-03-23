import { message, Spin } from 'antd';
import { BranchProduct, markdownTypes, standardRound } from 'ejjy-global';
import { priceCodes } from 'global';
import { usePrintProduct, useWeight } from 'hooks';
import _ from 'lodash';
import React, { useEffect } from 'react';
import { useCurrentTransactionStore, useWeightStore } from 'stores';
import {
	formatPrintDetails,
	formatWeight,
	formatZeroToO,
	getBranchName,
	getCompanyName,
	getPriceCodeFeature,
} from 'utils/function';
import { WeightProductDetails } from './WeightProductDetails';
import { WeightProductSelection } from './WeightProductSelection';

type Props = {
	branchProducts: BranchProduct[];
};

export const WeightDrawer = ({ branchProducts }: Props) => {
	// CUSTOM HOOKS
	const { weight } = useWeightStore();
	const { mutateAsync: printProduct, isLoading: isPrintingProduct } =
		usePrintProduct({
			onError: () => {
				message.error('An error occurred while printing the product details');
			},
		});
	const { transactionProducts, currentProduct, setCurrentProduct } =
		useCurrentTransactionStore();
	useWeight();

	// METHODS
	useEffect(() => {
		if (weight === 0 && currentProduct) {
			setCurrentProduct(null);
		}
	}, [weight]);

	const handleSelectProduct = (branchProduct: BranchProduct) => {
		const foundProduct = transactionProducts.find(
			({ id }) => id === branchProduct.id,
		);

		if (!foundProduct) {
			setCurrentProduct({ ...branchProduct, isCheckedOut: false });
		} else {
			message.error('Product already in the list.');
		}
	};

	const handlePrint = async (onSuccess?: () => void) => {
		// Get total
		const total = standardRound(currentProduct.price_per_piece * weight);

		// Get weight
		const roundedWeight = formatWeight(weight);
		const formattedWeight = _.padStart(
			`${roundedWeight.replace('.', '')}0`,
			6,
			'0',
		);

		// Get price code
		let priceCode = '';
		if (getPriceCodeFeature()) {
			const type =
				currentProduct.price_markdown?.type ||
				currentProduct.markdownType ||
				markdownTypes.REGULAR;
			priceCode = priceCodes[type] || '';
		}

		// Get code
		const code =
			currentProduct.product.selling_barcode || currentProduct.product.barcode;

		await printProduct({
			name: formatPrintDetails(currentProduct.product.name),
			weight: `${formatZeroToO(roundedWeight)}kg`,
			price: `P${formatZeroToO(currentProduct.price_per_piece.toFixed(2))}`,
			totalPrice: `P${formatZeroToO(total)}`,
			code: `${priceCode}${code}${formattedWeight}`,
			branchName: formatPrintDetails(getBranchName()),
			companyName: formatPrintDetails(getCompanyName()),
		});

		message.success('Successfully printed product details.');
		onSuccess?.();
	};

	return (
		<Spin spinning={isPrintingProduct} wrapperClassName="h-full">
			<div className="flex h-[inherit] flex-col">
				{currentProduct ? (
					<WeightProductDetails onPrint={handlePrint} />
				) : (
					<WeightProductSelection
						branchProducts={branchProducts}
						onSelectProduct={handleSelectProduct}
					/>
				)}
			</div>
		</Spin>
	);
};
