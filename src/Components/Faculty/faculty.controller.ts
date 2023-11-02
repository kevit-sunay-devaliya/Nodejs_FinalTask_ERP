// import * as fs from 'fs';
// import { join } from 'path';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
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
	 */
	async createFaculty(req: Request, res: Response) {
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
			res.status(500).send({
				success: false,
				error: {
					statusCode: 500,
					message: 'Error while creating new user',
				},
			});
		}
	}

	/**
	 * Faculty Login
	 * @param {Request} req => Express Request
	 * @param {Response} res => Express Response
	 */

	async loginFaculty(req: Request, res: Response) {
		try {
			const { emailId, password } = req.body;
			if (!emailId || !password) {
				return res.status(404).send({
					success: false,
					error: {
						statusCode: 404,
						message: 'Please Provide an emailId and password',
					},
				});
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
					res.status(401).send({
						success: false,
						error: {
							statusCode: 401,
							message: 'Invalid EmailId or Password',
						},
					});
				}
			} else {
				res.status(401).send({
					success: false,
					error: {
						statusCode: 401,
						message: 'Invalid EmailId or Password',
					},
				});
			}
		} catch (error) {
			res.status(500).send({
				success: false,
				error: { statusCode: 500, message: 'Error while Login' },
			});
		}
	}

	/**
	 * Faculty LogOut
	 * @param req => Express Request
	 * @param {Response} res => Express Response
	 */
	async logOutFaculty(req: Request, res: Response) {
		try {
			const id = req['loginUser'].id;
			const faculty = await findFacultyById(id);
			if (!faculty) {
				return res.status(404).send({
					success: false,
					error: { statusCode: 404, message: 'faculty not found' },
				});
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
			res.status(500).send({
				success: false,
				error: { statusCode: 500, message: 'Error while Login' },
			});
		}
	}

	/**
	 * List Faculties
	 * @param {Request} req => Express Request
	 * @param {Response} res => Express Response
	 */
	async getFaculties(req: Request, res: Response) {
		try {
			const faculties = await findFaculties();
			res.status(200).send({
				success: true,
				data: { statusCode: 200, data: faculties, message: 'Success' },
			});
		} catch (error) {
			res.status(500).send({
				success: false,
				error: {
					statusCode: 500,
					message: 'Error while Loading Users',
				},
			});
		}
	}

	/**
	 * Updates Faculty By FacultyId
	 * @param {Request} req => Express Request
	 * @param {Response} res => Express Response
	 */
	async updateFaculty(req: Request, res: Response) {
		try {
			const id = req.params.id;

			const faculty = await findFacultyById(id);
			if (!faculty) {
				return res.status(404).send({
					success: false,
					error: { statusCode: 404, message: 'faculty not found' },
				});
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
			res.status(500).send({
				success: false,
				error: {
					statusCode: 500,
					message: 'Error while updating faculty',
				},
			});
		}
	}

	/**
	 * Deletes Faculty By FacultyId
	 * @param {Request} req => Express Request
	 * @param {Response} res => Express Response
	 */
	async deleteFaculty(req: Request, res: Response) {
		try {
			const id = req.params.id;
			const faculty = await findFacultyById(id);
			if (!faculty) {
				return res.status(404).send({
					success: false,
					error: { statusCode: 404, message: 'faculty not found' },
				});
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
			res.status(500).send({
				success: false,
				error: {
					statusCode: 500,
					message: 'Error while deleting faculty',
				},
			});
		}
	}

	/**
	 * Faculty Profile
	 * @param req => Express Request
	 * @param {Response} res => Express Response
	 */
	async getProfile(req: Request, res: Response) {
		try {
			const faculty = await findFacultyById(req['loginUser']._id);
			if (!faculty) {
				return res.status(404).send({
					success: false,
					error: { statusCode: 404, message: 'faculty not found' },
				});
			}

			res.status(200).send({
				success: true,
				data: { statusCode: 200, data: faculty, message: 'Profile' },
			});
		} catch {
			res.status(500).send({
				success: false,
				error: {
					statusCode: 500,
					message: 'Error while Loading your profile',
				},
			});
		}
	}
}
export default facultyController;
