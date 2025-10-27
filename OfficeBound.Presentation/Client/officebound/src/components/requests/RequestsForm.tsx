import {NavLink, useNavigate, useParams} from "react-router-dom";
import type {RequestDto} from "../../models/requestDto.ts";
import {useEffect, useState} from "react";
import apiConnector from "../../api/apiConnector.ts";
import {Button, Form, Segment} from "semantic-ui-react";

export default function RequestsForm () {
    const {id} = useParams();
    const navigate = useNavigate();

    const [request, setRequest] = useState<RequestDto>({
        id: undefined,
        description: '',
        requestType: 0,
        createdDate: undefined,
    });

    useEffect(() => {
        if (id) {
            apiConnector.getRequestById(id).then(request => setRequest(request!))
        }
    }, [id]);

    function handleSubmit() {
        if (!request.id) {
            apiConnector.createRequest(request).then(() => navigate('/'));
        }
        else {
            apiConnector.editRequest(request).then(() => navigate('/'));
        }
    }

    const handleInputChange = (_e: any, data: any) => {
        const { name, value } = data;
        setRequest((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <>
            <Segment clearing inverted>
                <Form onSubmit={handleSubmit} autoComplete="off" className="ui inverted form">
                    <Form.TextArea
                        placeholder='Description'
                        name='description'
                        value={request.description}
                        onChange={handleInputChange} />
                    <Form.Input
                        placeholder='Request Type'
                        name='requestType'
                        type='number'
                        inputMode='numeric'
                        value={request.requestType}
                        onChange={handleInputChange} />
                    <Button
                        floated="right"
                        positive
                        type="submit"
                        content="Submit" />
                    <Button
                        as={NavLink}
                        to='/'
                        floated="right"
                        type="button" 
                        content="Cancel" />
                </Form>
            </Segment>
        </>
    )
}