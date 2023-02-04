/* eslint-disable react/jsx-one-expression-per-line */
import { AuthForm, RequestErrors } from 'components';
import { Box } from 'components/elements';
import { request } from 'global/types';
import { useAuth } from 'hooks/useAuth';
import { isEmpty } from 'lodash';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { convertIntoArray } from 'utils/function';
import './style.scss';

const Login = () => {
	// CUSTOM HOOKS
	const history = useHistory();
	const { user, login, status: authStatus, errors } = useAuth();

	// METHODS
	useEffect(() => {
		if (!isEmpty(user)) {
			history.replace('main');
		}
	}, [user]);

	return (
		<section className="Login">
			<Box className="Login_box">
				<img
					alt="logo"
					className="Login_logo"
					src={require('assets/images/logo.png')}
				/>

				<RequestErrors
					className="Login_requestErrors"
					errors={convertIntoArray(errors)}
					withSpaceBottom
				/>

				<AuthForm
					loading={authStatus === request.REQUESTING}
					submitText="Start Sesssion"
					onSubmit={login}
				/>
			</Box>
		</section>
	);
};

export default Login;
