/* eslint-disable @typescript-eslint/no-unused-vars */
// import * as fs from 'fs';
// import { join } from 'path';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';

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

import { sampleStudent } from './student.model';

class studentController {
	/**
	 * Create Student
	 * @param req => Express Request
	 * @param res => Express Response
	 */
	async createStudent(req: Request, res: Response) {
		try {
			const studentObj: sampleStudent = req.body;
			// console.log(studentObj);
			const student = await createStudent(studentObj);

			// console.log(student);
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
			res.status(500).send({
				success: false,
				error: {
					statusCode: 500,
					message: 'Error while creating new Student',
				},
			});
		}
	}

	/**
	 * Student Login
	 * @param req => Express Request
	 * @param res => Express Response
	 */
	async loginStudent(req: Request, res: Response) {
		try {
			const { emailId, password } = req.body;
			if (!emailId || !password) {
				res.status(404).send({
					success: false,
					error: {
						statusCode: 404,
						message: 'Please Provide an emailId and password',
					},
				});
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
	 * Student LogOut
	 * @param req => Express Request
	 * @param res => Express Response
	 */
	async logOutStudent(req, res: Response) {
		try {
			const id = req.loginUser.id;
			const student = await findStudentById(id);
			if (!student) {
				res.status(404).send({
					success: false,
					error: { statusCode: 404, message: 'student not found' },
				});
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
			res.status(500).send({
				success: false,
				error: { statusCode: 500, message: 'Error while LogOut' },
			});
		}
	}

	/**
	 * List Students
	 * @param req => Express Request
	 * @param res => Express Response
	 */
	async getStudents(req: Request, res: Response) {
		try {
			const students = await findStudents();
			res.status(200).send({
				success: true,
				data: { statusCode: 200, data: students, message: 'Success' },
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
	 * Update Student By StudentId
	 * @param req => Express Request
	 * @param res => Express Response
	 */
	async updateStudent(req: Request, res: Response) {
		try {
			const id = req.params.id;
			// console.log(id)
			const student = await findStudentById(id);
			// console.log(student)
			if (!student) {
				return res.status(404).send({
					success: false,
					error: { statusCode: 404, message: 'student not found' },
				});
			}

			for (const field in req.body) {
				student[field] = req.body[field];
				// console.log(student)
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
			res.status(500).send({
				success: false,
				error: {
					statusCode: 500,
					message: 'Error while updating student',
				},
			});
		}
	}

	/**
	 * Delete Student By StudentId
	 * @param req => Express Request
	 * @param res => Express Response
	 */
	async deleteStudent(req: Request, res: Response) {
		try {
			const id = req.params.id;
			const student = await findStudentById(id);

			if (!student) {
				res.status(404).send({
					success: false,
					error: { statusCode: 404, message: 'student not found' },
				});
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
			res.status(500).send({
				success: false,
				error: {
					statusCode: 500,
					message: 'Error while deleting student',
				},
			});
		}
	}

	/**
	 * Delete All Students
	 * @param req => Express Request
	 * @param res => Express Response
	 */

	async deleteAllStudents(req: Request, res: Response) {
		try {
			await deleteAll();
			res.status(200).send({
				message: 'All Students Deleted successfully!',
			});
		} catch (error) {
			res.status(500).send({
				success: false,
				error: {
					statusCode: 500,
					message: 'Error while deleting student',
				},
			});
		}
	}

	/**
	 * Student Profile
	 * @param req => Express Request
	 * @param res => Express Response
	 */
	async getProfile(req, res: Response) {
		try {
			const student = await findStudentById(req.loginUser._id);
			if (!student) {
				res.status(404).send({
					success: false,
					error: { statusCode: 404, message: 'Student  not found' },
				});
			}
			res.status(200).send({
				success: true,
				data: { statusCode: 200, data: student, message: 'Profile' },
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

	/**
	 * Get Absent Student List
	 * @param req => Express Request
	 * @param res => Express Response
	 */
	async getAbsentStudentBatchYearSemesterDateWise(
		req: Request,
		res: Response,
	) {
		try {
			const data = await getAbsentStudentBatchYearSemesterDateWise(
				req.body,
			);
			res.status(200).send({
				success: true,
				data: { statusCode: 200, data: data, message: 'Success' },
			});
		} catch {
			res.status(500).send({
				success: false,
				data: {
					statusCode: 500,
					message: 'Something went wrong while retrieving data',
				},
			});
		}
	}

	/**
	 * Get Students whose Attendance is more then 75%
	 * @param req => Express Request
	 * @param res => Express Response
	 */
	async getMoreThen75PercentStudent(req: Request, res: Response) {
		try {
			const data = await getMoreThen75PercentStudent(req.body);
			res.status(200).send({
				success: true,
				data: { statusCode: 200, data: data, message: 'Success' },
			});
		} catch {
			res.status(500).send({
				success: false,
				data: {
					statusCode: 500,
					message: 'Something went wrong white retrieving data',
				},
			});
		}
	}

	/**
	 * Get Department and Year wise vacancy
	 * @param req => Express Request
	 * @param res => Express Response
	 */
	async getVacancySeat(req: Request, res: Response) {
		try {
			const data = await getVacancySeat(req.body);
			res.status(200).send({
				success: true,
				data: { statusCode: 200, data: data, message: 'Success' },
			});
		} catch {
			res.status(500).send({
				success: false,
				data: {
					statusCode: 500,
					message: 'Something went wrong white retrieving data',
				},
			});
		}
	}
}
export default studentController;
