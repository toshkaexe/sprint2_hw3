import bcrypt from "bcrypt";
import {ObjectId, WithId} from "mongodb";
import {CreateUserInputModel, UserDbModel, userMapper, UserOutputModel} from "../models/users/users-models";
import {UsersRepository} from "../repositories/users-repositiory";
import {LoginInputModel} from "../models/auth/login-model";


export class UsersService {

    static async findUserById(userId: ObjectId | null) {
        const user = await UsersRepository.findUserById(userId!)
        if (!user) return null
        return userMapper(user)

    }

    static async createUser(body: CreateUserInputModel): Promise<UserOutputModel> {
        const passwordHash = await bcrypt.hash(body.password, 10)
        const newUser: UserDbModel = {
            login: body.login,
            email: body.email,
            password: passwordHash,
            createdAt: new Date().toISOString(),
        }
        return UsersRepository.createUser(newUser)
    }

    static async deleteUser(id: string): Promise<boolean> {
        return UsersRepository.deleteUser(id)
    }

    static async checkCredentials(body: LoginInputModel) {
        const user: WithId<UserDbModel> | null = await UsersRepository.findByLoginOrEmail(body.loginOrEmail)
        if (!user) return null
        const compare = await bcrypt.compare(body.password, user.password)
        if (compare) {
            return user
        }
        return null
    }
}