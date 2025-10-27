import type { RequestDto } from "../../models/requestDto";
import {Button} from "semantic-ui-react";
import apiConnector from "../../api/apiConnector.ts";
import {NavLink} from "react-router-dom";

interface Props {
    request: RequestDto;
}

export default function RequestsTableItem ({request}: Props) {
    return (
        <>
            <tr className="center aligned">
                <td data-label="Id">{request.id}</td>
                <td data-label="Description">{request.description}</td>
                <td data-label="RequestType">{request.requestType}</td>
                <td data-label="createdDate">{request.createdDate}</td>
                <td data-label="Action">
                    <Button as={NavLink} to={`editRequest/${request.id}`} color="yellow" type="submit">Edit</Button>
                    <Button type="button" negative onClick={async() => {
                        await apiConnector.deleteRequest(request.id!)
                        window.location.reload();
                    }}>
                        Delete
                    </Button>
                </td>
            </tr>
        </>
    )
}