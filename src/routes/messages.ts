import { Router } from 'express';
import { Message, Messages } from '../types/Message';
import CommService from '../services/Comm';


const router = Router();

// define the home page route
router.post('/rooms/retrieve', (req, res) => {
    CommService.retrieveRooms(req.body._id).then((rooms: any) => {
        const response = {
            data: rooms
        }
        res.status(200).send(response);
    }).catch((err: Error) => {
        res.status(500).json({ error: err.message });
    });
});

router.post('/message/retrieve', (req, res) => {
    const { roomId, lastTimestamp } = req.body;
    console.log(roomId, lastTimestamp);
    CommService.retrieveMessages(roomId, lastTimestamp).then((messages: Messages) => {
        const response = {
            data: messages
        }
        res.status(200).send(response);
    }).catch((err: Error) => {
        res.status(500).json({ error: err.message });
    });
})

router.post('/message/send', (req, res) => {
    const { roomId, message, sender } = req.body;
    CommService.sendMessage(roomId, message, sender).then((result: Message) => {
        res.status(200).send(result);
    }).catch((err: Error) => {
        res.status(500).json({ error: err.message });
    });
});
export default router;