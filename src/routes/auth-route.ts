import {Router, Request, Response} from 'express';
import {StatusCode} from "../models/common";
import {blogsCollection, postsCollection} from "../db/db";
import {WithId} from "mongodb";
import {UserDbModel} from "../models/users/users-models";
import {UsersService} from "../domain/users-service";
import {jwtService} from "../domain/jwt-service";
import {inputValidation} from "../validators/input-validation";
import {validateAuthorization} from "../validators/auth-validation";
import {bearerAuth} from "../middleware/auth-middlewares";
import {UsersQueryRepository} from "../repositories/user-query-repository";


export const authRoute = Router({})



authRoute.post('/login',
    validateAuthorization(),
    inputValidation,

    async (req: Request, res: Response): Promise<void>  => {
    console.log(req.body)
        const user: WithId<UserDbModel> | null  = await UsersService.checkCredentials(req.body)
        console.log(user)
        if (user) {
            const token = await jwtService.createJWT(user)
            res.status(StatusCode.OK_200).send({accessToken: token})
            console.log(token)
        } else {
            res.sendStatus(StatusCode.NOT_AUTHORIZED_401)
        }
    }
)

authRoute.get('/me' ,
    bearerAuth,
    async (req: Request, res: Response) => {
        const userId = req.user!.id
        const currentUser = await UsersQueryRepository.findCurrentUser(userId)
        console.log(currentUser)
        if (!currentUser)
            return res.sendStatus(StatusCode.NOT_FOUND_404)
        res.send({
            email: currentUser.email,
            login: currentUser.login,
            userId: currentUser.id
        })
        return
    })
