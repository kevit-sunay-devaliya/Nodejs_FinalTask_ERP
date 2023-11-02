import * as http from 'http';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as dotenv from 'dotenv';

import * as express from 'express';
import mongoose from 'mongoose';

import applicationRoutes from './application.routes';
import Config from './config';

import { log } from './utils/winston-logger';

//For use Environment Variable
dotenv.config();
const mongoUrl: string = Config.mongodb.url;
const PORT: string | number = Config.server.port;

class app {
	public app: express.Application;
	public ExpressServer: any;

	constructor() {
		this.app = express();

		const server = http.createServer(this.app);
		this.ExpressServer = server.listen(PORT, () => {
			log.info('Server Started..');
		});
		this.config();
		this.mongoSetup();
	}

	//Configure the Express application with middleware, routes, and error handling.

	//Register Routes
	private config(): void {
		// Enable CORS with specific options
		this.app.use(
			cors({
				origin: true,
				methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
				allowedHeaders: [
					'Origin',
					' X-Requested-With',
					' Content-Type',
					' Accept ',
					' Authorization',
					'x-ms-bot-agent',
					'User-Agent',
				],
				credentials: true,
			}),
		);
		this.app.use(bodyParser.json());
		applicationRoutes.registerRoute(this.app);
	}

	//Mongo Setup
	private mongoSetup(): void {
		// Configure MongoDB connection options
		const dbOptions = {
			maxPoolSize: 5,
			useNewUrlParser: true,
		};
		// Connect to the MongoDB database using the provided URL and options
		mongoose.connect(mongoUrl, dbOptions);

		// Log when connected to the database
		mongoose.connection.on('connected', () => {
			log.info('Connected');
		});
		// Log database errors
		mongoose.connection.on('error', (err) => {
			log.info(`DATABASE - Error:${err}`);
		});
		// Log when disconnected and attempt reconnection
		mongoose.connection.on('disconnected', () => {
			log.info('DATABASE - disconnected  Retrying....');
		});
	}
}

export default new app().ExpressServer;
// new app();
