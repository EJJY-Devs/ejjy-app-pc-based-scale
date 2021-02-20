import { Modal } from 'antd';
import React, { useState } from 'react';
import './style.scss';
import ControlledInput from '../../../../components/elements/ControlledInput/ControlledInput';
import { MainButton } from '../MainButtons/MainButton';
import { Button } from '../../../../components/elements';

interface Props {
	visible: boolean;
	onClose: any;
}

export const TextcodeModal = ({ visible, onClose }: Props) => {
	const [textcode, setTextcode] = useState('...');
	return (
		<Modal
			title="Textcode"
			className="TextcodeModal"
			visible={visible}
			footer={null}
			onCancel={onClose}
			centered
			closable
		>
			<div className="form">
				<div className="textcode-numbers">
					<ControlledInput
						classNames="input"
						value={textcode}
						onChange={(value) => setTextcode(value)}
						disabled
					/>
					<MainButton classNames="btn-clear" title="X" onClick={null} />

					<MainButton classNames="number-9" title="9" onClick={null} />
					<MainButton classNames="number-8" title="8" onClick={null} />
					<MainButton classNames="number-7" title="7" onClick={null} />

					<MainButton classNames="number-6" title="6" onClick={null} />
					<MainButton classNames="number-5" title="5" onClick={null} />
					<MainButton classNames="number-4" title="4" onClick={null} />

					<MainButton classNames="number-3" title="3" onClick={null} />
					<MainButton classNames="number-2" title="2" onClick={null} />
					<MainButton classNames="number-1" title="1" onClick={null} />

					<MainButton classNames="number-0" title="0" onClick={null} />
				</div>

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
		</Modal>
	);
};
