/* eslint-disable react/jsx-wrap-multilines */
import { message } from 'antd';
import React from 'react';
import { ScaleButton } from '../../../../components';
import { ControlledInput, Label } from '../../../../components/elements';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import { usePc } from '../../../../hooks/usePc';
import { numberWithCommas } from '../../../../utils/function';
import './style.scss';

interface Props {
	onPrint: any;
}

export const WeightProductDetails = ({ onPrint }: Props) => {
	// CUSTOM HOOKS
	const { weight } = usePc();
	const { currentProduct, addProduct, setCurrentProduct } =
		useCurrentTransaction();

	// METHODS
	const onPrintAndAddCart = () => {
		onPrint(() => {
			addProduct({ ...currentProduct, weight: weight.toFixed(3) });
			onClearSelectedProduct();
			message.success('Product successfully added.');
		});
	};

	const onClearSelectedProduct = () => {
		setCurrentProduct(null);
	};

	return (
		<div className="WeightProductDetails">
			<div className="WeightProductDetails_inputGroup">
				<Label id="name" label="Name" spacing />
				<ControlledInput
					className="WeightProductDetails_inputGroup_input"
					value={currentProduct.name}
					onChange={() => null}
					disabled
				/>
			</div>

			<div className="WeightProductDetails_inputGroup">
				<Label id="price" label="Price" spacing />
				<ControlledInput
					className="WeightProductDetails_inputGroup_input"
					value={`₱${numberWithCommas(
						currentProduct.price_per_piece?.toFixed(2),
					)}`}
					onChange={() => null}
					disabled
				/>
			</div>

			<div className="WeightProductDetails_inputGroup">
				<Label id="total" label="TOTAL" spacing />
				<ControlledInput
					className="WeightProductDetails_inputGroup_input"
					value={`₱${numberWithCommas(
						(weight * currentProduct.price_per_piece)?.toFixed(2),
					)}`}
					onChange={() => null}
					disabled
				/>
			</div>

			<ScaleButton
				className="WeightProductDetails_btnClear"
				title="Remove Selected Product"
				onClick={onClearSelectedProduct}
			/>

			<div className="WeightProductDetails_btnGroup">
				<ScaleButton title="Print" onClick={onPrint} />
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
	);
};
