import type { RequestDto } from "../../models/requestDto";
import { TableCell, TableRow, Box, IconButton, Tooltip, Chip, Avatar, Typography } from "@mui/material";
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
    Business as BusinessIcon
} from "@mui/icons-material";
import apiConnector from "../../api/apiConnector.ts";
import {NavLink} from "react-router-dom";

interface Props {
    request: RequestDto;
}

export default function RequestsTableItem ({request}: Props) {
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this request?')) {
            await apiConnector.deleteRequest(request.id!);
            window.location.reload();
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
            0: 'Approved',
            1: 'Rejected',
            2: 'Cancelled',
            3: 'Pending',
            4: 'Expired'
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
                <Box sx={{ display: 'flex', gap: 1 }}>
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
        </TableRow>
    )
}