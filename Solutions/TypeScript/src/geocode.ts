import { error } from 'console'
import * as dotenv from 'dotenv'
import { GeocodingService, OpenRouteGeoLocationService } from './services/geocoding-service'
import { GeoLocation, StreetAddress } from './types/location-types'
import { createReadStream, existsSync, fstat } from 'fs'
import CsvReadableStream, { DataTypes, Line } from 'csv-reader'
const config = dotenv.config()

if (config.error) {
  error('************************************************************************************')
  error('Config could not be loaded - do you have a .env file in the main directory?')
  error('This can be copied from the example.env in most cases.')
  error('Error was: %s', config.error.message)
  error('************************************************************************************')
  process.exit(1)
}

if (!process.env.OPENROUTESERVICE_API_KEY) {
  error('************************************************************************************')
  error('API Key OPENROUTESERVICE_API_KEY is not defined in your configuration.')
  error('Make sure to set this key, and if you don\'t have one, sign up and create one here:')
  error('https://openrouteservice.org/dev/#/home')
  error('************************************************************************************')
  process.exit(1)
}

async function main(args: Array<string>) {
  if (args.length != 2) {
    console.error(`usage: yarn ${args[0].replace(/^.*\/(.*)\..*$/, '$1')} filename.csv`)
    process.exit(1)
  }

  const fileName = args[1]
  if (!existsSync(fileName)) {
    console.error(`Cannot read file ${fileName}.`)
    process.exit(1)
  }

  const geoCodeService: GeocodingService = new OpenRouteGeoLocationService(process.env.OPENROUTESERVICE_API_KEY!)

  createReadStream(fileName, 'utf8')
    .pipe(new CsvReadableStream({skipLines: 1}))
    .on('header', (header) => {
      console.log(header.join(','))
    })
    .on('data', async (row: DataTypes[]) => {
      const address = new StreetAddress(row[0] as string, row[1] as string | null, row[2] as string, row[3] as string, row[4] as string)
      if (row.length == 7 && row[5] && row[6]) {
        address.geoLocation = <GeoLocation>{
          longitude: new Number(row[5]),
          latitude: new Number(row[6]),
        }
      }

      if (!address.hasGeoLocation) {
        const geoLocation = await geoCodeService.getGeoLocation(address)
        address.geoLocation = geoLocation
      }
      console.log(address.toCsvString())
    })
}

await main(process.argv.slice(1))
