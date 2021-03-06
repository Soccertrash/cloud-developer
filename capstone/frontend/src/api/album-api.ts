import {apiEndpoint} from '../config'
import {Album} from '../types/Album';
import {CreateAlbumRequest} from '../types/CreateAlbumRequest';
import Axios from 'axios'

export async function getAlbums(idToken: string): Promise<Album[]> {
    console.log('Fetching albums')

    const response = await Axios.get(`${apiEndpoint}/album`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        },
    })
    console.log('Albums:', response.data)
    return response.data.items
}

export async function createAlbum(
    idToken: string,
    newAlbum: CreateAlbumRequest
): Promise<Album> {
    const response = await Axios.put(`${apiEndpoint}/album`, JSON.stringify(newAlbum), {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        }
    })
    return response.data.item
}

export async function deleteAlbum(
    idToken: string,
    albumId: string
): Promise<void> {
    await Axios.delete(`${apiEndpoint}/album/${albumId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        }
    })
}

export async function getUploadUrl(
    idToken: string,
    albumId: string
): Promise<string> {
    const response = await Axios.post(`${apiEndpoint}/album/${albumId}/image`, '', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        }
    })
    return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: File): Promise<void> {
    await Axios.put(uploadUrl, file)
}
