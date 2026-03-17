export type Root = ICommute[]

export interface ICommute {
  routeId: string
  routeName: string
  baseFare: number
  pickup: Pickup
  dropoff: Dropoff
  timings: Timing[]
  allStops: AllStop[]
  nearestPoint?: NearestPoint
}

export interface Pickup {
  name: string
  address: string
  latitude: number
  longitude: number
  images: Image[]
  distance: string
  travelTime: string
  travelType: 'WALK' | 'DRIVE'
  pointId: string
}

export interface Image {
  id: string
  imageUrl: string
  displayOrder: number
  isPrimary: boolean
}

export interface Dropoff {
  name: string
  address: string
  latitude: number
  longitude: number
  images: Image2[]
  distance: string
  travelTime: string
  travelType: 'WALK' | 'DRIVE'
  pointId: string
}

export interface Image2 {
  id: string
  imageUrl: string
  displayOrder: number
  isPrimary: boolean
}

export interface Timing {
  tripId: string
  pickupArrivalTime: string
  dropoffArrivalTime: string
  busNumber: string
  availableSeats: number
}

export interface AllStop {
  name: string
  address: string
  latitude: number
  longitude: number
  images: Image3[]
  arrivalTime: string
  sequence: number
  pointId: string
  isUserSegment: boolean
}

export interface NearestPoint {
  name: string
  distance: string
  travelTime: string
  travelType: 'WALK' | 'DRIVE'
  proximityMessage: string
}

export interface Image3 {
  id: string
  imageUrl: string
  displayOrder: number
  isPrimary: boolean
}
