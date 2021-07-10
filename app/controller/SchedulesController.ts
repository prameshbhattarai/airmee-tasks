import {SchedulesService} from "../service/SchedulesService";
import {Response} from "../utils/Response";
import {ResponseModel} from "../interface/ResponseModel";

export class SchedulesController {

    constructor(private readonly schedulesService: SchedulesService) {
    }

    public async getAvailableSchedules(event: any): Promise<ResponseModel> {
        const {retailerId, areaId, timestamp} = event.pathParameters;
        try {
            const response = await this.schedulesService.getAvailableSchedules(retailerId, areaId, timestamp);
            return Response.success(response);
        } catch (error) {
            return Response.error(error.message);
        }
    }

}
