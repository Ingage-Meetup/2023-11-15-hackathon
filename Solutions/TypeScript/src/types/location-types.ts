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
  latitude: number,
  longitude: number
}
