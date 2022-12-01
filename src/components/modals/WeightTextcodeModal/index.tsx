/* eslint-disable react/jsx-wrap-multilines */
import { message, Modal } from 'antd';
import { ScaleButton } from 'components';
import { Button, ControlledInput } from 'components/elements';
import { request } from 'global';
import { useBranchProducts } from 'hooks/useBranchProducts';
import { useCurrentTransaction } from 'hooks/useCurrentTransaction';
import React, { useEffect, useState } from 'react';
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
	const { listBranchProducts, status: branchProductsStatus } =
		useBranchProducts();
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

	const handleSubmit = () => {
		if (textcode.length > 0) {
			listBranchProducts({ search: textcode }, ({ status, data }) => {
				if (status === request.SUCCESS) {
					const branchProduct = data.find(
						(item) => item.product.textcode === textcode,
					);

					if (branchProduct) {
						const transactionProduct = transactionProducts.find(
							({ id }) => id === branchProduct.id,
						);

						if (transactionProduct) {
							message.warning('Product is already on your cart.');
							return;
						}

						const {
							product,
							markdown_price_per_piece1,
							markdown_price_per_piece2,
							price_per_piece,
						} = branchProduct;

						onSelectProduct({
							...product,
							markdown_price_per_piece1,
							markdown_price_per_piece2,
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
			className="WeightTextcodeModal"
			footer={null}
			title="Search Product By Textcode"
			visible={visible}
			centered
			closable
			onCancel={onClose}
		>
			<div className="WeightTextcodeModal_textcodeNumbers">
				<ControlledInput
					className="WeightTextcodeModal_textcodeNumbers_input"
					value={textcode}
					disabled
					onChange={(value) => setTextcode(value)}
				/>

				<ScaleButton
					className="WeightTextcodeModal_textcodeNumbers_num"
					disabled={textcode.length >= TEXTCODE_MAX_LENGTH}
					title="7"
					onClick={() => onNumpadInput(7)}
				/>
				<ScaleButton
					className="WeightTextcodeModal_textcodeNumbers_num"
					disabled={textcode.length >= TEXTCODE_MAX_LENGTH}
					title="8"
					onClick={() => onNumpadInput(8)}
				/>
				<ScaleButton
					className="WeightTextcodeModal_textcodeNumbers_num"
					disabled={textcode.length >= TEXTCODE_MAX_LENGTH}
					title="9"
					onClick={() => onNumpadInput(9)}
				/>

				<ScaleButton
					className="WeightTextcodeModal_textcodeNumbers_num"
					disabled={textcode.length >= TEXTCODE_MAX_LENGTH}
					title="4"
					onClick={() => onNumpadInput(4)}
				/>
				<ScaleButton
					className="WeightTextcodeModal_textcodeNumbers_num"
					disabled={textcode.length >= TEXTCODE_MAX_LENGTH}
					title="5"
					onClick={() => onNumpadInput(5)}
				/>
				<ScaleButton
					className="WeightTextcodeModal_textcodeNumbers_num"
					disabled={textcode.length >= TEXTCODE_MAX_LENGTH}
					title="6"
					onClick={() => onNumpadInput(6)}
				/>

				<ScaleButton
					className="WeightTextcodeModal_textcodeNumbers_num"
					disabled={textcode.length >= TEXTCODE_MAX_LENGTH}
					title="1"
					onClick={() => onNumpadInput(1)}
				/>
				<ScaleButton
					className="WeightTextcodeModal_textcodeNumbers_num"
					disabled={textcode.length >= TEXTCODE_MAX_LENGTH}
					title="2"
					onClick={() => onNumpadInput(2)}
				/>
				<ScaleButton
					className="WeightTextcodeModal_textcodeNumbers_num"
					disabled={textcode.length >= TEXTCODE_MAX_LENGTH}
					title="3"
					onClick={() => onNumpadInput(3)}
				/>

				<ScaleButton
					className="WeightTextcodeModal_textcodeNumbers_num WeightTextcodeModal_textcodeNumbers_num0"
					disabled={textcode.length >= TEXTCODE_MAX_LENGTH}
					title="0"
					onClick={() => onNumpadInput(0)}
				/>
				<ScaleButton
					disabled={textcode.length === 0}
					title="C"
					onClick={() => onNumpadInput(-1)}
				/>
			</div>

			<div className="WeightTextcodeModal_btnGroup">
				<Button
					className="WeightTextcodeModal_btnGroup_btnCancel"
					size="lg"
					text="Cancel"
					type="button"
					onClick={onClose}
				/>
				<Button
					loading={branchProductsStatus === request.REQUESTING}
					size="lg"
					text="Submit"
					type="submit"
					variant="primary"
					onClick={handleSubmit}
				/>
			</div>
		</Modal>
	);
};
