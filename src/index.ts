import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";

import authenticationRoute from "./routes/authentication";
import messagesRoute from "./routes/messages";


// Language: typescript
// Path: api\src\index.ts

dotenv.config();

const { API_PORT } = process.env;
const port = API_PORT || 3001;
const corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200
};

// Create the express app and add middleware
const app = express();
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors(corsOptions));

// api routes
app.use('/api/v1/auth', authenticationRoute);
app.use('/api/v1/messages', messagesRoute);

// start the server
app.listen(port, () => {
    console.info(`> Server listening on port ${port}`);
    console.info(`> Environment: ${process.env.NODE_ENV}`);
});

// TODO: add jwt middleware


// write tests to see if user objects coming from database
// have dates in them instead of strings

// write tests to see if all services are initalized

// write tests to see if authmiddleware is working