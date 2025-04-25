export type UsersListType = {
    id?: number;
    username: string;
    name: string;
    phone: string;
    mail: string;
    createAt: string;
    roleType: string;
    page?: UsersListPage[],
}

export type UsersListPage = {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
}