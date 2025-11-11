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
    ThumbDown as ThumbDownIcon
} from "@mui/icons-material";
import apiConnector from "../../api/apiConnector.ts";
import {NavLink} from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { canApproveRequests } from "../../utils/roles";
import { useTranslation } from "react-i18next";

interface Props {
    request: RequestDto;
}

export default function RequestsTableItem ({request}: Props) {
    const { user } = useAuth();
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [processing, setProcessing] = useState(false);
    const { t } = useTranslation();

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

    const getRequestTypeLabel = (type: number) => {
        const types = ['Desk', 'Desk with Parking', 'Conference Room', 'Conference Room with Parking'];
        return types[type] || 'Unknown';
    };

    const getRequestTypeColor = (type: number) => {
        const colors = ['default', 'primary', 'secondary', 'success'];
        return colors[type] || 'default';
    };

    const getRequestStatusLabel = (status: number): string => {
        const statusLabels: Record<number, string> = {
            0: t('request.status.approved'),
            1: t('request.status.rejected'),
            2: t('request.status.cancelled'),
            3: t('request.status.pending'),
            4: t('request.status.expired')
        };
        return statusLabels[status] || 'Unknown';
    };

    const getRequestStatusColor = (status: number): "success" | "error" | "warning" | "default" | "info" => {
        const colorMap: Record<number, "success" | "error" | "warning" | "default" | "info"> = {
            0: 'success',
            1: 'error',
            2: 'warning',
            3: 'info',
            4: 'default'
        };
        return colorMap[status] || 'default';
    };

    const getRequestStatusIcon = (status: number) => {
        switch (status) {
            case 0: return <CheckCircleIcon fontSize="small" />;
            case 1: return <BlockIcon fontSize="small" />;
            case 2: return <CancelIcon fontSize="small" />;
            case 3: return <PendingIcon fontSize="small" />;
            case 4: return <ScheduleIcon fontSize="small" />;
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
            <TableCell sx={{ maxWidth: 300 }}>
                <Box sx={{ 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <DescriptionIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
                    <Typography variant="body2">
                        {request.description}
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
            <TableCell>
                {request.departmentName ? (
                    <Chip 
                        icon={<BusinessIcon fontSize="small" />}
                        label={request.departmentName}
                        size="small"
                        variant="outlined"
                        color="secondary"
                    />
                ) : (
                    <Typography variant="body2" color="text.secondary">
                        None
                    </Typography>
                )}
            </TableCell>
            <TableCell>
                <Chip 
                    icon={getRequestStatusIcon(request.requestStatus)}
                    label={getRequestStatusLabel(request.requestStatus)}
                    color={getRequestStatusColor(request.requestStatus)}
                    size="small"
                    variant="outlined"
                />
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
            <TableCell>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {user && canApproveRequests(user.role) && request.requestStatus === 3 && (
                        <>
                            <Tooltip title="Approve Request">
                                <IconButton
                                    onClick={handleApprove}
                                    color="success"
                                    size="small"
                                    disabled={processing}
                                    sx={{
                                        backgroundColor: 'success.main',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'success.dark',
                                        },
                                        '&.Mui-disabled': {
                                            backgroundColor: 'action.disabledBackground',
                                        },
                                    }}
                                >
                                    <ThumbUpIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Reject Request">
                                <IconButton
                                    onClick={handleRejectClick}
                                    color="error"
                                    size="small"
                                    disabled={processing}
                                    sx={{
                                        backgroundColor: 'error.main',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'error.dark',
                                        },
                                        '&.Mui-disabled': {
                                            backgroundColor: 'action.disabledBackground',
                                        },
                                    }}
                                >
                                    <ThumbDownIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </>
                    )}
                    <Tooltip title="Edit Request">
                        <IconButton
                            component={NavLink}
                            to={`/editRequest/${request.id}`}
                            color="primary"
                            size="small"
                            sx={{
                                backgroundColor: 'primary.main',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: 'primary.dark',
                                },
                            }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Request">
                        <IconButton
                            onClick={handleDelete}
                            color="error"
                            size="small"
                            sx={{
                                backgroundColor: 'error.main',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: 'error.dark',
                                },
                            }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            </TableCell>
            
            <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)}>
                <DialogTitle>Reject Request</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Rejection Reason"
                        fullWidth
                        multiline
                        rows={4}
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
                    <Button 
                        onClick={handleRejectConfirm} 
                        color="error" 
                        variant="contained"
                        disabled={!rejectionReason.trim() || processing}
                    >
                        Reject
                    </Button>
                </DialogActions>
            </Dialog>
        </TableRow>
    )
}