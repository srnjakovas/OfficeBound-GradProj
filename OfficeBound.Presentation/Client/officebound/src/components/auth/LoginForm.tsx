import {useNavigate} from "react-router-dom";
import {useState} from "react";
import apiConnector from "../../api/apiConnector.ts";
import { useAuth } from "../../contexts/AuthContext";
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
    Login as LoginIcon,
    PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";

export default function LoginForm() {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
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

        const newErrors: Record<string, string> = {};
        
        if (!formData.username.trim()) {
            newErrors.username = t('validation.username.required');
        }

        if (!formData.password) {
            newErrors.password = t('validation.password.required');
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsSubmitting(false);
            return;
        }

        apiConnector.login(formData.username, formData.password)
            .then((response) => {
                localStorage.setItem('token', response.token);
                setUser(response.user);
                
                navigate('/');
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
                    setErrors({ submit: error.response?.data?.detail || t('validation.username.or.password.missmatch') });
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
                    {t('general.sign.in')}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {t('auth.login.description')}
                </Typography>
            </Box>

            <Paper elevation={2} sx={{ p: 4 }}>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
                            label={t('general.username')}
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder={t('general.username.description')}
                            required
                            error={!!errors.username}
                            helperText={errors.username}
                            autoComplete="username"
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
                            label={t('general.password')}
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder={t('general.password.description')}
                            required
                            error={!!errors.password}
                            helperText={errors.password}
                            autoComplete="current-password"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', mt: 2 }}>
                            <Button
                                onClick={() => navigate('/signup')}
                                variant="text"
                                size="medium"
                                type="button"
                                startIcon={<PersonAddIcon />}
                                disabled={isSubmitting}
                            >
                                {t('general.sign.up')}
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                startIcon={<LoginIcon />}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? t('general.loading') : t('general.sign.in')}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}

