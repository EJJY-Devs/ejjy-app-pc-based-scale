import { Modal } from 'antd';
import React from 'react';
import { AuthForm } from '..';
import { ControlledInput, Label } from '../elements';
import './style.scss';

interface Props {
	visible: boolean;
	isLoading: boolean;
	onConfirm: any;
	onClose: any;
	discount?: string;
}

export const DiscountModal = ({
	visible,
	discount,
	isLoading,
	onConfirm,
	onClose,
}: Props) => (
	<Modal
		className="DiscountModal"
		title="Manager's Approval for Discount"
		visible={visible}
		footer={null}
		onCancel={onClose}
		centered
		closable
	>
		<div className="DiscountModal_inputGroup">
			<Label label="Discounted Price" spacing />
			<ControlledInput value={discount} onChange={() => null} disabled />
		</div>

		<AuthForm
			submitText="Submit"
			onSubmit={onConfirm}
			loading={isLoading}
			isManager
		/>
	</Modal>
);
