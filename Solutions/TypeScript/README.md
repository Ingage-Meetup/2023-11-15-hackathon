# Tikkun Farms - Typescript Implementation

## Overview
This is my attempt at a TypeScript implementation of the Tikkun Farms routing requirements. The end goal is that this could be a full routing system,
but for now, it is just some standalone command-line implementations of solutions to the challenges described in the [main README](../../README.md). This is very much a work in progress, to check back often for updates!

## Development
To work on this code, make sure you have node 18+ and yarn installed. You can also use `nix shell` and you will get the required node and yarn in your environment.

Once you have those pre-requisites, you can create a `.env` file by copying the `example.env` to a new files called `.env`. Then you need to set the value of the `OPENROUTESERVICE_API_KEY`, which is the API key needed for accessing the OpenRouteService map APIs. You can create a key for free by signing up at this site: https://openrouteservice.org/dev/#/home

TODO - document this better...

## Usage
To run this code, you also need node and yarn and the other setup mentioned in the [Development](#development) section.

### Find Optimal Routes
I'm thinking an approach could be to do the traveling salesperson solution, but at each iteration over a delivery and each driver, use the straight-line distance calculation formula to calculate the distance for that delivery from the driver's current position. Then choose the top N (not sure, maybe this should be tunable...) "candidates" from that list, which would be the top N based on the shortest distance to that next delivery. Then use the OpenRouteService to get an actual driving distance for those top N, and choose the one with the shortest driving distance.

To make this even more optimized, we can keep some geofenced boxes configured for land features like the Ohio River (any others) so that if a driver has to cross any of those features in their straight-line between their points, then we can assume that the route will be longer, and they should maybe not be in the top N.

#### Current Implementation
The initial implementation I'm playing with is just doing straight-line calculations. I think I can work out a lot of the kinks with this, and try to optimize the algorithm, before integrating with an actual distance service (which can get expensive).

The current implementation starts at the Farm and tries to move each driver towards their home address with each delivery. It could be improved further by picking the next optimal delivery for each driver, rather than just doing one delivery at a time and finding the optimal driver for that delivery. This way, if there are ties where a delivery might be a good option for multiple drivers, we could look at the next best delivery for each driver.

Still a work in progress.

Run this with a command like the following:
```shell
yarn plan ../../driver-geocoded.csv ../../delivery-geocoded.csv
```

This command expects two arguments - the path to a file containing fully geo-coded driver addresses, and the path to a file containing fully geo-coded delivery addresses. It will remove delivery addresses where the delivery is a driver's home address, with the assumption that the driver will take their own delivery to their own home.

#### Maps
* [Deliveries](https://batchgeo.com/map/5767e2b7469ff59b08974e70af461250)
* [Drivers](https://batchgeo.com/map/3abd164361e5faf9d2d1983ce3e5bda2)

### Geocode Addresses
This is the solution to [Challenge 2](../../README.md#challenge-2) in the main README. This will take a CSV with the proper format as input, and output a CSV (in the console) with all addresses having missing geo-coordinates filled in. The format is expected to be what is shown in the [driver-partial-geocoded.csv](../../driver-partial-geocoded.csv).

This is currently using the OpenRouteService [Geocode Search API](https://openrouteservice.org/dev/#/api-docs/geocode), but could in theory use any API that accepts an address and returns geo-coordinates.

This command expects to be given the path to the CSV to process. An example running it with the supplied input looks like this:
`yarn geocode ../../driver-partial-geocoded.csv`

The output will be in the same terminal, so you can redirect it to a new file with a command like this:
`yarn geocode ../../driver-partial-geocoded.csv > output.csv`

If you do that, there will be some extra lines at the beginning and the end, they may differ slightly for you, but it will be something like this:
```
yarn run v1.22.19
$ node --loader ts-node/esm --experimental-specifier-resolution=node ./src/geocode.ts ../../driver-partial-geocoded.csv
Street address,Apt / Unit #,City,State,Zip code,latitude,longitude
7528 Pippin Road,,Cincinnati,OH,45239,-84.57386,39.21408
8931 Winton Road,,Cincinnati,OH,45231,-84.51118,39.22866
...
7108 Clawson Ridge Court,,Liberty Township,OH,45011,-84.449848,39.376282
7368 Shady Hollow Lane,,West Chester,OH,45069,-84.402356,39.369498
Done in 5.66s.
```

You would want to remove the first two lines in that example, and the final line.

This program could be enhanced to allow writing directly to an output file, but I have a feeling that this is really just a proof-of-concept, and that in the larger "system", we would not be outputting CSV files anywhere, we would simply be inputting the list of drivers and the list of deliveries, and using those to do the routing with the code/classes that have been built.