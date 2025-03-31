export type RegisterType = {
    username : string;
    password : string;
    name : string;
    phone : string;
    mail : string;
}

export interface ApiResponse {
    status: number;
    message: string;
    timestamp: Date;
    data: string | any;
}

export interface PasswordApiResponse {
    status: number;
    message: string;
    timestamp: string;
    data: PasswordStranghType;
}

export type PasswordStranghType = {
    description: string;
    grade: number;
    strongPassword: boolean;
}