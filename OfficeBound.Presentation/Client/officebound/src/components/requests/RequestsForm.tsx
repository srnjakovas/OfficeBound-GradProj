import {NavLink, useNavigate, useParams} from "react-router-dom";
import type {RequestDto} from "../../models/requestDto.ts";
import {useEffect, useState} from "react";
import apiConnector from "../../api/apiConnector.ts";
import {
  Button,
  TextField,
  Paper,
  Typography,
  Box,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";

import { 
  ArrowBack as ArrowBackIcon,
  Description as DescriptionIcon,
  Category as CategoryIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from "@mui/icons-material";

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

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!request.id) {
            apiConnector.createRequest(request).then(() => navigate('/'));
        }
        else {
            apiConnector.editRequest(request).then(() => navigate('/'));
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRequest((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e: any) => {
        const { value } = e.target;
        setRequest((prev) => ({ ...prev, requestType: value }));
    };

    return (
        <Container maxWidth="md" sx={{ py: 3 }}>
            <Box sx={{ mb: 3 }}>
                <Button
                    component={NavLink}
                    to="/"
                    startIcon={<ArrowBackIcon />}
                    sx={{ mb: 2 }}
                >
                    Back to Requests
                </Button>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {id ? <EditIcon sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} /> : <AddIcon sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />}
                    <Typography variant="h4" component="h1">
                        {id ? 'Edit Request' : 'Create New Request'}
                    </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary">
                    {id ? 'Update the request details below' : 'Fill in the details to create a new office request'}
                </Typography>
            </Box>

            <Paper elevation={2} sx={{ p: 3 }}>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            multiline
                            rows={4}
                            value={request.description}
                            onChange={handleInputChange}
                            placeholder="Describe your request..."
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <DescriptionIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <FormControl sx={{ minWidth: 200, flex: 1 }}>
                                <InputLabel>Request Type</InputLabel>
                                <Select
                                    value={request.requestType}
                                    onChange={handleSelectChange}
                                    label="Request Type"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <CategoryIcon color="action" />
                                        </InputAdornment>
                                    }
                                >
                                    <MenuItem value={0}>General</MenuItem>
                                    <MenuItem value={1}>IT Support</MenuItem>
                                    <MenuItem value={2}>Facilities</MenuItem>
                                    <MenuItem value={3}>HR</MenuItem>
                                    <MenuItem value={4}>Other</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                            <Button
                                component={NavLink}
                                to="/"
                                variant="outlined"
                                size="large"
                                startIcon={<CancelIcon />}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                startIcon={id ? <SaveIcon /> : <AddIcon />}
                            >
                                {id ? 'Update Request' : 'Create Request'}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Container>
    )
}