import {Router, Request, Response} from 'express';
import {filterImageFromURL, deleteLocalFiles} from '../../util/util';

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
    const imageUrl = req.query.image_url;
    if (!imageUrl) {
        return res.status(400).send("Provide image_url as query parameter");
    }

    const imageLocal = await filterImageFromURL(imageUrl);
    res.on('finish', () => {
        deleteLocalFiles([imageLocal]);
    })
    return res.status(200).sendFile(imageLocal);

});


export const ImageFilterRouter: Router = router;
