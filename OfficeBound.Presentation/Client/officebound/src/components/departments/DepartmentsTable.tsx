import {useEffect, useState} from "react";
import type {DepartmentDto} from "../../models/departmentDto.ts";
import apiConnector from "../../api/apiConnector.ts";
import {Button, Container, Paper, Typography, Box, Fab, useTheme, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip} from "@mui/material";
import {Add as AddIcon, Business as BusinessIcon, Edit as EditIcon, Delete as DeleteIcon} from "@mui/icons-material";
import {NavLink} from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function DepartmentsTable () {
    const [departments, setDepartments] = useState<DepartmentDto[]>([]);
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const { t } = useTranslation();
    
    useEffect(() => {
        const fetchData = async () => {
            const fetchedDepartments = await apiConnector.getDepartments();
            setDepartments(fetchedDepartments);
        }
        
        fetchData();
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm(t('general.delete.warning'))) {
            await apiConnector.deleteDepartment(id);
            window.location.reload();
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <BusinessIcon 
                        sx={{ 
                            fontSize: 32, 
                            mr: 2, 
                            color: 'primary.main',
                        }} 
                    />
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                        {t('general.departments')}
                    </Typography>
                </Box>
                <Button
                    component={NavLink}
                    to="/createDepartment"
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{ mb: 2 }}
                >
                    {t('department.add.new')}
                </Button>
            </Box>
            
            <Paper elevation={0} sx={{ 
                overflow: 'hidden',
                border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                borderRadius: 3,
            }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ 
                                background: isDark 
                                    ? 'linear-gradient(135deg, #334155 0%, #475569 100%)'
                                    : 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                            }}>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>ID</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>{t('department.name')}</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>{t('department.manager')}</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Manager ID</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>{t('departments.number.of.people')}</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>{t('general.created.date')}</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>{t('general.actions')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {departments.length !== 0 ? (
                                departments.map((department) => (
                                    <TableRow key={department.id} hover>
                                        <TableCell>{department.id}</TableCell>
                                        <TableCell>{department.departmentName}</TableCell>
                                        <TableCell>{department.managerName || '-'}</TableCell>
                                        <TableCell>{department.managerId || '-'}</TableCell>
                                        <TableCell>{department.numberOfPeople}</TableCell>
                                        <TableCell>
                                            {department.createdDate ? new Date(department.createdDate).toLocaleDateString() : '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Tooltip title="Edit Department">
                                                    <IconButton
                                                        component={NavLink}
                                                        to={`/editDepartment/${department.id}`}
                                                        color="primary"
                                                        size="small"
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete Department">
                                                    <IconButton
                                                        onClick={() => handleDelete(department.id!)}
                                                        color="error"
                                                        size="small"
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <BusinessIcon sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
                                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                                {t('general.not.found')}
                                            </Typography>
                                            <Button
                                                component={NavLink}
                                                to="/createDepartment"
                                                variant="contained"
                                                startIcon={<AddIcon />}
                                            >
                                                {t('department.add.new')}
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            
            {departments.length > 0 && (
                <Fab
                    color="primary"
                    aria-label="add"
                    component={NavLink}
                    to="/createDepartment"
                    sx={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                    }}
                >
                    <AddIcon />
                </Fab>
            )}
        </Container>
    )
}

