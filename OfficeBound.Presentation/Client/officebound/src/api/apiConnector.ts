import type {RequestDto} from "../models/requestDto.ts";
import type {GetRequestsResponse} from "../models/getRequestsResponse.ts";
import axios, {type AxiosResponse} from "axios";
import {API_BASE_URL} from "../../config.ts";
import type {GetRequestByIdResponse} from "../models/getRequestByIdResponse.ts";
import type {DepartmentDto} from "../models/departmentDto.ts";
import type {GetDepartmentsResponse} from "../models/getDepartmentsResponse.ts";
import type {GetDepartmentByIdResponse} from "../models/getDepartmentByIdResponse.ts";
import type {UserDto} from "../models/userDto.ts";
import type {UserAccountRequestDto} from "../models/userAccountRequestDto.ts";
import type {LoginResponse} from "../models/loginResponse.ts";
import type {SignUpResponse} from "../models/signUpResponse.ts";
import type {GetUserAccountRequestsResponse} from "../models/getUserAccountRequestsResponse.ts";

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
        const payload = {
            description: request.description,
            requestType: request.requestType,
            requestDate: request.requestDate ? new Date(request.requestDate).toISOString() : null,
            departmentId: request.departmentId || null
        };
        await axios.post<number>(`${API_BASE_URL}/requests`, payload);
    },
    
    editRequest: async (request: RequestDto): Promise<void> => {
        const payload = {
            description: request.description,
            requestType: request.requestType,
            requestDate: request.requestDate ? new Date(request.requestDate).toISOString() : null,
            departmentId: request.departmentId || null
        };
        await axios.put<number>(`${API_BASE_URL}/requests/${request.id}`, payload);
    },
    
    deleteRequest: async (requestId: number): Promise<void> => {
        await axios.delete<number>(`${API_BASE_URL}/requests/${requestId}`);
    },
    
    getRequestById: async(requestId: string) : Promise<RequestDto | undefined> => {
        const response = await axios.get<GetRequestByIdResponse>(`${API_BASE_URL}/requests/${requestId}`);
        return response.data.requestDto;
    },
    
    getDepartments: async (): Promise<DepartmentDto[]> => {
        const response: AxiosResponse<GetDepartmentsResponse> =
            await axios.get(`${API_BASE_URL}/departments`);
        return response.data.departmentsDtos;
    },
    
    getDepartmentById: async(departmentId: string) : Promise<DepartmentDto | undefined> => {
        const response = await axios.get<GetDepartmentByIdResponse>(`${API_BASE_URL}/departments/${departmentId}`);
        return response.data.departmentDto;
    },
    
    createDepartment: async (department: DepartmentDto): Promise<void> => {
        const payload = {
            departmentName: department.departmentName,
            manager: department.manager,
            numberOfPeople: department.numberOfPeople
        };
        await axios.post<number>(`${API_BASE_URL}/departments`, payload);
    },
    
    editDepartment: async (department: DepartmentDto): Promise<void> => {
        const payload = {
            departmentName: department.departmentName,
            manager: department.manager,
            numberOfPeople: department.numberOfPeople
        };
        await axios.put<number>(`${API_BASE_URL}/departments/${department.id}`, payload);
    },
    
    deleteDepartment: async (departmentId: number): Promise<void> => {
        await axios.delete<number>(`${API_BASE_URL}/departments/${departmentId}`);
    },
    
    // Auth endpoints
    signUp: async (username: string, password: string, confirmPassword: string): Promise<SignUpResponse> => {
        const response = await axios.post<SignUpResponse>(`${API_BASE_URL}/auth/signup`, {
            username,
            password,
            confirmPassword
        });
        return response.data;
    },
    
    login: async (username: string, password: string): Promise<LoginResponse> => {
        const response = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/login`, {
            username,
            password
        });
        return response.data;
    },
    
    // Admin endpoints
    getUserAccountRequests: async (): Promise<UserAccountRequestDto[]> => {
        const response = await axios.get<GetUserAccountRequestsResponse>(`${API_BASE_URL}/admin/account-requests`);
        return response.data.userAccountRequests;
    },
    
    reviewAccount: async (userId: number, isApproved: boolean, position: string | null, departmentId: number | null): Promise<void> => {
        await axios.post(`${API_BASE_URL}/admin/review-account`, {
            userId,
            isApproved,
            position,
            departmentId
        });
    },
    
    // Request approval endpoints
    approveRequest: async (requestId: number): Promise<void> => {
        await axios.post(`${API_BASE_URL}/requests/${requestId}/approve`);
    },
    
    rejectRequest: async (requestId: number, rejectionReason: string): Promise<void> => {
        await axios.post(`${API_BASE_URL}/requests/${requestId}/reject`, {
            rejectionReason
        });
    }
}

export default apiConnector;