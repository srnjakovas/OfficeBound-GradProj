import {createBrowserRouter, type RouteObject} from "react-router-dom";
import App from "../App.tsx";
import RequestsForm from "../components/requests/RequestsForm.tsx";
import RequestsTable from "../components/requests/RequestsTable.tsx";

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App/>,
        children: [
            { path: 'createRequest', element: <RequestsForm key='create' /> },
            { path: 'editRequest/:id', element: <RequestsForm key='update' /> },
            { path: '*', element: <RequestsTable /> },
        ]
    }
]

export const router = createBrowserRouter(routes);