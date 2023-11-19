export class StreetAddress {
  constructor(
    readonly addressLine1: string,
    readonly addressLine2: string | null,
    readonly city: string,
    readonly state: string,
    readonly postalCode: string,
    public geoLocation: GeoLocation | null = null
  ) { }

  public static forComponents(addressLine1: string, city: string, state: string, postalCode: string, geoLocation: GeoLocation | null = null): StreetAddress {
    return new StreetAddress(addressLine1, null, city, state, postalCode, geoLocation)
  }

  get hasGeoLocation(): boolean {
    return this.geoLocation !== null
  }

  public sameAs(other: StreetAddress): boolean {
    if (this.hasGeoLocation && other.hasGeoLocation) {
      return this.geoLocation?.latitude == other.geoLocation?.latitude &&
        this.geoLocation?.longitude == other.geoLocation?.longitude
    }

    return this.addressLine1.toLowerCase().trim() == other.addressLine1.toLowerCase().trim()
      && this.addressLine2?.toLowerCase().trim() == other.addressLine2?.toLowerCase().trim()
      && this.city.toLowerCase().trim() == other.city.toLowerCase().trim()
      && this.state.toLowerCase().trim() == other.state.toLowerCase().trim()
      && this.postalCode.toLowerCase().trim() == other.postalCode.toLowerCase().trim()
  }

  public toString() {
    const address = [this.addressLine1, this.addressLine2, this.city, this.state, this.postalCode]
    return address.map((component) => component?.trim()).filter((component) => component && component?.length > 0).join(', ')
  }

  public toCsvString() {
    const address = [
      this.addressLine1,
      this.addressLine2 || '',
      this.city,
      this.state,
      this.postalCode,
      this.hasGeoLocation ? this.geoLocation!.latitude : '',
      this.hasGeoLocation ? this.geoLocation!.longitude : ''
    ]

    return address.join(',')
  }
}

export interface GeoLocation {
  latitude: string,
  longitude: string
}
