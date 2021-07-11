/**
 * Data Transfer Object for Schedules.
 */
export interface ScheduleModel {
  pickUpEarliestTime?: number;
  pickUpLatestTime?: number;
  pickUpInterval?: string;
  dropOffEarliestTime?: number;
  dropOffLatestTime?: number;
  dropOffInterval?: string;
  price?: number;
  currency?: string;
}
