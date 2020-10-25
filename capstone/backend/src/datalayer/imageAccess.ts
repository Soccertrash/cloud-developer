import * as AWS from 'aws-sdk'
import {DocumentClient} from 'aws-sdk/clients/dynamodb'
import {createLogger} from "../utils/logger";
import {Image} from "../model/Image";
import {getUserAlbumId} from "../utils/getUserAlbumId";

const AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)


const logger = createLogger('datalayer');

export class ImageAccess {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly tableimage = process.env.TABLE_IMAGES,
        private readonly tableImageSecIdx = process.env.TABLE_IMAGES_SEC_INDEX
    ) {
    }


    /**
     * Create a new Image.
     * @param Image will be created.
     */
    async createImage(image: Image): Promise<Image> {
        logger.debug("createImage", image)
        await this.docClient.put({
            TableName: this.tableimage,
            Item: image
        }).promise()

        return image
    }

    /**
     * Get all images for a album (and user)
     * @param userId id of user
     * @param albumId id of album
     */
    async getAllImages(userId: string, albumId: string): Promise<Image[]> {
        logger.debug(`Get all images for user ${userId} and album ${albumId}`);
        const key = getUserAlbumId(userId, albumId);
        try {
            const result = await this.docClient
                .query({
                    TableName: this.tableimage,
                    IndexName: this.tableImageSecIdx,
                    KeyConditionExpression: 'userAlbumId = :userAlbumIdKey',
                    ExpressionAttributeValues: {
                        ':userAlbumIdKey': key
                    }
                })
                .promise()

            const items = result.Items
            return items as Image[]
        } catch (e) {
            logger.error("Could not get all album", e);
        }
    }


    /**
     * Delete a certain imange
     * @param userId the ID of the user
     * @param albumId the ID of the album
     * @param imageId the ID of the image
     */
    async deleteimage(userId: string, albumId: string, imageId: string): Promise<Image[]> {
        const userAlbumId = getUserAlbumId(userId, albumId);
        logger.debug(`Delete Image (${userAlbumId},${imageId})`)

        const deleteRes = await this.docClient.delete(
            {
                TableName: this.tableimage,
                Key: {"userAlbumId": userAlbumId, "imageId": imageId},
                ReturnValues: 'ALL_OLD'
            }
        ).promise();

        logger.debug("Delete done", deleteRes);
        return deleteRes.Attributes as Image[]
    }


}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        logger.debug('Creating a local DynamoDB instance')
        return new AWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        })
    }

    return new XAWS.DynamoDB.DocumentClient()
}
