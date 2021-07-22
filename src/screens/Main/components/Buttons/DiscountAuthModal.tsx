import { Modal } from 'antd';
import React from 'react';
import { AuthForm } from '../../../../components';
import { ControlledInput, Label } from '../../../../components/elements';

interface Props {
	visible: boolean;
	isLoading: boolean;
	onConfirm: any;
	onClose: any;
	discount?: string;
}

export const DiscountAuthModal = ({
	visible,
	discount,
	isLoading,
	onConfirm,
	onClose,
}: Props) => (
	<Modal
		title="Manager's Approval for Discount"
		visible={visible}
		footer={null}
		onCancel={onClose}
		centered
		closable
	>
		<div style={{ marginBottom: '30px' }}>
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
