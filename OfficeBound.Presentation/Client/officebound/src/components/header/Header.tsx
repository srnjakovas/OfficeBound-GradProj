import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, useMediaQuery, useTheme, Avatar, Tooltip } from '@mui/material';
import { Menu as MenuIcon, DarkMode, LightMode, Assignment, Business, Login, Logout, AdminPanelSettings } from '@mui/icons-material';
import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../../assets/images/office-bound-logo.jpg';
import { useAuth } from '../../contexts/AuthContext';
import { canManageDepartments, canApproveAccounts, getRoleName } from '../../utils/roles';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

export default function Header({ darkMode, setDarkMode }: HeaderProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useTranslation();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    navigate('/login');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        background: darkMode 
          ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
          : 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
        borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <Avatar
            src={Logo}
            alt="OfficeBound"
            sx={{
              width: 48,
              height: 48,
              mr: 2,
              border: `2px solid ${darkMode ? '#60a5fa' : '#ffffff'}`,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }}
          />
          <Typography 
            variant="h5" 
            component={NavLink}
            to="/"
            sx={{ 
              fontWeight: 700,
              background: darkMode 
                ? 'linear-gradient(45deg, #60a5fa, #a78bfa)'
                : 'linear-gradient(45deg, #ffffff, #f1f5f9)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: darkMode ? '0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
              textDecoration: 'none',
            }}
          >
            OfficeBound
          </Typography>
        </Box>
        
        {isAuthenticated && (
          <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
            <Button
              component={NavLink}
              to="/"
              color="inherit"
              startIcon={<Assignment />}
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                px: 2,
                py: 1,
                borderRadius: 2,
                backgroundColor: location.pathname === '/' || location.pathname.includes('Request') 
                  ? 'rgba(255, 255, 255, 0.2)' 
                  : 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {t('general.requests')}
            </Button>
            {user && canManageDepartments(user.role) && (
              <Button
                component={NavLink}
                to="/departments"
                color="inherit"
                startIcon={<Business />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  backgroundColor: location.pathname.includes('Department')
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {t('general.departments')}
              </Button>
            )}
            {user && canApproveAccounts(user.role) && (
              <Button
                component={NavLink}
                to="/account-approvals"
                color="inherit"
                startIcon={<AdminPanelSettings />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  backgroundColor: location.pathname.includes('account-approvals')
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {t('general.account.approvals')}
              </Button>
            )}
          </Box>
        )}
        
        <Box sx={{ flexGrow: 1 }} />
        
        {isAuthenticated && user ? (
          <>
            <Tooltip title={`${user.username} (${getRoleName(user.role)})`}>
              <IconButton
                onClick={handleUserMenuOpen}
                sx={{
                  mr: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                  {user.username.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={userMenuAnchor}
              open={Boolean(userMenuAnchor)}
              onClose={handleUserMenuClose}
              PaperProps={{
                sx: {
                  backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                  border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                  mt: 1,
                }
              }}
            >
              <MenuItem disabled>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {user.username}
                </Typography>
              </MenuItem>
              <MenuItem disabled>
                <Typography variant="body2" color="text.secondary">
                  {getRoleName(user.role)}
                </Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} />
                {t('general.logout')}
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Button
            component={NavLink}
            to="/login"
            color="inherit"
            startIcon={<Login />}
            sx={{
              mr: 2,
              textTransform: 'none',
              fontWeight: 500,
              px: 2,
              py: 1,
              borderRadius: 2,
              backgroundColor: location.pathname === '/login' 
                ? 'rgba(255, 255, 255, 0.2)' 
                : 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {t('general.sign.in')}
          </Button>
        )}
        
        <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
          <IconButton
            onClick={toggleDarkMode}
            color="inherit"
            aria-label="toggle dark mode"
            sx={{
              backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
              '&:hover': {
                backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.3)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {darkMode ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Tooltip>
        
        {isMobile ? (
          <>
            <IconButton
              size="large"
              edge="end"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
              sx={{
                backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                  border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                }
              }}
            >
            {isAuthenticated && (
              <>
                <MenuItem component={NavLink} to="/" onClick={handleClose}>
                  <Assignment sx={{ mr: 1 }} />
                  {t('general.requests')}
                </MenuItem>
                {user && canManageDepartments(user.role) && (
                  <MenuItem component={NavLink} to="/departments" onClick={handleClose}>
                    <Business sx={{ mr: 1 }} />
                    {t('general.departments')}
                  </MenuItem>
                )}
                {user && canApproveAccounts(user.role) && (
                  <MenuItem component={NavLink} to="/account-approvals" onClick={handleClose}>
                    <AdminPanelSettings sx={{ mr: 1 }} />
                    {t('general.account.approvals')}
                  </MenuItem>
                )}
              </>
            )}
            </Menu>
          </>
        ) : null}
      </Toolbar>
    </AppBar>
  );
}