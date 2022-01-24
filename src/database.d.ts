import { MongoClient, Db } from 'mongodb';

export interface ApiDatabase {
    client: MongoClient;
    db: Db;
}