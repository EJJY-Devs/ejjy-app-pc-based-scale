export const wrapServiceWithCatch = (service) => {
	return service.catch((e) => Promise.reject(e.errors));
};
