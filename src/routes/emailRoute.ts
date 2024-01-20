import {Router, Response, Request} from "express";
import {emailAdapter} from "../adapter/email-adapter";


export const emailRoute = Router({})

emailRoute.post(
    '/send', async (req: Request, res: Response) => {

       await  emailAdapter.sendEmail(req.body.email, req.body.subject, req.body.message);

    }
)