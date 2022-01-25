import { Message, Messages, Rooms } from "../types/Message";
import { Date_meOwO, StwingOwO } from "../types/defaults";
import {
    LoginUserProps,
    RegisterUserProps,
    User,
    UserWithPassword
} from "../types/User";

export interface ApiUserProps {
    _id?: StwingOwO;
    username?: StwingOwO;
    tag?: StwingOwO;
    password?: StwingOwO;
    email?: StwingOwO;
    createdAt?: Date_meOwO;
    updatedAt?: Date_meOwO;
}

export interface ApiCommService {
    retrieveRooms(_id: StwingOwO): Promise<Rooms>;
    sendMessage(roomId: StwingOwO, message: StwingOwO, sender: User): Promise<Message>;
    retrieveMessages(roomId: StwingOwO, timestamp: Date | null): Promise<Messages>;
    addBuddy(roomId: StwingOwO, email: StwingOwO): Promise<User>
}