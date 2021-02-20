/* eslint-disable react-hooks/exhaustive-deps */
import { message, Modal, Spin } from 'antd';
import React, { useEffect, useRef } from 'react';
import { Button, ControlledInput, Label } from '../../../../components/elements';
import { numberWithCommas } from '../../../../utils/function';
import './style.scss';

interface Props {
	amountDue: any;
	visible: boolean;
	onSuccess: any;
	onClose: any;
}

export const PaymentModal = ({ amountDue, visible, onClose, onSuccess }: Props) => {
	// STATES
	const inputRef = useRef(null);

	// CUSTOM HOOKS
	// const { session } = useSession();
	// const {
	// 	transactionId: currentTransactionId,
	// 	setPreviousSukli,
	// 	createCurrentTransaction,
	// 	requestStatus: createTransactionStatus,
	// } = useCurrentTransaction();
	// const { payTransaction, status: paymentStatus } = useTransactions();

	// METHODS
	useEffect(() => {
		if (inputRef && inputRef.current) {
			setTimeout(() => {
				const input = inputRef.current;
				input.focus();
			}, 500);
		}
	}, [visible, inputRef]);

	const onSubmit = (formData) => {
		message.success('Paid');
		// if (currentTransactionId) {
		// 	onPayTransaction(currentTransactionId, formData.amountTendered);
		// } else {
		// 	createCurrentTransaction({
		// 		callback: ({ status, response }) => {
		// 			if (status === request.SUCCESS) {
		// 				onPayTransaction(response.id, formData.amountTendered);
		// 			} else if (status === request.ERROR) {
		// 				message.error('An error occurred while creating transaction');
		// 			}
		// 		},
		// 	});
		// }
	};

	// const onPayTransaction = (transactionId, amountTendered) => {
	// 	let amountTenderedNumber = removeCommas(amountTendered);

	// 	const data = {
	// 		transactionId,
	// 		amountTendered: amountTenderedNumber,
	// 		cashierUserId: session.user.id,
	// 	};

	// 	const sukli = amountTenderedNumber - amountDue;
	// 	payTransaction(data, ({ status, response }) => {
	// 		if (status === request.SUCCESS) {
	// 			if (response.is_fully_paid && response?.invoice.id) {
	// 				setPreviousSukli(sukli);
	// 				onSuccess(response);
	// 			}
	// 			onClose();
	// 		} else if (status === request.ERROR) {
	// 			message.error('An error occured while processing the payment.');
	// 		}
	// 	});
	// };

	return (
		<Modal
			title="Pay"
			className="PaymentModal"
			visible={visible}
			footer={null}
			onCancel={onClose}
			centered
			closable
		>
			<Spin
				size="large"
				spinning={false}
				// spinning={[createTransactionStatus, paymentStatus].includes(request.REQUESTING)}
			>
				<div className="form">
					<Label classNames="quantity-label" label="Amount Due (₱)" spacing />
					<ControlledInput
						classNames="amount-due-input"
						value={numberWithCommas(amountDue)}
						onChange={() => null}
						disabled
					/>

					<div className="custom-footer">
						<Button
							type="button"
							text={
								<>
									<span>Cancel</span>
									<span className="shortcut-key">[ESC]</span>
								</>
							}
							size="lg"
							onClick={onClose}
							classNames="btn-cancel"
							hasShortcutKey
						/>
						<Button
							type="submit"
							text={
								<>
									<span>Submit</span>
									<span className="shortcut-key">[ENTER]</span>
								</>
							}
							size="lg"
							variant="primary"
							hasShortcutKey
						/>
					</div>
				</div>
			</Spin>
		</Modal>
	);
};
