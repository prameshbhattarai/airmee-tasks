import {Query} from "../repository/RepositoryImpl";

/**
 * Utility class for SQLs.
 */
export class QueryUtils {
  /**
   * Create query to fetch all schedules by retailerId and areaId.
   * @param retailerId
   * @param areaId
   * @private
   */
  public static createQueryToGetSchedulesByRetailerIdAndAreaId(retailerId: string, areaId: string): Query {
    return {
      query: `select distinct sp.retailer_id,
                     sp.day_of_week,
                     sp.delivery_start_window_hours,
                     sp.delivery_start_window_minutes,
                     sp.delivery_stop_window_hours,
                     sp.delivery_stop_window_minutes,
                     sp.price,
                     sp.price_currency,

                     avs.working_start_window_hours,
                     avs.working_start_window_minutes,
                     avs.working_stop_window_hours,
                     avs.working_stop_window_minutes,

                     vs.area_id,
                     vs.store_name,
                     vs.store_email,

                     sa.area_name,
                     sa.area_geometry
              from schedules_and_prices.schedules_and_prices sp
                       left join admin.vendor_store_work_hours avs on sp.day_of_week = avs.day_of_week
                       inner join admin.vendor_stores vs on sp.retailer_id = vs.id
                       inner join service.areas sa on vs.area_id = sa.id
              where
                  sp.retailer_id = $1 and
                  vs.area_id = $2`,
      params: [retailerId, areaId]
    }
  }

  /**
   * Create query to fetch all schedules by retailerId.
   * @param retailerId
   * @private
   */
  public static createQueryToGetHolidaySchedulesByRetailerId(retailerId: string): Query {
    return {
      query: `select distinct sp.retailer_id,
                     sp.date,
                     sp.month,
                     sp.delivery_start_window_hours,
                     sp.delivery_start_window_minutes,
                     sp.delivery_stop_window_hours,
                     sp.delivery_stop_window_minutes,
                     sp.price,
                     sp.price_currency
              from schedules_and_prices.holiday_schedules_and_prices sp
              where sp.retailer_id = $1`,
      params: [retailerId]
    }
  }
}
