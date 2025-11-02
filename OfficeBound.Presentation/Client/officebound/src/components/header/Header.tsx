import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, useMediaQuery, useTheme, Avatar, Tooltip } from '@mui/material';
import { Menu as MenuIcon, DarkMode, LightMode, Assignment, Business, Login } from '@mui/icons-material';
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Logo from '../../assets/images/office-bound-logo.jpg';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

export default function Header({ darkMode, setDarkMode }: HeaderProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
        
        {/* Navigation Links */}
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
            Requests
          </Button>
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
            Departments
          </Button>
        </Box>
        
        <Box sx={{ flexGrow: 1 }} />
        
        {/* Sign In Button */}
        <Button
          color="inherit"
          startIcon={<Login />}
          sx={{
            mr: 1,
            textTransform: 'none',
            fontWeight: 500,
            px: 2,
            py: 1,
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Sign in
        </Button>
        
        {/* Log In Button */}
        <Button
          color="inherit"
          startIcon={<Login />}
          sx={{
            mr: 2,
            textTransform: 'none',
            fontWeight: 500,
            px: 2,
            py: 1,
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Log in
        </Button>
        
        {/* Dark Mode Toggle */}
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
            <MenuItem component={NavLink} to="/" onClick={handleClose}>
              <Assignment sx={{ mr: 1 }} />
              Requests
            </MenuItem>
            <MenuItem component={NavLink} to="/departments" onClick={handleClose}>
              <Business sx={{ mr: 1 }} />
              Departments
            </MenuItem>
            </Menu>
          </>
        ) : null}
      </Toolbar>
    </AppBar>
  );
}