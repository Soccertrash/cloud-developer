import * as AWS from 'aws-sdk'
import {DocumentClient} from 'aws-sdk/clients/dynamodb'
import {createLogger} from "../utils/logger";
import {Album} from "../model/Album";

const AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)


const logger = createLogger('datalayer');

export class AlbumAccess {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly tableAlbum = process.env.TABLE_ALBUMS,
        private readonly tableAlbumSecIdx = process.env.TABLE_ALBUMS_ID_INDEX
    ) {
    }

    /**
     * Get all album information for a specific user id
     * @param userId key for request all album information
     * @return list of album for the given userId
     */
    async getAllAlbums(userId: string): Promise<Album[]> {
        logger.debug(`Get all albums for user ${userId}`);
        try {
            const result = await this.docClient
                .query({
                    TableName: this.tableAlbum,
                    IndexName: this.tableAlbumSecIdx,
                    KeyConditionExpression: 'userId = :userIdKey',
                    ExpressionAttributeValues: {
                        ':userIdKey': userId
                    }
                })
                .promise()

            const items = result.Items
            return items as Album[]
        } catch (e) {
            logger.error("Could not get all album", e);
        }
    }


    // /**
    //  * Get all images for given user and album.
    //  * @param userId
    //  * @param albumId
    //  * @return list of images of a given album
    //  */
    // async getAllImages(userId: string, albumId: string): Promise<Image[]> {
    //     logger.debug(`Get all images for user ${userId} and album ${albumId}`);
    //
    //     try {
    //         const result = await this.docClient
    //             .query({
    //                 TableName: this.tableimage,
    //                 KeyConditionExpression: 'albumIdUserId = :albumIdUserId',
    //                 ExpressionAttributeValues: {
    //                     ':albumIdUserId': albumId + userId
    //                 }
    //             })
    //             .promise();
    //         const items = result.Items;
    //         return items as Image[]
    //     } catch (e) {
    //         logger.error("Could not get album", e);
    //     }
    //
    // }


    /**
     * Create a new album.
     * @param album will be created.
     */
    async createAlbum(album: Album): Promise<Album> {
        logger.debug("createAlbum", album)
        await this.docClient.put({
            TableName: this.tableAlbum,
            Item: album
        }).promise()

        return album
    }

    //
    //
    // async updateTodo(todoId: string, userId: string, todo: UpdateTodoRequest) {
    //     logger.debug(`UpdateTodo (${todoId})`, todo)
    //
    //     await this.docClient.update(
    //         {
    //             TableName: this.todoTable,
    //             Key: {"todoId": todoId, "userId": userId},
    //             ExpressionAttributeNames: {"#nameAlt": "name"},
    //             UpdateExpression: "set #nameAlt = :n, dueDate = :d, done = :o",
    //             ExpressionAttributeValues: {
    //                 ":n": todo.name,
    //                 ":d": todo.dueDate,
    //                 ":o": todo.done
    //             },
    //             ReturnValues: "UPDATED_NEW"
    //
    //         }
    //     ).promise();
    //
    // }
    //
    // async setUpdateUrl(todoId: string, userId: string, url: string) {
    //     logger.debug(`setUpdateUrl (${todoId}, ${url})`)
    //
    //     await this.docClient.update(
    //         {
    //             TableName: this.todoTable,
    //             Key: {"todoId": todoId, "userId": userId},
    //             UpdateExpression: "set attachmentUrl = :u",
    //             ExpressionAttributeValues: {
    //                 ":u": url
    //             },
    //             ReturnValues: "UPDATED_NEW"
    //
    //         }
    //     ).promise();
    //
    // }
    //
    /**
     * Delete an album of a user
     * @param albumId the id of the album
     * @param userId the user id
     *
     */
    async deleteAlbum(albumId: string, userId: string) {
        logger.debug(`Delete (${albumId}`)

        const deleteRes = await this.docClient.delete(
            {
                TableName: this.tableAlbum,
                Key: {"userId": userId, "albumId": albumId},
                ReturnValues: 'ALL_OLD'
            }
        ).promise();

        logger.debug("Delete done", deleteRes);
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
