export interface UserDto {
    id: number;
    username: string;
    position: string | null;
    departmentId: number | null;
    departmentName: string | null;
    role: number;
    isApproved: boolean;
    createdDate: string;
}

