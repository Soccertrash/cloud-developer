import 'source-map-support/register'

import * as express from 'express'
import * as awsServerlessExpress from 'aws-serverless-express'
import {createLogger} from "../../utils/logger";
import {AlbumAccess} from "../../datalayer/albumAccess";
import {getUserId} from "../../utils/getUserId";

const app = express()

const logger = createLogger("deleteAlbum");

app.delete('/album/:albumId', async (_req, res) => {
    const albumId = _req.params.albumId;
    logger.info(`AlbumdId ${albumId}`);

    const albumAccess = new AlbumAccess();
    await albumAccess.deleteAlbum(albumId, getUserId(_req));

    res.status(201).send('');
})

const server = awsServerlessExpress.createServer(app)
exports.handler = (event, context) => {
    awsServerlessExpress.proxy(server, event, context)
}
