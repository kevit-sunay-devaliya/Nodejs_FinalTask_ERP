"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("supertest");
const app_1 = require("../src/app");
const databaseSetUpTest_1 = require("./databaseSetUpTest");
beforeEach(databaseSetUpTest_1.default.setupDataBase);
describe('Create new Faculty', () => {
    test('Only Admin can create Faculty', async () => {
        const response = await request(app_1.default)
            .post('/faculty/signup')
            .set('Authorization', `Bearer ${databaseSetUpTest_1.default.facultyAdmin.authToken}`)
            .send(databaseSetUpTest_1.default.demoFacultyToCreate)
            .expect(201);
        expect(response._body.success).toBe(true);
    });
    test('Faculty can not add new Faculty', async () => {
        await request(app_1.default)
            .post('/faculty/signup')
            .set('Authorization', `Bearer ${databaseSetUpTest_1.default.facultyStaff.authToken}`)
            .send(databaseSetUpTest_1.default.demoFacultyToCreate)
            .expect(401);
    });
});
describe('Login Faculty', () => {
    test('Faculty Login', async () => {
        const response = await request(app_1.default)
            .post('/faculty/login')
            .send({
            emailId: databaseSetUpTest_1.default.facultyAdmin.emailId,
            password: databaseSetUpTest_1.default.facultyAdmin.password,
        })
            .expect(200);
        expect(response._body.success).toBe(true);
    });
    test('Faculty could not able to Login while entering wrong username and password', async () => {
        const response = await request(app_1.default)
            .post('/faculty/login')
            .send({
            emailId: 'admin@gmail.com',
            password: '123',
        })
            .expect(401);
        expect(response._body.success).toBe(false);
    });
});
describe('update Faculty', () => {
    test('Admin Update Faculty By Id', async () => {
        const response = await request(app_1.default)
            .patch(`/faculty/update/${databaseSetUpTest_1.default.adminFacultyId}`)
            .set('Authorization', `Bearer ${databaseSetUpTest_1.default.facultyAdmin.authToken}`)
            .send({
            name: 'Updated Faculty',
            role: 'Staff',
        })
            .expect(200);
        expect(response._body.success).toBe(true);
    });
    test('Admin Update Staff Faculty By Id', async () => {
        const response = await request(app_1.default)
            .patch(`/faculty/update/${databaseSetUpTest_1.default.staffFacultyId}`)
            .set('Authorization', `Bearer ${databaseSetUpTest_1.default.facultyAdmin.authToken}`)
            .send({
            name: 'Demo faculty',
            role: 'Staff',
        })
            .expect(200);
        expect(response._body.success).toBe(true);
    });
    test('Faculty can not update their own profile with Faculty role', async () => {
        const response = await request(app_1.default)
            .patch(`/faculty/update/${databaseSetUpTest_1.default.staffFacultyId}`)
            .set('Authorization', `Bearer ${databaseSetUpTest_1.default.facultyStaff.authToken}`)
            .send({
            name: 'Update Faculty by their-self',
            role: 'Admin',
        })
            .expect(200);
        expect(response._body.success).toBe(true);
    });
});
describe('delete Faculty', () => {
    test('Staff can not delete Staff Faculty By Id', async () => {
        await request(app_1.default)
            .delete(`/faculty/delete/${databaseSetUpTest_1.default.staffFacultyId}`)
            .set('Authorization', `Bearer ${databaseSetUpTest_1.default.facultyStaff.authToken}`)
            .expect(401);
    });
    test('Admin delete Faculty By Id', async () => {
        const response = await request(app_1.default)
            .delete(`/faculty/delete/${databaseSetUpTest_1.default.staffFacultyId}`)
            .set('Authorization', `Bearer ${databaseSetUpTest_1.default.facultyAdmin.authToken}`)
            .expect(200);
        expect(response._body.success).toBe(true);
    });
});
describe('Get Profile', () => {
    test('Get Profile', async () => {
        const response = await request(app_1.default).get('/faculty/me')
            .set('Authorization', `Bearer ${databaseSetUpTest_1.default.facultyStaff.authToken}`).
            expect(200);
        expect(response._body.success).toBe(true);
    });
});
describe('LogOut Faculty', () => {
    test('LogOut Faculty', async () => {
        const response = await request(app_1.default).post('/faculty/logout')
            .set('Authorization', `Bearer ${databaseSetUpTest_1.default.facultyStaff.authToken}`).
            expect(200);
        expect(response._body.success).toBe(true);
    });
});
afterAll(() => {
    app_1.default.close(() => { });
});
//# sourceMappingURL=faculty.test.js.map