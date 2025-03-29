import axiosAuth from '@/plugins/axiosAuth';
import type { LogResponseType } from '@/types/activelog.d';

export async function fetchLogActive(

    x: number | undefined,
    y: number | undefined,

): Promise<LogResponseType> {
    const response = await axiosAuth.get("/api/log", {
        params: {
            page: x,
            size: y,
        },
    });
    return response.data;
} 
    


