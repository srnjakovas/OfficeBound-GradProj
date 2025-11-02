// Role constants matching the backend enum
export enum Role {
    User = 0,
    Administrator = 1,
    Manager = 2,
    BranchManager = 3
}

// Permission checks
export const hasPermission = (userRole: number, requiredRoles: Role[]): boolean => {
    return requiredRoles.includes(userRole as Role);
};

// Check if user can view all requests
export const canViewAllRequests = (userRole: number): boolean => {
    return userRole === Role.Administrator;
};

// Check if user can view department requests
export const canViewDepartmentRequests = (userRole: number): boolean => {
    return userRole === Role.Manager || userRole === Role.BranchManager || userRole === Role.Administrator;
};

// Check if user can approve requests
export const canApproveRequests = (userRole: number): boolean => {
    return userRole === Role.Manager || userRole === Role.BranchManager || userRole === Role.Administrator;
};

// Check if user can approve accounts
export const canApproveAccounts = (userRole: number): boolean => {
    return userRole === Role.BranchManager || userRole === Role.Administrator;
};

// Check if user can manage departments
export const canManageDepartments = (userRole: number): boolean => {
    return userRole === Role.Administrator;
};

// Check if user can view all users
export const canViewAllUsers = (userRole: number): boolean => {
    return userRole === Role.Administrator;
};

// Get role name as string
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

