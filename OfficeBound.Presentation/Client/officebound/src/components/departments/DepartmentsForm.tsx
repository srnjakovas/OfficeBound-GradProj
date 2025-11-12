import {NavLink, useNavigate, useParams} from "react-router-dom";
import type {DepartmentDto} from "../../models/departmentDto.ts";
import type {UserDto} from "../../models/userDto.ts";
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { 
  ArrowBack as ArrowBackIcon,
  Business as BusinessIcon,
  Group as GroupIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import { Role } from "../../utils/roles";

export default function DepartmentsForm () {
    const {id} = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user } = useAuth();
    const isAdministrator = user?.role === Role.Administrator;
    const isEditMode = !!id;
    const canEditDepartmentName = isAdministrator || !isEditMode;

    const [department, setDepartment] = useState<DepartmentDto>({
        id: undefined,
        departmentName: '',
        managerId: null,
        managerName: null,
        numberOfPeople: 0,
        createdDate: undefined,
        isActive: true,
        rejectionReason: null,
    });

    const [users, setUsers] = useState<UserDto[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchUsers = async () => {
            const fetchedUsers = await apiConnector.getUsers();
            setUsers(fetchedUsers);
        };
        fetchUsers();
    }, []);

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
            apiConnector.editDepartment(department, user?.id).then(() => navigate('/departments')).catch((error: any) => {
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
                    {t('general.back')}
                </Button>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {id ? <EditIcon sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} /> : <AddIcon sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />}
                    <Typography variant="h4" component="h1">
                        {id ? t('departments.update') : t('departments.create.new')}
                    </Typography>
                </Box>
            </Box>

            <Paper elevation={2} sx={{ p: 3 }}>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField
                            fullWidth
                            label={t('department.name')}
                            name="departmentName"
                            value={department.departmentName}
                            onChange={handleInputChange}
                            placeholder={t('departments.name.placeholder')}
                            required
                            disabled={!canEditDepartmentName}
                            error={!!errors.departmentName}
                            helperText={errors.departmentName || (!canEditDepartmentName && isEditMode ? t('department.name.edit.restriction') : '')}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <BusinessIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        
                        <FormControl fullWidth error={!!errors.managerId}>
                            <InputLabel>{t('department.manager')}</InputLabel>
                            <Select
                                value={department.managerId || ''}
                                onChange={(e) => setDepartment(prev => ({ ...prev, managerId: e.target.value ? Number(e.target.value) : null }))}
                                label={t('department.manager')}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {users.map((user) => (
                                    <MenuItem key={user.id} value={user.id}>
                                        {user.username}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.managerId && <FormHelperText>{errors.managerId}</FormHelperText>}
                        </FormControl>
                        
                        <TextField
                            fullWidth
                            label={t('departments.number.of.people')}
                            name="numberOfPeople"
                            type="number"
                            value={department.numberOfPeople}
                            onChange={handleInputChange}
                            placeholder={t('departments.number.of.people')}
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
                                {t('department.created.date')} {new Date(department.createdDate).toLocaleString()}
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
                                {t('general.back')}
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                startIcon={id ? <SaveIcon /> : <AddIcon />}
                            >
                                {id ? t('departments.update') : t('department.add.new')}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Container>
    )
}

