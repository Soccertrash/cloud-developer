import 'source-map-support/register'

import * as express from 'express'
import * as awsServerlessExpress from 'aws-serverless-express'
import {createLogger} from "../../utils/logger";

const app = express()

const logger = createLogger("getSingleAlbum");

app.get('/album/:albumId', async (_req, res) => {
    const albumId = _req.params.albumId;

    logger.info(`AlbumdId ${albumId}`);

    res.json({
        items: []
    })
})

const server = awsServerlessExpress.createServer(app)
exports.handler = (event, context) => {
    awsServerlessExpress.proxy(server, event, context)
}
