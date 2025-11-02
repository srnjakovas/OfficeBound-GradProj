import {NavLink, useNavigate, useParams} from "react-router-dom";
import type {DepartmentDto} from "../../models/departmentDto.ts";
import {useEffect, useState} from "react";
import apiConnector from "../../api/apiConnector.ts";
import {
  Button,
  TextField,
  Paper,
  Typography,
  Box,
  Container,
  InputAdornment,
} from "@mui/material";
import { 
  ArrowBack as ArrowBackIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from "@mui/icons-material";

export default function DepartmentsForm () {
    const {id} = useParams();
    const navigate = useNavigate();

    const [department, setDepartment] = useState<DepartmentDto>({
        id: undefined,
        departmentName: '',
        manager: '',
        numberOfPeople: 0,
        createdDate: undefined,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (id) {
            apiConnector.getDepartmentById(id).then(dept => {
                if (dept) {
                    setDepartment(dept);
                }
            });
        }
    }, [id]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        
        const newErrors: Record<string, string> = {};
        
        if (!department.departmentName.trim()) {
            newErrors.departmentName = 'Department Name is required';
        }
        
        if (!department.manager.trim()) {
            newErrors.manager = 'Manager is required';
        }
        
        if (department.numberOfPeople <= 0) {
            newErrors.numberOfPeople = 'Number of People must be greater than 0';
        }
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        setErrors({});
        
        if (!department.id) {
            apiConnector.createDepartment(department).then(() => navigate('/departments')).catch((error: any) => {
                const errors = error.response?.data?.errors || error.response?.data?.extensions?.errors || [];
                
                if (errors && Array.isArray(errors) && errors.length > 0) {
                    const backendErrors: Record<string, string> = {};
                    errors.forEach((err: any) => {
                        const property = err.Property || err.property;
                        const errorMessage = err.ErrorMessage || err.errorMessage;
                        if (property && errorMessage) {
                            backendErrors[property.toLowerCase()] = errorMessage;
                        }
                    });
                    setErrors(backendErrors);
                } else {
                    console.error('Error creating department:', error);
                }
            });
        }
        else {
            apiConnector.editDepartment(department).then(() => navigate('/departments')).catch((error: any) => {
                const errors = error.response?.data?.errors || error.response?.data?.extensions?.errors || [];
                
                if (errors && Array.isArray(errors) && errors.length > 0) {
                    const backendErrors: Record<string, string> = {};
                    errors.forEach((err: any) => {
                        const property = err.Property || err.property;
                        const errorMessage = err.ErrorMessage || err.errorMessage;
                        if (property && errorMessage) {
                            backendErrors[property.toLowerCase()] = errorMessage;
                        }
                    });
                    setErrors(backendErrors);
                } else {
                    console.error('Error updating department:', error);
                }
            });
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDepartment((prev) => ({ ...prev, [name]: name === 'numberOfPeople' ? parseInt(value) || 0 : value }));
    };

    return (
        <Container maxWidth="md" sx={{ py: 3 }}>
            <Box sx={{ mb: 3 }}>
                <Button
                    component={NavLink}
                    to="/departments"
                    startIcon={<ArrowBackIcon />}
                    sx={{ mb: 2 }}
                >
                    Back to Departments
                </Button>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {id ? <EditIcon sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} /> : <AddIcon sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />}
                    <Typography variant="h4" component="h1">
                        {id ? 'Edit Department' : 'Create New Department'}
                    </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary">
                    {id ? 'Update the department details below' : 'Fill in the details to create a new department'}
                </Typography>
            </Box>

            <Paper elevation={2} sx={{ p: 3 }}>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField
                            fullWidth
                            label="Department Name"
                            name="departmentName"
                            value={department.departmentName}
                            onChange={handleInputChange}
                            placeholder="Enter department name"
                            required
                            error={!!errors.departmentName}
                            helperText={errors.departmentName}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <BusinessIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        
                        <TextField
                            fullWidth
                            label="Manager"
                            name="manager"
                            value={department.manager}
                            onChange={handleInputChange}
                            placeholder="Enter manager name"
                            required
                            error={!!errors.manager}
                            helperText={errors.manager}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        
                        <TextField
                            fullWidth
                            label="Number of People"
                            name="numberOfPeople"
                            type="number"
                            value={department.numberOfPeople}
                            onChange={handleInputChange}
                            placeholder="Enter number of people"
                            required
                            error={!!errors.numberOfPeople}
                            helperText={errors.numberOfPeople}
                            inputProps={{
                                min: 1
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <GroupIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {department.createdDate && (
                            <Typography variant="body2" color="text.secondary">
                                Created: {new Date(department.createdDate).toLocaleString()}
                            </Typography>
                        )}
                        
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                            <Button
                                component={NavLink}
                                to="/departments"
                                variant="outlined"
                                size="large"
                                type="button"
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
                                {id ? 'Update Department' : 'Create Department'}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Container>
    )
}

