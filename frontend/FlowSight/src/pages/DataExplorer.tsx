import React from 'react';
import { Box, Typography } from '@mui/material';

const DataExplorer: React.FC = () => (
  <Box sx={{ mt: 10 }}>
    <Typography variant="h4" gutterBottom>
      Data Explorer
    </Typography>
    <Typography>
      Explore raw or summarized traffic and collision data.
    </Typography>
  </Box>
);

export default DataExplorer; 