export const newError = (code: number, error: Error | string): Error => {
	return new Error(JSON.stringify({ code, error }));
};
