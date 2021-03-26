import { useState } from 'react';
import { useSelector } from 'react-redux';
import { actions, selectors, types } from '../ducks/auth';
import { request } from '../global/types';
import { modifiedExtraCallback } from '../utils/function';
import { useActionDispatch } from './useActionDispatch';

export const useAuth = () => {
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);
	const [recentRequest, setRecentRequest] = useState<any>();

	const user = useSelector(selectors.selectUser());
	const accessToken = useSelector(selectors.selectAccessToken());

	const loginAction = useActionDispatch(actions.login);
	const validateUserAction = useActionDispatch(actions.validateUser);

	const reset = () => {
		resetError();
		resetStatus();
	};

	const resetError = () => setErrors([]);

	const resetStatus = () => setStatus(request.NONE);

	const login = (data) => {
		loginAction({ ...data, callback });
	};

	const validateUser = (data, extraCallback = null) => {
		setRecentRequest(types.VALIDATE_USER);
		validateUserAction({ ...data, callback: modifiedExtraCallback(callback, extraCallback) });
	};

	const callback = ({ status, errors = [] }) => {
		setStatus(status);
		setErrors(errors);
	};

	return {
		user,
		accessToken,
		login,
		validateUser,
		status,
		errors,
		recentRequest,
		reset,
		resetStatus,
		resetError,
	};
};
