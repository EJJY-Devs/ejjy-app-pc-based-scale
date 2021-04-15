import { Modal } from 'antd';
import React from 'react';
import { ControlledInput, Label } from '../../../../components/elements';
import { LoginForm } from '../../../_Login/components/LoginForm';

interface Props {
	visible: boolean;
	isLoading: boolean;
	onConfirm: any;
	onClose: any;
	discount?: string;
}

export const DiscountAuthModal = ({ visible, discount, isLoading, onConfirm, onClose }: Props) => (
	<Modal
		title="Manager's Approval for Discount"
		visible={visible}
		footer={null}
		onCancel={onClose}
		centered
		closable
	>
		<div style={{ marginBottom: '30px' }}>
			<Label label="Discount" spacing />
			<ControlledInput value={discount} onChange={() => null} disabled />
		</div>

		<LoginForm onSubmit={onConfirm} submitText="Submit" loading={isLoading} errors={[]} isManager />
	</Modal>
);
