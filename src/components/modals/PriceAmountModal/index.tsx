import { message, Modal } from 'antd';
import { ScaleButton } from 'components';
import { Button, ControlledInput } from 'components/elements';
import React, { useEffect, useState } from 'react';
import { usePriceStore } from 'stores/usePriceStore';
import { cn } from 'utils';
import { formatInPeso } from 'ejjy-global';

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
	const [rawInput, setRawInput] = useState('0');
	const { setPrice } = usePriceStore();

	// METHODS
	const handleNumpadInput = (key: number | string) => {
		setRawInput((value) => {
			if (key === NUMPAD_CLEAR) {
				return value.length > 1 ? value.slice(0, -1) : '0';
			}

			// Handle decimal point input
			if (key === NUMPAD_DECIMAL && value.includes('.')) return value;
			if (key === NUMPAD_DECIMAL) return `${value}${key}`;

			// Avoid leading zeros
			return value === '0' ? `${key}` : `${value}${key}`;
		});
	};

	useEffect(() => {
		if (visible) {
			setRawInput('0');
		}
	}, [visible]);

	const handleSubmit = () => {
		const price = parseFloat(rawInput);
		if (isNaN(price)) {
			message.error('Invalid price. Please enter a valid number.');
			return;
		}

		setPrice(price);
		onClose();
	};

	const displayValue =
		rawInput === '0' ? formatInPeso(0) : formatInPeso(rawInput);

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
						value={displayValue}
					/>

					{inputs.map((input) => (
						<ScaleButton
							key={input}
							className={
								input === 0
									? 'col-span-1 col-start-1 h-20 text-[2rem]'
									: 'h-20 text-[2rem]'
							}
							disabled={
								(rawInput.length >= TEXTCODE_MAX_LENGTH &&
									input !== NUMPAD_CLEAR) ||
								(input === NUMPAD_DECIMAL && rawInput.includes('.')) || //Prevent multiple decimal points
								(rawInput.includes('.') && rawInput.split('.')[1].length >= 2) // Disable if two decimals
							}
							title={String(input)}
							onClick={() => handleNumpadInput(input)}
						/>
					))}

					<ScaleButton
						className={cn('col-span-1 h-20 text-[2rem]', {
							'bg-red-500 text-white': rawInput.length > 0,
						})}
						disabled={rawInput === '0'}
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
