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

const commonPasswords = [
  'password', '123456', '12345678', '1234', 'qwerty', '12345',
  'dragon', 'baseball', 'football', 'letmein', 'monkey', 'abc123'
];

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const navigate = useNavigate();

  const validatePassword = (pass: string) => {
    const errors: string[] = [];
    
    if (pass.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(pass)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(pass)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(pass)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) {
      errors.push('Password must contain at least one special character');
    }
    if (commonPasswords.includes(pass.toLowerCase())) {
      errors.push(' Password is too common and easily guessable');
    }

    return errors;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: undefined }));
    }

    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      setErrors(prev => ({ ...prev, password: passwordErrors.join('. ') }));
    } else {
      setErrors(prev => ({ ...prev, password: undefined }));
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    
    if (password && newConfirmPassword && password !== newConfirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setErrors(prev => ({ ...prev, password: passwordErrors.join('. ') }));
      return;
    }

    if (password !== confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      return;
    }

    localStorage.setItem('user', JSON.stringify({ name, email, password }));
    alert('Signup successful!');
    navigate('/login');
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
            Sign Up
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              margin="normal"
              required
              error={!!errors.password}
              helperText={errors.password}
            />
            
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              margin="normal"
              required
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              disabled={!!errors.password || !!errors.confirmPassword}
            >
              Sign Up
            </Button>
          </form>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <MuiLink component={Link} to="/login" variant="body2">
              Account already present? Please Login
            </MuiLink>
          </Box>
        </Paper>
      </Box>
      <Footer />
    </Box>
  );
};

export default Signup; 