import { StreetAddress } from "./location-types";

export class DriverRoute {
  private stops: RouteStop[]
  constructor(readonly homeAddress: StreetAddress) {
    this.stops = []
  }

  addStop(address: StreetAddress, distance: number) {
    this.stops.push(<RouteStop> {
      currentAddress: address,
      distanceFromPrevious: distance
    })
  }

  get currentStop() {
    return this.stops[this.stops.length - 1]
  }

  get route() {
    const r = <Route> {
      stops: new Array<StreetAddress>(),
      totalDistanceKm: 0
    }

    this.stops.slice().reverse().forEach((stop) => {
      r.stops.push(stop.currentAddress)
      r.totalDistanceKm += stop.distanceFromPrevious
    })

    return r
  }

  public reverseStops() {
    this.stops.reverse()
  }

  public toString(): String {
    const listOfStops = this.stops.slice().reverse().map((s, i) => {
      return `#${i + 1}\t${(s.distanceFromPrevious * 0.621371).toFixed(2)}mi\t${s.currentAddress}`
    }).join('\n\t')
    return `Home Address: ${this.homeAddress}\n\t${listOfStops}\nTotal: ${(this.route.totalDistanceKm * 0.621371).toFixed(2)}mi`
  }
}

export interface Route {
  stops: StreetAddress[],
  totalDistanceKm: number,
}

export interface RouteStop {
  currentAddress: StreetAddress,
  distanceFromPrevious: number
}
