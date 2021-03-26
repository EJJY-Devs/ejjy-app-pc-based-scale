import React from 'react';
import { Box } from '../../components/elements';
import { request } from '../../global/types';
import { useAuth } from '../../hooks/useAuth';
import { ILoginValues, LoginForm } from './components/LoginForm';
import './style.scss';

const Login = () => {
	const { login, status, errors } = useAuth();

	const onStartSession = (data: ILoginValues) => {
		login(data);
	};

	return (
		<section className="Login">
			<Box className="container">
				<img src={require('../../assets/images/logo.jpg')} alt="logo" className="logo" />

				<LoginForm
					onSubmit={onStartSession}
					loading={status === request.REQUESTING}
					errors={errors}
				/>
			</Box>
		</section>
	);
};

export default Login;
