import { Router } from 'express';
import { RegisterUserProps, UserWithPassword } from '../types/User';
import UserService from '../services/User';
import AuthService from '../services/Auth';
import { StwingOwO } from '../types/defaults';
import _ from 'lodash';

const router = Router();


router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // validate login from UserService
    UserService.login({ email, password }).then((user: UserWithPassword) => {
        // if user is valid then generate token using AuthService
        AuthService.generateToken(user).then((token: StwingOwO) => {
            res.status(200).send({
                ..._.omit(user, 'password'),
                token
            });
        }).catch((err: Error) => {
            res.status(500).json({ error: err.message });
        });
    }).catch((err: Error) => {
        res.status(400).json({ error: err.message });
    });
});


router.get('/retrieve', (req, res) => {
    const header = req.headers.authorization;
    AuthService.validateToken(header).then((user: UserWithPassword) => {
        res.status(200).send(_.omit(user, 'password'));
    }).catch((_err: Error) => {
        res.status(401).json({ error: 'Unauthorized.' });
    });
});


router.post('/logout', (req, res) => {
    const { _id } = req.body;
    const authorizationHeader = req.headers.authorization;
    AuthService.removeToken(_id, authorizationHeader).then(() => {
        res.status(200).send({ message: 'logged out' });
    }).catch((err: Error) => {
        res.status(500).json({ error: err.message });
    });
});

router.post('/register', (req, res) => {
    const {
        email,
        username,
        password,
        confirm_password,
    } = req.body;

    const registerUser: RegisterUserProps = {
        email,
        username,
        password,
        confirmPassword: confirm_password,
    }

    // first try to register user
    UserService.createUser(registerUser)
        .then((user: UserWithPassword) => {
            // if user register is valid then generate token using AuthService
            AuthService.generateToken(user).then((token: StwingOwO) => {
                res.status(200).send({
                    ..._.omit(user, 'password'),
                    token
                });
            }).catch((err: Error) => {
                res.status(500).json({ error: err.message });
            });
        })
        .catch((err: Error) => {
            res.status(500).json({ error: err.message });
        });
});

router.post('/profile/update', (req, res) => {
    const {
        avatar,
        language,
    } = req.body;

    // check if avatar or language exists
    if (!avatar && !language) {
        res.status(400).json({ error: 'Avatar or Language is required' });
        return;
    } else {
        // update user profile
        UserService.updateProfile(req.body)
            .then((_: boolean) => {
                res.status(200).send({ message: 'profile updated' });
            }).catch((err: Error) => {
                res.status(500).json({ error: err.message });
            });
    }
});

router.post('/profile/update-status', (req, res) => {
    const {
        userId,
        status,
    } = req.body;

    // check if avatar or language exists
    if (!userId || !status) {
        res.status(400).json({ error: 'Insufficient data.' });
        return;
    } else {
        // update user profile
        UserService.updateStatus(userId, status)
            .then((_: boolean) => {
                res.status(200).send({ message: 'Status updated.' });
            }).catch((err: Error) => {
                res.status(500).json({ error: err.message });
            });
    }
});

export default router;