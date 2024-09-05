import { message, Modal } from 'antd';
import { ScaleButton } from 'components';
import { Button, ControlledInput } from 'components/elements';
import React, { useEffect, useState } from 'react';
import { usePrintTotal } from 'hooks';
import {
	formatPrintDetails,
	formatZeroToO,
	getBranchName,
	getCompanyName,
} from 'utils/function';
import { cn } from 'utils';
import { formatInPeso } from 'ejjy-global';

const DECIMAL_NUMBER_LIMIT = 2;
const TEXTCODE_MAX_LENGTH = 10;
const NUMPAD_CLEAR = -1;
const NUMPAD_DOT = '.';
const inputs = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0, NUMPAD_DOT];

type Props = {
	onClose: () => void;
	visible: boolean;
};

export const LamasAmountModal = ({ visible, onClose }: Props) => {
	// STATES
	const [textcode, setTextcode] = useState('0');
	const { mutateAsync: printTotal, isLoading: isPrintingTotal } =
		usePrintTotal();

	// METHODS
	const handleNumpadInput = (key: number | string) => {
		setTextcode((value) => {
			if (key === NUMPAD_CLEAR) {
				return value.length > 1 ? value.slice(0, -1) : '0';
			}

			// Handle decimal point input
			if (key === NUMPAD_DOT) {
				if (value.includes(NUMPAD_DOT)) return value; // Prevent multiple decimal points
				return `${value}${key}`;
			}

			// Prevent adding digits after two decimal points
			if (value.includes(NUMPAD_DOT)) {
				const [integerPart, decimalPart] = value.split(NUMPAD_DOT);
				if (decimalPart.length >= DECIMAL_NUMBER_LIMIT) return value;
			}

			// Avoid leading zeros except for the single zero
			return value === '0' ? `${key}` : `${value}${key}`;
		});
	};

	const handleSubmit = async () => {
		const totalAmount = parseFloat(textcode);
		if (isNaN(totalAmount)) {
			message.error('Invalid amount. Please enter a valid number.');
			return;
		}

		await printTotal({
			branchName: formatPrintDetails(getBranchName()),
			companyName: formatPrintDetails(getCompanyName()),
			totalPrice: `P${formatZeroToO(totalAmount.toFixed(2))}`,
		});
		message.success('Successfully printed total amount.');
		onClose();
	};

	useEffect(() => {
		if (visible) {
			setTextcode('0');
		}
	}, [visible]);

	const displayValue =
		textcode === '0' ? formatInPeso(0) : formatInPeso(parseFloat(textcode));

	return (
		<Modal
			footer={null}
			title="Input Amount"
			centered
			closable
			visible={visible}
			onCancel={onClose}
		>
			<div className="grid w-full grid-cols-3 grid-rows-4 gap-3">
				<ControlledInput
					className="col-span-3 col-start-1 text-center text-4xl font-bold text-dark"
					value={displayValue}
					disabled
				/>

				{inputs.map((number) => (
					<ScaleButton
						key={number}
						className="h-20 text-[2rem]"
						disabled={
							// Disable the decimal point if already included
							(number === NUMPAD_DOT && textcode.includes(NUMPAD_DOT)) ||
							// Disable the button if the length is at maximum
							(textcode.length >= TEXTCODE_MAX_LENGTH &&
								number !== NUMPAD_CLEAR) ||
							// Prevent adding more decimal places
							(textcode.includes(NUMPAD_DOT) &&
								textcode.split(NUMPAD_DOT)[1]?.length >= DECIMAL_NUMBER_LIMIT)
						}
						title={String(number)}
						onClick={() => handleNumpadInput(number)}
					/>
				))}

				<ScaleButton
					className={cn('h-20 text-[2rem]', {
						'bg-red-500 text-white': textcode.length > 0 && textcode !== '0',
					})}
					disabled={textcode === '0'}
					title="C"
					onClick={() => handleNumpadInput(NUMPAD_CLEAR)}
				/>
			</div>

			<div className="mt-8 grid grid-cols-2 gap-x-5">
				<Button
					disabled={isPrintingTotal}
					size="lg"
					text="Cancel"
					type="button"
					onClick={onClose}
				/>
				<Button
					loading={isPrintingTotal}
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
