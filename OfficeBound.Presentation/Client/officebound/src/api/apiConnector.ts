import type {RequestDto} from "../models/requestDto.ts";
import type {GetRequestsResponse} from "../models/getRequestsResponse.ts";
import axios, {type AxiosResponse} from "axios";
import {API_BASE_URL} from "../../config.ts";
import type {GetRequestByIdResponse} from "../models/getRequestByIdResponse.ts";

const apiConnector = {
    
    getRequests: async (): Promise<RequestDto[]> => {
        const response: AxiosResponse<GetRequestsResponse> =
            await axios.get(`${API_BASE_URL}/requests`);
        return response.data.requestsDtos.map((request) =>
            ({
                ...request,
                createdDate: request.createdDate?.slice(0, 10) ?? "",
            }));
    },
    
    createRequest: async (request: RequestDto): Promise<void> => {
        await axios.post<number>(`${API_BASE_URL}/requests`, request);
    },
    
    editRequest: async (request: RequestDto): Promise<void> => {
        await axios.put<number>(`${API_BASE_URL}/requests/${request.id}`, request);
    },
    
    deleteRequest: async (requestId: number): Promise<void> => {
        await axios.delete<number>(`${API_BASE_URL}/requests/${requestId}`);
    },
    
    getRequestById: async(requestId: string) : Promise<RequestDto | undefined> => {
        const response = await axios.get<GetRequestByIdResponse>(`${API_BASE_URL}/requests/${requestId}`);
        return response.data.requestDto;
    }
}

export default apiConnector;