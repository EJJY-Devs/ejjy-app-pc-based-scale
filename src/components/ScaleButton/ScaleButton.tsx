/* eslint-disable react/jsx-wrap-multilines */
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import cn from 'classnames';
import React, { ReactNode } from 'react';
import './style.scss';

interface Props {
	title: string | ReactNode;
	onClick: any;
	className?: string;
	disabled?: boolean;
	loading?: boolean;
}

export const ScaleButton = ({
	title,
	onClick,
	className,
	disabled,
	loading,
}: Props) => (
	<button
		type="button"
		className={cn('ScaleButton', className, {
			ScaleButton__disabled: disabled || loading,
		})}
		onClick={onClick}
	>
		{loading ? (
			<Spin
				indicator={
					<LoadingOutlined
						style={{ fontSize: 17, color: 'rgba(35, 37, 46, 0.85)' }}
						spin
					/>
				}
				className="ScaleButton_spinner"
			/>
		) : (
			title
		)}
	</button>
);
