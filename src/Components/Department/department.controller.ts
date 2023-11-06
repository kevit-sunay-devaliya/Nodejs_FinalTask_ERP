/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';

import {
	createDepartment,
	findDepartments,
	findDepartmentById,
} from './department.DAL';
import { newError } from '../../utils/error';
import { sampleDepartment } from './department.types';

class departmentController {
	/**
	 * Creates A New Department
	 * @param {Request} req => Express Request
	 * @param {Response} res => Express Response
	 * @param {NextFunction} next => Express next function
	 */
	async createDepartment(req: Request, res: Response, next: NextFunction) {
		try {
			const departmentObj: sampleDepartment = req.body;
			const department = await createDepartment(departmentObj);
			res.status(200).send({
				success: true,
				data: {
					statusCode: 200,
					data: department,
					message: 'New Department Created Successfully',
				},
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * List Departments
	 * @param {Request} req => Express Request
	 * @param {Response} res => Express Response
	 * @param {NextFunction} next => Express next function
	 */
	async getDepartments(req: Request, res: Response, next: NextFunction) {
		try {
			const departments = await findDepartments();
			res.status(200).send({
				success: true,
				data: {
					statusCode: 200,
					data: departments,
					message: 'Success',
				},
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Updates Department By DepartmentId
	 * @param {Request}req => Express Request
	 * @param {Response} res => Express Response
	 * @param {NextFunction} next => Express next function
	 */
	async updateDepartment(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;
			const department = await findDepartmentById(id);
			if (!department) {
				throw newError(404, 'Department not found!');
			}
			for (const field in req.body) {
				department[field] = req.body[field];
			}
			await department.save();
			res.status(200).send({
				success: true,
				data: {
					statusCode: 200,
					data: department,
					message: 'Department Updated Successfully',
				},
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Delete Department By DepartmentId
	 * @param {Request}req => Express Request
	 * @param {Response} res => Express Response
	 * @param {NextFunction} next => Express next function
	 */
	async deleteDepartment(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;
			const department = await findDepartmentById(id);
			if (!department) {
				throw newError(404, 'Department not found!');
			}
			await department.deleteOne();
			res.status(200).send({
				success: true,
				data: {
					statusCode: 200,
					data: department,
					message: 'Department Deleted Successfully',
				},
			});
		} catch (error) {
			next(error);
		}
	}
}
export default departmentController;
