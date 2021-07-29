/* eslint-disable react/jsx-wrap-multilines */
import { message, Spin } from 'antd';
import React, { useEffect } from 'react';
import { Label } from '../../../../components/elements';
import ControlledInput from '../../../../components/elements/ControlledInput/ControlledInput';
import { request } from '../../../../global/types';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { usePc } from '../../../../hooks/usePc';
import { formatPrintDetails, zeroToO } from '../../../../utils/function';
import './style.scss';
import { WeightProductDetails } from './WeightProductDetails';
import { WeightProductSelection } from './WeightProductSelection';
import { useAuth } from '../../../../hooks/useAuth';

export const WeightDrawer = () => {
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
		const weightSplit = weight.toFixed(3).split('.');
		const wholeNumber = `0${weightSplit}`.substring(0, 2);
		const decimalNumber = weightSplit[1].substring(0, 2);

		const total = transactionProducts.reduce(
			(prev: number, { weight: productWeight, price_per_piece }) =>
				Number(productWeight) * Number(price_per_piece) + prev,
			0,
		);

		printProduct(
			{
				name: formatPrintDetails(currentProduct.name),
				weight: `${weight.toFixed(3)}kg`,
				price: currentProduct.price_per_piece?.toFixed(2),
				totalPrice: `P${zeroToO(total.toFixed(2))}`,
				code: `${currentProduct.barcode}${wholeNumber}${decimalNumber}`,
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
					<WeightProductSelection onSelectProduct={onSelectProduct} />
				)}
			</div>
		</Spin>
	);
};
