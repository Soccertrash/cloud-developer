import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import * as AWS from 'aws-sdk';
import {createLogger} from "../../utils/logger";
import * as uuid from 'uuid'
import {TodoAccess} from '../../datalayer/todoAccess';
import { getUserId } from '../../utils/user';

const s3 = new AWS.S3({
    signatureVersion: 'v4'
})

const bucketName = process.env.IMAGES_S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;
const logger = createLogger('uploadUrl');
const todoAccess = new TodoAccess();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    logger.debug("uploadUrl: " + todoId);
    const imageId = uuid.v4()
    const userId = getUserId(event);

    const uploadUrl = getUploadUrl(imageId);

    const imageUrl = `https://${bucketName}.s3.amazonaws.com/${imageId}`
    await todoAccess.setUpdateUrl(todoId, userId, imageUrl);

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            "uploadUrl": uploadUrl
        })
    }
}

function getUploadUrl(imageId: string) {
    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: imageId,
        Expires: urlExpiration
    })
}
