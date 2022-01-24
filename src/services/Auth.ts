import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import dotenv from "dotenv";

import { UserWithPassword } from '../types/User';
import { ApiAuthService } from './Auth.d';
import { ApiDatabase } from "../database.d";
import Database from '../database';
import { StwingOwO } from '../types/defaults';


dotenv.config();


class AuthService implements ApiAuthService {

    private database: ApiDatabase;
    private readonly secret: string = process.env.API_PORT || 'secret';

    constructor(database: ApiDatabase) {
        this.database = database;
        console.info('> AuthService initialized');
        if (this.secret)
            console.info(`> Auth Secret initialized`);
    }

    public readonly generateToken = (user: UserWithPassword): Promise<StwingOwO> => {
        return new Promise((resolve, reject) => {
            bcrypt.hash(`${user.password}.${this.secret}`, 10, (err: Error, hash: StwingOwO) => {
                if (err) {
                    reject(err);
                } else {
                    // save token to mongodb
                    this.database.db.collection('sessions').insertOne({
                        userId: new ObjectId(user._id),
                        token: hash,
                        createdAt: new Date()
                    }).then(() => {
                        resolve(hash);
                    }).catch((err: Error) => {
                        reject(err);
                    });
                }
            });
        });
    }

    public readonly validateToken = (authorizationHeader: StwingOwO): Promise<UserWithPassword> => {
        return new Promise((resolve, reject) => {
            if (authorizationHeader) {
                // get token from header
                const token = authorizationHeader.split(' ')[1];

                this.database.db.collection('sessions').findOne({ token }).then((session: any) => {
                    if (
                        session
                        && ( // check if token is not expired because getting a better mongo tier is expensive
                            new Date().getTime()
                            < new Date(session.createdAt).getTime()
                            + (1000 * 60 * 60 * 24)
                        )
                    ) {
                        // get user from mongodb
                        this.database.db.collection('users').findOne({ _id: new ObjectId(session.userId) }).then((user: any) => {
                            const userObj: UserWithPassword = {
                                ...user,
                                createdAt: new Date(user.createdAt),
                                updatedAt: new Date(user.updatedAt),
                                password: user.password,
                                token: token
                            };
                            resolve(userObj);
                        }).catch((err: Error) => {
                            reject(err);
                        });
                    } else {
                        reject(new Error('Token expired.'));
                    }
                }).catch((err: Error) => {
                    reject(err);
                });
            } else {
                reject(new Error('Authorization header is not valid.'));
            }
        });
    }

    public readonly removeToken = (_id: StwingOwO, authorizationHeader: StwingOwO): Promise<void> => {
        return new Promise((resolve, reject) => {
            const token = authorizationHeader.split(' ')[1];
            const userId: ObjectId = new ObjectId(_id);
            if (!token || !userId) {
                reject(new Error('Token or userId is not valid.'));
            } else {
                this.database.db.collection('sessions').deleteOne({ userId, token }).then(() => {
                    resolve();
                }).catch((err: Error) => {
                    reject(err);
                });
            }
        });
    }
}

const AuthServiceInstance: ApiAuthService = new AuthService(Database);

export default AuthServiceInstance;