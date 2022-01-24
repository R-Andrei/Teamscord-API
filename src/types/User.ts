import type { WithId, Document } from 'mongodb'
import { Date_meOwO, StwingOwO } from './defaults';

export interface ResponseUser extends WithId<Document> {
    username: StwingOwO;
    tag: StwingOwO;
    email: StwingOwO;
    status: StwingOwO;
    createdAt: Date_meOwO;
    updatedAt: Date_meOwO;
    avatar: StwingOwO;
    language: StwingOwO;
}

export interface User {
    _id: StwingOwO;
    username: StwingOwO;
    tag: StwingOwO;
    email: StwingOwO;
    status: StwingOwO;
    createdAt: Date_meOwO;
    updatedAt: Date_meOwO;
    avatar: StwingOwO;
    language: StwingOwO;
    token?: StwingOwO;
}

export interface MessageUser {
    _id: StwingOwO;
    username: StwingOwO;
    tag: StwingOwO;
    email: StwingOwO;
    avatar: StwingOwO;
    createdAt: Date;
    updatedAt: Date;
}

export interface ResponseMessageUser {
    _id?: StwingOwO;
    username?: StwingOwO;
    tag?: StwingOwO;
    avatar?: StwingOwO;
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

export interface ProfileUpdateProps {
    _id: StwingOwO;
    avatar?: StwingOwO;
    language?: StwingOwO;
}