import { AuthForm } from 'components';
import { FormData } from 'components/AuthForm';
import { convertIntoArray, RequestErrors, useAuthLogin } from 'ejjy-global';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useUserStore } from 'stores';

const Login = () => {
	const history = useHistory();
	const { user, setUser } = useUserStore();
	const {
		mutateAsync: login,
		isLoading: isLoggingIn,
		error: loginError,
	} = useAuthLogin();

	useEffect(() => {
		if (!user) {
			history.replace('main');
		}
	}, [user]);

	const handleLoginSubmit = async (formData: FormData) => {
		const { data: loggedInUser } = await login({
			login: formData.username,
			password: formData.password,
		});

		setUser(loggedInUser);
	};

	return (
		<section className="flex h-full items-center justify-center bg-background">
			<div className="mx-10 my-12 mb-7 flex w-[400px] flex-col items-center justify-center overflow-hidden rounded-2xl bg-background shadow-lg">
				<img
					alt="logo"
					className="mb-10 w-[200px]"
					src={require('assets/images/logo.png')}
				/>

				<RequestErrors
					className="w-full"
					errors={convertIntoArray(loginError.errors)}
					withSpaceBottom
				/>

				<AuthForm
					loading={isLoggingIn}
					submitText="Start Sesssion"
					onSubmit={handleLoginSubmit}
				/>
			</div>
		</section>
	);
};

export default Login;
