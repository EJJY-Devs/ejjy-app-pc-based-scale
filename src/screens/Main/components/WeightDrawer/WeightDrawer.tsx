/* eslint-disable react/jsx-wrap-multilines */
import { message, Spin } from 'antd';
import _, { padStart } from 'lodash';
import React, { useEffect } from 'react';
import { markdownTypes, priceCodes, request } from '../../../../global/types';
import { useAuth } from '../../../../hooks/useAuth';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { usePc } from '../../../../hooks/usePc';
import {
	formatPrintDetails,
	getPriceCodeFeature,
	standardRound,
	formatZeroToO,
} from '../../../../utils/function';
import './style.scss';
import { WeightProductDetails } from './WeightProductDetails';
import { WeightProductSelection } from './WeightProductSelection';

interface Props {
	branchProducts: any;
}

export const WeightDrawer = ({ branchProducts }: Props) => {
	// CUSTOM HOOKS
	const { user } = useAuth();
	const { resetWeight, getWeight } = usePc();
	const { weight, printProduct, status: pcStatus } = usePc();
	const { transactionProducts, currentProduct, setCurrentProduct } =
		useCurrentTransaction();

	// METHODS
	useEffect(() => {
		resetWeight();
		getWeight();
	}, []);

	useEffect(() => {
		if (weight === 0 && currentProduct) {
			setCurrentProduct(null);
		}
	}, [weight]);

	const onSelectProduct = (product) => {
		const foundProduct = transactionProducts.find(
			({ id }) => id === product.id,
		);

		if (!foundProduct) {
			setCurrentProduct({ ...product, isCheckedOut: false });
		} else {
			message.error('Product already in the list.');
		}
	};

	const onPrint = (onSuccess = null) => {
		const total = standardRound(currentProduct.price_per_piece * weight);
		const roundedWeight = _.round(Number(weight), 3);
		const formattedWeight = padStart(
			roundedWeight.toFixed(4).replace(/\./g, ''),
			6,
			'0',
		);

		let priceCode = '';
		if (getPriceCodeFeature()) {
			const type =
				currentProduct.price_markdown?.type ||
				currentProduct.markdownType ||
				markdownTypes.REGULAR;

			priceCode = priceCodes[type] || '';
		}

		printProduct(
			{
				name: formatPrintDetails(currentProduct.name),
				weight: `${formatZeroToO(roundedWeight.toFixed(3))}kg`,
				price: `P${formatZeroToO(currentProduct.price_per_piece.toFixed(2))}`,
				totalPrice: `P${formatZeroToO(total)}`,
				code: `${priceCode}${currentProduct.selling_barcode}${formattedWeight}`,
				branch: formatPrintDetails(user?.branch?.name),
			},
			({ status }) => {
				if (status === request.SUCCESS) {
					if (!onSuccess) {
						message.success('Successfully printed product details.');
					} else {
						onSuccess();
					}
				} else if (status === request.ERROR) {
					message.error('An error occurred while printing the product details');
				}
			},
		);
	};

	return (
		<Spin
			size="large"
			spinning={pcStatus === request.REQUESTING}
			wrapperClassName="WeightDrawer"
		>
			<div className="WeightDrawer_container">
				{currentProduct ? (
					<WeightProductDetails onPrint={onPrint} />
				) : (
					<WeightProductSelection
						branchProducts={branchProducts}
						onSelectProduct={onSelectProduct}
					/>
				)}
			</div>
		</Spin>
	);
};
