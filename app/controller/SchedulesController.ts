import {Response} from "../utils/Response";
import {ResponseModel} from "../interface/ResponseModel";
import {SchedulesService} from "../service/SchedulesService";

/**
 * Schedules Controller.
 */
export class SchedulesController {

  constructor(private readonly schedulesService: SchedulesService) {
  }

  /**
   * Get all available schedules for provided retailerId, areaId, and, timestamp.
   * Endpoint: /schedules/{retailerId}/{areaId}/{timestamp}
   * @param event
   */
  public async getAvailableSchedules(event: any): Promise<ResponseModel> {
    try {
      const {retailerId, areaId, timestamp} = event.pathParameters;
      const response = await this.schedulesService.getAvailableSchedules(retailerId, areaId, timestamp);
      return Response.success(response);
    } catch (error) {
      return Response.error(error.message);
    }
  }

}
