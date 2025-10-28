import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, useMediaQuery, useTheme, Avatar } from '@mui/material';
import { Menu as MenuIcon, DarkMode, LightMode, Star, Login, Info } from '@mui/icons-material';
import { useState } from 'react';
import Logo from '../../assets/images/office-bound-logo.jpg';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

export default function Header({ darkMode, setDarkMode }: HeaderProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
            component="div" 
            sx={{ 
              fontWeight: 700,
              background: darkMode 
                ? 'linear-gradient(45deg, #60a5fa, #a78bfa)'
                : 'linear-gradient(45deg, #ffffff, #f1f5f9)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: darkMode ? '0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            OfficeBound
          </Typography>
        </Box>
        
        <Box sx={{ flexGrow: 1 }} />
        
        {/* Dark Mode Toggle */}
        <IconButton
          onClick={toggleDarkMode}
          color="inherit"
          sx={{
            mr: 2,
            backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
            '&:hover': {
              backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.3)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          {darkMode ? <LightMode /> : <DarkMode />}
        </IconButton>
        
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
            <MenuItem onClick={handleClose}>
              <Info sx={{ mr: 1 }} />
              Features
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Star sx={{ mr: 1 }} />
              Testimonials
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Login sx={{ mr: 1 }} />
              Sign In
            </MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              color="inherit" 
              startIcon={<Info />}
              sx={{ 
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
              Features
            </Button>
            <Button 
              color="inherit" 
              startIcon={<Star />}
              sx={{ 
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
              Testimonials
            </Button>
            <Button 
              color="inherit" 
              startIcon={<Login />}
              sx={{ 
                textTransform: 'none',
                fontWeight: 500,
                px: 2,
                py: 1,
                borderRadius: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Sign In
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}