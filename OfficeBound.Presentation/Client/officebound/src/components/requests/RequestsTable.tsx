import {useEffect, useState} from "react";
import type {RequestDto} from "../../models/requestDto.ts";
import apiConnector from "../../api/apiConnector.ts";
import {Button, Container, Paper, Typography, Box, Fab, Chip, useTheme} from "@mui/material";
import {Add as AddIcon, Assignment as AssignmentIcon, TrendingUp as TrendingUpIcon, CheckCircle as CheckCircleIcon} from "@mui/icons-material";
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

export default function RequestsTable () {
    const [requests, setRequests] = useState<RequestDto[]>([]);
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    
    useEffect(() => {
        const fetchData = async () => {
            const fetchedRequests = await apiConnector.getRequests();
            setRequests(fetchedRequests);
        }
        
        fetchData();
    }, [])
    
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
                        Office Requests
                    </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    Manage and track all office requests in one place
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip 
                        icon={<TrendingUpIcon />}
                        label={`${requests.length} Total Requests`} 
                        color="primary" 
                        variant="outlined"
                        size="small"
                    />
                    <Chip 
                        icon={<CheckCircleIcon />}
                        label="Active" 
                        color="success" 
                        variant="outlined"
                        size="small"
                    />
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
                                <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>Description</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>Request Type</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>Created Date</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {requests.length !== 0 ? (
                                requests.map((request, index) => (
                                    <RequestsTableItem key={index} request={request} />
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
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
                                                No requests found
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                                Create your first request to get started!
                                            </Typography>
                                            <Button
                                                component={NavLink}
                                                to="createRequest"
                                                variant="contained"
                                                startIcon={<AddIcon />}
                                                sx={{ borderRadius: 2 }}
                                            >
                                                Create Request
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            
            {requests.length > 0 && (
                <Fab
                    color="primary"
                    aria-label="add"
                    component={NavLink}
                    to="createRequest"
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