import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import * as mongoose from 'mongoose';
import Department from '../src/Components/Department/department.model';
import Faculty from '../src/Components/Faculty/faculty.model';
import Student from '../src/Components/Student/student.model';

dotenv.config();
const departmentId = new mongoose.Types.ObjectId();
const adminFacultyId = new mongoose.Types.ObjectId();
const staffFacultyId = new mongoose.Types.ObjectId();
const studentId = new mongoose.Types.ObjectId();

const departmentOne = {
	_id:departmentId,
	name: 'Information Technology',
	totalSeat: 10,
	initial: 'IT',
};

const departmentToCreate = {
	name:'Computer Engineering',
	totalSeat: 20,
	initial: 'CE'
};

const facultyAdmin = {
	_id: adminFacultyId,
	name: 'Admin',
	emailId: 'admin@gmail.com',
	password: 'Admin@123',
	address: 'Rajkot',
	// departmentId:departmentId,
	role: 'Admin',
	authToken: jwt.sign(
		{ id: adminFacultyId, emailId: 'admin@gmail.com' },
		process.env.PRIVATE,
	),
};

const facultyStaff = {
	_id: staffFacultyId,
	name: 'DarshanSir',
	emailId: 'Darshan@gmail.com',
	password: 'Darshan@123',
	address: 'Rajkot',
	// departmentId:departmentId,
	role: 'Faculty',
	authToken: jwt.sign(
		{ id: staffFacultyId, emailId: 'Darshan@gmail.com' },
		process.env.PRIVATE,
	),
};

const demoFacultyToCreate = {
	name: 'Demo',
	emailId: 'Sunay@gmail.com',
	password: 'Sunay@123',
	address: 'Rajkot',
	// departmentId:departmentId,
	role: 'Faculty',
	authToken: jwt.sign(
		{ id: staffFacultyId, emailId: 'Sunay@gmail.com' },
		process.env.PRIVATE,
	),
};

const demoStudentToCreate = {
	name: 'Sunay Student',
	emailId: 'Sunay@gmail.com',
	password: 'Sunay@2023',
	address: 'Rajkot',
	departmentId: departmentId,
	semester: 1,
	batchYear: 2023,
	phone_number:9898848484,
	attendance: [],
	authToken: jwt.sign(
		{
			id: studentId,
			emailId: 'Sunay@gmail.com',
		},
		process.env.PRIVATE,
	),
};

const studentLogin = {
	_id: studentId,
	name: 'Sunay for login',
	emailId: 'Sunaylogin@gmail.com',
	password: 'Sunaylogin@2023',
	address: 'Rajkot',
	phone_number:9898424242,
	departmentId: departmentId,
	authToken: jwt.sign(
		{
			id: studentId,
			emailId: 'Sunaylogin@gmail.com',
		},
		process.env.PRIVATE,
	),
	semester: 1,
	batchYear: 2023,
	onRoll: true,
	attendance: [],
};

const setupDataBase = async () => {
	await Student.deleteMany();
	await Faculty.deleteMany();
	await Department.deleteMany();
	await new Department(departmentOne).save();
	await new Faculty(facultyAdmin).save();
	await new Faculty(facultyStaff).save();
	// await new Faculty(demoFacultyToCreate).save();
	await new Student(studentLogin).save();
	// await new Faculty(demoStudentToCreate).save();
};

export default {
	setupDataBase,
	departmentOne,
	facultyAdmin,
	facultyStaff,
	departmentId,
	adminFacultyId,
	staffFacultyId,
	departmentToCreate,
	demoFacultyToCreate,
	demoStudentToCreate,
	studentLogin,
};
