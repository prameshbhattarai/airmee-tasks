# Airmee Serverless Nodejs Rest API with TypeScript And PostgreSQL

## Use Cases

* REST API endpoint prototype in NodeJS with Serverless.
* Build a set of unit tests for the specified API endpoint.
* PostgreSQL data storage

## Requirements
* NodeJs: v12.18.2
* npm: 6.14.8
* Docker: 20.10.2, build 20.10.2-0ubuntu1~20.10.1
* Docker-Compose: 1.25.0

## Deploy

### To Run database from docker and extract postgres IPAddress/Host

```bash
sudo docker-compose -f airmee-docker-compose.yml up
sudo docker inspect container-id-of-postgres | grep IPAddress
```

### To Run application

* Run ```npm install``` to install all the necessary dependencies.
* Run ```npm run local``` use serverless offline to test locally.

### To run Unit test specs
* Run ```npm run test``` to run all the unit test specs.

## Invoke the function locally
API: http://localhost:3000/schedules/{retailerId}/{areaId}/{timestamp}
```bash
curl http://localhost:3000/schedules/280f052c-e303-11eb-9ff4-6be2f290a106/280e4736-e303-11eb-9ff4-e34597db2aa6/1640239412 | json_pp
```

Which should result in:

```bash
{
   "data" : [
      {
         "currency" : "SEK",
         "dropOffEarliestTime" : 1640538000000,
         "dropOffInterval" : "26 Dec 17:00-22:00",
         "dropOffLatestTime" : 1640556000000,
         "pickUpEarliestTime" : null,
         "pickUpInterval" : "",
         "pickUpLatestTime" : null,
         "price" : 59
      },
      {
         "currency" : "SEK",
         "dropOffEarliestTime" : 1640624400000,
         "dropOffInterval" : "27 Dec 17:00-22:00",
         "dropOffLatestTime" : 1640642400000,
         "pickUpEarliestTime" : 1640592000000,
         "pickUpInterval" : "27 Dec 8:00-15:00",
         "pickUpLatestTime" : 1640618100000,
         "price" : 59
      },
      {
         "currency" : "SEK",
         "dropOffEarliestTime" : 1640710800000,
         "dropOffInterval" : "28 Dec 17:00-22:00",
         "dropOffLatestTime" : 1640728800000,
         "pickUpEarliestTime" : 1640678400000,
         "pickUpInterval" : "28 Dec 8:00-15:00",
         "pickUpLatestTime" : 1640704500000,
         "price" : 59
      },
      {
         "currency" : "SEK",
         "dropOffEarliestTime" : 1640797200000,
         "dropOffInterval" : "29 Dec 17:00-22:00",
         "dropOffLatestTime" : 1640815200000,
         "pickUpEarliestTime" : 1640764800000,
         "pickUpInterval" : "29 Dec 8:00-15:00",
         "pickUpLatestTime" : 1640790900000,
         "price" : 59
      },
      {
         "currency" : "SEK",
         "dropOffEarliestTime" : 1640883600000,
         "dropOffInterval" : "30 Dec 17:00-22:00",
         "dropOffLatestTime" : 1640901600000,
         "pickUpEarliestTime" : 1640851200000,
         "pickUpInterval" : "30 Dec 8:00-15:00",
         "pickUpLatestTime" : 1640877300000,
         "price" : 59
      },
      {
         "currency" : "SEK",
         "dropOffEarliestTime" : 1640970000000,
         "dropOffInterval" : "31 Dec 17:00-22:00",
         "dropOffLatestTime" : 1640988000000,
         "pickUpEarliestTime" : 1640937600000,
         "pickUpInterval" : "31 Dec 8:00-15:00",
         "pickUpLatestTime" : 1640963700000,
         "price" : 100
      },
      {
         "currency" : "SEK",
         "dropOffEarliestTime" : 1641056400000,
         "dropOffInterval" : "1 Jan 17:00-22:00",
         "dropOffLatestTime" : 1641074400000,
         "pickUpEarliestTime" : null,
         "pickUpInterval" : "",
         "pickUpLatestTime" : null,
         "price" : 100
      }
   ],
   "message" : "success"
}
```
