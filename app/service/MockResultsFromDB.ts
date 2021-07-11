export const availableSchedulesForRetailerAndArea = (retailerId: string, areaId: string, numberOfDays: number) => {
  const availableSchedules = new Array<any>();
  for(let i = 0; i < 7 && i < numberOfDays; i++) {
    availableSchedules.push(
      {
        "retailer_id": retailerId,
        "day_of_week": i,
        "delivery_start_window_hours": 17,
        "delivery_start_window_minutes": 0,
        "delivery_stop_window_hours": 22,
        "delivery_stop_window_minutes": 0,
        "price": 59,
        "price_currency": "SEK",
        "area_id": areaId,
        "store_name": "mock store",
        "store_email": "mock@airmee.com",
        "area_name": "Stockholm",
        "area_geometry": "random polygon"
      }
    );
  }
  return availableSchedules;
}

export const availableHolidaySchedulesForRetailer = (retailerId: string) => {
  const availableSchedules = new Array<any>();
    availableSchedules.push(
      {
        "retailer_id": retailerId,
        "date": 20,
        "month": 6,
        "delivery_start_window_hours": 10,
        "delivery_start_window_minutes": 30,
        "delivery_stop_window_hours": 22,
        "delivery_stop_window_minutes": 30,
        "price": 100,
        "price_currency": "SEK"
      },
      {
        "retailer_id": retailerId,
        "date": 21,
        "month": 6,
        "delivery_start_window_hours": 10,
        "delivery_start_window_minutes": 30,
        "delivery_stop_window_hours": 22,
        "delivery_stop_window_minutes": 30,
        "price": 100,
        "price_currency": "SEK"
      }
    );
  return availableSchedules;
}
