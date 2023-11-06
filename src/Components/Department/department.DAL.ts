/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose, { ObjectId } from 'mongoose';

import Department from './department.model';
import { newError } from '../../utils/error';

/**
 * Create New Department in DB
 * @param departmentBody => Department Object to be created.
 * @returns => New Created Department
 */
export async function createDepartment(departmentBody: object) {
	try {
		return await Department.create(departmentBody);
	} catch (error) {
		throw newError(500, error);
	}
}

/**
 * Find All Departments From DB
 * @returns => List Departments
 */
export async function findDepartments() {
	try {
		return await Department.find().sort({ name: 1 });
	} catch (error) {
		throw newError(500, error);
	}
}

/**
 * Finds Department from DB
 * @param id DepartmentID
 * @returns Department
 */
export async function findDepartmentById(id: string) {
	try {
		return await Department.findById(id);
	} catch (error) {
		throw newError(500, error);
	}
}
