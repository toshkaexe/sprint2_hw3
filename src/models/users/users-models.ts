import {WithId} from "mongodb";

export type UserDbModel = {
    login: string
    email: string
    password: string
    createdAt: string
}

export type CreateUserInputModel = {
    login: string
    email: string
    password: string
}

export type UserOutputModel = {
    id: string
    login: string
    email: string
    createdAt: string
}

export type Paginator<UserOutputModel> = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: [UserOutputModel]
}
export const userMapper = (user: WithId<UserDbModel>): UserOutputModel => {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
    }
}