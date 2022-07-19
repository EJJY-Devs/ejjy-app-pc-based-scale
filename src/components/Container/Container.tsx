import { Spin } from 'antd';
import React, { ReactNode } from 'react';
import './style.scss';

interface Props {
	loadingText?: string;
	loading?: boolean;
	children: ReactNode;
}

export const Container = ({ loading, loadingText, children }: Props) => (
	<Spin
		size="large"
		spinning={loading}
		tip={loadingText}
		wrapperClassName="Container"
	>
		{children}
	</Spin>
);

Container.defaultProps = {
	loading: false,
	loadingText: 'Fetching data...',
};
