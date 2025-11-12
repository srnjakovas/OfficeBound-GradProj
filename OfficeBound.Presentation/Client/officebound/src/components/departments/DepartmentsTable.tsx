import {useEffect, useState} from "react";
import type {DepartmentDto} from "../../models/departmentDto.ts";
import apiConnector from "../../api/apiConnector.ts";
import {Button, Container, Paper, Typography, Box, Fab, useTheme, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert} from "@mui/material";
import {Add as AddIcon, Business as BusinessIcon, Edit as EditIcon, Delete as DeleteIcon} from "@mui/icons-material";
import {NavLink} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import { canManageDepartments, Role } from "../../utils/roles";

export default function DepartmentsTable () {
    const [departments, setDepartments] = useState<DepartmentDto[]>([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [rejectionReasonDialogOpen, setRejectionReasonDialogOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [rejectionReasonError, setRejectionReasonError] = useState<string | null>(null);
    const [departmentToDelete, setDepartmentToDelete] = useState<DepartmentDto | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const { t } = useTranslation();
    const { user } = useAuth();
    
    useEffect(() => {
        const fetchData = async () => {
            const fetchedDepartments = await apiConnector.getDepartments(user?.role);
            setDepartments(fetchedDepartments);
        }
        
        fetchData();
    }, [user]);

    const handleDeleteClick = (department: DepartmentDto) => {
        setDepartmentToDelete(department);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        setDeleteDialogOpen(false);
        setRejectionReasonDialogOpen(true);
        setRejectionReason('');
        setRejectionReasonError(null);
    };

    const handleRejectionReasonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setRejectionReason(value);
        
        if (value.length > 0 && value.length < 50) {
            setRejectionReasonError(t('validation.rejection.reason.min.length'));
        } else {
            setRejectionReasonError(null);
        }
    };

    const handleRejectionReasonConfirm = async () => {
        if (!departmentToDelete) return;

        if (rejectionReason.trim().length < 50) {
            setRejectionReasonError(t('validation.rejection.reason.min.length'));
            return;
        }

        setLoading(true);
        setError(null);
        setRejectionReasonError(null);

        try {
            await apiConnector.deleteDepartment(departmentToDelete.id!, rejectionReason.trim());
            setRejectionReasonDialogOpen(false);
            setDepartmentToDelete(null);
            setRejectionReason('');
            const fetchedDepartments = await apiConnector.getDepartments(user?.role);
            setDepartments(fetchedDepartments);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to remove department');
        } finally {
            setLoading(false);
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
                {user && canManageDepartments(user.role) && (
                    <Button
                        component={NavLink}
                        to="/createDepartment"
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{ mb: 2 }}
                    >
                        {t('department.add.new')}
                    </Button>
                )}
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
                                {user?.role === Role.Administrator && (
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>{t('user.rejection.reason')}</TableCell>
                                )}
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>{t('general.actions')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {departments.length !== 0 ? (
                                departments.map((department) => (
                                    <TableRow key={department.id} hover>
                                        <TableCell>{department.id}</TableCell>
                                        <TableCell>
                                            {department.departmentName}
                                        </TableCell>
                                        <TableCell>{department.managerName || '-'}</TableCell>
                                        <TableCell>{department.managerId || '-'}</TableCell>
                                        <TableCell>{department.numberOfPeople}</TableCell>
                                        <TableCell>
                                            {department.createdDate ? new Date(department.createdDate).toLocaleDateString() : '-'}
                                        </TableCell>
                                        {user?.role === Role.Administrator && (
                                            <TableCell>
                                                {department.rejectionReason || '-'}
                                            </TableCell>
                                        )}
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                {department.isActive !== false && canManageDepartments(user?.role) && (
                                                    <>
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
                                                        <Tooltip title={t('user.remove')}>
                                                            <IconButton
                                                                onClick={() => handleDeleteClick(department)}
                                                                color="error"
                                                                size="small"
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </>
                                                )}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={user?.role === Role.Administrator ? 8 : 7} align="center" sx={{ py: 6 }}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <BusinessIcon sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
                                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                                {t('general.not.found')}
                                            </Typography>
                                            {user && canManageDepartments(user.role) && (
                                                <Button
                                                    component={NavLink}
                                                    to="/createDepartment"
                                                    variant="contained"
                                                    startIcon={<AddIcon />}
                                                >
                                                    {t('department.add.new')}
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
            
            {departments.length > 0 && user && canManageDepartments(user.role) && (
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

            {error && (
                <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>{t('user.remove')}</DialogTitle>
                <DialogContent>
                    <Typography>
                        {t('general.delete.warning')}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>{t('general.no')}</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        {t('general.yes')}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={rejectionReasonDialogOpen} onClose={() => setRejectionReasonDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>{t('user.rejection.reason')}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label={t('user.rejection.reason')}
                        fullWidth
                        multiline
                        rows={4}
                        value={rejectionReason}
                        onChange={handleRejectionReasonChange}
                        error={!!rejectionReasonError}
                        helperText={rejectionReasonError || t('validation.rejection.reason.min.length')}
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRejectionReasonDialogOpen(false)} disabled={loading}>
                        {t('general.back')}
                    </Button>
                    <Button 
                        onClick={handleRejectionReasonConfirm} 
                        color="error" 
                        variant="contained"
                        disabled={!rejectionReason.trim() || rejectionReason.trim().length < 50 || loading}
                    >
                        {loading ? t('general.loading') : t('user.remove')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

