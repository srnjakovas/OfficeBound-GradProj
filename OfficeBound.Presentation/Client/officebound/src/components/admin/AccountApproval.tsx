import { useEffect, useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Alert,
    useTheme,
    Avatar,
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import {
    AdminPanelSettings,
    CheckCircle,
    Cancel,
    Person as PersonIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import apiConnector from '../../api/apiConnector';
import type { UserAccountRequestDto } from '../../models/userAccountRequestDto';
import type { DepartmentDto } from '../../models/departmentDto';
import type { UserDto } from '../../models/userDto';
import { useAuth } from '../../contexts/AuthContext';
import { Role, canApproveAccounts } from '../../utils/roles';
import { useTranslation } from 'react-i18next';

export default function AccountApproval() {
    const [accountRequests, setAccountRequests] = useState<UserAccountRequestDto[]>([]);
    const [approvedUsers, setApprovedUsers] = useState<UserDto[]>([]);
    const [departments, setDepartments] = useState<DepartmentDto[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<UserAccountRequestDto | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [rejectionReasonDialogOpen, setRejectionReasonDialogOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [rejectionReasonError, setRejectionReasonError] = useState<string | null>(null);
    const [userToDelete, setUserToDelete] = useState<UserDto | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [position, setPosition] = useState('');
    const [departmentId, setDepartmentId] = useState<number | null>(null);
    const [setAsBranchManager, setSetAsBranchManager] = useState(false);
    const [hasBranchManager, setHasBranchManager] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const { user } = useAuth();
    const { t } = useTranslation();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [requests, depts, users, hasBranchManagerResult] = await Promise.all([
                apiConnector.getUserAccountRequests(),
                apiConnector.getDepartments(),
                apiConnector.getUsers(),
                apiConnector.hasBranchManager()
            ]);
            
            let filteredRequests = requests;
            if (user && user.role === Role.BranchManager && user.departmentId) {
                filteredRequests = requests;
            }
            
            setHasBranchManager(hasBranchManagerResult);
            
            setAccountRequests(filteredRequests.filter(r => !r.isReviewed));
            setApprovedUsers(users);
            setDepartments(depts);
        } catch (err: any) {
            setError('Failed to load account requests');
        }
    };

    const handleReview = (request: UserAccountRequestDto) => {
        setSelectedRequest(request);
        setPosition('');
        setDepartmentId(null);
        setSetAsBranchManager(false);
        setDialogOpen(true);
        setError(null);
    };

    const handleApprove = async () => {
        if (!selectedRequest) return;
        
        if (!position.trim() || !departmentId) {
            setError('Position and Department are required for approval');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await apiConnector.reviewAccount(
                selectedRequest.id,
                true,
                position,
                departmentId,
                setAsBranchManager
            );
            setSuccess(t('users.account.approved'));
            setDialogOpen(false);
            setSetAsBranchManager(false);
            fetchData();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to approve account');
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        if (!selectedRequest) return;

        if (!window.confirm('Are you sure you want to reject this account request?')) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await apiConnector.reviewAccount(
                selectedRequest.id,
                false,
                null,
                null
            );
            setSuccess('Account rejected successfully');
            setDialogOpen(false);
            fetchData();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to reject account');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (userToDelete: UserDto) => {
        setUserToDelete(userToDelete);
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
        if (!userToDelete) return;

        if (rejectionReason.trim().length < 50) {
            setRejectionReasonError(t('validation.rejection.reason.min.length'));
            return;
        }

        setLoading(true);
        setError(null);
        setRejectionReasonError(null);

        try {
            await apiConnector.deleteUser(userToDelete.id, rejectionReason.trim());
            setSuccess('User removed successfully');
            setRejectionReasonDialogOpen(false);
            setDeleteDialogOpen(false);
            setUserToDelete(null);
            setRejectionReason('');
            fetchData();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to remove user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AdminPanelSettings
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
                        {t('general.account.approvals')}
                    </Typography>
                </Box>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
                    {success}
                </Alert>
            )}

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
                            <TableRow
                                sx={{
                                    background: isDark
                                        ? 'linear-gradient(135deg, #334155 0%, #475569 100%)'
                                        : 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                                }}
                            >
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>{t('general.username')}</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>{t('department.created.date')}</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>{t('general.status')}</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>{t('general.actions')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {accountRequests.length > 0 ? (
                                accountRequests.map((request) => (
                                    <TableRow key={request.id} hover>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main' }}>
                                                    <PersonIcon fontSize="small" />
                                                </Avatar>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {request.username}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {new Date(request.createdDate).toLocaleDateString()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={request.isReviewed ? (request.isApproved ? t('general.approved') : t('general.rejected')) : t('general.pending')}
                                                color={request.isReviewed ? (request.isApproved ? 'success' : 'error') : 'warning'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    size="small"
                                                    startIcon={<CheckCircle />}
                                                    onClick={() => handleReview(request)}
                                                    disabled={request.isReviewed}
                                                >
                                                    {t('general.approve')}
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    size="small"
                                                    startIcon={<Cancel />}
                                                    onClick={handleReject}
                                                    disabled={request.isReviewed || selectedRequest?.id !== request.id}
                                                >
                                                    {t('general.reject')}
                                                </Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                                        <Typography variant="h6" color="text.secondary">
                                            No pending account requests
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {user && canApproveAccounts(user.role) && approvedUsers.length > 0 && (
                <Paper
                    elevation={0}
                    sx={{
                        overflow: 'hidden',
                        border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                        borderRadius: 3,
                        background: isDark
                            ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
                            : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                        mt: 3,
                    }}
                >
                    <Box sx={{ p: 2, borderBottom: `1px solid ${isDark ? '#334155' : '#e2e8f0'}` }}>
                        <Typography variant="h6" fontWeight={600}>
                            {t('general.users')}
                        </Typography>
                    </Box>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow
                                    sx={{
                                        background: isDark
                                            ? 'linear-gradient(135deg, #334155 0%, #475569 100%)'
                                            : 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                                    }}
                                >
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>{t('general.username')}</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>{t('general.created.date')}</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>{t('general.actions')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {approvedUsers.map((approvedUser) => (
                                    <TableRow key={approvedUser.id} hover>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main' }}>
                                                    <PersonIcon fontSize="small" />
                                                </Avatar>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {approvedUser.username}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {new Date(approvedUser.createdDate).toLocaleDateString()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                size="small"
                                                startIcon={<DeleteIcon />}
                                                onClick={() => handleDeleteClick(approvedUser)}
                                                disabled={loading}
                                            >
                                                {t('user.remove')}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{t('general.approve')}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                        <TextField
                            label={t('general.username')}
                            value={selectedRequest?.username || ''}
                            disabled
                            fullWidth
                        />
                        <TextField
                            label={t('users.position')}
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            required
                            fullWidth
                        />
                        <FormControl fullWidth required>
                            <InputLabel>{t('general.department')}</InputLabel>
                            <Select
                                value={departmentId || ''}
                                onChange={(e) => setDepartmentId(Number(e.target.value))}
                                label={t('general.department')}
                            >
                                {departments.map((dept) => (
                                    <MenuItem key={dept.id} value={dept.id}>
                                        {dept.departmentName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={setAsBranchManager}
                                    onChange={(e) => setSetAsBranchManager(e.target.checked)}
                                    disabled={hasBranchManager}
                                />
                            }
                            label={t('user.set.as.branch.manager')}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>{t('general.back')}</Button>
                    <Button
                        onClick={handleApprove}
                        variant="contained"
                        color="success"
                        disabled={loading || !position.trim() || !departmentId}
                    >
                        {t('general.approve')}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{t('user.remove')}</DialogTitle>
                <DialogContent>
                    <Typography>
                        {userToDelete ? t('user.delete.confirmation', { username: userToDelete.username }) : ''}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} disabled={loading}>
                        {t('general.no')}
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        variant="contained"
                        color="error"
                        disabled={loading}
                    >
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
                        required
                        error={!!rejectionReasonError}
                        helperText={rejectionReasonError || `${rejectionReason.length}/50`}
                        inputProps={{
                            maxLength: 1000
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setRejectionReasonDialogOpen(false);
                        setRejectionReason('');
                        setRejectionReasonError(null);
                    }} disabled={loading}>
                        {t('general.back')}
                    </Button>
                    <Button
                        onClick={handleRejectionReasonConfirm}
                        variant="contained"
                        color="error"
                        disabled={loading || rejectionReason.trim().length < 50}
                    >
                        {t('user.remove')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

