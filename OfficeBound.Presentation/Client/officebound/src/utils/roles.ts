export enum Role {
    User = 0,
    Administrator = 1,
    Manager = 2,
    BranchManager = 3
}

export const hasPermission = (userRole: number, requiredRoles: Role[]): boolean => {
    return requiredRoles.includes(userRole as Role);
};

export const canViewAllRequests = (userRole: number): boolean => {
    return userRole === Role.Administrator;
};

export const canViewDepartmentRequests = (userRole: number): boolean => {
    return userRole === Role.Manager || userRole === Role.BranchManager || userRole === Role.Administrator;
};

export const canApproveRequests = (userRole: number): boolean => {
    return userRole === Role.Manager || userRole === Role.BranchManager || userRole === Role.Administrator;
};

export const canApproveAccounts = (userRole: number): boolean => {
    return userRole === Role.BranchManager || userRole === Role.Administrator;
};

export const canManageDepartments = (userRole: number): boolean => {
    return userRole === Role.Administrator;
};

export const canViewAllUsers = (userRole: number): boolean => {
    return userRole === Role.Administrator;
};

export const getRoleName = (role: number): string => {
    switch (role) {
        case Role.User:
            return 'User';
        case Role.Administrator:
            return 'Administrator';
        case Role.Manager:
            return 'Manager';
        case Role.BranchManager:
            return 'Branch Manager';
        default:
            return 'Unknown';
    }
};

