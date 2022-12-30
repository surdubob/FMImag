import { UserRole } from "../helper/user.roles";

export interface UserLogin {
    id: number;
    username: string;
    password: string;
    token?: string;
    roleId: UserRole;
}
