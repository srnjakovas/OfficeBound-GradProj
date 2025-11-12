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
  Chip,
  Alert,
} from "@mui/material";

import { 
  ArrowBack as ArrowBackIcon,
  Description as DescriptionIcon,
  Category as CategoryIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Add as AddIcon,
  CalendarToday as CalendarIcon,
  Info as InfoIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { getRequestStatusLabel, getRequestStatusColor } from "../../utils/requestStatus";
import { useAuth } from "../../contexts/AuthContext";

export default function RequestsForm () {
    const {id} = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user } = useAuth();

    const getTomorrowDate = (): string => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const year = tomorrow.getFullYear();
        const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const day = String(tomorrow.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getTomorrowDateISO = (): string => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        const year = tomorrow.getFullYear();
        const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const day = String(tomorrow.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}T00:00:00.000Z`;
    };

    const isoToDateString = (isoString: string | undefined): string => {
        if (!isoString) return getTomorrowDate();
        const match = isoString.match(/^(\d{4}-\d{2}-\d{2})/);
        return match ? match[1] : getTomorrowDate();
    };

    const [request, setRequest] = useState<RequestDto>({
        id: undefined,
        description: '',
        requestType: 0,
        createdDate: undefined,
        requestDate: !id ? getTomorrowDateISO() : undefined,
        requestStatus: 0,
        rejectionReason: undefined,
        departmentId: undefined,
        departmentName: undefined,
    });

    const [departments, setDepartments] = useState<Array<{id: number, name: string}>>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        apiConnector.getDepartments(user?.role).then(deps => {
            setDepartments(deps.filter(d => d.isActive).map(d => ({ id: d.id!, name: d.departmentName })));
        });

        if (id) {
            apiConnector.getRequestById(id).then(request => {
                if (request) {
                    setRequest(request);
                }
            });
        }
    }, [id]);

    const validateRequestDate = (dateString: string | undefined): string => {
        if (!dateString) {
            return '';
        }
        
        const selectedDate = new Date(dateString + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        selectedDate.setHours(0, 0, 0, 0);
        
        if (selectedDate < tomorrow) {
            return t('validation.request.date');
        }
        
        return '';
    };

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        
        const newErrors: Record<string, string> = {};
        
        if (!request.description.trim()) {
            newErrors.description = t('validation.required');
        }
        
        const dateToValidate = request.requestDate || getTomorrowDateISO();
        const dateString = dateToValidate ? isoToDateString(dateToValidate) : undefined;
        const dateError = validateRequestDate(dateString);
        if (dateError) {
            newErrors.requestDate = dateError;
        }
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        setErrors({});
        
        const requestToSubmit = {
            ...request,
            requestDate: request.requestDate || getTomorrowDateISO()
        };
        
        if (!request.id) {
            apiConnector.createRequest(requestToSubmit, user?.id).then(() => navigate('/')).catch((error: any) => {
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
                    console.error('Error creating request:', error);
                }
            });
        }
        else {
            apiConnector.editRequest(requestToSubmit, user?.id).then(() => navigate('/')).catch((error: any) => {
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
                    console.error('Error updating request:', error);
                }
            });
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRequest((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e: any) => {
        const { name, value } = e.target;
        if (name === 'requestType') {
            const requestTypeValue = typeof value === 'string' ? parseInt(value, 10) : value;
            setRequest((prev) => ({ ...prev, requestType: requestTypeValue }));
        } else if (name === 'departmentId') {
            setRequest((prev) => ({ 
                ...prev, 
                departmentId: value === '' ? undefined : (typeof value === 'string' ? parseInt(value, 10) : value) 
            }));
        }
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (value) {
            const dateError = validateRequestDate(value);
            if (dateError) {
                setErrors((prev) => ({ ...prev, requestDate: dateError }));
                return;
            } else {
                setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.requestDate;
                    return newErrors;
                });
            }

            const isoString = `${value}T00:00:00.000Z`;
            setRequest((prev) => ({ ...prev, requestDate: isoString }));
        } else {
            const tomorrowISO = getTomorrowDateISO();
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.requestDate;
                return newErrors;
            });
            setRequest((prev) => ({ ...prev, requestDate: tomorrowISO }));
        }
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
                    {t('general.back')}
                </Button>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {id ? <EditIcon sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} /> : <AddIcon sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />}
                    <Typography variant="h4" component="h1">
                        {id ? t('general.edit.request') : t('general.create.request')}
                    </Typography>
                </Box>
            </Box>

            <Paper elevation={2} sx={{ p: 3 }}>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {request.id && (
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                                <Chip 
                                    label={`${t('general.status')}: ${getRequestStatusLabel(request.requestStatus, t)}`}
                                    color={getRequestStatusColor(request.requestStatus)}
                                    icon={<InfoIcon />}
                                />
                                {request.rejectionReason && (
                                    <Alert severity="error" sx={{ flex: 1 }}>
                                        <Typography variant="body2">
                                            <strong>{t('request.reject.reason')}:</strong> {request.rejectionReason}
                                        </Typography>
                                    </Alert>
                                )}
                            </Box>
                        )}

                        <TextField
                            fullWidth
                            label={t('general.description')}
                            name="description"
                            multiline
                            rows={4}
                            value={request.description}
                            onChange={handleInputChange}
                            placeholder={t('request.description.placeholder')}
                            required
                            error={!!errors.description}
                            helperText={errors.description}
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
                                <InputLabel>{t('general.request.type')}</InputLabel>
                                <Select
                                    name="requestType"
                                    value={request.requestType}
                                    onChange={handleSelectChange}
                                    label={t('general.request.type')}
                                    required
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <CategoryIcon color="action" />
                                        </InputAdornment>
                                    }
                                >
                                    <MenuItem value={0}>{t('request.type.conference.room')}</MenuItem>
                                    <MenuItem value={1}>{t('request.type.conference.room.with.parking')}</MenuItem>
                                    <MenuItem value={2}>{t('request.type.desk')}</MenuItem>
                                    <MenuItem value={3}>{t('request.type.desk.with.parking')}</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl sx={{ minWidth: 200, flex: 1 }}>
                                <InputLabel>{t('general.department')}</InputLabel>
                                <Select
                                    name="departmentId"
                                    value={request.departmentId || ''}
                                    onChange={handleSelectChange}
                                    label={t('general.department')}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <BusinessIcon color="action" />
                                        </InputAdornment>
                                    }
                                >
                                    <MenuItem value="">None</MenuItem>
                                    {departments.map((dept) => (
                                        <MenuItem key={dept.id} value={dept.id}>
                                            {dept.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                fullWidth
                                label={t('general.request.date')}
                                name="requestDate"
                                type="date"
                                value={isoToDateString(request.requestDate)}
                                onChange={handleDateChange}
                                inputProps={{
                                    min: getTomorrowDate()
                                }}
                                error={!!errors.requestDate}
                                helperText={errors.requestDate || t('validation.request.date')}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CalendarIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        {request.createdDate && (
                            <Typography variant="body2" color="text.secondary">
                                Created: {new Date(request.createdDate).toLocaleString()}
                            </Typography>
                        )}
                        
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                            <Button
                                component={NavLink}
                                to="/"
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
                                {id ? t('general.edit.request') : t('general.create.request')}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Container>
    )
}