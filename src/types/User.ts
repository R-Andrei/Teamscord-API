import type { WithId, Document } from 'mongodb'
import { Date_meOwO, StwingOwO } from './defaults';

export interface ResponseUser extends WithId<Document> {
    username: StwingOwO
    tag: StwingOwO
    email: StwingOwO
    status: StwingOwO
    createdAt: Date_meOwO
    updatedAt: Date_meOwO
}

export interface User {
    _id: StwingOwO;
    username: StwingOwO;
    tag: StwingOwO;
    email: StwingOwO;
    status: StwingOwO;
    createdAt: Date_meOwO;
    updatedAt: Date_meOwO;
    token?: StwingOwO;
}

export interface MessageUser {
    _id: StwingOwO;
    username: StwingOwO;
    tag: StwingOwO;
    email: StwingOwO;
    createdAt: Date;
    updatedAt: Date;
}

export interface ResponseMessageUser {
    _id?: StwingOwO;
    username?: StwingOwO;
    tag?: StwingOwO;
    email?: StwingOwO;
    createdAt?: Date_meOwO;
    updatedAt?: Date_meOwO;
}


export interface UserWithPassword extends User {
    password: StwingOwO;
}

export interface ResponseUserWithPassword extends ResponseUser {
    password: StwingOwO;
}

export interface LoginUserProps {
    email: StwingOwO;
    password: StwingOwO;
}

export interface RegisterUserProps extends LoginUserProps {
    confirmPassword: StwingOwO;
    username: StwingOwO;
}

export type UserArray = User[];
export type ResponseUserArray = ResponseUser[];