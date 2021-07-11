import {mock} from "../utils/TestUtils";
import {Repository} from "../../app/repository/Repository";
import {SchedulesServiceImpl} from "../../app/service/SchedulesServiceImpl";
import {
  availableHolidaySchedulesForRetailer,
  availableSchedulesForRetailerAndArea
} from "../../app/service/MockResultsFromDB";

const mockRepository: Repository = mock<Repository>();
describe('Scheduler Service test specs', () => {

  it('should throw exception if uuid is invalid', async () => {
    mockRepository.query = jest.fn().mockImplementation(() => {
      return Promise.resolve();
    });

    const validUuid = '5dd023f6-e094-11eb-a011-e7052009774e';
    const invalidUuid = 'invalid-uuid';
    const invalidTimestamp = '1234';

    const schedulesService = new SchedulesServiceImpl(mockRepository);

    // for retailer id
    await expect(schedulesService.getAvailableSchedules(invalidUuid, invalidUuid, invalidTimestamp)).rejects.toThrowError('Invalid uuid format for \'retailerId\': invalid-uuid');

    // for area id
    await expect(schedulesService.getAvailableSchedules(validUuid, invalidUuid, invalidTimestamp)).rejects.toThrowError('Invalid uuid format for \'areaId\': invalid-uuid');

  });

  it('should throw exception if timestamp is invalid or less than 2015', async () => {
    mockRepository.query = jest.fn().mockImplementation(() => {
      return Promise.resolve();
    });

    const validUuid = '5dd023f6-e094-11eb-a011-e7052009774e';
    const invalidTimestamp = 'invalid-timestamp';
    const timestampLessThan2015 = '1405038485';

    const schedulesService = new SchedulesServiceImpl(mockRepository);

    // for retailer id
    await expect(schedulesService.getAvailableSchedules(validUuid, validUuid, invalidTimestamp)).rejects.toThrowError('Invalid timestamp provided: invalid-timestamp');

    // for area id
    await expect(schedulesService.getAvailableSchedules(validUuid, validUuid, timestampLessThan2015)).rejects.toThrowError('Invalid timestamp provided: 1405038485');

  });

  it('should return 7 days available schedules for next week', async () => {
    const retailerId = '5dd023f6-e094-11eb-a011-e7052009774e';
    const areaId = '5dcf0890-e094-11eb-a011-7b57e06d8376';
    const timestamp = '1625980000';
    const numberOfDays = 7;

    const availableSchedules = availableSchedulesForRetailerAndArea(retailerId, areaId, numberOfDays);

    mockRepository.query = jest.fn().mockImplementation((args: any) => {
      if (args.params.length === 1) {
        // not returning value for holiday schedules
        return Promise.resolve([]);
      }
      return Promise.resolve(availableSchedules);
    });

    const schedulesService = new SchedulesServiceImpl(mockRepository);
    const actualResponse = await schedulesService.getAvailableSchedules(retailerId, areaId, timestamp);

    const expectedResponse = [
      {
        "currency": "SEK",
        "dropOffEarliestTime": 1626109240000,
        "dropOffInterval": "12 Jul 17:00-22:00",
        "dropOffLatestTime": 1626127240000,
        "price": 59
      },
      {
        "currency": "SEK",
        "dropOffEarliestTime": 1626195640000,
        "dropOffInterval": "13 Jul 17:00-22:00",
        "dropOffLatestTime": 1626213640000,
        "price": 59
      },
      {
        "currency": "SEK",
        "dropOffEarliestTime": 1626282040000,
        "dropOffInterval": "14 Jul 17:00-22:00",
        "dropOffLatestTime": 1626300040000,
        "price": 59
      },
      {
        "currency": "SEK",
        "dropOffEarliestTime": 1626368440000,
        "dropOffInterval": "15 Jul 17:00-22:00",
        "dropOffLatestTime": 1626386440000,
        "price": 59
      },
      {
        "currency": "SEK",
        "dropOffEarliestTime": 1626454840000,
        "dropOffInterval": "16 Jul 17:00-22:00",
        "dropOffLatestTime": 1626472840000,
        "price": 59
      },
      {
        "currency": "SEK",
        "dropOffEarliestTime": 1626541240000,
        "dropOffInterval": "17 Jul 17:00-22:00",
        "dropOffLatestTime": 1626559240000,
        "price": 59
      },
      {
        "currency": "SEK",
        "dropOffEarliestTime": 1626627640000,
        "dropOffInterval": "18 Jul 17:00-22:00",
        "dropOffLatestTime": 1626645640000,
        "price": 59
      }
    ];
    expect(actualResponse.length).toEqual(numberOfDays);
    expect(actualResponse).toEqual(expectedResponse);
  });

  it('should return only 3 days available schedules for next week', async () => {
    const retailerId = '5dd023f6-e094-11eb-a011-e7052009774e';
    const areaId = '5dcf0890-e094-11eb-a011-7b57e06d8376';
    const timestamp = '1625980000';
    const numberOfDays = 3;

    const availableSchedules = availableSchedulesForRetailerAndArea(retailerId, areaId, numberOfDays);

    mockRepository.query = jest.fn().mockImplementation((args) => {
      if (args.params.length === 1) {
        // not returning value for holiday schedules
        return Promise.resolve([]);
      }
      return Promise.resolve(availableSchedules);
    });

    const schedulesService = new SchedulesServiceImpl(mockRepository);
    const actualResponse = await schedulesService.getAvailableSchedules(retailerId, areaId, timestamp);

    const expectedResponse = [
      {
        "currency": "SEK",
        "dropOffEarliestTime": 1626109240000,
        "dropOffInterval": "12 Jul 17:00-22:00",
        "dropOffLatestTime": 1626127240000,
        "price": 59
      },
      {
        "currency": "SEK",
        "dropOffEarliestTime": 1626195640000,
        "dropOffInterval": "13 Jul 17:00-22:00",
        "dropOffLatestTime": 1626213640000,
        "price": 59
      },
      {
        "currency": "SEK",
        "dropOffEarliestTime": 1626282040000,
        "dropOffInterval": "14 Jul 17:00-22:00",
        "dropOffLatestTime": 1626300040000,
        "price": 59
      }
    ];
    expect(actualResponse.length).toEqual(numberOfDays);
    expect(actualResponse).toEqual(expectedResponse);
  });

  it('should return 7 days available schedules with holiday schedules for next week', async () => {
    const retailerId = '5dd023f6-e094-11eb-a011-e7052009774e';
    const areaId = '5dcf0890-e094-11eb-a011-7b57e06d8376';
    const timestamp = '1625980000';
    const numberOfDays = 7;

    const availableSchedules = availableSchedulesForRetailerAndArea(retailerId, areaId, numberOfDays);
    const availableHolidaySchedules = availableHolidaySchedulesForRetailer(retailerId);

    mockRepository.query = jest.fn().mockImplementation((args) => {
      if (args.params.length === 1) {
        return Promise.resolve(availableHolidaySchedules);
      }
      return Promise.resolve(availableSchedules);
    });

    const schedulesService = new SchedulesServiceImpl(mockRepository);
    const actualResponse = await schedulesService.getAvailableSchedules(retailerId, areaId, timestamp);

    const expectedResponse = [
      {
        "currency": "SEK",
        "dropOffEarliestTime": 1626109240000,
        "dropOffInterval": "12 Jul 17:00-22:00",
        "dropOffLatestTime": 1626127240000,
        "price": 59
      },
      {
        "currency": "SEK",
        "dropOffEarliestTime": 1626195640000,
        "dropOffInterval": "13 Jul 17:00-22:00",
        "dropOffLatestTime": 1626213640000,
        "price": 59
      },
      {
        "currency": "SEK",
        "dropOffEarliestTime": 1626258640000,
        "dropOffInterval": "14 Jul 10:30-22:30",
        "dropOffLatestTime": 1626301840000,
        "price": 100
      },
      {
        "currency": "SEK",
        "dropOffEarliestTime": 1626345040000,
        "dropOffInterval": "15 Jul 10:30-22:30",
        "dropOffLatestTime": 1626388240000,
        "price": 100
      },
      {
        "currency": "SEK",
        "dropOffEarliestTime": 1626454840000,
        "dropOffInterval": "16 Jul 17:00-22:00",
        "dropOffLatestTime": 1626472840000,
        "price": 59
      },
      {
        "currency": "SEK",
        "dropOffEarliestTime": 1626541240000,
        "dropOffInterval": "17 Jul 17:00-22:00",
        "dropOffLatestTime": 1626559240000,
        "price": 59
      },
      {
        "currency": "SEK",
        "dropOffEarliestTime": 1626627640000,
        "dropOffInterval": "18 Jul 17:00-22:00",
        "dropOffLatestTime": 1626645640000,
        "price": 59
      }
    ];
    expect(actualResponse.length).toEqual(numberOfDays);
    expect(actualResponse).toEqual(expectedResponse);
  });

});
