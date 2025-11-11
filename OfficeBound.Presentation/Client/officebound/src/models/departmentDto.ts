export interface DepartmentDto {
    id: number | undefined,
    departmentName: string,
    managerId: number | null | undefined,
    managerName: string | null | undefined,
    numberOfPeople: number,
    createdDate: string | undefined,
}

