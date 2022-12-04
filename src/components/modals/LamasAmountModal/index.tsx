/* eslint-disable react/jsx-wrap-multilines */
import { message, Modal } from 'antd';
import { ScaleButton } from 'components';
import { Button, ControlledInput } from 'components/elements';
import { useAuth, usePrintTotal } from 'hooks';
import React, { useCallback, useState } from 'react';
import {
	formatStringForPrinting,
	formatZeroToO,
	getBranchName,
	getCompanyName,
} from 'utils/function';
import './style.scss';

const DECIMAL_NUMBER_LIMIT = 2;
const NUMPAD_CLEAR = -1;
const NUMPAD_DOT = '.';

interface Props {
	onClose: any;
}

export const LamasAmountModal = ({ onClose }: Props) => {
	// STATES
	const [textcode, setTextcode] = useState('');

	// CUSTOM HOOKS
	const { mutateAsync: printTotal, isLoading: isPrintingTotal } =
		usePrintTotal();

	// METHODS
	const handleNumpadClick = (key) => {
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
			branchName: formatStringForPrinting(getBranchName()),
			companyName: formatStringForPrinting(getCompanyName()),
			totalPrice: `P${formatZeroToO(totalAmount.toFixed(2))}`,
		});

		message.success('Successfully printed total amount.');
		onClose();
	};

	return (
		<Modal
			className="InputAmountModal"
			footer={null}
			title="Input Amount"
			centered
			closable
			visible
			onCancel={onClose}
		>
			<div className="InputAmountModal_textcodeNumbers">
				<ControlledInput
					className="InputAmountModal_textcodeNumbers_input"
					value={`₱${textcode}`}
					disabled
					onChange={(value) => setTextcode(value)}
				/>

				<ScaleButton
					className="InputAmountModal_textcodeNumbers_num"
					disabled={isDigitsDisabled()}
					title="7"
					onClick={() => handleNumpadClick(7)}
				/>
				<ScaleButton
					className="InputAmountModal_textcodeNumbers_num"
					disabled={isDigitsDisabled()}
					title="8"
					onClick={() => handleNumpadClick(8)}
				/>
				<ScaleButton
					className="InputAmountModal_textcodeNumbers_num"
					disabled={isDigitsDisabled()}
					title="9"
					onClick={() => handleNumpadClick(9)}
				/>

				<ScaleButton
					className="InputAmountModal_textcodeNumbers_num"
					disabled={isDigitsDisabled()}
					title="4"
					onClick={() => handleNumpadClick(4)}
				/>
				<ScaleButton
					className="InputAmountModal_textcodeNumbers_num"
					disabled={isDigitsDisabled()}
					title="5"
					onClick={() => handleNumpadClick(5)}
				/>
				<ScaleButton
					className="InputAmountModal_textcodeNumbers_num"
					disabled={isDigitsDisabled()}
					title="6"
					onClick={() => handleNumpadClick(6)}
				/>

				<ScaleButton
					className="InputAmountModal_textcodeNumbers_num"
					disabled={isDigitsDisabled()}
					title="1"
					onClick={() => handleNumpadClick(1)}
				/>
				<ScaleButton
					className="InputAmountModal_textcodeNumbers_num"
					disabled={isDigitsDisabled()}
					title="2"
					onClick={() => handleNumpadClick(2)}
				/>
				<ScaleButton
					className="InputAmountModal_textcodeNumbers_num"
					disabled={isDigitsDisabled()}
					title="3"
					onClick={() => handleNumpadClick(3)}
				/>

				<ScaleButton
					className="InputAmountModal_textcodeNumbers_num"
					disabled={isDigitsDisabled()}
					title="0"
					onClick={() => handleNumpadClick(0)}
				/>

				<ScaleButton
					className="InputAmountModal_textcodeNumbers_num"
					disabled={textcode.includes(NUMPAD_DOT)}
					title={NUMPAD_DOT}
					onClick={() => handleNumpadClick(NUMPAD_DOT)}
				/>
				<ScaleButton
					className="InputAmountModal_textcodeNumbers_num InputAmountModal_textcodeNumbers_clear"
					disabled={textcode.length === 0}
					title="C"
					onClick={() => handleNumpadClick(NUMPAD_CLEAR)}
				/>
			</div>

			<div className="InputAmountModal_btnGroup">
				<Button
					className="InputAmountModal_btnGroup_btnCancel"
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
