import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer: React.FC = () => (
  <Box sx={{ py: 4, px: { xs: 2, md: 8 }, background: '#222', color: 'white', textAlign: 'center' }}>
    <Typography variant="body1" sx={{ mb: 1 }}>
      &copy; Team @FlowSight
    </Typography>
  </Box>
);

export default Footer; 