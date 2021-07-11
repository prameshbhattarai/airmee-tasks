import {Handler} from 'aws-lambda';
import path from 'path';
import dotenv from 'dotenv';
import {SchedulesController} from "./controller/SchedulesController";
import {SchedulesServiceImpl} from "./service/SchedulesServiceImpl";
import {RepositoryImpl} from "./repository/RepositoryImpl";
import {Repository} from "./repository/Repository";
import {SchedulesService} from "./service/SchedulesService";

/**
 * Selecting environment file.
 */
const dotenvPath = path.join(__dirname, '../', `config/.env.${process.env.NODE_ENV}`);
dotenv.config({
  path: dotenvPath,
});

/**
 * Dependency Injection part.
 */
const repository: Repository = new RepositoryImpl();
const schedulesService: SchedulesService = new SchedulesServiceImpl(repository);
const schedulesController: SchedulesController = new SchedulesController(schedulesService);

/**
 * Lambda handler function.
 * @param event
 */
export const availableSchedules: Handler = (event: any) => {
  return schedulesController.getAvailableSchedules(event);
};
