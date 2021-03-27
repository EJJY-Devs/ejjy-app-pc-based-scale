import { message, Modal } from 'antd';
import React, { useState } from 'react';
import './style.scss';
import ControlledInput from '../../../../components/elements/ControlledInput/ControlledInput';
import { MainButton } from '../MainButtons/MainButton';
import { Button } from '../../../../components/elements';
import { useBranchProducts } from '../../../../hooks/useBranchProducts';

interface Props {
	visible: boolean;
	onSelectProduct: any;
	onClose: any;
}

export const TextcodeModal = ({ visible, onSelectProduct, onClose }: Props) => {
	// STATES
	const [textcode, setTextcode] = useState('');

	// CUSTOM HOOKS
	const { branchProducts } = useBranchProducts();

	// METHODS
	const onNumpadInput = (key) => {
		if (textcode.length >= 10) {
			return;
		}

		if (key === -1) {
			setTextcode((value) => (value.length > 0 ? value.substring(0, value.length - 1) : ''));
		} else {
			setTextcode((value) => `${value}${key}`);
		}
	};

	const onSubmit = () => {
		if (textcode.length > 0) {
			const {
				product,
				discounted_price_per_piece1,
				discounted_price_per_piece2,
				price_per_piece,
			} = branchProducts.find(({ product }) => product.textcode === textcode);

			if (product) {
				onSelectProduct({
					...product,
					discounted_price_per_piece1: discounted_price_per_piece1,
					discounted_price_per_piece2: discounted_price_per_piece2,
					price_per_piece,
				});
				onClose();
			} else {
				message.error('Product does not exist.');
			}
		} else {
			message.warning('Please input a textcode first.');
		}
	};

	return (
		<Modal
			title="Textcode"
			className="TextcodeModal"
			visible={visible}
			footer={null}
			onCancel={onClose}
			centered
			closable
		>
			<div className="form">
				<div className="textcode-numbers">
					<ControlledInput
						classNames="input"
						value={textcode}
						onChange={(value) => setTextcode(value)}
						disabled
					/>
					<MainButton classNames="btn-clear" title="X" onClick={() => onNumpadInput(-1)} />

					<MainButton classNames="number-9" title="9" onClick={() => onNumpadInput(9)} />
					<MainButton classNames="number-8" title="8" onClick={() => onNumpadInput(8)} />
					<MainButton classNames="number-7" title="7" onClick={() => onNumpadInput(7)} />

					<MainButton classNames="number-6" title="6" onClick={() => onNumpadInput(6)} />
					<MainButton classNames="number-5" title="5" onClick={() => onNumpadInput(5)} />
					<MainButton classNames="number-4" title="4" onClick={() => onNumpadInput(4)} />

					<MainButton classNames="number-3" title="3" onClick={() => onNumpadInput(3)} />
					<MainButton classNames="number-2" title="2" onClick={() => onNumpadInput(2)} />
					<MainButton classNames="number-1" title="1" onClick={() => onNumpadInput(1)} />

					<MainButton classNames="number-0" title="0" onClick={() => onNumpadInput(0)} />
				</div>

				<div className="custom-footer">
					<Button type="button" text="Cancel" size="lg" onClick={onClose} classNames="btn-cancel" />
					<Button type="submit" text="Submit" size="lg" variant="primary" onClick={onSubmit} />
				</div>
			</div>
		</Modal>
	);
};
