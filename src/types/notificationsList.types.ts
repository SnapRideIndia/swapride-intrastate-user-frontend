export interface INotificationListResponse {
  data: INotification[]
  pagination: IPagination
}

export interface INotification {
  id: string
  title: string
  content: string
  type: string
  priority: string
  metadata?: Metadata
  targetGroup?: string
  createdAt: string
  read: boolean
  readAt: any
}

export interface Metadata {
  type?: string
  amount?: number
  referenceId?: string
  bookingId?: string
  images?: string[]
  rentalId?: string
  suggestionId?: string
}

export interface IPagination {
  total: number
  limit: number
  offset: number
  hasMore: boolean
}
