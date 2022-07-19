import { Modal } from 'antd';
import React from 'react';
import { AuthForm } from '..';
import { ControlledInput, Label } from '../elements';
import './style.scss';

interface Props {
	isLoading: boolean;
	onConfirm: any;
	onClose: any;
	discount?: string;
}

export const DiscountModal = ({
	discount,
	isLoading,
	onConfirm,
	onClose,
}: Props) => (
	<Modal
		className="DiscountModal"
		footer={null}
		title="Manager's Approval for Discount"
		centered
		closable
		visible
		onCancel={onClose}
	>
		<div className="DiscountModal_inputGroup">
			<Label label="Discounted Price" spacing />
			<ControlledInput value={discount} disabled onChange={() => null} />
		</div>

		<AuthForm
			loading={isLoading}
			submitText="Submit"
			isManager
			onSubmit={onConfirm}
		/>
	</Modal>
);
