import type {RequestDto} from "../models/requestDto.ts";
import type {GetRequestsResponse} from "../models/getRequestsResponse.ts";
import axios, {type AxiosResponse} from "axios";
import {API_BASE_URL} from "../../config.ts";
import type {GetRequestByIdResponse} from "../models/getRequestByIdResponse.ts";
import type {DepartmentDto} from "../models/departmentDto.ts";
import type {GetDepartmentsResponse} from "../models/getDepartmentsResponse.ts";
import type {GetDepartmentByIdResponse} from "../models/getDepartmentByIdResponse.ts";
import type {UserAccountRequestDto} from "../models/userAccountRequestDto.ts";
import type {LoginResponse} from "../models/loginResponse.ts";
import type {SignUpResponse} from "../models/signUpResponse.ts";
import type {GetUserAccountRequestsResponse} from "../models/getUserAccountRequestsResponse.ts";
import type {UserDto} from "../models/userDto.ts";
import type {GetUsersResponse} from "../models/getUsersResponse.ts";
import type {GetOfficeResourcesResponse} from "../models/getOfficeResourcesResponse.ts";

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
    
    createRequest: async (request: RequestDto, userId?: number): Promise<void> => {
        const payload = {
            description: request.description,
            requestType: request.requestType,
            requestDate: request.requestDate ? new Date(request.requestDate).toISOString() : null,
            departmentId: request.departmentId || null,
            userId: userId || null
        };
        await axios.post<number>(`${API_BASE_URL}/requests`, payload);
    },
    
    editRequest: async (request: RequestDto, userId?: number): Promise<void> => {
        const payload = {
            description: request.description,
            requestType: request.requestType,
            requestDate: request.requestDate ? new Date(request.requestDate).toISOString() : null,
            departmentId: request.departmentId || null,
            userId: userId || null
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
            managerId: department.managerId || null,
            numberOfPeople: department.numberOfPeople
        };
        await axios.post<number>(`${API_BASE_URL}/departments`, payload);
    },
    
    editDepartment: async (department: DepartmentDto, userId?: number): Promise<void> => {
        const payload = {
            departmentName: department.departmentName,
            managerId: department.managerId || null,
            numberOfPeople: department.numberOfPeople,
            userId: userId || null
        };
        await axios.put<number>(`${API_BASE_URL}/departments/${department.id}`, payload);
    },
    
    getUsers: async (): Promise<UserDto[]> => {
        const response = await axios.get<GetUsersResponse>(`${API_BASE_URL}/Auth/Users`);
        return response.data.usersDtos;
    },
    
    deleteDepartment: async (departmentId: number): Promise<void> => {
        await axios.delete<number>(`${API_BASE_URL}/departments/${departmentId}`);
    },
    
    signUp: async (username: string, password: string, confirmPassword: string): Promise<SignUpResponse> => {
        const response = await axios.post<SignUpResponse>(`${API_BASE_URL}/Auth/SignUp`, {
            username,
            password,
            confirmPassword
        });
        return response.data;
    },
    
    login: async (username: string, password: string): Promise<LoginResponse> => {
        const response = await axios.post<LoginResponse>(`${API_BASE_URL}/Auth/Login`, {
            username,
            password
        });
        return response.data;
    },
    
    getUserAccountRequests: async (): Promise<UserAccountRequestDto[]> => {
        const response = await axios.get<GetUserAccountRequestsResponse>(`${API_BASE_URL}/Admin/AccountRequests`);
        return response.data.userAccountRequests;
    },
    
    reviewAccount: async (userId: number, isApproved: boolean, position: string | null, departmentId: number | null, setAsBranchManager: boolean = false): Promise<void> => {
        await axios.post(`${API_BASE_URL}/Admin/ReviewAccount`, {
            userId,
            isApproved,
            position,
            departmentId,
            setAsBranchManager
        });
    },
    
    approveRequest: async (requestId: number): Promise<void> => {
        await axios.post(`${API_BASE_URL}/Requests/${requestId}/Approve`);
    },
    
    rejectRequest: async (requestId: number, rejectionReason: string): Promise<void> => {
        await axios.post(`${API_BASE_URL}/Requests/${requestId}/Reject`, {
            rejectionReason
        });
    },

    cancelRequest: async (requestId: number, cancellationReason: string, userId?: number): Promise<void> => {
        await axios.post(`${API_BASE_URL}/Requests/${requestId}/Cancel`, {
            cancellationReason,
            userId: userId || null
        });
    },
    
    getOfficeResources: async (): Promise<GetOfficeResourcesResponse> => {
        const response = await axios.get<GetOfficeResourcesResponse>(`${API_BASE_URL}/Requests/OfficeResources`);
        return response.data;
    },

    deleteUser: async (userId: number, rejectionReason: string): Promise<void> => {
        await axios.delete(`${API_BASE_URL}/Admin/Users/${userId}`, {
            data: { rejectionReason }
        });
    },

    hasBranchManager: async (): Promise<boolean> => {
        const response = await axios.get<boolean>(`${API_BASE_URL}/Admin/HasBranchManager`);
        return response.data;
    }
}

export default apiConnector;