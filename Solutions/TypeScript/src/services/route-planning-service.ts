import { StreetAddress } from "../types/location-types";
import { DriverRoute } from "../types/route-types";
import { DistanceService, SphericalLawOfCosinesDistanceService } from "./distance-service";

export interface RoutePlanningService {
  planRoutes(startingAddress: StreetAddress, drivers: StreetAddress[], deliveries: StreetAddress[]): Promise<DriverRoute[]>
}

export class StartAtTikkunRoutePlanningService implements RoutePlanningService {
  constructor(readonly distanceService: DistanceService = new SphericalLawOfCosinesDistanceService()) { }

  async planRoutes(startingAddress: StreetAddress, drivers: StreetAddress[], deliveries: StreetAddress[]): Promise<DriverRoute[]> {
    // Sort deliveries by distance from Tikkun Farms - remove those that match drivers addresses
    const deliveriesWithDistance: { address: StreetAddress, distance: number }[] = []
    for (const delivery of deliveries) {
      if (drivers.some((driver) => driver.sameAs(delivery))) {
        continue
      }
      const distance = await this.distanceService.findDistance(startingAddress.geoLocation!, delivery.geoLocation!)
      deliveriesWithDistance.push({ address: delivery, distance: distance })
    }
    deliveriesWithDistance.sort((a, b) => a.distance - b.distance).reverse()

    const driverRoutes = drivers.map((address) => { const dr = new DriverRoute(address); dr.addStop(startingAddress, 0); return dr;})
    for (const delivery of deliveriesWithDistance.map((d) => d.address)) {
      const distances: { driver: DriverRoute; distanceFromHome: number, stopDistance: number }[] = []
      for (const driver of driverRoutes) {
        const stopDistance = await this.distanceService.findDistance(delivery.geoLocation!, driver.currentStop.currentAddress.geoLocation!)
        const distanceFromHome = await this.distanceService.findDistance(delivery.geoLocation!, driver.homeAddress.geoLocation!)

        distances.push({ driver, distanceFromHome: distanceFromHome, stopDistance })
      }

      distances.sort((a, b) => a.distanceFromHome - b.distanceFromHome)
      const closestToHomeDriver = distances[0]

      distances.sort((a, b) => a.driver.route.totalDistanceKm - b.driver.route.totalDistanceKm)
      const shortestTotalDistanceDriver = distances[0]

      // This is kind of arbitrary, but seems to come up with a relatively even distribution of number of stops and
      // total mileage, while moving drivers toward their respective homes.
      //
      // We found the driver with the shortest total distance, and we found the driver where the next stop puts them
      // closest to their home. If the driver who would be closest to their home has a longer current route, we'll
      // still assign the delivery to them if the difference is < 7km. If it is greater than 7km difference, we'll give
      // the route to the driver with the total shortest current distance.
      if (closestToHomeDriver != shortestTotalDistanceDriver &&
          closestToHomeDriver.driver.route.totalDistanceKm - shortestTotalDistanceDriver.driver.route.totalDistanceKm < 7) {
        closestToHomeDriver.driver.addStop(delivery, closestToHomeDriver.stopDistance)
      } else {
        shortestTotalDistanceDriver.driver.addStop(delivery, shortestTotalDistanceDriver.stopDistance)
      }
    }

    // Finally, add their home address - they should be relatively close now.
    for (const dr of driverRoutes) {
      const stopDistance = await this.distanceService.findDistance(dr.homeAddress.geoLocation!, dr.currentStop.currentAddress.geoLocation!)
      dr.addStop(dr.homeAddress, stopDistance)
      dr.reverseStops()
    }

    return driverRoutes
  }
}
