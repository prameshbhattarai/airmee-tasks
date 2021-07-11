import dayjs, {Dayjs} from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {ScheduleUtils} from "../utils/ScheduleUtils";
import {ScheduleModel} from "../interface/ScheduleModel";
import utc from "dayjs/plugin/utc";
import {SchedulesService} from "./SchedulesService";
import {Repository} from "../repository/Repository";
import {QueryUtils} from "../utils/QueryUtils";

dayjs.extend(duration);
dayjs.extend(utc);

/**
 * Schedules Service Class Implementation.
 */
export class SchedulesServiceImpl implements SchedulesService {

  constructor(private readonly repository: Repository) {
  }

  /**
   * Validate uuid and timestamp values.
   * @param retailerId {uuid}
   * @param areaId {uuid}
   * @param timestamp {timestamp}
   * @private
   */
  private static validateUuidAndTimestamp(retailerId: string, areaId: string, timestamp: string) {
    ScheduleUtils.validateUuids({retailerId, areaId});
    ScheduleUtils.validateTimestamp(timestamp);
  }

  /**
   * Map raw results from database to Schedule Model.
   * @param results
   * @param timestamp
   * @private
   */
  private static mapResultsToScheduleModel(results: Array<Array<any>>, timestamp: string): Array<ScheduleModel> {
    const nextWeekDays = ScheduleUtils.getNextWeekDays(timestamp);

    const formatTime = (_date: Dayjs, hour: number, minutes: number) => {
      return _date.set("hour", hour).set("minutes", minutes).toDate().getTime()
    }

    const formatInterval = (_date, startHour: number, startMinute: number, stopHour: number, stopMinute: number) => {
      const _startMinute = startMinute < 10 ? '0' + startMinute : startMinute;
      const _stopMinute = stopMinute < 10 ? '0' + stopMinute : stopMinute;
      return _date.format('D MMM').concat(` ${startHour}:${_startMinute}-${stopHour}:${_stopMinute}`);
    }

    const availableSchedulesResults = results[0];
    const holidaySchedulesResults = results[1];

    return availableSchedulesResults.map((result: any) => {
      const date = nextWeekDays[result['day_of_week'] as number];

      const holidaySchedule = this.getHolidaySchedule(date.date(), date.month(), holidaySchedulesResults);
      if(holidaySchedule) {
        result = holidaySchedule;
      }

      const deliveryStartHours = result['delivery_start_window_hours'] as number;
      const deliveryStartMinutes = result['delivery_start_window_minutes'] as number;
      const deliveryStopHours = result['delivery_stop_window_hours'] as number;
      const deliveryStopMinutes = result['delivery_stop_window_minutes'] as number;
      const price = result['price'] as number;
      const currency = result['price_currency'];
      return {
        dropOffEarliestTime: formatTime(date, deliveryStartHours, deliveryStartMinutes),
        dropOffLatestTime: formatTime(date, deliveryStopHours, deliveryStopMinutes),
        dropOffInterval: formatInterval(date, deliveryStartHours, deliveryStartMinutes, deliveryStopHours, deliveryStartMinutes),
        price,
        currency
      } as ScheduleModel;
    }).filter((scheduleModel: ScheduleModel) => scheduleModel).sort((sm1: ScheduleModel, sm2: ScheduleModel) => sm1.dropOffEarliestTime - sm2.dropOffEarliestTime);
  }

  /**
   * Get the schedule for holiday for provided month and date.
   * @param date {number}
   * @param month {number}
   * @param holidaySchedulesResults
   * @private
   */
  private static getHolidaySchedule(date: number, month: number, holidaySchedulesResults: Array<any>): any {
    for (let i = 0; i < holidaySchedulesResults.length; i++) {
      const result = holidaySchedulesResults[i];
      if (result['date'] === date && result['month'] === month) {
        return result;
      }
    }
  }

  /**
   * Fetch all available schedules for next week with respect to provided retailers and area.
   * @param retailerId {uuid}
   * @param areaId {uuid}
   * @param timestamp {timestamp}
   */
  public async getAvailableSchedules(retailerId: string, areaId: string, timestamp: string): Promise<Array<ScheduleModel>> {
    SchedulesServiceImpl.validateUuidAndTimestamp(retailerId, areaId, timestamp);
    const availableSchedules = QueryUtils.createQueryToGetSchedulesByRetailerIdAndAreaId(retailerId, areaId);
    const holidayAvailableSchedules = QueryUtils.createQueryToGetHolidaySchedulesByRetailerId(retailerId);

    const results = await Promise.all([
      this.repository.query(availableSchedules),
      this.repository.query(holidayAvailableSchedules)
    ])

    return SchedulesServiceImpl.mapResultsToScheduleModel(results, timestamp);
  }

}
