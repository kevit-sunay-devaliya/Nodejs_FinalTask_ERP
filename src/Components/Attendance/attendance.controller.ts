import { Request , Response } from 'express';

import {
    fillAttendance
} from './attendance.DAL';


/**
 * Fill Students Attendance
 * @param {Request} req => Express Request
 * @param {Response} res => Express Response
 */
class studentController {
    async fillAttendance(req:Request, res:Response) {
        try {
            fillAttendance(req.body);
            res.status(200).send({ 'success': true, 'data': { 'statusCode': 200, 'message': 'Attendance Filled Successfully' } });
        }
        catch (error) {
            res.status(500).send({ 'success': false, 'error': { 'statusCode': 500, 'message': error } });
        }
    }
}
export default studentController;