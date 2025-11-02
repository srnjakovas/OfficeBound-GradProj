export interface RequestDto {
    id: number | undefined,
    description: string,
    requestType: number,
    createdDate: string | undefined,
    requestDate: string | undefined,
    requestStatus: number,
    rejectionReason: string | null | undefined,
    departmentId: number | null | undefined,
    departmentName: string | null | undefined,
}