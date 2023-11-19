import Openrouteservice from "openrouteservice";
import { GeoLocation } from "../types/location-types";

export interface DistanceService {
  totalCalls: number
  findDistance(start: GeoLocation, end: GeoLocation): Promise<number>
}

export abstract class AbstractDistanceService implements DistanceService {
  private distanceCalls: { a: GeoLocation, b: GeoLocation, total: number }[] = []

  findDistance(start: GeoLocation, end: GeoLocation): Promise<number> {
    const uniqueAddressPair = this.distanceCalls.find((call) => {
      return (start.latitude == call.a.latitude
        && start.longitude == call.a.longitude
        && end.latitude == call.b.latitude
        && end.longitude == call.b.longitude) ||
        (start.latitude == call.b.latitude
          && start.longitude == call.b.longitude
          && end.latitude == call.a.latitude
          && end.longitude == call.a.longitude)
    })
    if (uniqueAddressPair) {
      uniqueAddressPair.total++
    } else {
      this.distanceCalls.push({ a: start, b: end, total: 1 })
    }

    return this.doFindDistance(start, end)
  }

  abstract doFindDistance(start: GeoLocation, end: GeoLocation): Promise<number>

  get totalCalls() {
    return this.distanceCalls.length
  }
}

export class SphericalLawOfCosinesDistanceService extends AbstractDistanceService {
  /**
   * Implement the [Spherical Law of Cosines](https://en.wikipedia.org/wiki/Spherical_law_of_cosines). Code borrowed
   * from here: https://henry-rossiter.medium.com/calculating-distance-between-geographic-coordinates-with-javascript-5f3097b61898#0807
   * @param start the starting point
   * @param end the ending point
   * @returns the straight-line distance in meters between the two points
   */
  async doFindDistance(start: GeoLocation, end: GeoLocation): Promise<number> {
    const R = 6371e3; // Radius of the Earth in km
    const p1 = parseFloat(start.latitude) * Math.PI / 180;
    const p2 = parseFloat(end.latitude) * Math.PI / 180;
    const deltaP = p2 - p1;
    const deltaLon = parseFloat(end.longitude) - parseFloat(start.longitude);
    const deltaLambda = (deltaLon * Math.PI) / 180;
    const a = Math.sin(deltaP / 2) * Math.sin(deltaP / 2) +
      Math.cos(p1) * Math.cos(p2) *
      Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const distance = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * R;

    return Promise.resolve(distance / 1000)
  }
}

export class OpenRouteServiceDistanceService extends AbstractDistanceService {
  private openRouteService: Openrouteservice
  constructor(private readonly apiKey: string) {
    super()
    this.openRouteService = new Openrouteservice(apiKey)
  }

  doFindDistance(start: GeoLocation, end: GeoLocation): Promise<number> {
    throw new Error("Method not implemented.");
  }

  get totalCalls() {
    return 0
  }

}


