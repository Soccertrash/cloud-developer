import 'source-map-support/register'

import * as express from 'express'
import * as awsServerlessExpress from 'aws-serverless-express'
import {createLogger} from "../../utils/logger";
import {ImageAccess} from "../../datalayer/imageAccess";
import {getUserId} from "../../utils/getUserId";
import {Image} from "../../model/Image";
import * as AWS from "aws-sdk";
import {applyCorsHeader} from "../../utils/corsUtil";

const app = express()
const bucketName = process.env.IMAGES_S3_BUCKET;

const logger = createLogger("deleteAlbum");

const s3 = new AWS.S3({
    signatureVersion: 'v4'
})

async function removeFromS3Bucket(dr: Image) {

    await new Promise((resolve, reject) => {
            s3.deleteObject({
                Bucket: bucketName,
                Key: dr.imageId
            }, (err, data) => {
                if (err) {
                    logger.error(`Could not delete image ${dr.imageId} from S3`);
                    return reject(err);
                }
                return resolve(data);
            })
        }
    );


}

function deleteImageFiles(deletedRecords: Image[]) {
    deletedRecords.forEach(
        r => {
            removeFromS3Bucket(r);
        }
    )
}

applyCorsHeader(app);

app.delete('/album/:albumId/image/:imageId', async (_req, res) => {
    const albumId = _req.params.albumId;
    const imageId = _req.params.imageId;
    logger.info(`AlbumdId ${albumId}, imageId ${imageId}`);

    const imageAccess = new ImageAccess();
    const deletedRecords = await imageAccess.deleteimage(getUserId(_req), albumId, imageId);

    deleteImageFiles(deletedRecords);

    res.status(201).send('');
})


const server = awsServerlessExpress.createServer(app)
exports.handler = (event, context) => {
    awsServerlessExpress.proxy(server, event, context)
}
