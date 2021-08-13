/* eslint-disable react/jsx-wrap-multilines */
import { message, Spin } from 'antd';
import { padStart } from 'lodash';
import React, { useEffect } from 'react';
import { Label } from '../../../../components/elements';
import ControlledInput from '../../../../components/elements/ControlledInput/ControlledInput';
import { request } from '../../../../global/types';
import { useAuth } from '../../../../hooks/useAuth';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { usePc } from '../../../../hooks/usePc';
import { formatPrintDetails, zeroToO } from '../../../../utils/function';
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
		const total = currentProduct.price_per_piece * weight;
		const formattedWeight = padStart(
			weight.toFixed(4).replace(/\./g, ''),
			6,
			'0',
		);

		printProduct(
			{
				name: formatPrintDetails(currentProduct.name),
				weight: `${weight.toFixed(3)}kg`,
				price: `P${zeroToO(currentProduct.price_per_piece.toFixed(2))}`,
				totalPrice: `P${zeroToO(total.toFixed(2))}`,
				code: `${currentProduct.barcode}${formattedWeight}`,
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
			wrapperClassName="WeightDrawer"
			size="large"
			spinning={pcStatus === request.REQUESTING}
		>
			<div className="WeightDrawer_container">
				<Label id="weight" label="Weight" spacing />
				<ControlledInput
					className="WeightDrawer_inputWeight"
					value={weight?.toFixed(3)}
					onChange={() => null}
					disabled
				/>

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
