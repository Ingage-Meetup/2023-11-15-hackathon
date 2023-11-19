import { error } from 'console'
import * as dotenv from 'dotenv'
import { GeoLocation, StreetAddress } from './types/location-types'
import { createReadStream, existsSync } from 'fs'
import CsvReadableStream, { DataTypes } from 'csv-reader'
import { StartAtTikkunRoutePlanningService } from './services/route-planning-service'
import { GeocodingService, OpenRouteGeoLocationService } from './services/geocoding-service'
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
  if (args.length != 3) {
    console.error(`usage: yarn ${args[0].replace(/^.*\/(.*)\..*$/, '$1')} driver-filename.csv deliveries-filename.csv`)
    process.exit(1)
  }

  const driverFileName = args[1]
  if (!existsSync(driverFileName)) {
    console.error(`Cannot read file ${driverFileName}.`)
    process.exit(1)
  }

  const deliveriesFileName = args[2]
  if (!existsSync(deliveriesFileName)) {
    console.error(`Cannot read file ${deliveriesFileName}.`)
    process.exit(1)
  }

  const drivers = await new Promise<Array<StreetAddress>>((resolve, reject) => {
    const driversArray = new Array<StreetAddress>()
    const driverStream = createReadStream(driverFileName, 'utf8')
      .pipe(new CsvReadableStream({ skipLines: 1 }))
    driverStream.on('data', async (row: DataTypes[]) => {
      const address = new StreetAddress(row[0] as string, row[1] as string | null, row[2] as string, row[3] as string, row[4] as string)
      if (row.length == 7 && row[5] && row[6]) {
        address.geoLocation = <GeoLocation>{
          latitude: row[5],
          longitude: row[6],
        }
      }

      driversArray.push(address)
    })
    driverStream.on('end', () => resolve(driversArray))
    driverStream.on('error', (error) => reject(error))
  })

  const deliveries = await new Promise<Array<StreetAddress>>((resolve, reject) => {
    const deliveriesArray = new Array<StreetAddress>()
    const deliveriesStream = createReadStream(deliveriesFileName, 'utf8')
      .pipe(new CsvReadableStream({ skipLines: 1 }))
    deliveriesStream.on('data', async (row: DataTypes[]) => {
      const address = new StreetAddress(row[0] as string, row[1] as string | null, row[2] as string, row[3] as string, row[4] as string)
      if (row.length == 7 && row[5] && row[6]) {
        address.geoLocation = <GeoLocation>{
          latitude: row[5],
          longitude: row[6],
        }
      } else {
        console.log(`Error - something went wrong: ${address}`)
      }

      deliveriesArray.push(address)
    })
    deliveriesStream.on('end', () => resolve(deliveriesArray))
    deliveriesStream.on('error', (error) => reject(error))
  })

  const geoCodeService: GeocodingService = new OpenRouteGeoLocationService(process.env.OPENROUTESERVICE_API_KEY!)
  const tikkunFarmStreetAddress = StreetAddress.forComponents(
    '7941 Elizabeth St', 'Mt Healthy', 'OH', '45231'
  )
  tikkunFarmStreetAddress.geoLocation = await geoCodeService.getGeoLocation(tikkunFarmStreetAddress)

  const routePlanningService = new StartAtTikkunRoutePlanningService()
  const routes = await routePlanningService.planRoutes(tikkunFarmStreetAddress, drivers, deliveries)

  console.log('Routes')
  routes.forEach((r, i) => {
    console.log(`#${i + 1}: ${r}\n=============\n`)
  })

  console.log(`Number of unique distance calls: ${routePlanningService.distanceService.totalCalls}`)
}

await main(process.argv.slice(1))
