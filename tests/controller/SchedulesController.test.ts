import {SchedulesService} from "../../app/service/SchedulesService";
import {mock} from "../utils/TestUtils";
import {SchedulesController} from "../../app/controller/SchedulesController";
import {ScheduleModel} from "../../app/interface/ScheduleModel";
import {Response} from "../../app/utils/Response";

const mockScheduleService: SchedulesService = mock<SchedulesService>();
const event = {
  pathParameters: {}
}
describe('Scheduler Controller test specs', () => {

  it('should return success response', async () => {

    const mockResponse: Array<ScheduleModel> = [{
      dropOffEarliestTime: 1626022809000,
      dropOffInterval: "11 Jul 17:00-22:00",
      dropOffLatestTime: 1626040809000
    }];

    mockScheduleService.getAvailableSchedules = jest.fn().mockImplementation(() => {
      return Promise.resolve(mockResponse);
    });

    const controller = new SchedulesController(mockScheduleService);
    const response = await controller.getAvailableSchedules(event);

    expect(mockScheduleService.getAvailableSchedules).toHaveBeenCalledTimes(1);
    expect(response).toEqual(Response.success(mockResponse));
  });

  it('should return error response', async () => {
    const mockErrorResponse ={
      message: 'Something went wrong !!!'
    };

    mockScheduleService.getAvailableSchedules = jest.fn().mockImplementation(() => {
      return Promise.reject(new Error(mockErrorResponse.message));
    });

    const controller = new SchedulesController(mockScheduleService);
    const response = await controller.getAvailableSchedules(event);

    expect(mockScheduleService.getAvailableSchedules).toHaveBeenCalledTimes(1);
    expect(response).toEqual(Response.error(mockErrorResponse.message));
  });
});
