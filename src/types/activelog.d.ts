export type LogDescriptionType = {
    id: number;
    action: string;
    description: {
        title: string;
        content: string;
        createdAt: Date;
    }
}

export interface PageInfoType {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
}

export interface LogResponseType {
    status: string;
    message: string;
    timestamp: string;
    data: {
        content: LogDescriptionType[];
        page: PageInfoType;
    };
}