export interface Image {
    imageId: string
    albumId: string
    name: string
    userId: string
    timestamp: string
    description?: string
    geoPosition?: {
        lat: number,
        lng: number,
        alt: number
    }
}
