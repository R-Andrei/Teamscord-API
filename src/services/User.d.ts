import { Date_meOwO, StwingOwO } from "../types/defaults";
import { 
    LoginUserProps, 
    ProfileUpdateProps, 
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

export interface ApiUserService {
    getUser(userProps: ApiUserProps): Promise<User>;
    login(userProps: LoginUserProps): Promise<UserWithPassword>;
    getUsers(): Promise<User[]>;
    createUser(userProps: RegisterUserProps): Promise<UserWithPassword>;
    updateUser(userProps: ApiUserProps): void;
    updateProfile(profileData: ProfileUpdateProps): Promise<boolean>
    deleteUser(userProps: ApiUserProps): void;
}