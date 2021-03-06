import validate from "uuid-validate";
import dayjs, {Dayjs} from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import utc from "dayjs/plugin/utc";

dayjs.extend(isoWeek);
dayjs.extend(utc);

/**
 * Utility class for Schedules class.
 */
export class ScheduleUtils {

  /**
   * Validating provided uuid.
   * @param keyValues
   */
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

  /**
   * Generate next week dates starting from provided timestamp.
   * @param timestamp {timestamp}
   */
  public static getNextWeekDays(timestamp: string): Array<Dayjs> {
    const _timestamp = parseInt(timestamp, 10);
    const _dayjs = dayjs.unix(_timestamp).utc();

    const currentWeekStartDate = _dayjs.startOf('week');
    const nextWeekStartDate = currentWeekStartDate.add(1, 'week');

    const dayFormat = new Array<Dayjs>();
    for (let i = 0; i < 7; i++) {
      dayFormat[i] = nextWeekStartDate.add(i, 'day');
    }
    return dayFormat;
  }
}
