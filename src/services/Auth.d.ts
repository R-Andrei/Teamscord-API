import { StwingOwO } from '../types/defaults';
import { User, UserWithPassword } from '../types/User';

export interface ApiAuthService {
    generateToken(user: User): Promise<string>;
    validateToken(authorizationHeader: StwingOwO): Promise<UserWithPassword>;
    removeToken(user: StwingOwO, authorizationHeader: StwingOwO): Promise<void>;
}