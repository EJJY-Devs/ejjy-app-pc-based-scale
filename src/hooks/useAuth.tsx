import { useState } from 'react';
import { useSelector } from 'react-redux';
import { actions, selectors } from '../ducks/auth';
import { request } from '../global/types';
import { modifiedExtraCallback } from '../utils/function';
import { useActionDispatch } from './useActionDispatch';

export const useAuth = () => {
	// STATES
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);

	// SELECTORS
	const user = useSelector(selectors.selectUser());

	// ACTIONS
	const loginAction = useActionDispatch(actions.login);
	const validateUserAction = useActionDispatch(actions.validateUser);

	// METHODS
	const login = (data) => {
		loginAction({ ...data, callback });
	};

	const validateUser = (data, extraCallback = null) => {
		validateUserAction({
			...data,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	const callback = ({
		status: callbackStatus,
		errors: callbackErrors = [],
	}) => {
		setStatus(callbackStatus);
		setErrors(callbackErrors);
	};

	return {
		user,
		login,
		validateUser,
		status,
		errors,
	};
};

export default useAuth;
