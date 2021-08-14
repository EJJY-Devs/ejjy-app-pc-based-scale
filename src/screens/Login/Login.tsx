/* eslint-disable react/jsx-one-expression-per-line */
import { Divider } from 'antd';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AppVersion, AuthForm, RequestErrors } from '../../components';
import { Box, Button } from '../../components/elements';
import { request } from '../../global/types';
import { useAuth } from '../../hooks/useAuth';
import { convertIntoArray, getLocalServerUrl } from '../../utils/function';
import { SettingUrlModal } from '../../components/SettingUrl/SettingUrlModal';
import './style.scss';

const Login = () => {
	// STATES
	const [areSetupButtonsVisible, setSetupButtonsVisible] = useState(false);
	const [urlModalVisible, setUrlModalVisible] = useState(false);

	// CUSTOM HOOKS
	const history = useHistory();
	const { user, login, status: authStatus, errors } = useAuth();

	// METHODS
	useEffect(() => {
		setSetupButtonsVisible(!getLocalServerUrl());
	}, []);

	useEffect(() => {
		if (!isEmpty(user)) {
			history.replace('main');
		}
	}, [user]);

	return (
		<section className="Login">
			<Box className="Login_box">
				<img
					src={require('../../assets/images/logo.jpg')}
					alt="logo"
					className="Login_logo"
				/>

				<RequestErrors
					className="Login_requestErrors"
					errors={convertIntoArray(errors)}
					withSpaceBottom
				/>

				<AuthForm
					submitText="Start Sesssion"
					onSubmit={login}
					loading={authStatus === request.REQUESTING}
				/>

				{areSetupButtonsVisible && (
					<>
						<Divider />

						<Button
							text="Set API URL"
							variant="dark-gray"
							onClick={() => setUrlModalVisible(true)}
							block
						/>
					</>
				)}
			</Box>

			<AppVersion />

			<SettingUrlModal
				visible={urlModalVisible}
				onClose={() => setUrlModalVisible(false)}
			/>
		</section>
	);
};

export default Login;
