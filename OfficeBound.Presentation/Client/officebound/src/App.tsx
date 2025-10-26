import './App.css'
import RequestsTable from "./components/requests/RequestsTable.tsx";
import {Outlet, useLocation} from "react-router-dom";
import {Container} from "semantic-ui-react";
import Header from "./components/header/Header.tsx";
import {useEffect} from "react";
import {setupErrorHandlingInterceptor} from "./interceptors/axiosInterceptor.ts";

function App() {
    const location = useLocation();
    
    useEffect(() => {
        setupErrorHandlingInterceptor();
    }, [])
    
  return (
    <>
        <Header />
        {location.pathname === '/' ? <RequestsTable /> : (
            <Container className="container-style">
                <Outlet />
            </Container>
        )}
    </>
  )
}

export default App
