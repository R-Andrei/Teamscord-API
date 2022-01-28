import { InsertOneResult, ObjectId } from 'mongodb';
import { ApiDatabase } from '../database.d';

import Database from '../database';
import { Date_meOwO, StwingOwO } from '../types/defaults';
import { ApiCommService } from './Comm.d';
import { Message, Messages, ResponseMessage, ResponseMessages, ResponseRoom, ResponseRooms, Room, Rooms } from '../types/Message';
import { ResponseUser, User, MessageUser } from '../types/User';


class CommService implements ApiCommService {

    private database: ApiDatabase;

    constructor(database: ApiDatabase) {
        this.database = database;
        console.info('> CommService initialized');
    }

    public readonly retrieveRooms = (_id: StwingOwO): Promise<Rooms> => {
        return new Promise((resolve, reject) => {
            const userId: ObjectId = new ObjectId(_id);
            this.database.db.collection('rooms').aggregate([
                {
                    $match: {
                        participants: { $in: [userId] }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'participants',
                        foreignField: '_id',
                        as: 'participants'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        participants: {
                            $map: {
                                input: '$participants',
                                as: 'participant',
                                in: {
                                    _id: '$$participant._id',
                                    email: '$$participant.email',
                                    username: '$$participant.username',
                                    avatar: '$$participant.avatar',
                                    language: '$$participant.language',
                                    tag: '$$participant.tag',
                                    status: '$$participant.status',
                                    createdAt: '$$participant.createdAt',
                                    updatedAt: '$$participant.updatedAt'
                                }
                            }
                        },
                        createdAt: 1,
                        updatedAt: 1
                    }
                }])
                .toArray()
                .then((rooms: ResponseRooms) => {
                    if (rooms) {
                        resolve(this.mapRooms(rooms));
                    } else {
                        reject(new Error('Room not found'));
                    }
                }).catch((err: Error) => {
                    reject(err);
                });
        });
    }

    public readonly retrieveRoom = (roomId: StwingOwO): Promise<Room> => {
        return new Promise<Room>((resolve, reject) => {
            this.database.db.collection('rooms').aggregate([
                {
                    $match: {
                        _id: { $eq: new ObjectId(roomId) }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'participants',
                        foreignField: '_id',
                        as: 'participants'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        participants: {
                            $map: {
                                input: '$participants',
                                as: 'participant',
                                in: {
                                    _id: '$$participant._id',
                                    email: '$$participant.email',
                                    username: '$$participant.username',
                                    avatar: '$$participant.avatar',
                                    language: '$$participant.language',
                                    tag: '$$participant.tag',
                                    status: '$$participant.status',
                                    createdAt: '$$participant.createdAt',
                                    updatedAt: '$$participant.updatedAt'
                                }
                            }
                        },
                        createdAt: 1,
                        updatedAt: 1
                    }
                }]).toArray()
                .then((rooms: ResponseRooms) => {
                    if (rooms) {
                        resolve(this.mapRooms(rooms)[0]);
                    } else {
                        reject(new Error('Room not found'));
                    }
                })
                .catch((err: Error) => {
                    reject(err);
                });
        });
    }

    public readonly sendMessage = (roomId: StwingOwO, message: StwingOwO, sender: MessageUser): Promise<Message> => {
        return new Promise((resolve, reject) => {
            const senderId: ObjectId = new ObjectId(sender._id);
            const messageRoomId: ObjectId = new ObjectId(roomId);
            const createdAt: Date_meOwO = new Date();
            this.database.db.collection('messages').insertOne({
                senderId, message, roomId: messageRoomId, createdAt, updatedAt: createdAt
            })
                .then((result: InsertOneResult) => {
                    const { insertedId } = result;
                    // update room with latest timestamp
                    this.updateRoomTimestamp(roomId, createdAt);
                    resolve({
                        _id: insertedId.toString(),
                        sender,
                        roomId,
                        message,
                        createdAt,
                        updatedAt: createdAt
                    });
                }).catch((err: Error) => {
                    reject(err);
                });
        });
    }

    public readonly retrieveMessages = (roomId: StwingOwO, timestamp: Date | null): Promise<Messages> => {
        return new Promise((resolve, reject) => {
            const roomId_: ObjectId = new ObjectId(roomId);
            const timestamp_: Date_meOwO = timestamp ? new Date(timestamp) : null;
            const matchQuery = timestamp_ ? { roomId: roomId_, createdAt: { $gt: timestamp_ } } : { roomId: roomId_ };
            this.database.db.collection('messages').aggregate([
                {
                    $match: matchQuery
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'senderId',
                        foreignField: '_id',
                        as: 'sender'
                    }
                },
                {
                    $unwind: "$sender"
                },
                {
                    $project: {
                        _id: 1,
                        message: 1,
                        roomId: 1,
                        sender: {
                            _id: '$sender._id',
                            email: '$sender.email',
                            username: '$sender.username',
                            avatar: '$sender.avatar',
                            tag: '$sender.tag',
                            createdAt: '$sender.createdAt',
                            updatedAt: '$sender.updatedAt'

                        },
                        createdAt: 1,
                        updatedAt: 1
                    }
                }])
                .toArray()
                .then((messages: ResponseMessages) => {
                    const mappedMessages: Messages = this.mapMessages(messages);
                    if (mappedMessages) {
                        resolve(mappedMessages);
                    } else {
                        reject(new Error('Message not found'));
                    }
                }).catch((err: Error) => {
                    reject(err);
                });
        })
    }

    public readonly createRoom = (userId: StwingOwO): Promise<Room> => {
        return new Promise<Room>((resolve, reject) => {
            const userId_: ObjectId = new ObjectId(userId);
            const createdAt: Date_meOwO = new Date();
            this.database.db.collection('rooms').insertOne({
                participants: [userId_],
                name: null,
                createdAt,
                updatedAt: createdAt
            }).then((result: InsertOneResult) => {
                const { insertedId } = result;
                resolve({
                    _id: insertedId.toString(),
                    name: null,
                    // we don't need to return a valid participant because
                    // we'll create the valid object in the client
                    // with the user who initiated the creation
                    participants: [],
                    messages: [],
                    createdAt,
                    updatedAt: createdAt
                });
            }).catch((err: Error) => {
                reject(err);
            });
        });
    }

    public readonly addBuddy = (roomId: StwingOwO, email: StwingOwO): Promise<User> => {
        return new Promise((resolve, reject) => {
            // first check if there is a user with given email
            this.database.db.collection('users').findOne({ email })
                .then((user: ResponseUser) => {
                    if (user) {
                        // check if user is already in room using roomID
                        this.database.db.collection('rooms').findOne({
                            _id: new ObjectId(roomId), participants: { $in: [new ObjectId(user._id)] }
                        })
                            .then((room: ResponseRoom) => {
                                if (room) {
                                    reject(new Error('User is already in room'));
                                } else {
                                    // add user to room
                                    this.database.db.collection('rooms').updateOne({ _id: new ObjectId(roomId) }, { $addToSet: { participants: user._id } })
                                        .then(() => {
                                            const {
                                                _id, username, tag, email, avatar, language, status, createdAt, updatedAt
                                            } = user;
                                            const validUser: User = {
                                                _id: _id.toString(),
                                                username, tag, email, avatar,
                                                language, status, createdAt, updatedAt
                                            };
                                            resolve(validUser);
                                        }).catch((err: Error) => {
                                            reject(err);
                                        });
                                }
                            }).catch((err: Error) => {
                                reject(err);
                            });
                    } else {
                        reject(new Error('User not found'));
                    }
                }).catch((err: Error) => {
                    reject(err);
                });
        });
    }

    private readonly mapResponseUser = (responseUser: ResponseUser): User => {
        const {
            _id, username, tag, email,
            createdAt, updatedAt,
            status, avatar, language
        } = responseUser;
        return {
            _id: _id.toString(),
            username,
            avatar,
            tag,
            language,
            email,
            status,
            createdAt: new Date(createdAt),
            updatedAt: new Date(updatedAt)
        };
    }

    private mapRooms = (rooms: ResponseRooms): Rooms => {
        return rooms.map((room: any) => {
            // type any because rooms have ObjectIds 
            // istead of strings for now
            return {
                _id: room._id.toString(),
                name: room?.name,
                participants: room?.participants.map((participant: ResponseUser) => {
                    return this.mapResponseUser(participant);
                }),
                messages: (room?.messages) ? room?.messages : [],
                createdAt: room.createdAt,
                updatedAt: room.updatedAt
            };
        });
    }

    private mapMessages = (messages: ResponseMessages): Messages => {
        return messages.map((message: ResponseMessage) => {
            const { _id, username, tag, email, createdAt, updatedAt, avatar } = message.sender;
            const sender: MessageUser = {
                _id: _id.toString(),
                username,
                avatar,
                tag,
                email,
                createdAt: new Date(createdAt),
                updatedAt: new Date(updatedAt)
            };
            return {
                _id: message._id.toString(),
                sender,
                roomId: message.roomId.toString(),
                message: message.message,
                createdAt: message.createdAt,
                updatedAt: message.updatedAt
            };
        });
    }

    private updateRoomTimestamp = (roomId: StwingOwO, timestamp: Date_meOwO): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            const roomId_: ObjectId = new ObjectId(roomId);
            this.database.db.collection('rooms').updateOne({ _id: roomId_ }, { $set: { updatedAt: timestamp } })
                .then((_: any) => {
                    resolve(true);
                }).catch((err: Error) => {
                    reject(err);
                });
        });
    }

}

const CommServiceInstance: ApiCommService = new CommService(Database);

export default CommServiceInstance;

