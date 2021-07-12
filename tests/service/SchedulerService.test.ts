import {mock} from "../utils/TestUtils";
import {Repository} from "../../app/repository/Repository";
import {SchedulesServiceImpl} from "../../app/service/SchedulesServiceImpl";
import {
  availableHolidaySchedulesForRetailer,
  availableSchedulesForRetailerAndArea
} from "../utils/MockResultsFromDB";

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
    const timestamp = '1625998555';
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
        "dropOffEarliestTime": 1626627600000,
        "dropOffInterval": "18 Jul 17:00-22:00",
        "dropOffLatestTime": 1626645600000,
        "pickUpEarliestTime": 1626595200000,
        "pickUpInterval": "18 Jul 8:00-15:00",
        "pickUpLatestTime": 1626621300000,
        "price": 59
      },
      {
        "currency": "SEK",
        "dropOffEarliestTime": 1626714000000,
        "dropOffInterval": "19 Jul 17:00-22:00",
        "dropOffLatestTime": 1626732000000,
        "pickUpEarliestTime": 1626681600000,
        "pickUpInterval": "19 Jul 8:00-15:00",
        "pickUpLatestTime": 1626707700000,
        "price": 59
      },
      {
        "currency": "SEK",
        "dropOffEarliestTime": 1626800400000,
        "dropOffInterval": "20 Jul 17:00-22:00",
        "dropOffLatestTime": 1626818400000,
        "pickUpEarliestTime": 1626768000000,
        "pickUpInterval": "20 Jul 8:00-15:00",
        "pickUpLatestTime": 1626794100000,
        "price": 59
      },
      {
        "currency": "SEK",
        "dropOffEarliestTime": 1626886800000,
        "dropOffInterval": "21 Jul 17:00-22:00",
        "dropOffLatestTime": 1626904800000,
        "pickUpEarliestTime": 1626854400000,
        "pickUpInterval": "21 Jul 8:00-15:00",
        "pickUpLatestTime": 1626880500000,
        "price": 59
      },
      {
        "currency": "SEK",
        "dropOffEarliestTime": 1626973200000,
        "dropOffInterval": "22 Jul 17:00-22:00",
        "dropOffLatestTime": 1626991200000,
        "pickUpEarliestTime": 1626940800000,
        "pickUpInterval": "22 Jul 8:00-15:00",
        "pickUpLatestTime": 1626966900000,
        "price": 59
      },
      {
        "currency": "SEK",
        "dropOffEarliestTime": 1627059600000,
        "dropOffInterval": "23 Jul 17:00-22:00",
        "dropOffLatestTime": 1627077600000,
        "pickUpEarliestTime": 1627027200000,
        "pickUpInterval": "23 Jul 8:00-15:00",
        "pickUpLatestTime": 1627053300000,
        "price": 59
      },
      {
        "currency": "SEK",
        "dropOffEarliestTime": 1627146000000,
        "dropOffInterval": "24 Jul 17:00-22:00",
        "dropOffLatestTime": 1627164000000,
        "pickUpEarliestTime": 1627113600000,
        "pickUpInterval": "24 Jul 8:00-15:00",
        "pickUpLatestTime": 1627139700000,
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
        "dropOffEarliestTime": 1626627600000,
        "dropOffInterval": "18 Jul 17:00-22:00",
        "dropOffLatestTime": 1626645600000,
        "pickUpEarliestTime": 1626595200000,
        "pickUpInterval": "18 Jul 8:00-15:00",
        "pickUpLatestTime": 1626621300000,
        "price": 59
      },
      {
        "currency": "SEK",
        "dropOffEarliestTime": 1626714000000,
        "dropOffInterval": "19 Jul 17:00-22:00",
        "dropOffLatestTime": 1626732000000,
        "pickUpEarliestTime": 1626681600000,
        "pickUpInterval": "19 Jul 8:00-15:00",
        "pickUpLatestTime": 1626707700000,
        "price": 59
      },
      {
        "currency": "SEK",
        "dropOffEarliestTime": 1626800400000,
        "dropOffInterval": "20 Jul 17:00-22:00",
        "dropOffLatestTime": 1626818400000,
        "pickUpEarliestTime": 1626768000000,
        "pickUpInterval": "20 Jul 8:00-15:00",
        "pickUpLatestTime": 1626794100000,
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
        "dropOffEarliestTime": 1626627600000,
        "dropOffInterval": "18 Jul 17:00-22:00",
        "dropOffLatestTime": 1626645600000,
        "pickUpEarliestTime": 1626595200000,
        "pickUpInterval": "18 Jul 8:00-15:00",
        "pickUpLatestTime": 1626621300000,
        "price": 59
      },
      {
        "currency": "SEK",
        "dropOffEarliestTime": 1626714000000,
        "dropOffInterval": "19 Jul 17:00-22:00",
        "dropOffLatestTime": 1626732000000,
        "pickUpEarliestTime": 1626681600000,
        "pickUpInterval": "19 Jul 8:00-15:00",
        "pickUpLatestTime": 1626707700000,
        "price": 59
      },
      {
        "currency": "SEK",
        "dropOffEarliestTime": 1626777000000,
        "dropOffInterval": "20 Jul 10:30-22:30",
        "dropOffLatestTime": 1626820200000,
        "pickUpEarliestTime": 1626768000000,
        "pickUpInterval": "20 Jul 8:00-15:00",
        "pickUpLatestTime": 1626794100000,
        "price": 100
      },
      {
        "currency": "SEK",
        "dropOffEarliestTime": 1626863400000,
        "dropOffInterval": "21 Jul 10:30-22:30",
        "dropOffLatestTime": 1626906600000,
        "pickUpEarliestTime": 1626854400000,
        "pickUpInterval": "21 Jul 8:00-15:00",
        "pickUpLatestTime": 1626880500000,
        "price": 100
      },
      {
        "currency": "SEK",
        "dropOffEarliestTime": 1626973200000,
        "dropOffInterval": "22 Jul 17:00-22:00",
        "dropOffLatestTime": 1626991200000,
        "pickUpEarliestTime": 1626940800000,
        "pickUpInterval": "22 Jul 8:00-15:00",
        "pickUpLatestTime": 1626966900000,
        "price": 59
      },
      {
        "currency": "SEK",
        "dropOffEarliestTime": 1627059600000,
        "dropOffInterval": "23 Jul 17:00-22:00",
        "dropOffLatestTime": 1627077600000,
        "pickUpEarliestTime": 1627027200000,
        "pickUpInterval": "23 Jul 8:00-15:00",
        "pickUpLatestTime": 1627053300000,
        "price": 59
      },
      {
        "currency": "SEK",
        "dropOffEarliestTime": 1627146000000,
        "dropOffInterval": "24 Jul 17:00-22:00",
        "dropOffLatestTime": 1627164000000,
        "pickUpEarliestTime": 1627113600000,
        "pickUpInterval": "24 Jul 8:00-15:00",
        "pickUpLatestTime": 1627139700000,
        "price": 59
      }
    ];
    expect(actualResponse.length).toEqual(numberOfDays);
    expect(actualResponse).toEqual(expectedResponse);
  });

});
