import {useEffect, useState, useMemo} from "react";
import type {RequestDto} from "../../models/requestDto.ts";
import type {DepartmentDto} from "../../models/departmentDto.ts";
import apiConnector from "../../api/apiConnector.ts";
import { useAuth } from "../../contexts/AuthContext";
import { Role, canViewDepartmentRequests, canViewAllRequests } from "../../utils/roles";
import {Button, Container, Paper, Typography, Box, Fab, Chip, useTheme, ToggleButton, ToggleButtonGroup, FormControl, InputLabel, Select, MenuItem, TextField} from "@mui/material";
import {
    Add as AddIcon, 
    Assignment as AssignmentIcon, 
    TrendingUp as TrendingUpIcon, 
    CheckCircle as CheckCircleIcon,
    Pending as PendingIcon,
    Cancel as CancelIcon,
    Block as BlockIcon,
    Schedule as ScheduleIcon,
    FilterAlt as FilterAltIcon
} from "@mui/icons-material";
import RequestsTableItem from "./RequestsTableItem.tsx";
import {NavLink} from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useTranslation } from "react-i18next";
import { t } from "i18next";

type StatusFilter = number | null;

export default function RequestsTable () {
    const [requests, setRequests] = useState<RequestDto[]>([]);
    const [departments, setDepartments] = useState<DepartmentDto[]>([]);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>(null);
    const [departmentFilter, setDepartmentFilter] = useState<number | null>(null);
    const [dateFilter, setDateFilter] = useState<string>('');
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const { user } = useAuth();
    const { t } = useTranslation();
    
    useEffect(() => {
        const fetchData = async () => {
            const [fetchedRequests, fetchedDepartments] = await Promise.all([
                apiConnector.getRequests(),
                apiConnector.getDepartments()
            ]);
            setRequests(fetchedRequests);
            setDepartments(fetchedDepartments);
        }
        
        fetchData();
    }, []);

    const filteredRequests = useMemo(() => {
        let filtered = requests;
        
        if (user) {
            if (user.role === Role.User) {
            } else if (canViewDepartmentRequests(user.role) && !canViewAllRequests(user.role)) {
                if (user.departmentId) {
                    filtered = filtered.filter(request => request.departmentId === user.departmentId);
                } else {
                    filtered = [];
                }
            }
        } else {
            filtered = [];
        }
        
        if (statusFilter !== null) {
            filtered = filtered.filter(request => request.requestStatus === statusFilter);
        }
        
        if (departmentFilter !== null) {
            filtered = filtered.filter(request => request.departmentId === departmentFilter);
        }
        
        if (dateFilter) {
            const filterDate = new Date(dateFilter + 'T00:00:00').toDateString();
            filtered = filtered.filter(request => {
                if (!request.requestDate) return false;
                const requestDate = new Date(request.requestDate).toDateString();
                return requestDate === filterDate;
            });
        }
        
        return filtered;
    }, [requests, statusFilter, departmentFilter, dateFilter, user]);

    const statusCounts = useMemo(() => {
        return {
            all: requests.length,
            approved: requests.filter(r => r.requestStatus === 0).length,
            rejected: requests.filter(r => r.requestStatus === 1).length,
            cancelled: requests.filter(r => r.requestStatus === 2).length,
            pending: requests.filter(r => r.requestStatus === 3).length,
            expired: requests.filter(r => r.requestStatus === 4).length,
        };
    }, [requests]);

    const handleStatusFilterChange = (
        event: React.MouseEvent<HTMLElement>,
        newFilter: StatusFilter,
    ) => {
        setStatusFilter(newFilter);
    };
    
    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AssignmentIcon 
                        sx={{ 
                            fontSize: 32, 
                            mr: 2, 
                            color: 'primary.main',
                            background: isDark 
                                ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
                                : 'linear-gradient(135deg, #2563eb, #7c3aed)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }} 
                    />
                    <Typography 
                        variant="h4" 
                        component="h1" 
                        sx={{ 
                            fontWeight: 700,
                            background: isDark 
                                ? 'linear-gradient(135deg, #60a5fa, #a78bfa)'
                                : 'linear-gradient(135deg, #2563eb, #7c3aed)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        {t('general.requests')}
                    </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {t('general.application.description')}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mb: 2, p: 2, bgcolor: isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(241, 245, 249, 0.8)', borderRadius: 2 }}>
                    <FilterAltIcon sx={{ color: 'text.secondary' }} />
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mr: 1 }}>
                        {t('general.filters')}:
                    </Typography>
                    
                    <FormControl sx={{ minWidth: 180 }} size="small">
                        <InputLabel>{t('general.department')}</InputLabel>
                        <Select
                            value={departmentFilter || ''}
                            onChange={(e) => setDepartmentFilter(e.target.value === null ? null : Number(e.target.value))}
                            label={t('general.department')}
                        >
                            <MenuItem value="">All Departments</MenuItem>
                            {departments.map((dept) => (
                                <MenuItem key={dept.id} value={dept.id}>
                                    {dept.departmentName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    
                    <TextField
                        label={t('general.date')}
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        size="small"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={{ minWidth: 180 }}
                    />
                    
                    {(departmentFilter !== null || dateFilter) && (
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                                setDepartmentFilter(null);
                                setDateFilter('');
                            }}
                        >
                            Clear Filters
                        </Button>
                    )}
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>
                    <Chip 
                        icon={<TrendingUpIcon />}
                        label={`${filteredRequests.length} ${t('general.total')} `} 
                        color="primary" 
                        variant="outlined"
                        size="small"
                    />
                    <ToggleButtonGroup
                        value={statusFilter}
                        exclusive
                        onChange={handleStatusFilterChange}
                        aria-label="status filter"
                        size="small"
                        sx={{
                            '& .MuiToggleButton-root': {
                                textTransform: 'none',
                                border: `1px solid ${isDark ? '#475569' : '#cbd5e1'}`,
                                '&.Mui-selected': {
                                    backgroundColor: isDark ? '#3b82f6' : '#2563eb',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: isDark ? '#2563eb' : '#1d4ed8',
                                    },
                                },
                            },
                        }}
                    >
                        <ToggleButton value='' aria-label="all">
                            {t('general.all')} ({statusCounts.all})
                        </ToggleButton>
                        <ToggleButton value={3} aria-label="pending">
                            <PendingIcon sx={{ mr: 0.5, fontSize: 16 }} />
                            {t('request.status.pending')}  ({statusCounts.pending})
                        </ToggleButton>
                        <ToggleButton value={0} aria-label="approved">
                            <CheckCircleIcon sx={{ mr: 0.5, fontSize: 16 }} />
                            {t('request.status.approved')}  ({statusCounts.approved})
                        </ToggleButton>
                        <ToggleButton value={1} aria-label="rejected">
                            <BlockIcon sx={{ mr: 0.5, fontSize: 16 }} />
                            {t('request.status.rejected')}  ({statusCounts.rejected})
                        </ToggleButton>
                        <ToggleButton value={2} aria-label="cancelled">
                            <CancelIcon sx={{ mr: 0.5, fontSize: 16 }} />
                            {t('request.status.cancelled')}  ({statusCounts.cancelled})
                        </ToggleButton>
                        <ToggleButton value={4} aria-label="expired">
                            <ScheduleIcon sx={{ mr: 0.5, fontSize: 16 }} />
                            {t('request.status.expired')} ({statusCounts.expired})
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            </Box>
            
            <Paper 
                elevation={0}
                sx={{ 
                    overflow: 'hidden',
                    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                    borderRadius: 3,
                    background: isDark 
                        ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
                        : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                }}
            >
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ 
                                background: isDark 
                                    ? 'linear-gradient(135deg, #334155 0%, #475569 100%)'
                                    : 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                            }}>
                                <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>ID</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>{t('general.description')}</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>{t('general.request.type')}</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>{t('general.department')}</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>{t('general.status')}</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>{t('general.request.date')}</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>{t('general.actions')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredRequests.length !== 0 ? (
                                filteredRequests.map((request, index) => (
                                    <RequestsTableItem key={index} request={request} />
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <AssignmentIcon 
                                                sx={{ 
                                                    fontSize: 64, 
                                                    color: 'text.secondary',
                                                    opacity: 0.5,
                                                    mb: 2
                                                }} 
                                            />
                                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                                {t('general.not.found')}
                                            </Typography>
                                            {statusFilter === null && (
                                                <Button
                                                    component={NavLink}
                                                    to="/createRequest"
                                                    variant="contained"
                                                    startIcon={<AddIcon />}
                                                    sx={{ borderRadius: 2 }}
                                                >
                                                    {t('general.create.request')}
                                                </Button>
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            
            {filteredRequests.length > 0 && (
                <Fab
                    color="primary"
                    aria-label="add"
                    component={NavLink}
                    to="/createRequest"
                    sx={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        background: isDark 
                            ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
                            : 'linear-gradient(135deg, #2563eb, #7c3aed)',
                        '&:hover': {
                            background: isDark 
                                ? 'linear-gradient(135deg, #2563eb, #7c3aed)'
                                : 'linear-gradient(135deg, #1d4ed8, #6d28d9)',
                            transform: 'scale(1.05)',
                        },
                        transition: 'all 0.3s ease',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                    }}
                >
                    <AddIcon />
                </Fab>
            )}
        </Container>
    )
}