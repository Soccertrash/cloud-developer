import 'source-map-support/register'

import * as express from 'express'
import * as awsServerlessExpress from 'aws-serverless-express'
import {createLogger} from "../../utils/logger";
import {AlbumAccess} from "../../datalayer/albumAccess";
import {userId} from "../../utils/dummy";

const app = express()

const logger = createLogger("getAlbums");

const albumAccess = new AlbumAccess();

app.get('/album', async (_req, res) => {
    logger.info("getAlbums");

    const albums = await albumAccess.getAllAlbums(userId);

    res.json({
        items: albums
    })
})

const server = awsServerlessExpress.createServer(app)
exports.handler = (event, context) => {
    awsServerlessExpress.proxy(server, event, context)
}
