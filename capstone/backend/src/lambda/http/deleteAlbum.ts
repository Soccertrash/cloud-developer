import 'source-map-support/register'

import * as express from 'express'
import * as awsServerlessExpress from 'aws-serverless-express'
import {createLogger} from "../../utils/logger";
import {AlbumAccess} from "../../datalayer/albumAccess";
import {getUserId} from "../../utils/getUserId";
import {applyCorsHeader} from "../../utils/corsUtil";
import {ImageAccess} from "../../datalayer/imageAccess";

const app = express()

const logger = createLogger("deleteAlbum");
const albumAccess = new AlbumAccess();
const imageAccess = new ImageAccess();

applyCorsHeader(app);

app.delete('/album/:albumId', async (_req, res) => {
    const albumId = _req.params.albumId;
    logger.info(`AlbumdId ${albumId}`);

    const userid = getUserId(_req);
    await albumAccess.deleteAlbum(albumId, userid);

    const allImages = await imageAccess.getAllImages(userid, albumId);
    allImages.forEach(i => imageAccess.deleteimage(userid, albumId, i.imageId))

    res.status(201).send('');
})


const server = awsServerlessExpress.createServer(app)
exports.handler = (event, context) => {
    awsServerlessExpress.proxy(server, event, context)
}
