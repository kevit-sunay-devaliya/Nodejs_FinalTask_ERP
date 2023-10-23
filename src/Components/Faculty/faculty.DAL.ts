import mongoose from 'mongoose';
import Faculty from './faculty.model';

/**
 * Create New Faculty in DB
 * @param FacultyBody => Faculty Object to be created.
 * @returns => New Created Faculty
 */
export async function createFaculty(facultyBody) {
	try {
		return await Faculty.create(facultyBody);
	} catch (error) {
		throw new Error(error);
	}
}

/**
 * Find Faculty From DB
 * @param emailId => Faculty Email Id
 */
export async function findFacultyByEmailId(emailId) {
	try {
		return await Faculty.findOne({ emailId });
	} catch (error) {
		throw new Error(error);
	}
}

/**
 * Find All Faculties From DB
 * @returns => List Faculties
 */
export async function findFaculties() {
	try {
		return await Faculty.find().lean();
	} catch (error) {
		throw new Error(error);
	}
}

/**
 * Finds Faculty from DB
 * @param id => FacultyID
 * @returns => Faculty
 */
export async function findFacultyById(id) {
	try {
		return await Faculty.findById(new mongoose.Types.ObjectId(id));
	} catch (error) {
		throw new Error(error);
	}
}
