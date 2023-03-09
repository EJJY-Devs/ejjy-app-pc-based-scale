/* eslint-disable react/jsx-wrap-multilines */
import { message, Spin } from 'antd';
import { markdownTypes, priceCodes } from 'global';
import { usePrintProduct, useWeight } from 'hooks';
import { useAuth } from 'hooks/useAuth';
import { useCurrentTransaction } from 'hooks/useCurrentTransaction';
import _ from 'lodash';
import React, { useEffect } from 'react';
import { useWeightStore } from 'stores';
import {
	formatPrintDetails,
	formatWeight,
	formatZeroToO,
	getBranchName,
	getCompanyName,
	getPriceCodeFeature,
	standardRound,
} from 'utils/function';
import './style.scss';
import { WeightProductDetails } from './WeightProductDetails';
import { WeightProductSelection } from './WeightProductSelection';

interface Props {
	branchProducts: any;
}

export const WeightDrawer = ({ branchProducts }: Props) => {
	// CUSTOM HOOKS
	const weight = useWeightStore((state: any) => state.weight);

	const { user } = useAuth();
	const { mutateAsync: printProduct, isLoading: isPrintingProduct } =
		usePrintProduct();
	const { transactionProducts, currentProduct, setCurrentProduct } =
		useCurrentTransaction();
	useWeight();

	// METHODS
	useEffect(() => {
		if (weight === 0 && currentProduct) {
			setCurrentProduct(null);
		}
	}, [weight]);

	const handleSelectProduct = (product) => {
		const foundProduct = transactionProducts.find(
			({ id }) => id === product.id,
		);

		if (!foundProduct) {
			setCurrentProduct({ ...product, isCheckedOut: false });
		} else {
			message.error('Product already in the list.');
		}
	};

	const handlePrint = (onSuccess = null) => {
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
		const code = currentProduct.selling_barcode || currentProduct.barcode;
		console.log('print product', {
			name: formatPrintDetails(currentProduct.name),
			weight: `${formatZeroToO(roundedWeight)}kg`,
			price: `P${formatZeroToO(currentProduct.price_per_piece.toFixed(2))}`,
			totalPrice: `P${formatZeroToO(total)}`,
			code: `${priceCode}${code}${formattedWeight}`,
			branchName: formatPrintDetails(getBranchName()),
			companyName: formatPrintDetails(getCompanyName()),
		});

		printProduct({
			name: formatPrintDetails(currentProduct.name),
			weight: `${formatZeroToO(roundedWeight)}kg`,
			price: `P${formatZeroToO(currentProduct.price_per_piece.toFixed(2))}`,
			totalPrice: `P${formatZeroToO(total)}`,
			code: `${priceCode}${code}${formattedWeight}`,
			branchName: formatPrintDetails(getBranchName()),
			companyName: formatPrintDetails(getCompanyName()),
		})
			.then(() => {
				message.success('Successfully printed product details.');
				onSuccess?.();
			})
			.catch(() => {
				message.error('An error occurred while printing the product details');
			});
	};

	return (
		<Spin spinning={isPrintingProduct} wrapperClassName="WeightDrawer">
			<div className="WeightDrawer_container">
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
