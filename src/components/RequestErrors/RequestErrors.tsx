import { Space } from 'antd';
import cn from 'classnames';
import React from 'react';
import { FieldError } from '../elements';
import './style.scss';

interface Props {
	errors: string[];
	size?: number;
	className?: string;
	withSpaceTop?: boolean;
	withSpaceBottom?: boolean;
}

export const RequestErrors = ({
	className,
	errors,
	size,
	withSpaceTop,
	withSpaceBottom,
}: Props) => (
	<Space
		className={cn('RequestErrors', className, {
			RequestErrors___spaceTop: withSpaceTop,
			RequestErrors___spaceBottom: withSpaceBottom,
		})}
		direction="vertical"
		size={size}
	>
		{errors?.map((error, index) => (
			<FieldError key={index} error={error} />
		))}
	</Space>
);

RequestErrors.defaultProps = {
	size: 15,
	withSpaceTop: false,
	withSpaceBottom: false,
};
