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
TBD

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