import * as bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import validator from 'validator';

const { Schema, model } = mongoose;

// Faculty Schema For DataBase
const facultySchema = new Schema(
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
		password: {
			type: Schema.Types.String,
			require: true,
		},
		address: {
			type: Schema.Types.String,
			required: true,
		},
		authToken: {
			type: Schema.Types.String,
			required: true,
			default: ' ',
		},
		role: {
			type: Schema.Types.String,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

//encrypt password
facultySchema.pre('save', async function (next) {
	try {
		if (this.isModified('password')) {
			this.password = await bcrypt.hash(this.password, 8);
		}
		next();
	} catch (error) {}
});

const Faculty = model('Faculty', facultySchema);
export default Faculty;
