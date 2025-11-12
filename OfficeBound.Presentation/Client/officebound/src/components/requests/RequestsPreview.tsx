import {NavLink, useParams} from "react-router-dom";
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
  Visibility as VisibilityIcon,
  CalendarToday as CalendarIcon,
  Info as InfoIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { getRequestStatusLabel, getRequestStatusColor } from "../../utils/requestStatus";

export default function RequestsPreview () {
    const {id} = useParams();
    const { t } = useTranslation();

    const isoToDateString = (isoString: string | undefined): string => {
        if (!isoString) return '';
        const match = isoString.match(/^(\d{4}-\d{2}-\d{2})/);
        return match ? match[1] : '';
    };

    const getRequestTypeLabel = (type: number) => {
        const types = [
            t('request.type.conference.room'),
            t('request.type.conference.room.with.parking'),
            t('request.type.desk'),
            t('request.type.desk.with.parking')
        ];
        return types[type] || 'Unknown';
    };

    const [request, setRequest] = useState<RequestDto | null>(null);
    const [departments, setDepartments] = useState<Array<{id: number, name: string}>>([]);

    useEffect(() => {
        apiConnector.getDepartments().then(deps => {
            setDepartments(deps.map(d => ({ id: d.id!, name: d.departmentName })));
        });

        if (id) {
            apiConnector.getRequestById(id).then(request => {
                if (request) {
                    setRequest(request);
                }
            });
        }
    }, [id]);

    if (!request) {
        return (
            <Container maxWidth="md" sx={{ py: 3 }}>
                <Typography>Loading...</Typography>
            </Container>
        );
    }

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
                    <VisibilityIcon sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
                    <Typography variant="h4" component="h1">
                        {t('request.preview')}
                    </Typography>
                </Box>
            </Box>

            <Paper elevation={2} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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

                    <TextField
                        fullWidth
                        label={t('general.description')}
                        name="description"
                        multiline
                        rows={4}
                        value={request.description}
                        disabled
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <DescriptionIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />
                    
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <FormControl sx={{ minWidth: 200, flex: 1 }} disabled>
                            <InputLabel>{t('general.request.type')}</InputLabel>
                            <Select
                                name="requestType"
                                value={request.requestType}
                                label={t('general.request.type')}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <CategoryIcon color="action" />
                                    </InputAdornment>
                                }
                            >
                                <MenuItem value={request.requestType}>
                                    {getRequestTypeLabel(request.requestType)}
                                </MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl sx={{ minWidth: 200, flex: 1 }} disabled>
                            <InputLabel>{t('general.department')}</InputLabel>
                            <Select
                                name="departmentId"
                                value={request.departmentId || ''}
                                label={t('general.department')}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <BusinessIcon color="action" />
                                    </InputAdornment>
                                }
                            >
                                <MenuItem value={request.departmentId || ''}>
                                    {request.departmentName || 'None'}
                                </MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            label={t('general.request.date')}
                            name="requestDate"
                            type="date"
                            value={isoToDateString(request.requestDate)}
                            disabled
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CalendarIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    <TextField
                        fullWidth
                        label={t('request.created.by.user')}
                        value={request.createdByUsername || ''}
                        disabled
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {request.createdDate && (
                        <Typography variant="body2" color="text.secondary">
                            {t('general.created.date')}: {new Date(request.createdDate).toLocaleString()}
                        </Typography>
                    )}
                    
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                            component={NavLink}
                            to="/"
                            variant="outlined"
                            size="large"
                            startIcon={<ArrowBackIcon />}
                        >
                            {t('general.back')}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    )
}

