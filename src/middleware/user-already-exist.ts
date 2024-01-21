import {body} from "express-validator";
import {UserDbModel} from "../models/users/users-models";
import {UsersRepository} from "../repositories/users-repositiory";
import {inputValidation} from "../validators/input-validation";

export const uniqueEmailValidator = body('email').custom(async (body) => {
    const userByEmail: UserDbModel | null = await UsersRepository.findByLoginOrEmail(body);
    console.log(userByEmail)
    if (userByEmail) {
        throw new Error('User already exists');
    }
    return true;
});
export const uniqueLoginValidator = body('login').custom(async (body) => {
    const userByLogin: UserDbModel | null = await UsersRepository.findByLoginOrEmail(body);
    console.log(userByLogin, 'user by login')
    if (userByLogin) {
        throw new Error('User already exists');
    }
    return true;
});

export const loginValidation = body('login')
    .isString()
    .trim()
    .isLength({min: 3, max: 10})
    .matches(/^[a-zA-Z0-9_-]*$/).withMessage('incorect regex')
    .withMessage('incorrect login');

export const emailValidation = body('email')
    .isString()
    .trim()
    .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage('incorrect email');

export const passwordValidation = body('password')
    .isString()
    .trim()
    .isLength({min: 6, max:20})
    .withMessage('incorrect password');
export const authRegistrationValidation = () => [uniqueEmailValidator,
    uniqueLoginValidator,
    loginValidation,
    emailValidation,
    passwordValidation,
    inputValidation];