"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const department_model_1 = require("../src/Components/Department/department.model");
const faculty_model_1 = require("../src/Components/Faculty/faculty.model");
const student_model_1 = require("../src/Components/Student/student.model");
dotenv.config();
const departmentId = new mongoose.Types.ObjectId();
const adminFacultyId = new mongoose.Types.ObjectId();
const staffFacultyId = new mongoose.Types.ObjectId();
const studentId = new mongoose.Types.ObjectId();
const departmentOne = {
    _id: departmentId,
    name: 'Information Technology',
    totalSeat: 10,
    initial: 'IT',
};
const departmentToCreate = {
    name: 'Computer Engineering',
    totalSeat: 20,
    initial: 'CE'
};
const facultyAdmin = {
    _id: adminFacultyId,
    name: 'Admin',
    emailId: 'admin@gmail.com',
    password: 'Admin@123',
    address: 'Rajkot',
    role: 'Admin',
    authToken: jwt.sign({ id: adminFacultyId, emailId: 'admin@gmail.com' }, process.env.PRIVATE),
};
const facultyStaff = {
    _id: staffFacultyId,
    name: 'DarshanSir',
    emailId: 'Darshan@gmail.com',
    password: 'Darshan@123',
    address: 'Rajkot',
    role: 'Faculty',
    authToken: jwt.sign({ id: staffFacultyId, emailId: 'Darshan@gmail.com' }, process.env.PRIVATE),
};
const demoFacultyToCreate = {
    name: 'Demo',
    emailId: 'Sunay@gmail.com',
    password: 'Sunay@123',
    address: 'Rajkot',
    role: 'Faculty',
    authToken: jwt.sign({ id: staffFacultyId, emailId: 'Sunay@gmail.com' }, process.env.PRIVATE),
};
const demoStudentToCreate = {
    name: 'Sunay Student',
    emailId: 'Sunay@gmail.com',
    password: 'Sunay@2023',
    address: 'Rajkot',
    departmentId: departmentId,
    semester: 1,
    batchYear: 2023,
    phone_number: 9898848484,
    attendance: [],
    authToken: jwt.sign({
        id: studentId,
        emailId: 'Sunay@gmail.com',
    }, process.env.PRIVATE),
};
const studentLogin = {
    _id: studentId,
    name: 'Sunay for login',
    emailId: 'Sunaylogin@gmail.com',
    password: 'Sunaylogin@2023',
    address: 'Rajkot',
    phone_number: 9898424242,
    departmentId: departmentId,
    authToken: jwt.sign({
        id: studentId,
        emailId: 'Sunaylogin@gmail.com',
    }, process.env.PRIVATE),
    semester: 1,
    batchYear: 2023,
    onRoll: true,
    attendance: [],
};
const setupDataBase = async () => {
    await student_model_1.default.deleteMany();
    await faculty_model_1.default.deleteMany();
    await department_model_1.default.deleteMany();
    await new department_model_1.default(departmentOne).save();
    await new faculty_model_1.default(facultyAdmin).save();
    await new faculty_model_1.default(facultyStaff).save();
    await new student_model_1.default(studentLogin).save();
};
exports.default = {
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
//# sourceMappingURL=databaseSetUpTest.js.map