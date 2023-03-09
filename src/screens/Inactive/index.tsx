import { Button, Result } from 'antd';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { getBranchServerUrl } from 'utils/function';
import './style.scss';

const Inactive = () => {
	// VARIABLES
	const branchServerURL = getBranchServerUrl();

	// CUSTOM HOOKS
	const history = useHistory();

	// METHODS
	useEffect(() => {
		if (!history.location.state) {
			history.replace('/');
		}
	}, [history]);

	return (
		<div className="Inactive">
			<Result
				extra={[
					<Button
						key="resume"
						disabled={!branchServerURL}
						type="primary"
						onClick={() => history.push('/')}
					>
						Resume
					</Button>,
				]}
				subTitle="You have been inactive for a while. Please press the button below to resume."
				title="App is inactive"
			/>
		</div>
	);
};

export default Inactive;
