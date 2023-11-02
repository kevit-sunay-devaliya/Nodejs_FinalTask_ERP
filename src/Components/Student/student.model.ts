import * as bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import validator from 'validator';
// import { findDepartmentById } from "Components/Department/department.DAL";
// import Department from "Components/Department/department.model";

const { Schema, model } = mongoose;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const attandanceSchema = new mongoose.Schema({
	studentId: String,
	date: String,
	present: String,
});

// const userSchema = new mongoose.Schema({
//     name: String,
//     age: Number,
// });
//12
// Student Schema For DataBase
const studentSchema = new Schema(
	{
		name: {
			type: Schema.Types.String,
			required: true,
			trim: true,
		},
		emailId: {
			type: Schema.Types.String,
			required: true,
			unique: true,
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new Error('Email is Invalid!');
				}
			},
			trim: true,
			lowercase: true,
		},
		phone_number: {
			type: Schema.Types.Number,
			required: true,
			unique: true,
			minlength: 10,
		},
		password: {
			type: Schema.Types.String,
			require: true,
		},
		address: {
			type: Schema.Types.String,
			required: true,
		},
		departmentId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Department',
		},
		authToken: {
			type: Schema.Types.String,
			required: true,
			default: ' ',
		},
		semester: {
			type: Schema.Types.Number,
			required: true,
			default: 1,
		},
		batchYear: {
			type: Schema.Types.Number,
			required: true,
		},
		attendance: [
			{
				type: mongoose.Schema.Types.Mixed,
				default: [],
			},
		],
	},
	{
		timestamps: true,
	},
);

//For Uniqueness checking
studentSchema.index({ emailId: 1, departmentId: 1 }, { unique: true });

//encrypt password
studentSchema.pre('save', async function (next) {
	try {
		if (this.isModified('password')) {
			this.password = await bcrypt.hash(this.password, 8);
		}
		next();
	} catch (error) {}
});

const Student = model('Student', studentSchema);
export default Student;
