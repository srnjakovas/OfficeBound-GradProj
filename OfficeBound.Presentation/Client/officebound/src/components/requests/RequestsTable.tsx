import {useEffect, useState} from "react";
import type {RequestDto} from "../../models/requestDto.ts";
import apiConnector from "../../api/apiConnector.ts";
import {Button, Container} from "semantic-ui-react";
import RequestsTableItem from "./RequestsTableItem.tsx";
import {NavLink} from "react-router-dom";

export default function RequestsTable () {
    
    const [requests, setRequests] = useState<RequestDto[]>([]);
    
    useEffect(() => {
        const fetchData = async () => {
            const fetchedRequests = await apiConnector.getRequests();
            setRequests(fetchedRequests);
        }
        
        fetchData();
    }, [])
    return (
        <>
            <Container className="container-style">
                <table className="ui inverted table">
                    <thead style={{ textAlign: 'center' }}>
                        <tr>
                            <th>Id</th>
                            <th>Description</th>
                            <th>Request Type</th>
                            <th>Created Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {requests.length !== 0 && (
                        requests.map((request, index) => (
                            <RequestsTableItem key = {index} request={request} />
                        ))
                    )}
                    </tbody>
                </table>
                <Button as={NavLink} to="createRequest" floated="right" type="button" content="Create new Request" positive />
            </Container>
        </>
    )
}