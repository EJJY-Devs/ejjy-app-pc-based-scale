import { message, Modal } from 'antd';
import { ScaleButton } from 'components';
import { Button, ControlledInput } from 'components/elements';
import React, { useEffect, useState } from 'react';
import { usePriceStore } from 'stores/usePriceStore';
import { cn } from 'utils';

const TEXTCODE_MAX_LENGTH = 10;
const NUMPAD_CLEAR = -1;
const NUMPAD_DECIMAL = '.';
const inputs = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0, NUMPAD_DECIMAL];

type Props = {
	onClose: () => void;
	visible: boolean;
};

export const PriceAmountModal = ({ visible, onClose }: Props) => {
	// STATES
	const [textcode, setTextcode] = useState('');

	const { setPrice } = usePriceStore();

	// METHODS
	const handleNumpadInput = (key: number | string) => {
		if (key === NUMPAD_CLEAR) {
			setTextcode((value) =>
				value.length > 0 ? value.substring(0, value.length - 1) : '',
			);
		} else if (key === NUMPAD_DECIMAL) {
			// Prevent multiple decimal points or leading decimal points
			setTextcode((value) => {
				if (value.includes('.') || value.length === 0) return value;
				return `${value}${key}`;
			});
		} else {
			setTextcode((value) => `${value}${key}`);
		}
	};

	useEffect(() => {
		if (visible) {
			setTextcode('');
		}
	}, [visible]);

	const handleSubmit = () => {
		if (textcode.length === 0) {
			message.warning('Please input a price first.');
			return;
		}

		const price = parseFloat(textcode);
		if (isNaN(price)) {
			message.error('Invalid price. Please enter a valid number.');
			return;
		}

		setPrice(price);

		onClose();
	};

	return (
		<Modal
			footer={null}
			title="Input Price"
			visible={visible}
			centered
			closable
			onCancel={onClose}
		>
			<>
				<div className="grid w-full grid-cols-3 grid-rows-5 gap-3">
					<ControlledInput
						className="col-span-3 col-start-1 text-center text-4xl font-bold text-dark"
						value={textcode}
						disabled
						onChange={(value) => setTextcode(value)}
					/>

					{inputs.map((input) => (
						<ScaleButton
							key={input}
							className={
								input === 0
									? 'col-span-2 col-start-1 h-20 text-[2rem]'
									: 'h-20 text-[2rem]'
							}
							disabled={
								(textcode.length >= TEXTCODE_MAX_LENGTH &&
									input !== NUMPAD_CLEAR) ||
								(input === NUMPAD_DECIMAL && textcode.includes('.'))
							}
							title={String(input)}
							onClick={() => handleNumpadInput(input)}
						/>
					))}

					<ScaleButton
						className={cn('col-span-3 h-20 text-[2rem]', {
							'bg-red-500 text-white': textcode.length > 0,
						})}
						disabled={textcode.length === 0}
						title="C"
						onClick={() => handleNumpadInput(NUMPAD_CLEAR)}
					/>
				</div>
				<div className="mt-8 grid grid-cols-2 gap-x-5">
					<Button size="lg" text="Cancel" type="button" onClick={onClose} />
					<Button
						size="lg"
						text="Submit"
						type="submit"
						variant="primary"
						onClick={handleSubmit}
					/>
				</div>
			</>
		</Modal>
	);
};
