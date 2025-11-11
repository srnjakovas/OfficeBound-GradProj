import {useNavigate} from "react-router-dom";
import {useState} from "react";
import apiConnector from "../../api/apiConnector.ts";
import {
    Button,
    TextField,
    Paper,
    Typography,
    Box,
    Container,
    InputAdornment,
    Alert,
} from "@mui/material";
import {
    Person as PersonIcon,
    Lock as LockIcon,
    LockOutlined as LockOutlinedIcon,
    Add as AddIcon,
    CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

export default function SignUpForm() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});
        setSuccessMessage('');

        const newErrors: Record<string, string> = {};
        
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsSubmitting(false);
            return;
        }

        apiConnector.signUp(formData.username, formData.password, formData.confirmPassword)
            .then((response) => {
                setSuccessMessage(response.message);
                setFormData({
                    username: '',
                    password: '',
                    confirmPassword: '',
                });
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            })
            .catch((error: any) => {
                const errors = error.response?.data?.errors || error.response?.data?.extensions?.errors || [];
                
                if (errors && Array.isArray(errors) && errors.length > 0) {
                    const backendErrors: Record<string, string> = {};
                    errors.forEach((err: any) => {
                        const property = err.Property || err.property;
                        const errorMessage = err.ErrorMessage || err.errorMessage;
                        if (property && errorMessage) {
                            backendErrors[property.toLowerCase()] = errorMessage;
                        }
                    });
                    setErrors(backendErrors);
                } else {
                    setErrors({ submit: error.response?.data?.detail || 'An error occurred. Please try again.' });
                }
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    }

    return (
        <Container maxWidth="sm" sx={{ py: 5 }}>
            <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                    Create Account
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Sign up for a new account. Your request will be reviewed by an administrator.
                </Typography>
            </Box>

            <Paper elevation={2} sx={{ p: 4 }}>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {successMessage && (
                            <Alert 
                                severity="success" 
                                icon={<CheckCircleIcon />}
                                onClose={() => setSuccessMessage('')}
                            >
                                {successMessage}
                            </Alert>
                        )}

                        {errors.submit && (
                            <Alert severity="error" onClose={() => setErrors((prev) => {
                                const newErrors = { ...prev };
                                delete newErrors.submit;
                                return newErrors;
                            })}>
                                {errors.submit}
                            </Alert>
                        )}

                        <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder="Enter your username"
                            required
                            error={!!errors.username}
                            helperText={errors.username}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter your password"
                            required
                            error={!!errors.password}
                            helperText={errors.password || 'Minimum 6 characters'}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirm your password"
                            required
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlinedIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                            <Button
                                onClick={() => navigate('/login')}
                                variant="outlined"
                                size="large"
                                type="button"
                                disabled={isSubmitting}
                            >
                                Back to Login
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                startIcon={<AddIcon />}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}

