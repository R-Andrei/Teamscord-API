import dotenv from "dotenv";
dotenv.config();

import { MongoClient, Db } from 'mongodb';
import { ApiDatabase } from "./database.d";


class Database {

    public client: MongoClient;
    public db: Db;

    constructor() {
        const { MONGO_MAIN_DB } = process.env;

        const uri = `mongodb://127.0.0.1:27017`;


        const client = new MongoClient(uri, {});
        client.connect(err => {
            if (err) {
                return;
            }
            console.info('> DB Server connected');
            this.client = client;
            this.db = client.db(MONGO_MAIN_DB);
        });
    }
}

const database: ApiDatabase = new Database();
export default database;