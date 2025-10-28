import { Box, Container, Typography, Link, useTheme } from '@mui/material';
import { 
  GitHub, 
  LinkedIn, 
  Email, 
  Info as InfoIcon,
  Star as StarIcon,
  Login as LoginIcon,
  Help as HelpIcon,
  ContactMail as ContactIcon,
  Policy as PolicyIcon,
} from '@mui/icons-material';

export default function Footer() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      component="footer"
      sx={{
        background: isDark 
          ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
          : 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
        color: 'white',
        py: 4,
        mt: 'auto',
        borderTop: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 4,
            mb: 3,
          }}
        >
          <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #60a5fa, #a78bfa)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              OfficeBound
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
              Streamline your office requests and improve workplace efficiency with our modern, intuitive platform.
            </Typography>
          </Box>
          
          <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link 
                href="#" 
                color="inherit" 
                sx={{ 
                  mb: 1,
                  opacity: 0.8,
                  display: 'flex',
                  alignItems: 'center',
                  '&:hover': {
                    opacity: 1,
                    textDecoration: 'underline',
                  },
                  transition: 'opacity 0.3s ease',
                }}
              >
                <InfoIcon sx={{ mr: 1, fontSize: 16 }} />
                Features
              </Link>
              <Link 
                href="#" 
                color="inherit" 
                sx={{ 
                  mb: 1,
                  opacity: 0.8,
                  display: 'flex',
                  alignItems: 'center',
                  '&:hover': {
                    opacity: 1,
                    textDecoration: 'underline',
                  },
                  transition: 'opacity 0.3s ease',
                }}
              >
                <StarIcon sx={{ mr: 1, fontSize: 16 }} />
                Testimonials
              </Link>
              <Link 
                href="#" 
                color="inherit" 
                sx={{ 
                  mb: 1,
                  opacity: 0.8,
                  display: 'flex',
                  alignItems: 'center',
                  '&:hover': {
                    opacity: 1,
                    textDecoration: 'underline',
                  },
                  transition: 'opacity 0.3s ease',
                }}
              >
                <LoginIcon sx={{ mr: 1, fontSize: 16 }} />
                Sign In
              </Link>
            </Box>
          </Box>
          
          <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Support
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link 
                href="#" 
                color="inherit" 
                sx={{ 
                  mb: 1,
                  opacity: 0.8,
                  display: 'flex',
                  alignItems: 'center',
                  '&:hover': {
                    opacity: 1,
                    textDecoration: 'underline',
                  },
                  transition: 'opacity 0.3s ease',
                }}
              >
                <HelpIcon sx={{ mr: 1, fontSize: 16 }} />
                Help Center
              </Link>
              <Link 
                href="#" 
                color="inherit" 
                sx={{ 
                  mb: 1,
                  opacity: 0.8,
                  display: 'flex',
                  alignItems: 'center',
                  '&:hover': {
                    opacity: 1,
                    textDecoration: 'underline',
                  },
                  transition: 'opacity 0.3s ease',
                }}
              >
                <ContactIcon sx={{ mr: 1, fontSize: 16 }} />
                Contact Us
              </Link>
              <Link 
                href="#" 
                color="inherit" 
                sx={{ 
                  mb: 1,
                  opacity: 0.8,
                  display: 'flex',
                  alignItems: 'center',
                  '&:hover': {
                    opacity: 1,
                    textDecoration: 'underline',
                  },
                  transition: 'opacity 0.3s ease',
                }}
              >
                <PolicyIcon sx={{ mr: 1, fontSize: 16 }} />
                Privacy Policy
              </Link>
            </Box>
          </Box>
          
          <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Connect
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Link 
                href="#" 
                color="inherit"
                sx={{
                  opacity: 0.8,
                  '&:hover': {
                    opacity: 1,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <GitHub sx={{ fontSize: 24 }} />
              </Link>
              <Link 
                href="#" 
                color="inherit"
                sx={{
                  opacity: 0.8,
                  '&:hover': {
                    opacity: 1,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <LinkedIn sx={{ fontSize: 24 }} />
              </Link>
              <Link 
                href="#" 
                color="inherit"
                sx={{
                  opacity: 0.8,
                  '&:hover': {
                    opacity: 1,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <Email sx={{ fontSize: 24 }} />
              </Link>
            </Box>
          </Box>
        </Box>
        
        <Box
          sx={{
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            mt: 3,
            pt: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © {new Date().getFullYear()} OfficeBound. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
