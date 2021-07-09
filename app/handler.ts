import {Handler} from 'aws-lambda';
import path from 'path';
import dotenv from 'dotenv';
import {SchedulesController} from "./controller/SchedulesController";
import {SchedulesService} from "./service/SchedulesService";

const dotenvPath = path.join(__dirname, '../', `config/.env.${process.env.NODE_ENV}`);
dotenv.config({
  path: dotenvPath,
});

const schedulesService: SchedulesService = new SchedulesService();
const schedulesController: SchedulesController = new SchedulesController(schedulesService);

export const availableSchedules: Handler = (event: any) => {
  return schedulesController.getAvailableSchedules(event);
};
