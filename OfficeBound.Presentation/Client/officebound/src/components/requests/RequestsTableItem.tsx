import type { RequestDto } from "../../models/requestDto";
import { TableCell, TableRow, Box, IconButton, Tooltip, Chip, Avatar, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { 
    Edit as EditIcon, 
    Delete as DeleteIcon, 
    Assignment as AssignmentIcon, 
    Schedule as ScheduleIcon, 
    Category as CategoryIcon, 
    Description as DescriptionIcon,
    CheckCircle as CheckCircleIcon,
    Pending as PendingIcon,
    Cancel as CancelIcon,
    Block as BlockIcon,
    Business as BusinessIcon,
    ThumbUp as ThumbUpIcon,
    ThumbDown as ThumbDownIcon,
    Visibility as VisibilityIcon
} from "@mui/icons-material";
import apiConnector from "../../api/apiConnector.ts";
import {NavLink} from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { canApproveRequests } from "../../utils/roles";
import { useTranslation } from "react-i18next";
import { getRequestStatusLabel, getRequestStatusColor } from "../../utils/requestStatus";

interface Props {
    request: RequestDto;
}

export default function RequestsTableItem ({request}: Props) {
    const { user } = useAuth();
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [cancellationReason, setCancellationReason] = useState('');
    const [processing, setProcessing] = useState(false);
    const { t } = useTranslation();

    const isRequestOwner = user && 
                          request.createdByUsername && 
                          user.username && 
                          user.username.trim().toLowerCase() === request.createdByUsername.trim().toLowerCase();
    
    const canCancel = isRequestOwner && (request.requestStatus === 3 || request.requestStatus === 0);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this request?')) {
            await apiConnector.deleteRequest(request.id!);
            window.location.reload();
        }
    };

    const handleApprove = async () => {
        if (!window.confirm('Are you sure you want to approve this request?')) {
            return;
        }
        setProcessing(true);
        try {
            await apiConnector.approveRequest(request.id!);
            window.location.reload();
        } catch (error) {
            alert('Failed to approve request');
            setProcessing(false);
        }
    };

    const handleRejectClick = () => {
        setRejectDialogOpen(true);
        setRejectionReason('');
    };

    const handleRejectConfirm = async () => {
        if (!rejectionReason.trim()) {
            alert('Please provide a rejection reason');
            return;
        }
        setProcessing(true);
        try {
            await apiConnector.rejectRequest(request.id!, rejectionReason);
            setRejectDialogOpen(false);
            window.location.reload();
        } catch (error) {
            alert('Failed to reject request');
            setProcessing(false);
        }
    };

    const handleCancelClick = () => {
        setCancelDialogOpen(true);
        setCancellationReason('');
    };

    const handleCancelConfirm = async () => {
        if (!cancellationReason.trim()) {
            alert(t('validation.cancellation.reason.required'));
            return;
        }
        setProcessing(true);
        try {
            await apiConnector.cancelRequest(request.id!, cancellationReason, user?.id);
            setCancelDialogOpen(false);
            window.location.reload();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || t('requests.cancel.error');
            alert(errorMessage);
            setProcessing(false);
        }
    };

    const getRequestTypeLabel = (type: number) => {
        const types = ['Conference Room', 'Conference Room with Parking', 'Desk', 'Desk with Parking'];
        return types[type] || 'Unknown';
    };

    const getRequestTypeColor = (type: number) => {
        const colors = ['default', 'primary', 'secondary', 'success'];
        return colors[type] || 'default';
    };

    const getRequestStatusIcon = (status: number) => {
        switch (status) {
            case 0: return <CheckCircleIcon fontSize="small" />;
            case 1: return <BlockIcon fontSize="small" />;
            case 2: return <CancelIcon fontSize="small" />;
            case 3: return <PendingIcon fontSize="small" />;
            case 4: return <ScheduleIcon fontSize="small" />;
            case 5: return <CancelIcon fontSize="small" />;
            default: return <PendingIcon fontSize="small" />;
        }
    };

    return (
        <TableRow hover>
            <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main' }}>
                        <AssignmentIcon fontSize="small" />
                    </Avatar>
                    <Typography variant="body2" fontWeight="medium">
                        #{request.id}
                    </Typography>
                </Box>
            </TableCell>
            <TableCell>
                <Chip 
                    icon={<CategoryIcon />}
                    label={getRequestTypeLabel(request.requestType)}
                    color={getRequestTypeColor(request.requestType) as any}
                    size="small"
                    variant="outlined"
                />
            </TableCell>
            <TableCell sx={{ width: '18%' }}>
                {request.departmentName ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BusinessIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                        <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                            {request.departmentName}
                        </Typography>
                    </Box>
                ) : (
                    <Typography variant="body2" color="text.secondary">
                        None
                    </Typography>
                )}
            </TableCell>
            <TableCell sx={{ width: '18%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getRequestStatusIcon(request.requestStatus)}
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            wordBreak: 'break-word',
                            color: (theme) => {
                                const colorMap: Record<number, string> = {
                                    0: theme.palette.success.main,
                                    1: theme.palette.error.main,
                                    2: theme.palette.warning.main,
                                    3: theme.palette.info.main,
                                    4: theme.palette.text.secondary,
                                    5: theme.palette.warning.main,
                                };
                                return colorMap[request.requestStatus] || theme.palette.text.primary;
                            }
                        }}
                    >
                        {getRequestStatusLabel(request.requestStatus, t)}
                    </Typography>
                </Box>
            </TableCell>
            <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ScheduleIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
                    <Typography variant="body2">
                        {request.requestDate 
                            ? new Date(request.requestDate).toLocaleDateString()
                            : '-'}
                    </Typography>
                </Box>
            </TableCell>
            <TableCell sx={{ width: '26%', minWidth: 200 }}>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-start', maxWidth: '100%' }}>
                    {user && canApproveRequests(user.role) && request.requestStatus === 3 && (
                        <>
                            <Tooltip title="Approve Request" arrow>
                                <IconButton
                                    onClick={handleApprove}
                                    color="success"
                                    size="medium"
                                    disabled={processing}
                                    sx={{
                                        backgroundColor: 'success.main',
                                        color: 'white',
                                        width: 36,
                                        height: 36,
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                        '&:hover': {
                                            backgroundColor: 'success.dark',
                                            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                                            transform: 'translateY(-1px)',
                                        },
                                        '&.Mui-disabled': {
                                            backgroundColor: 'action.disabledBackground',
                                            color: 'action.disabled',
                                        },
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    <ThumbUpIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Reject Request" arrow>
                                <IconButton
                                    onClick={handleRejectClick}
                                    color="error"
                                    size="medium"
                                    disabled={processing}
                                    sx={{
                                        backgroundColor: 'error.main',
                                        color: 'white',
                                        width: 36,
                                        height: 36,
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                        '&:hover': {
                                            backgroundColor: 'error.dark',
                                            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                                            transform: 'translateY(-1px)',
                                        },
                                        '&.Mui-disabled': {
                                            backgroundColor: 'action.disabledBackground',
                                            color: 'action.disabled',
                                        },
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    <ThumbDownIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </>
                    )}
                    {canCancel && (
                        <Tooltip title={t('requests.cancel')} arrow>
                            <IconButton
                                onClick={handleCancelClick}
                                color="warning"
                                size="medium"
                                disabled={processing}
                                sx={{
                                    backgroundColor: 'warning.main',
                                    color: 'white',
                                    width: 36,
                                    height: 36,
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    '&:hover': {
                                        backgroundColor: 'warning.dark',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                                        transform: 'translateY(-1px)',
                                    },
                                    '&.Mui-disabled': {
                                        backgroundColor: 'action.disabledBackground',
                                        color: 'action.disabled',
                                    },
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                <CancelIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                    <Tooltip title={t('request.preview')} arrow>
                        <IconButton
                            component={NavLink}
                            to={`/previewRequest/${request.id}`}
                            color="info"
                            size="medium"
                            sx={{
                                backgroundColor: 'info.main',
                                color: 'white',
                                width: 36,
                                height: 36,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                '&:hover': {
                                    backgroundColor: 'info.dark',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                                    transform: 'translateY(-1px)',
                                },
                                transition: 'all 0.2s ease',
                            }}
                        >
                            <VisibilityIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Request" arrow>
                        <IconButton
                            component={NavLink}
                            to={`/editRequest/${request.id}`}
                            color="primary"
                            size="medium"
                            sx={{
                                backgroundColor: 'primary.main',
                                color: 'white',
                                width: 36,
                                height: 36,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                '&:hover': {
                                    backgroundColor: 'primary.dark',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                                    transform: 'translateY(-1px)',
                                },
                                transition: 'all 0.2s ease',
                            }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Request" arrow>
                        <IconButton
                            onClick={handleDelete}
                            color="error"
                            size="medium"
                            sx={{
                                backgroundColor: 'error.main',
                                color: 'white',
                                width: 36,
                                height: 36,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                '&:hover': {
                                    backgroundColor: 'error.dark',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                                    transform: 'translateY(-1px)',
                                },
                                transition: 'all 0.2s ease',
                            }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            </TableCell>
            
            <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>{t('requests.reject')}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label={t('requests.rejection.reason')}
                        fullWidth
                        multiline
                        rows={4}
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRejectDialogOpen(false)}>{t('general.back')}</Button>
                    <Button 
                        onClick={handleRejectConfirm} 
                        color="error" 
                        variant="contained"
                        disabled={!rejectionReason.trim() || processing}
                    >
                        {t('general.reject')}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>{t('requests.cancel')}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label={t('requests.cancellation.reason')}
                        fullWidth
                        multiline
                        rows={4}
                        value={cancellationReason}
                        onChange={(e) => setCancellationReason(e.target.value)}
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCancelDialogOpen(false)} disabled={processing}>{t('general.back')}</Button>
                    <Button 
                        onClick={handleCancelConfirm} 
                        color="warning" 
                        variant="contained"
                        disabled={!cancellationReason.trim() || processing}
                    >
                        {t('requests.cancel')}
                    </Button>
                </DialogActions>
            </Dialog>
        </TableRow>
    )
}