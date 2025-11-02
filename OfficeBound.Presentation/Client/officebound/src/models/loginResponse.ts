import type {UserDto} from "./userDto.ts";

export interface LoginResponse {
    user: UserDto;
    token: string;
}

