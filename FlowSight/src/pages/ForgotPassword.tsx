import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Link as MuiLink,
  Paper
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [error, setError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser.email === email) {
      setStep('reset');
      setError('');
    } else {
      setError('Email not found.');
    }
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    storedUser.password = newPassword;
    localStorage.setItem('user', JSON.stringify(storedUser));
    setIsSubmitted(true);
    setTimeout(() => navigate('/login'), 1500);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        minWidth: '100vw',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            width: '100%', 
            maxWidth: 400,
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Forgot Password
          </Typography>
          {step === 'email' && !isSubmitted && (
            <>
              <Typography variant="body1" align="center" sx={{ mb: 2 }}>
                Enter your email address, if email is present in the system user will be redirected to reset password.
              </Typography>
              <form onSubmit={handleEmailSubmit}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin="normal"
                  required
                />
                {error && <Typography color="error" variant="body2">{error}</Typography>}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  Verify Email
                </Button>
              </form>
            </>
          )}
          {step === 'reset' && !isSubmitted && (
            <>
              <Typography variant="body1" align="center" sx={{ mb: 2 }}>
                Enter your new password below: 
              </Typography>
              <form onSubmit={handlePasswordReset}>
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  margin="normal"
                  required
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  Reset Password
                </Button>
              </form>
            </>
          )}
          {isSubmitted && (
            <Typography variant="body1" align="center" color="success.main">
              Password reset successful
            </Typography>
          )}
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <MuiLink component={Link} to="/login" variant="body2">
              Back to Login
            </MuiLink>
          </Box>
        </Paper>
      </Box>
      <Footer />
    </Box>
  );
};

export default ForgotPassword; 