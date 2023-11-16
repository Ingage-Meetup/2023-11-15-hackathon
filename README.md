# November Hackathon
## Scenario
[Tikkun Farms](https://tikkunfarm.com/) delivers approximately 150 – 175 meals per week using a team of approximately 40 – 50
volunteer drivers. All deliveries originate from the farm located at 7945 Elizabeth St., Cincinnati, OH
45231, 39.2381772, -84.5459664.

Every week the list of families ([delivery.csv](delivery.csv) and [delivery-geocoded.csv](delivery-geocoded.csv)) that receive a meal delivery can change as a family may choose to receive a delivery this week but not the next.

Every week the list of volunteer drivers ([driver.csv](driver.csv), [driver-partial-geocoded.csv](driver-partial-geocoded.csv) and [driver-geocoded.csv](driver-geocoded.csv)) can change as a volunteer may have availability to participate this week but not the next.

The ideal scenario is to:
1. Upload a formatted spreadsheet of delivery addresses. (Assume spreadsheet is generated outside these requirements)
2. Upload a formatted spreadsheet of delivery drivers. (Assume spreadsheet is generated outside these requirements).
3. Each delivery driver will then be assigned a group of approximately 10 – 12 meal delivery addresses for delivery.
4. Originating from Farm and using their home address as a general direction of
travel.
5. This means that their home address would technically be the last address of their travel to optimize the delivery route.
6. The number of delivery addresses may vary based on the number of volunteer drivers.


## Challenge 1
The most challenging part of this should be taking a geocoded list of drivers and a geocoded list of deliveries and creating the delivery list for each driver based on the information above. Take each csv file provided in the root of this repo and create a list/array of the data and use an API or library to determine the next geographically nearest location based on origin of the farm, and the driver's end home address. May also be worth investigating a reverse delivery route, so start with their home address and find nearest delivery address, then move back towards the farm to find the next one.

## Challenge 2
We will also need to geocode the addresses, but there are many samples out there on how to accomplish this with many tools or APIs. If your team feels overwhelmed with the most challenging part of this create a list/array of the data from the non-geocoded data and get the Latitude and Longitude for hte address provided. Bonus points for using the driver-partial-geocoded.csv sample file and only making calls to geocode an address if the latitude and longitude are not already known.

## Collaboration
Please fork this repo, complete either of the challenges, and create a PR for your solutions back to the repo so that we may share the results of this hackathon with the developers who will work on the final solution for Tikkun Farms.

## APIs and Services that may be explored
### Google Maps/GCP
https://developers.google.com/maps/documentation/geocoding

### AWS Amazon Location API
https://docs.aws.amazon.com/location/latest/developerguide/location-actions.html

### Azure Maps
https://azure.microsoft.com/en-us/products/azure-maps/  
I have created a service here and you may test this one using Shared Key Authentication with the key: RovavDJWenupKw-1g_V9LBwo_ggX4xuwXe8tQi6U-Ec  
I will be deleting this key after the event.

### Mapquest (yes apparently they are still around)
https://developer.mapquest.com/documentation
