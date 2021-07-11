import {Query} from "../repository/RepositoryImpl";
import dayjs, {Dayjs} from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {ScheduleUtils} from "../utils/ScheduleUtils";
import {ScheduleModel} from "../interface/ScheduleModel";
import utc from "dayjs/plugin/utc";
import {SchedulesService} from "./SchedulesService";
import {Repository} from "../repository/Repository";

dayjs.extend(duration);
dayjs.extend(utc);

export class SchedulesServiceImpl implements SchedulesService {

  constructor(private readonly repository: Repository) {
  }

  /**
   * Create query to fetch all schedules by retailerId and areaId.
   * @param retailerId
   * @param areaId
   * @private
   */
  private static createQueryToGetSchedulesByRetailerIdAndAreaId(retailerId: string, areaId: string): Query {
    return {
      query: `select sp.retailer_id,
                     sp.day_of_week,
                     sp.delivery_start_window_hours,
                     sp.delivery_start_window_minutes,
                     sp.delivery_stop_window_hours,
                     sp.delivery_stop_window_minutes,
                     sp.price,
                     sp.price_currency,

                     vs.area_id,
                     vs.store_name,
                     vs.store_email,

                     sa.area_name,
                     sa.area_geometry
              from schedules_and_prices.schedules_and_prices sp
                       inner join admin.vendor_stores vs on sp.retailer_id = vs.id
                       inner join service.areas sa on vs.area_id = sa.id
              where sp.retailer_id = $1
                and vs.area_id = $2`,
      params: [retailerId, areaId]
    }
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
  private static mapResultsToScheduleModel(results: Array<any>, timestamp: string): Array<ScheduleModel> {
    const nextWeekDays = ScheduleUtils.getNextDays(timestamp);

    const formatTime = (_date: Dayjs, hour: number, minutes: number) => {
      return _date.set("hour", hour).set("minutes", minutes).toDate().getTime()
    }

    const formatInterval = (_date, startHour: number, startMinute: number, stopHour: number, stopMinute: number) => {
      const _startMinute = startMinute < 10 ? '0' + startMinute : startMinute;
      const _stopMinute = stopMinute < 10 ? '0' + stopMinute : stopMinute;
      return _date.format('D MMM').concat(` ${startHour}:${_startMinute}-${stopHour}:${_stopMinute}`);
    }

    return results.map((result: any) => {
      const date = nextWeekDays[result['day_of_week'] as number];
      const deliveryStartHours = result['delivery_start_window_hours'] as number;
      const deliveryStartMinutes = result['delivery_start_window_minutes'] as number;
      const deliveryStopHours = result['delivery_stop_window_hours'] as number;
      const deliveryStopMinutes = result['delivery_stop_window_minutes'] as number;
      return {
        dropOffEarliestTime: formatTime(date, deliveryStartHours, deliveryStartMinutes),
        dropOffLatestTime: formatTime(date, deliveryStopHours, deliveryStopMinutes),
        dropOffInterval: formatInterval(date, deliveryStartHours, deliveryStartMinutes, deliveryStopHours, deliveryStartMinutes)
      } as ScheduleModel;
    }).filter((scheduleModel: ScheduleModel) => scheduleModel).sort((sm1: ScheduleModel, sm2: ScheduleModel) => sm1.dropOffEarliestTime - sm2.dropOffEarliestTime);
  }

  /**
   * Fetch all available schedules for next week with respect to provided retailers and area.
   * @param retailerId {uuid}
   * @param areaId {uuid}
   * @param timestamp {timestamp}
   */
  public async getAvailableSchedules(retailerId: string, areaId: string, timestamp: string): Promise<Array<ScheduleModel>> {
    SchedulesServiceImpl.validateUuidAndTimestamp(retailerId, areaId, timestamp);
    const results = await this.repository.query(SchedulesServiceImpl.createQueryToGetSchedulesByRetailerIdAndAreaId(retailerId, areaId));

    return SchedulesServiceImpl.mapResultsToScheduleModel(results, timestamp);
  }

}