import { Modal } from 'antd';
import { AuthForm } from 'components/AuthForm';
import React from 'react';
import { ControlledInput, Label } from '../../elements';

type Props = {
	isLoading: boolean;
	discount?: string;
	onConfirm: () => void;
	onClose: () => void;
};

export const DiscountModal = ({
	discount,
	isLoading,
	onConfirm,
	onClose,
}: Props) => (
	<Modal
		footer={null}
		title="Manager's Approval for Discount"
		centered
		closable
		visible
		onCancel={onClose}
	>
		<div className="mb-7">
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
