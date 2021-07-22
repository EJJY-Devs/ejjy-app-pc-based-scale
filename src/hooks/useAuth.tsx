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
	const localIpAddress = useSelector(selectors.selectLocalIpAddress());

	// ACTIONS
	const saveAction = useActionDispatch(actions.save);
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

	const updateLocalIpAddress = (newLocalIpAddress) => {
		saveAction({ localIpAddress: newLocalIpAddress });
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
		localIpAddress,
		login,
		validateUser,
		updateLocalIpAddress,
		status,
		errors,
	};
};
