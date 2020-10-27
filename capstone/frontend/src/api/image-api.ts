import {apiEndpoint} from '../config'
import Axios from 'axios'
import {Image} from "../types/Image";

export async function getImages(idToken: string, albumId: string): Promise<Image[]> {
    console.log('Fetching albums')

    const response = await Axios.get(`${apiEndpoint}/album/${albumId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        },
    })
    console.log('Images:', response.data)
    return response.data.items
}
