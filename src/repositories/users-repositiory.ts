import {usersCollection} from "../db/db";
import {UserDbModel, userMapper, UserOutputModel} from "../models/users/users-models";
import {InsertOneResult, ObjectId, WithId} from "mongodb";

export class UsersRepository {

    static async createUser(user: UserDbModel): Promise<UserOutputModel> {
        const result: InsertOneResult<UserDbModel> = await usersCollection.insertOne({...user})
        return userMapper({_id: result.insertedId, ...user})
    }

    static async findUserById(id: ObjectId) {
        let product = await usersCollection.findOne({_id: id})
        return product ? product : null
    }

    static async findByLoginOrEmail(loginOrEmail: string): Promise<WithId<UserDbModel> | null> {
        const user = await usersCollection.findOne(
            {
                $or: [
                    {email: loginOrEmail},
                    {login: loginOrEmail}]
            })
        return user
    }

    static async deleteUser(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) return false
        const result = await usersCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }

    static async deleteAll() {
        return usersCollection.deleteMany({})
    }

}