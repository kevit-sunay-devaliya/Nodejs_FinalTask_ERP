import { NextFunction, Request, Response } from 'express';

import { fillAttendance } from './attendance.DAL';

/**
 * Fill Students Attendance
 * @param {Request} req => Express Request
 * @param {Response} res => Express Response
 * @param {NextFunction} next => Express next function
 */
class studentController {
	async fillAttendance(req: Request, res: Response, next: NextFunction) {
		try {
			fillAttendance(req.body);
			res.status(200).send({
				success: true,
				data: {
					statusCode: 200,
					message: 'Attendance Filled Successfully',
				},
			});
		} catch (error) {
			next(error);
		}
	}
}
export default studentController;
