export interface ScheduleListType {
    id: number;
    title: string;
    description: string;
    startTime: string | Date;
    endTime: string | Date;
    status: string;
    writer: string;
}

export interface ScheduleUpdateDTO {
    id: number;
    title: string;
    description: string;
    updatedAt: string | Date;
    startTime: string | Date;
    endTime: string | Date;
    isDeleted: boolean | undefined;
}