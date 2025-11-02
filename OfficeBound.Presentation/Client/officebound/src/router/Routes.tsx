import {createBrowserRouter, type RouteObject} from "react-router-dom";
import App from "../App.tsx";
import RequestsForm from "../components/requests/RequestsForm.tsx";
import RequestsTable from "../components/requests/RequestsTable.tsx";
import DepartmentsTable from "../components/departments/DepartmentsTable.tsx";
import DepartmentsForm from "../components/departments/DepartmentsForm.tsx";
import LoginForm from "../components/auth/LoginForm.tsx";
import SignUpForm from "../components/auth/SignUpForm.tsx";
import AccountApproval from "../components/admin/AccountApproval.tsx";
import ProtectedRoute from "../components/auth/ProtectedRoute.tsx";
import { Role } from "../utils/roles";

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App/>,
        children: [
            { 
                index: true, 
                element: (
                    <ProtectedRoute>
                        <RequestsTable />
                    </ProtectedRoute>
                ) 
            },
            { 
                path: 'createRequest', 
                element: (
                    <ProtectedRoute>
                        <RequestsForm key='create' />
                    </ProtectedRoute>
                ) 
            },
            { 
                path: 'editRequest/:id', 
                element: (
                    <ProtectedRoute>
                        <RequestsForm key='update' />
                    </ProtectedRoute>
                ) 
            },
            { 
                path: 'departments', 
                element: (
                    <ProtectedRoute requiredRoles={[Role.Administrator]}>
                        <DepartmentsTable />
                    </ProtectedRoute>
                ) 
            },
            { 
                path: 'createDepartment', 
                element: (
                    <ProtectedRoute requiredRoles={[Role.Administrator]}>
                        <DepartmentsForm key='create' />
                    </ProtectedRoute>
                ) 
            },
            { 
                path: 'editDepartment/:id', 
                element: (
                    <ProtectedRoute requiredRoles={[Role.Administrator]}>
                        <DepartmentsForm key='update' />
                    </ProtectedRoute>
                ) 
            },
            { 
                path: 'account-approvals', 
                element: (
                    <ProtectedRoute requiredRoles={[Role.BranchManager, Role.Administrator]}>
                        <AccountApproval />
                    </ProtectedRoute>
                ) 
            },
            { path: 'login', element: <LoginForm /> },
            { path: 'signup', element: <SignUpForm /> },
        ]
    }
]

export const router = createBrowserRouter(routes);