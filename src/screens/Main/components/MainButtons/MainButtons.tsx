import { Divider } from 'antd';
import React from 'react';
import { MainButton } from './MainButton';
import './style.scss';

export const MainButtons = ({ onOpenDrawerModal, onOpenCheckoutModal }) => {
	return (
		<div className="MainButtons">
			<div className="buttons-wrapper">
				<MainButton
					title={
						<>
							<span>Reset</span>
							<span className="shortcut-key">[—]</span>
						</>
					}
					onClick={onOpenDrawerModal}
				/>

				<div className="divider">
					<Divider type="vertical" className="vertical-divider" />
				</div>

				<MainButton
					title={
						<>
							<span>Disc 1</span>
							<span className="shortcut-key">[—]</span>
						</>
					}
					onClick={null}
				/>

				<MainButton
					title={
						<>
							<span>Disc 2</span>
							<span className="shortcut-key">[—]</span>
						</>
					}
					onClick={null}
				/>

				<div className="divider">
					<Divider type="vertical" className="vertical-divider" />
				</div>

				<MainButton
					title={
						<>
							<span>Checkout</span>
							<span className="shortcut-key">[—]</span>
						</>
					}
					onClick={onOpenCheckoutModal}
				/>
			</div>
		</div>
	);
};
