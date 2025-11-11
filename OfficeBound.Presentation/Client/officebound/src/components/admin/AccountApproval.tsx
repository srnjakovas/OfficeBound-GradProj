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
} from '@mui/material';
import {
    AdminPanelSettings,
    CheckCircle,
    Cancel,
    Person as PersonIcon,
} from '@mui/icons-material';
import apiConnector from '../../api/apiConnector';
import type { UserAccountRequestDto } from '../../models/userAccountRequestDto';
import type { DepartmentDto } from '../../models/departmentDto';
import { useAuth } from '../../contexts/AuthContext';
import { Role } from '../../utils/roles';

export default function AccountApproval() {
    const [accountRequests, setAccountRequests] = useState<UserAccountRequestDto[]>([]);
    const [departments, setDepartments] = useState<DepartmentDto[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<UserAccountRequestDto | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [position, setPosition] = useState('');
    const [departmentId, setDepartmentId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const { user } = useAuth();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [requests, depts] = await Promise.all([
                apiConnector.getUserAccountRequests(),
                apiConnector.getDepartments()
            ]);
            
            let filteredRequests = requests;
            if (user && user.role === Role.BranchManager && user.departmentId) {
                filteredRequests = requests;
            }
            
            setAccountRequests(filteredRequests.filter(r => !r.isReviewed));
            setDepartments(depts);
        } catch (err: any) {
            setError('Failed to load account requests');
        }
    };

    const handleReview = (request: UserAccountRequestDto) => {
        setSelectedRequest(request);
        setPosition('');
        setDepartmentId(null);
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
                departmentId
            );
            setSuccess('Account approved successfully');
            setDialogOpen(false);
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
                        Account Approvals
                    </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    Review and approve pending account requests
                </Typography>
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
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>User</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Created Date</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
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
                                                label={request.isReviewed ? (request.isApproved ? 'Approved' : 'Rejected') : 'Pending'}
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
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    size="small"
                                                    startIcon={<Cancel />}
                                                    onClick={handleReject}
                                                    disabled={request.isReviewed || selectedRequest?.id !== request.id}
                                                >
                                                    Reject
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

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Approve Account</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                        <TextField
                            label="Username"
                            value={selectedRequest?.username || ''}
                            disabled
                            fullWidth
                        />
                        <TextField
                            label="Position"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            required
                            fullWidth
                        />
                        <FormControl fullWidth required>
                            <InputLabel>Department</InputLabel>
                            <Select
                                value={departmentId || ''}
                                onChange={(e) => setDepartmentId(Number(e.target.value))}
                                label="Department"
                            >
                                {departments.map((dept) => (
                                    <MenuItem key={dept.id} value={dept.id}>
                                        {dept.departmentName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleApprove}
                        variant="contained"
                        color="success"
                        disabled={loading || !position.trim() || !departmentId}
                    >
                        Approve
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

