import { NextFunction, Request, Response } from 'express';

export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction,
): Response => {
	// console.log(err.message);
	const { code, error } = JSON.parse(err.message);
	// return res
	// 	.status(code)
	// 	.json({ success: 'error', error: error.message || error });
	return res.status(code).send({
		success: false,
		Error: {
			statusCode: code,
			message: error.message || error,
		},
	});
};
