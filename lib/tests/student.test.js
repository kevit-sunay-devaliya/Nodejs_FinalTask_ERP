"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("supertest");
const app_1 = require("../src/app");
const databaseSetUpTest_1 = require("./databaseSetUpTest");
beforeEach(databaseSetUpTest_1.default.setupDataBase);
describe('Create New Faculty', () => {
    test('Admin can create new Student', async () => {
        const response = await request(app_1.default)
            .post('/student/signup')
            .set('Authorization', `Bearer ${databaseSetUpTest_1.default.facultyAdmin.authToken}`)
            .send(databaseSetUpTest_1.default.demoStudentToCreate)
            .expect(201);
    });
    test('Faculty can create new Student', async () => {
        await request(app_1.default)
            .post('/student/signup')
            .set('Authorization', `Bearer ${databaseSetUpTest_1.default.facultyStaff.authToken}`)
            .send(databaseSetUpTest_1.default.demoStudentToCreate)
            .expect(201);
    });
});
describe('Login student', () => {
    test('student Login', async () => {
        const response = await request(app_1.default)
            .post('/student/login')
            .send({
            emailId: databaseSetUpTest_1.default.studentLogin.emailId,
            password: databaseSetUpTest_1.default.studentLogin.password,
        })
            .expect(200);
        expect(response._body.success).toBe(true);
    });
});
describe('update Student', () => {
    test('Admin/Faculty Update Student By Id', async () => {
        const response = await request(app_1.default)
            .patch(`/student/update/${databaseSetUpTest_1.default.studentLogin._id}`)
            .set('Authorization', `Bearer ${databaseSetUpTest_1.default.facultyStaff.authToken}`)
            .send({
            name: 'Updated Student',
        })
            .expect(200);
        expect(response._body.success).toBe(true);
    });
    test('Student can not Update Student By Id', async () => {
        const response = await request(app_1.default)
            .patch(`/student/update/${databaseSetUpTest_1.default.facultyAdmin._id}`)
            .set('Authorization', `Bearer ${databaseSetUpTest_1.default.studentLogin.authToken}`)
            .send({
            name: 'Updated Student',
        })
            .expect(404);
        expect(response._body.success).toBe(false);
    });
});
describe('delete Faculty', () => {
    test('Admin delete Faculty By Id', async () => {
        const response = await request(app_1.default)
            .delete(`/student/delete/${databaseSetUpTest_1.default.studentLogin._id}`)
            .set('Authorization', `Bearer ${databaseSetUpTest_1.default.facultyAdmin.authToken}`)
            .expect(200);
        expect(response._body.success).toBe(true);
    });
});
describe('Get Profile', () => {
    test('Get Profile', async () => {
        const response = await request(app_1.default)
            .get('/student/me')
            .set('Authorization', `Bearer ${databaseSetUpTest_1.default.studentLogin.authToken}`)
            .expect(200);
        expect(response._body.success).toBe(true);
    });
});
describe('LogOut Student', () => {
    test('LogOut Student', async () => {
        const response = await request(app_1.default)
            .post('/student/logout')
            .set('Authorization', `Bearer ${databaseSetUpTest_1.default.studentLogin.authToken}`)
            .expect(200);
        expect(response._body.success).toBe(true);
    });
});
afterAll(() => {
    app_1.default.close(() => { });
});
//# sourceMappingURL=student.test.js.map