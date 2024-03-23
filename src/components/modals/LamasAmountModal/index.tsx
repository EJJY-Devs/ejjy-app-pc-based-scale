import { message, Modal } from 'antd';
import { ScaleButton } from 'components';
import { Button, ControlledInput } from 'components/elements';
import { usePrintTotal } from 'hooks';
import React, { useCallback, useState } from 'react';
import {
	formatPrintDetails,
	formatZeroToO,
	getBranchName,
	getCompanyName,
} from 'utils/function';
import { cn } from 'utils';

const DECIMAL_NUMBER_LIMIT = 2;
const NUMPAD_CLEAR = -1;
const NUMPAD_DOT = '.';
const inputs = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0, NUMPAD_DOT];

type Props = {
	onClose: () => void;
};

export const LamasAmountModal = ({ onClose }: Props) => {
	// STATES
	const [textcode, setTextcode] = useState('');

	// CUSTOM HOOKS
	const { mutateAsync: printTotal, isLoading: isPrintingTotal } =
		usePrintTotal();

	// METHODS
	const handleNumpadInput = (key: number | string) => {
		if (key === NUMPAD_CLEAR) {
			setTextcode((value) =>
				value.length > 0 ? value.substring(0, value.length - 1) : '',
			);

			return;
		}

		setTextcode((value) => `${value}${key}`);
	};

	const isDigitsDisabled = useCallback(() => {
		const hasDot = textcode.includes(NUMPAD_DOT);

		if (hasDot) {
			return textcode.split(NUMPAD_DOT)?.[1].length >= DECIMAL_NUMBER_LIMIT;
		}

		return false;
	}, [textcode]);

	const handleSubmit = async () => {
		const totalAmount = Number(textcode);

		await printTotal({
			branchName: formatPrintDetails(getBranchName()),
			companyName: formatPrintDetails(getCompanyName()),
			totalPrice: `P${formatZeroToO(totalAmount.toFixed(2))}`,
		});

		message.success('Successfully printed total amount.');
		onClose();
	};

	return (
		<Modal
			footer={null}
			title="Input Amount"
			centered
			closable
			visible
			onCancel={onClose}
		>
			<div className="grid w-full grid-cols-3 grid-rows-5 gap-3">
				<ControlledInput
					className="col-span-3 col-start-1 text-center text-4xl font-bold text-dark"
					value={textcode}
					disabled
					onChange={(value) => setTextcode(value)}
				/>

				{inputs.map((number) => (
					<ScaleButton
						key={number}
						className={
							number === 0
								? 'col-span-2 col-start-1 h-20 text-[2rem]'
								: 'h-20 text-[2rem]'
						}
						disabled={isDigitsDisabled() || textcode.includes(NUMPAD_DOT)}
						title={String(number)}
						onClick={() => handleNumpadInput(number)}
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
