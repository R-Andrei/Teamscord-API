import { WithId } from "mongodb";
import { Date_meOwO, StwingOwO, StwingOwOAwway } from "./defaults";
import { MessageUser, ResponseMessageUser, ResponseUserArray, User, UserArray } from "./User";

export interface Message {
    _id: StwingOwO;
    sender: MessageUser;
    roomId: StwingOwO;
    message: StwingOwO;
    createdAt: Date_meOwO;
    updatedAt: Date_meOwO;
}

export interface ResponseMessage extends WithId<Document> {
    sender: ResponseMessageUser;
    roomId: StwingOwO;
    message: StwingOwO;
    createdAt: Date_meOwO;
    updatedAt: Date_meOwO;
}

export interface Room {
    _id: StwingOwO;
    name?: StwingOwO | null;
    participants: UserArray;
    messages: StwingOwOAwway;
    createdAt: Date_meOwO;
    updatedAt: Date_meOwO;
}

export interface ResponseRoom extends WithId<Document> {
    name?: StwingOwO | null;
    participants: ResponseUserArray;
    messages: [];
    createdAt: Date_meOwO;
    updatedAt: Date_meOwO;
}

export type Rooms = Room[];
export type Messages = Message[];
export type ResponseRooms = ResponseRoom[];
export type ResponseMessages = ResponseMessage[];