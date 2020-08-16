import {Router, Request, Response} from 'express';

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
    const imageUrl = req.query.image_url;
    if (!imageUrl) {
        return res.status(400).send("Provide image_url as query parameter");
    }
    return res.status(200).send();
});


export const ImageFilterRouter: Router = router;
