import * as request from 'supertest';

import app from '../src/app';

import db from './databaseSetUpTest';

beforeEach(db.setupDataBase);

describe('Create New Faculty', () => {
	test('Admin can create new Student', async () => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const response = await request(app)
			.post('/student/signup')
			.set('Authorization', `Bearer ${db.facultyAdmin.authToken}`)
			.send(db.demoStudentToCreate)
			.expect(201);
	});

	test('Faculty can create new Student', async () => {
		await request(app)
			.post('/student/signup')
			.set('Authorization', `Bearer ${db.facultyStaff.authToken}`)
			.send(db.demoStudentToCreate)
			.expect(201);
	});
});

describe('Login student', () => {
	test('student Login', async () => {
		const response = await request(app)
			.post('/student/login')
			.send({
				emailId: db.studentLogin.emailId,
				password: db.studentLogin.password,
			})
			.expect(200);
		expect(response._body.success).toBe(true);
	});
});

describe('update Student', () => {
	test('Admin/Faculty Update Student By Id', async () => {
		const response = await request(app)
			.patch(`/student/update/${db.studentLogin._id}`)
			.set('Authorization', `Bearer ${db.facultyStaff.authToken}`)
			.send({
				name: 'Updated Student',
			})
			.expect(200);

		expect(response._body.success).toBe(true);
	});

	test('Student can not Update Student By Id', async () => {
		const response = await request(app)
			.patch(`/student/update/${db.facultyAdmin._id}`)
			.set('Authorization', `Bearer ${db.studentLogin.authToken}`)
			.send({
				name: 'Updated Student',
			})
			.expect(404);

		expect(response._body.success).toBe(false);
	});
});

describe('delete Faculty', () => {
	test('Admin delete Faculty By Id', async () => {
		const response = await request(app)
			.delete(`/student/delete/${db.studentLogin._id}`)
			.set('Authorization', `Bearer ${db.facultyAdmin.authToken}`)
			.expect(200);

		expect(response._body.success).toBe(true);
	});
});

describe('Get Profile', () => {
	test('Get Profile', async () => {
		const response = await request(app)
			.get('/student/me')
			.set('Authorization', `Bearer ${db.studentLogin.authToken}`)
			.expect(200);
		expect(response._body.success).toBe(true);
	});
});

describe('LogOut Student', () => {
	test('LogOut Student', async () => {
		const response = await request(app)
			.post('/student/logout')
			.set('Authorization', `Bearer ${db.studentLogin.authToken}`)
			.expect(200);

		expect(response._body.success).toBe(true);
	});
});

afterAll(() => {
	app.close(() => {});
});
