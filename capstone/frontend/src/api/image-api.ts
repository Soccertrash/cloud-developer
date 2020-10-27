import {apiEndpoint} from '../config'
import Axios from 'axios'
import {Image} from "../types/Image";

export async function getImages(idToken: string, albumId: string): Promise<Image[]> {
    console.log('Fetching images')

    const response = await Axios.get(`${apiEndpoint}/album/${albumId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        },
    })
    console.log('Images:', response.data)
    return response.data.items
}

export async function deleteImage(idToken: string, albumId: string, imageId: string): Promise<boolean> {
    console.log('Delete image')

    const response = await Axios.delete(`${apiEndpoint}/album/${albumId}/image/${imageId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        },
    })

    return response.status === 201
}
