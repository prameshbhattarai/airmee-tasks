import {Query, Repository} from "../repository/Repository";
import validate from "uuid-validate";

export class SchedulesService {

    private static createQueryToGetAvailableSchedules(retailerId: string, areaId: string, timestamp?: string): Query {
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
                    where sp.retailer_id = $1 and vs.area_id = $2`,
            params: [retailerId, areaId]
        }
    }

    private static validateUuids(keyValues: any) {
        for (const [key, value] of Object.entries(keyValues)) {
            if (!validate(value.toString())) {
                throw new Error(`Invalid uuid format for '${key}': ${value}`);
            }
        }
    }

    public async getAvailableSchedules(retailerId: string, areaId: string, timestamp: string): Promise<Array<any>> {
        SchedulesService.validateUuids({retailerId, areaId});
        return Repository.query(SchedulesService.createQueryToGetAvailableSchedules(retailerId, areaId, timestamp));
    }

}
