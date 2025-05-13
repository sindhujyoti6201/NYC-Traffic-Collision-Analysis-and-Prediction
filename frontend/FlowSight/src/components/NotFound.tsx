import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => (
  <Box sx={{ textAlign: 'center', mt: 8 }}>
    <Typography variant="h2" gutterBottom>
      404 : Page Not Found
    </Typography>
    <Typography variant="h4" gutterBottom>
      The page you are looking for does not exist.
    </Typography>
    <Button variant="contained" color="primary" component={Link} to="/">
      Go Back to Home
    </Button>
  </Box>
);

export default NotFound; 