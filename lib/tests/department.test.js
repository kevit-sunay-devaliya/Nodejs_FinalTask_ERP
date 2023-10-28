"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("supertest");
const app_1 = require("../src/app");
const databaseSetUpTest_1 = require("./databaseSetUpTest");
beforeEach(databaseSetUpTest_1.default.setupDataBase);
describe('Create new Department', () => {
    test('Create new Department', async () => {
        const response = await request(app_1.default).post('/department/add')
            .set('Authorization', `Bearer ${databaseSetUpTest_1.default.facultyAdmin.authToken}`).
            send(databaseSetUpTest_1.default.departmentToCreate).
            expect(200);
        expect(response._body.success).toBe(true);
    });
});
describe('List Departments', () => {
    test('List Departments', async () => {
        const response = await request(app_1.default).get('/department')
            .set('Authorization', `Bearer ${databaseSetUpTest_1.default.facultyAdmin.authToken}`).
            expect(200);
        expect(response._body.success).toBe(true);
    });
});
describe('Update Department', () => {
    test('Update Department', async () => {
        const response = await request(app_1.default).patch(`/department/update/${databaseSetUpTest_1.default.departmentId}`)
            .set('Authorization', `Bearer ${databaseSetUpTest_1.default.facultyAdmin.authToken}`).
            send({
            name: 'Mechanical Engineering',
            initial: 'ME',
            totalSeat: 100
        });
        expect(200);
        expect(response._body.success).toBe(true);
    });
});
describe('delete Department', () => {
    test('delete Department', async () => {
        const response = await request(app_1.default).delete(`/department/delete/${databaseSetUpTest_1.default.departmentId}`)
            .set('Authorization', `Bearer ${databaseSetUpTest_1.default.facultyAdmin.authToken}`).
            expect(200);
        expect(response._body.success).toBe(true);
    });
});
afterAll(() => {
    app_1.default.close(() => {
    });
});
//# sourceMappingURL=department.test.js.map