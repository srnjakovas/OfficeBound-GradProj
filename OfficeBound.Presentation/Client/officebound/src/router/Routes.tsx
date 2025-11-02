import {createBrowserRouter, type RouteObject} from "react-router-dom";
import App from "../App.tsx";
import RequestsForm from "../components/requests/RequestsForm.tsx";
import RequestsTable from "../components/requests/RequestsTable.tsx";
import DepartmentsTable from "../components/departments/DepartmentsTable.tsx";
import DepartmentsForm from "../components/departments/DepartmentsForm.tsx";

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App/>,
        children: [
            { index: true, element: <RequestsTable /> },
            { path: 'createRequest', element: <RequestsForm key='create' /> },
            { path: 'editRequest/:id', element: <RequestsForm key='update' /> },
            { path: 'departments', element: <DepartmentsTable /> },
            { path: 'createDepartment', element: <DepartmentsForm key='create' /> },
            { path: 'editDepartment/:id', element: <DepartmentsForm key='update' /> },
        ]
    }
]

export const router = createBrowserRouter(routes);