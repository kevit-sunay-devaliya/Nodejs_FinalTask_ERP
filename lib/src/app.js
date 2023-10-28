"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const mongoose_1 = require("mongoose");
const application_routes_1 = require("./application.routes");
const config_1 = require("./config");
const winston_logger_1 = require("./utils/winston-logger");
dotenv.config();
const mongoUrl = config_1.default.mongodb.url;
const PORT = config_1.default.server.port;
class app {
    constructor() {
        this.app = express();
        const server = http.createServer(this.app);
        this.ExpressServer = server.listen(PORT, () => {
            winston_logger_1.log.info('Server Started..');
        });
        this.config();
        this.mongoSetup();
    }
    config() {
        this.app.use(cors({
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
        }));
        this.app.use(bodyParser.json());
        application_routes_1.default.registerRoute(this.app);
    }
    mongoSetup() {
        const dbOptions = {
            maxPoolSize: 5,
            useNewUrlParser: true,
        };
        mongoose_1.default.connect(mongoUrl, dbOptions);
        mongoose_1.default.connection.on('connected', () => {
            winston_logger_1.log.info('Connected');
        });
        mongoose_1.default.connection.on('error', (err) => {
            winston_logger_1.log.info(`DATABASE - Error:${err}`);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            winston_logger_1.log.info('DATABASE - disconnected  Retrying....');
        });
    }
}
exports.default = new app().ExpressServer;
//# sourceMappingURL=app.js.map