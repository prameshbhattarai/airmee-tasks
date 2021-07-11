import {ScheduleModel} from "../interface/ScheduleModel";

/**
 * Interface for Schedules Service.
 */
export abstract class SchedulesService {

  /**
   * Fetch all available schedules for next week with respect to provided retailers and area.
   * @param retailerId {uuid}
   * @param areaId {uuid}
   * @param timestamp {timestamp}
   */
  public abstract getAvailableSchedules(retailerId: string, areaId: string, timestamp: string): Promise<Array<ScheduleModel>>;
}
