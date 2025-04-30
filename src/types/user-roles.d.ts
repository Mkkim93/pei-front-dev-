export type UsersListType = {
    id?: number;
    username: string;
    name: string;
    phone: string;
    mail: string;
    createAt: string;
    roleType: string;
    hospitalName: string; // 소속 추가
    page?: UsersListPage[],
}

export type UsersListPage = {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
}