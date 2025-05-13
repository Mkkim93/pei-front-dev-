import axiosAuth from '@/plugins/axiosAuth';
import { ScheduleListType, ScheduleUpdateDTO, ScheduleCreateDTO, SchduleResponseDTO } from '@/types/schedule.d';
import { ApiResponse } from '@/types/api';

export async function fetchScheduleList() :Promise <ApiResponse<ScheduleListType[]>>{
    const response = await axiosAuth.get<ApiResponse<ScheduleListType[]>>('/api/schedule');
    return response.data;
}

export async function deleteSchedule(id :number) {
    const response = await axiosAuth.delete(`/api/schedule/${id}`);
    return response.data;
}

export async function updateSchedule(obj :ScheduleUpdateDTO) {
    const response = await axiosAuth.patch(`/api/schedule`, obj);
    return response.data;
}

export async function createSchedule(obj :ScheduleCreateDTO) :Promise<ApiResponse<SchduleResponseDTO>>{
    const response = await axiosAuth.post<ApiResponse<SchduleResponseDTO>>(`/api/schedule`, obj);
    return response.data;
}

