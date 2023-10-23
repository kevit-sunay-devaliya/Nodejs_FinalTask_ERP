import * as request from 'supertest';

import app from '../src/app';

import db from './databaseSetUpTest';

beforeEach(db.setupDataBase);

describe('Create new Department', () => {
    test('Create new Department', async () => {
        const response = await request(app).post('/department/add')
            .set('Authorization', `Bearer ${db.facultyAdmin.authToken}`).
            send(db.departmentToCreate).
            expect(200);
            expect(response._body.success).toBe(true);
    });
});

describe('List Departments', () => {
    test('List Departments', async () => {
        const response = await request(app).get('/department')
            .set('Authorization', `Bearer ${db.facultyAdmin.authToken}`).
            expect(200);
        expect(response._body.success).toBe(true);
    });
});

describe('Update Department', () => {
    test('Update Department', async () => {
        const response = await request(app).patch(`/department/update/${db.departmentId}`)
            .set('Authorization', `Bearer ${db.facultyAdmin.authToken}`).
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
        const response = await request(app).delete(`/department/delete/${db.departmentId}`)
            .set('Authorization', `Bearer ${db.facultyAdmin.authToken}`).
            expect(200);



        expect(response._body.success).toBe(true);
    });
});

afterAll(() => {
    app.close(() => {
    });
});