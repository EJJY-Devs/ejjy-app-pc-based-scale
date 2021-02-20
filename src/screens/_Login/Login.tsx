import { message } from 'antd';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box } from '../../components/elements';
import { request } from '../../global/types';
import { useSession } from '../../hooks/useSession';
import { getBranchMachineCount, getBranchMachineId } from '../../utils/function';
import { ILoginValues, LoginForm } from './components/LoginForm';
import './style.scss';

const Login = () => {
	const history = useHistory();
	const { startSession, status, errors } = useSession();

	const onStartSession = (data: ILoginValues) => {
		// TODO: Implement proper logging in
		history.replace('/');

		// const branchMachineId = getBranchMachineId();
		// const branchMachineCount = getBranchMachineCount();

		// if (data.login !== 'specialpersonnel' && !branchMachineId) {
		// 	message.error('Machine is not yet registered.');
		// 	return;
		// }

		// startSession({
		// 	...data,
		// 	branch_machine_id: data.login === 'specialpersonnel' ? 1 : branchMachineId,
		// 	branch_machine_registration_count: data.login === 'specialpersonnel' ? 1 : branchMachineCount,
		// });
	};

	return (
		<section className="Login">
			<Box className="container">
				<img src={require('../../assets/images/logo.jpg')} alt="logo" className="logo" />

				<LoginForm
					onSubmit={onStartSession}
					loading={status === request.REQUESTING}
					errors={errors}
					shouldFullScreen
				/>
			</Box>
		</section>
	);
};

export default Login;
