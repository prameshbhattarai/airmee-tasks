import {Query, Repository} from "../repository/Repository";
import dayjs, {Dayjs} from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {ScheduleUtils} from "../utils/ScheduleUtils";
import {ScheduleModel} from "../interface/ScheduleModel";
import utc from "dayjs/plugin/utc";

dayjs.extend(duration);
dayjs.extend(utc);

export class SchedulesService {

  private static createQueryToGetAvailableSchedules(retailerId: string, areaId: string): Query {
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

  private static validateUuidAndTimestamp(retailerId: string, areaId: string, timestamp: string) {
    ScheduleUtils.validateUuids({retailerId, areaId});
    ScheduleUtils.validateTimestamp(timestamp);
  }

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
      if (!date) {
        // handle special cases for holidays
        return null;
      }
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

  public async getAvailableSchedules(retailerId: string, areaId: string, timestamp: string): Promise<Array<any>> {
    SchedulesService.validateUuidAndTimestamp(retailerId, areaId, timestamp);
    const results = await Repository.query(SchedulesService.createQueryToGetAvailableSchedules(retailerId, areaId));
    return SchedulesService.mapResultsToScheduleModel(results, timestamp);
  }

}
