// import * as fs from 'fs';
// import { join } from 'path';
import * as bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { newError } from '../../utils/error';
import Config from '../../config';

import {
	createFaculty,
	findFacultyByEmailId,
	findFacultyById,
	findFaculties,
} from './faculty.DAL';

import { sampleFaculty } from './faculty.types';

class facultyController {
	/**
	 * Creates A New Faculty
	 * @param {Request} req => Express Request
	 * @param {Response} res => Express Response
	 * @param {NextFunction} next => Express next function
	 */
	async createFaculty(req: Request, res: Response, next: NextFunction) {
		try {
			const facultyObj: sampleFaculty = req.body;
			const faculty = await createFaculty(facultyObj);
			await faculty.save();
			res.status(201).send({
				success: true,
				data: {
					statusCode: 201,
					data: faculty,
					message: 'New Faculty Created Successfully',
				},
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Faculty Login
	 * @param {Request} req => Express Request
	 * @param {Response} res => Express Response
	 * @param {NextFunction} next => Express next function
	 */

	async loginFaculty(req: Request, res: Response, next: NextFunction) {
		try {
			const { emailId, password } = req.body;
			if (!emailId || !password) {
				throw newError(404, 'Please Provide an emailId and password');
			}

			const faculty = await findFacultyByEmailId(emailId);
			if (faculty) {
				const match = await bcrypt.compare(password, faculty.password);
				if (match) {
					// const privateKey = fs.readFileSync(
					//     join(__dirname,'../../../keys/Private.key'),
					// );
					const privateKey: string = Config.server.private;

					const token = jwt.sign(
						{ id: faculty._id, emailId: faculty.emailId },
						privateKey,
					);
					faculty.authToken = token;
					await faculty.save();
					res.status(200).send({
						success: true,
						data: {
							statusCode: 200,
							data: faculty.authToken,
							message: 'Authentication Token Generated',
						},
					});
				} else {
					throw newError(401, 'Invalid EmailId or Password');
				}
			} else {
				throw newError(404, 'Faculty not found!');
			}
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Faculty LogOut
	 * @param {Request}req => Express Request
	 * @param {Response} res => Express Response
	 * @param {NextFunction} next => Express next function
	 */
	async logOutFaculty(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req['loginUser'].id;
			const faculty = await findFacultyById(id);
			if (!faculty) {
				throw newError(404, 'Faculty not found!');
			}
			faculty.authToken = ' ';
			await faculty.save();
			res.status(200).send({
				success: true,
				data: {
					statusCode: 200,
					data: faculty,
					message: 'faculty Logout Successfully',
				},
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * List Faculties
	 * @param {Request} req => Express Request
	 * @param {Response} res => Express Response
	 * @param {NextFunction} next => Express next function
	 */
	async getFaculties(req: Request, res: Response, next: NextFunction) {
		try {
			const faculties = await findFaculties();
			res.status(200).send({
				success: true,
				data: { statusCode: 200, data: faculties, message: 'Success' },
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Updates Faculty By FacultyId
	 * @param {Request} req => Express Request
	 * @param {Response} res => Express Response
	 * @param {NextFunction} next => Express next function
	 */
	async updateFaculty(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;

			const faculty = await findFacultyById(id);
			if (!faculty) {
				throw newError(404, 'Faculty not found!');
			}

			for (const field in req.body) {
				faculty[field] = req.body[field];
			}
			await faculty.save();
			res.status(200).send({
				success: true,
				data: {
					statusCode: 200,
					data: faculty,
					message: 'faculty Updated Successfully',
				},
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Deletes Faculty By FacultyId
	 * @param {Request} req => Express Request
	 * @param {Response} res => Express Response
	 * @param {NextFunction} next => Express next function
	 */
	async deleteFaculty(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;
			const faculty = await findFacultyById(id);
			if (!faculty) {
				throw newError(404, 'Faculty not found!');
			}
			await faculty.deleteOne();
			res.status(200).send({
				success: true,
				data: {
					statusCode: 200,
					data: faculty,
					message: 'faculty Deleted Successfully',
				},
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Faculty Profile
	 * @param {Request}req => Express Request
	 * @param {Response} res => Express Response
	 * @param {NextFunction} next => Express next function
	 */
	async getProfile(req: Request, res: Response, next: NextFunction) {
		try {
			const faculty = await findFacultyById(req['loginUser']._id);
			if (!faculty) {
				throw newError(404, 'Faculty not found!');
			}

			res.status(200).send({
				success: true,
				data: { statusCode: 200, data: faculty, message: 'Profile' },
			});
		} catch (error) {
			next(error);
		}
	}
}
export default facultyController;
