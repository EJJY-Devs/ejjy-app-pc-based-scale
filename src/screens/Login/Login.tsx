import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthForm, RequestErrors } from '../../components';
import { Box } from '../../components/elements';
import { request } from '../../global/types';
import { useAuth } from '../../hooks/useAuth';
import { convertIntoArray } from '../../utils/function';
import './style.scss';

const Login = () => {
	// CUSTOM HOOKS
	const history = useHistory();
	const { user, login, status: authStatus, errors } = useAuth();

	// METHODS
	useEffect(() => {
		if (user) {
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
			</Box>
		</section>
	);
};

export default Login;
