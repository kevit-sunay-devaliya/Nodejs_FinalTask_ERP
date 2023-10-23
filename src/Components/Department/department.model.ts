import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Department Schema For DataBase
const departmentSchema = new Schema(
	{
		name: {
			type: Schema.Types.String,
			required: true,
			unique:true
		},
		totalSeat: {
			type: Schema.Types.Number,
			required: true,
		},
		initial: {
			type: Schema.Types.String,
			required: true,
			unique:true
		},
	},
	{
		timestamps: true,
	},
);


export interface sampleDepartment {
	name: string;
	totalSeat: number;
	initial: string;
  }

const Department = model('Department', departmentSchema);
export default Department;
