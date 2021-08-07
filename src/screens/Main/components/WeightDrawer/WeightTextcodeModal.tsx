/* eslint-disable react/jsx-wrap-multilines */
import { message, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { ScaleButton } from '../../../../components';
import { Button } from '../../../../components/elements';
import ControlledInput from '../../../../components/elements/ControlledInput/ControlledInput';
import { request } from '../../../../global/types';
import { useBranchProducts } from '../../../../hooks/useBranchProducts';
import { useCurrentTransaction } from '../../../../hooks/useCurrentTransaction';
import './style.scss';

const TEXTCODE_MAX_LENGTH = 10;

interface Props {
	visible: boolean;
	onSelectProduct: any;
	onClose: any;
}

export const WeightTextcodeModal = ({
	visible,
	onSelectProduct,
	onClose,
}: Props) => {
	// STATES
	const [textcode, setTextcode] = useState('');

	// CUSTOM HOOKS
	const { listBranchProducts } = useBranchProducts();
	const { transactionProducts } = useCurrentTransaction();

	// METHODS
	useEffect(() => {
		if (visible) {
			setTextcode('');
		}
	}, [visible]);

	const onNumpadInput = (key) => {
		if (key === -1) {
			// eslint-disable-next-line no-confusing-arrow
			setTextcode((value) =>
				value.length > 0 ? value.substring(0, value.length - 1) : '',
			);
		} else {
			setTextcode((value) => `${value}${key}`);
		}
	};

	const onSubmit = () => {
		if (textcode.length > 0) {
			listBranchProducts({ search: textcode }, ({ status, data }) => {
				if (status === request.SUCCESS) {
					const foundProduct = data.results?.[0];
					const transactionProduct = transactionProducts.find(
						({ id }) => id === foundProduct.id,
					);

					if (transactionProduct) {
						message.warning('Product is already on your cart.');
						return;
					}

					if (foundProduct) {
						const {
							product,
							discounted_price_per_piece1,
							discounted_price_per_piece2,
							price_per_piece,
						} = foundProduct;

						onSelectProduct({
							...product,
							discounted_price_per_piece1,
							discounted_price_per_piece2,
							price_per_piece,
						});
						onClose();
					} else {
						message.error('Product does not exist.');
					}
				} else if (status === request.ERROR) {
					message.error('An error occurred while searching the product.');
				}
			});
		} else {
			message.warning('Please input a textcode first.');
		}
	};

	return (
		<Modal
			title="Search Product By Textcode"
			className="WeightTextcodeModal"
			visible={visible}
			footer={null}
			onCancel={onClose}
			centered
			closable
		>
			<div className="WeightTextcodeModal_textcodeNumbers">
				<ControlledInput
					className="WeightTextcodeModal_textcodeNumbers_input"
					value={textcode}
					onChange={(value) => setTextcode(value)}
					disabled
				/>

				<ScaleButton
					className="WeightTextcodeModal_textcodeNumbers_num"
					title="7"
					onClick={() => onNumpadInput(7)}
					disabled={textcode.length >= TEXTCODE_MAX_LENGTH}
				/>
				<ScaleButton
					className="WeightTextcodeModal_textcodeNumbers_num"
					title="8"
					onClick={() => onNumpadInput(8)}
					disabled={textcode.length >= TEXTCODE_MAX_LENGTH}
				/>
				<ScaleButton
					className="WeightTextcodeModal_textcodeNumbers_num"
					title="9"
					onClick={() => onNumpadInput(9)}
					disabled={textcode.length >= TEXTCODE_MAX_LENGTH}
				/>

				<ScaleButton
					className="WeightTextcodeModal_textcodeNumbers_num"
					title="4"
					onClick={() => onNumpadInput(4)}
					disabled={textcode.length >= TEXTCODE_MAX_LENGTH}
				/>
				<ScaleButton
					className="WeightTextcodeModal_textcodeNumbers_num"
					title="5"
					onClick={() => onNumpadInput(5)}
					disabled={textcode.length >= TEXTCODE_MAX_LENGTH}
				/>
				<ScaleButton
					className="WeightTextcodeModal_textcodeNumbers_num"
					title="6"
					onClick={() => onNumpadInput(6)}
					disabled={textcode.length >= TEXTCODE_MAX_LENGTH}
				/>

				<ScaleButton
					className="WeightTextcodeModal_textcodeNumbers_num"
					title="1"
					onClick={() => onNumpadInput(1)}
					disabled={textcode.length >= TEXTCODE_MAX_LENGTH}
				/>
				<ScaleButton
					className="WeightTextcodeModal_textcodeNumbers_num"
					title="2"
					onClick={() => onNumpadInput(2)}
					disabled={textcode.length >= TEXTCODE_MAX_LENGTH}
				/>
				<ScaleButton
					className="WeightTextcodeModal_textcodeNumbers_num"
					title="3"
					onClick={() => onNumpadInput(3)}
					disabled={textcode.length >= TEXTCODE_MAX_LENGTH}
				/>

				<ScaleButton
					className="WeightTextcodeModal_textcodeNumbers_num WeightTextcodeModal_textcodeNumbers_num0"
					title="0"
					onClick={() => onNumpadInput(0)}
					disabled={textcode.length >= TEXTCODE_MAX_LENGTH}
				/>
				<ScaleButton
					title="C"
					onClick={() => onNumpadInput(-1)}
					disabled={textcode.length === 0}
				/>
			</div>

			<div className="WeightTextcodeModal_btnGroup">
				<Button
					type="button"
					text="Cancel"
					size="lg"
					onClick={onClose}
					classNames="WeightTextcodeModal_btnGroup_btnCancel"
				/>
				<Button
					type="submit"
					text="Submit"
					size="lg"
					variant="primary"
					onClick={onSubmit}
				/>
			</div>
		</Modal>
	);
};
