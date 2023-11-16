import { GeoLocation, StreetAddress } from "@/types/location-types";
import Openrouteservice from "openrouteservice";

export interface GeocodingService {
    getGeoLocation(address: StreetAddress): Promise<GeoLocation>
}

export class OpenRouteGeoLocationService implements GeocodingService{
  private openRouteService: Openrouteservice
  constructor(private readonly apiKey: string) {
    this.openRouteService = new Openrouteservice(apiKey)
  }

  public async getGeoLocation(address: StreetAddress): Promise<GeoLocation> {
    if (address.hasGeoLocation) {
      return Promise.resolve(address.geoLocation!)
    }

    const result = await this.openRouteService.getGeocodeSearch(address.toString())
    const point = result.features.find((f) => f.geometry.type == 'Point')
    if (point) {
      return <GeoLocation>{
        latitude: point.geometry.coordinates[0],
        longitude: point.geometry.coordinates[1]
      }
    } else {
      throw new Error("No coordinates returned");
    }
  }
}
