import validate from "uuid-validate";
import dayjs, {Dayjs} from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import utc from "dayjs/plugin/utc";
dayjs.extend(isoWeek);
dayjs.extend(utc);

export class ScheduleUtils {

    public static validateUuids(keyValues: any) {
        for (const [key, value] of Object.entries(keyValues)) {
            if (!validate(value.toString())) {
                throw new Error(`Invalid uuid format for '${key}': ${value}`);
            }
        }
    }

    /**
     * We are assuming all the date before 2015 are invalid.
     * @param timestamp
     */
    public static validateTimestamp(timestamp: string) {
        const _timestamp = parseInt(timestamp, 10);
        if (!dayjs.unix(_timestamp).isValid() || dayjs.unix(_timestamp).get('year') < 2015) {
            throw new Error(`Invalid timestamp provided: ${timestamp}`);
        }
    }

    public static getNextDays(timestamp: string): Array<Dayjs> {
        const _timestamp = parseInt(timestamp, 10);
        const currentDate = dayjs.unix(_timestamp);

        const dayFormat = new Array<Dayjs>();

        for (let i = 0; i <= 7; i++) {
            const day = currentDate.add(i, 'day');
            dayFormat[day.isoWeekday() - 1] = day.utc();
        }

        return dayFormat;
    }
}
