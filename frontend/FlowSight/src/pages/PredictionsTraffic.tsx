import React from 'react';
import { Box, Typography } from '@mui/material';
import Footer from '../components/Footer';

const PredictionsTraffic = () => {
  return (
    <Box sx={{ minHeight: '100vh', background: '#181818' }}>
      {/* Header */}
      <Box sx={{
        width: '100vw',
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.25)), url(/src/assets/17.jpg) center/cover',
        color: 'white',
        textAlign: 'center',
        py: 8,
        mb: 4,
      }}>
        <Typography variant="h2" fontWeight={700} gutterBottom>
          Future's Congestion, Predicted Today
        </Typography>
        <Typography variant="h5" fontWeight={400} sx={{ mb: 2 }}>
          Our ML regression model analyzes historical patterns and data to predict traffic flow for the future.
        </Typography>
      </Box>

      {/* Visualization */}
      <Box sx={{ maxWidth: 1400, mx: 'auto', mb: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Congestion Visualization
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Understand the predicted traffic flow and congestion levels across the city by visualizing the forecasted data.
        </Typography>
        <Box sx={{ width: '100%', height: '110vh', borderRadius: 4, mb: 2, overflow: 'hidden' }}>
                <iframe
                  src="http://localhost:5173/visualization/traffic_viz/index.html"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  title="Collision Visualization"
                />
              </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default PredictionsTraffic;
