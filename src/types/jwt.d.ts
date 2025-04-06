import { jwtDecode, JwtPayload } from "jwt-decode";
import dayjs from "dayjs";

interface JwtPayload {
    category: string;
    id: number;
    username: string;
    roles: string;
    exp: number;
}

function decodePayload(token :any) :Promise<JwtPayload>{
    return jwtDecode<JwtPayload>(token);
}

export { decodePayload }