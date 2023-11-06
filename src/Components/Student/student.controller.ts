import * as bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { newError } from '../../utils/error';
import * as jwt from 'jsonwebtoken';
import Config from '../../config';

import {
	createStudent,
	findStudentByEmailId,
	findStudentById,
	findStudents,
	deleteAll,
	getAbsentStudentBatchYearSemesterDateWise,
	getMoreThen75PercentStudent,
	getVacancySeat,
} from './student.DAL';

import { sampleStudent } from './student.types';

class studentController {
	/**
	 * Create Student
	 * @param {Request}req => Express Request
	 * @param {Response}res => Express Response
	 * @param {NextFunction} next => Express next function
	 */
	async createStudent(req: Request, res: Response, next: NextFunction) {
		try {
			const studentObj: sampleStudent = req.body;
			const student = await createStudent(studentObj);
			await student.save();
			res.status(201).send({
				success: true,
				data: {
					statusCode: 201,
					data: student,
					message: 'New Student Created Successfully',
				},
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Student Login
	 * @param {Request}req => Express Request
	 * @param {Response}res => Express Response
	 * @param {NextFunction} next => Express next function
	 */
	async loginStudent(req: Request, res: Response, next: NextFunction) {
		try {
			const { emailId, password } = req.body;
			if (!emailId || !password) {
				throw newError(404, 'Please Provide an emailId and password');
			}
			const student = await findStudentByEmailId(emailId);
			if (student) {
				const match = await bcrypt.compare(password, student.password);
				if (match) {
					// const privateKey = fs.readFileSync(
					//     join(__dirname,'../../../keys/Private.key'),{ encoding: 'utf8', flag: 'r' });

					const privateKey: string = Config.server.private;
					const token = jwt.sign(
						{ id: student._id, emailId: student.emailId },
						privateKey,
					);
					student.authToken = token;
					// console.log(student.authToken)
					await student.save();
					res.status(200).send({
						success: true,
						data: {
							statusCode: 200,
							data: student.authToken,
							message: 'Authentication Token Generated',
						},
					});
				} else {
					throw newError(401, 'Invalid EmailId or Password');
				}
			} else {
				throw newError(404, 'Student not found!');
			}
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Student LogOut
	 * @param req => Express Request
	 * @param {Response}res => Express Response
	 * @param {NextFunction} next => Express next function
	 */
	async logOutStudent(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req['loginUser'].id;
			const student = await findStudentById(id);
			if (!student) {
				throw newError(404, 'Student not found');
			}
			student.authToken = ' ';
			await student.save();
			res.status(200).send({
				success: true,
				data: {
					statusCode: 200,
					data: student,
					message: 'student Logout Successfully',
				},
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * List Students
	 * @param {Request}req => Express Request
	 * @param {Response}res => Express Response
	 * @param {NextFunction} next => Express next function
	 */
	async getStudents(req: Request, res: Response, next: NextFunction) {
		try {
			const students = await findStudents();
			res.status(200).send({
				success: true,
				data: { statusCode: 200, data: students, message: 'Success' },
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Update Student By StudentId
	 * @param {Request}req => Express Request
	 * @param {Response}res => Express Response
	 * @param {NextFunction} next => Express next function
	 */
	async updateStudent(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;
			const student = await findStudentById(id);
			if (!student) {
				throw newError(404, 'Student not found');
			}

			for (const field in req.body) {
				student[field] = req.body[field];
			}
			await student.save();

			res.status(200).send({
				success: true,
				data: {
					statusCode: 200,
					data: student,
					message: 'student Updated Successfully',
				},
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Delete Student By StudentId
	 * @param {Request}req => Express Request
	 * @param {Response}res => Express Response
	 * @param {NextFunction} next => Express next function
	 */
	async deleteStudent(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;
			const student = await findStudentById(id);

			if (!student) {
				throw newError(404, 'Student not found');
			}
			await student.deleteOne();
			res.status(200).send({
				success: true,
				data: {
					statusCode: 200,
					data: student,
					message: 'student Deleted Successfully',
				},
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Delete All Students
	 * @param {Request}req => Express Request
	 * @param {Response}res => Express Response
	 * @param {NextFunction} next => Express next function
	 */

	async deleteAllStudents(req: Request, res: Response, next: NextFunction) {
		try {
			await deleteAll();
			res.status(200).send({
				message: 'All Students Deleted successfully!',
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Student Profile
	 * @param {Request}req => Express Request
	 * @param {Response}res => Express Response
	 * @param {NextFunction} next => Express next function
	 */
	async getProfile(req: Request, res: Response, next: NextFunction) {
		try {
			const student = await findStudentById(req['loginUser']._id);
			if (!student) {
				throw newError(404, 'Student not found');
			}
			res.status(200).send({
				success: true,
				data: { statusCode: 200, data: student, message: 'Profile' },
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Get Absent Student List
	 * @param {Request}req => Express Request
	 * @param {Response}res => Express Response
	 * @param {NextFunction} next => Express next function
	 */
	async getAbsentStudentBatchYearSemesterDateWise(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const data = await getAbsentStudentBatchYearSemesterDateWise(
				req.body,
			);
			res.status(200).send({
				success: true,
				data: { statusCode: 200, data: data, message: 'Success' },
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Get Students whose Attendance is more then 75%
	 * @param {Request}req => Express Request
	 * @param {Response}res => Express Response
	 * @param {NextFunction} next => Express next function
	 */
	async getMoreThen75PercentStudent(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const data = await getMoreThen75PercentStudent(req.body);
			res.status(200).send({
				success: true,
				data: { statusCode: 200, data: data, message: 'Success' },
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Get Department and Year wise vacancy
	 * @param {Request}req => Express Request
	 * @param {Response}res => Express Response
	 * @param {NextFunction} next => Express next function
	 */
	async getVacancySeat(req: Request, res: Response, next: NextFunction) {
		try {
			const data = await getVacancySeat(req.body);
			res.status(200).send({
				success: true,
				data: { statusCode: 200, data: data, message: 'Success' },
			});
		} catch (error) {
			next(error);
		}
	}
}
export default studentController;
