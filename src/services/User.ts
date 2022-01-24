import { InsertOneResult, ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

import {
    User,
    ResponseUser,
    LoginUserProps,
    ResponseUserWithPassword,
    UserWithPassword,
    RegisterUserProps
} from '../types/User';
import { ApiUserProps, ApiUserService } from "./User.d";
import { ApiDatabase } from "../database.d";
import Database from '../database';
import { StwingOwO } from '../types/defaults';


class UserService implements ApiUserService {

    private database: ApiDatabase;

    constructor(database: ApiDatabase) {
        this.database = database;
        console.info('> UserService initialized');
    }

    private readonly mapResponseUser = (responseUser: ResponseUser): User => {
        const { _id, username, tag, email, createdAt, updatedAt, status } = responseUser;
        return {
            _id: _id.toString(),
            username,
            tag,
            status,
            email,
            createdAt: new Date(createdAt),
            updatedAt: new Date(updatedAt)
        };
    }

    public readonly getUser = async (userProps: ApiUserProps): Promise<User> => {
        return new Promise((resolve, reject) => {
            const userId = new ObjectId(userProps._id);
            if (userId) {
                this.database.db.collection('users').findOne(
                    { _id: userId },
                    { projection: { _id: 1, username: 1, tag: 1, email: 1, createdAt: 1, updatedAt: 1, status: 1 } },
                ).then((user: ResponseUser) => {
                    const userObj: User = this.mapResponseUser(user);
                    resolve(userObj);
                }).catch(err => {
                    reject(err);
                });
            } else {
                reject(new Error('User id is not valid'));
            }
        });
    }

    public readonly getUsers = async (): Promise<User[]> => {
        return new Promise((resolve, reject) => {
            this.database.db.collection('users').find().toArray()
                .then((users: ResponseUser[]) => {
                    resolve(users.map(
                        (user: ResponseUser) => this.mapResponseUser(user)
                    ));
                }).catch(err => {
                    reject(err);
                });
        });
    }

    public readonly login = async (userProps: LoginUserProps): Promise<UserWithPassword> => {
        const { email, password } = userProps;

        return new Promise((resolve, reject) => {
            this.database.db.collection('users').findOne(
                { email },
                { projection: { _id: 1, username: 1, tag: 1, email: 1, createdAt: 1, updatedAt: 1, password: 1, status: 1 } },
            ).then((user: ResponseUserWithPassword) => {
                if (bcrypt.compareSync(password, user.password)) {
                    const { _id, username, tag, email, createdAt, updatedAt, password, status } = user;
                    resolve({
                        _id: _id.toString(),
                        username,
                        password,
                        status,
                        tag,
                        email,
                        createdAt: new Date(createdAt),
                        updatedAt: new Date(updatedAt)
                    });
                } else {
                    reject(new Error('Password is not valid.'));
                }
            }).catch(err => {
                reject(err);
            });
        });
    }

    public readonly createUser = async (userProps: RegisterUserProps): Promise<UserWithPassword> => {
        const { email, password, confirmPassword, username } = userProps;

        return new Promise((resolve, reject) => {
            if (password === confirmPassword) {
                this.database.db.collection('users').findOne(
                    { email },
                    { projection: { _id: 1, username: 1, tag: 1, email: 1, createdAt: 1, updatedAt: 1, password: 1 } },
                ).then((user: ResponseUserWithPassword) => {
                    if (!user) {
                        // generate tag
                        const newTag = `${Math.random()}`.substring(2, 6);
                        this.validateUserTag(username, newTag).then((validatedTag: string) => {
                            // hash password
                            this.hashPassword(password)
                                .then((hashedPassword: string) => {
                                    const status = 'offline';
                                    this.database.db.collection('users').insertOne({
                                        username,
                                        email,
                                        status,
                                        tag: validatedTag,
                                        password: hashedPassword,
                                        createdAt: new Date(),
                                        updatedAt: new Date()
                                    }).then((insertedDocument: InsertOneResult) => {
                                        const _id = insertedDocument.insertedId.toString();
                                        resolve({
                                            _id,
                                            username,
                                            password: hashedPassword,
                                            tag: validatedTag,
                                            email,
                                            status,
                                            createdAt: new Date(),
                                            updatedAt: new Date()
                                        });
                                    }).catch(err => {
                                        // insert new user error
                                        reject(err);
                                    });
                                })
                                .catch(err => {
                                    // hash password error
                                    reject(err);
                                });
                        }).catch(err => {
                            // validate new tag error
                            reject(err);
                        });
                    } else {
                        reject(new Error('Email is already in use.'));
                    }
                }).catch(err => {
                    // lookup user error
                    reject(err);
                });
            } else {
                reject(new Error('Passwords do not match.'));
            }
        });
    }

    public readonly updateUser = (userProps: ApiUserProps) => {
        // const user = this.database.db.collection('users').updateOne(userProps);

        // console.log(user);
    }

    public readonly deleteUser = (userProps: ApiUserProps) => {
        // const user = this.database.db.collection('users').deleteOne(userProps);

        // console.log(user);
    }

    private readonly validateUserTag = async (username: StwingOwO, tag: StwingOwO): Promise<string> => {
        let checkTag = tag;
        while (true) {
            let response = await this.database.db.collection('users').findOne({ username, tag: checkTag },
                { projection: { _id: 1, username: 1, tag: 1, email: 1, createdAt: 1, updatedAt: 1 } },
            );
            if (!response) {
                return checkTag;
            }
            checkTag = `${Math.random()}`.substring(2, 6);
        }
    }

    private readonly hashPassword = async (password: StwingOwO): Promise<string> => {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(hash);
                }
            });
        });
    }

}


const UserServiceInstance: ApiUserService = new UserService(Database);

export default UserServiceInstance;

