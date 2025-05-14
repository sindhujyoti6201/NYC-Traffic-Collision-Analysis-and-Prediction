import React from 'react';
import { Box, Typography } from '@mui/material';
import Footer from '../components/Footer';

const PredictionsCollision = () => {
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
        background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.1)), url(/src/assets/16.jpg) center/cover',
        color: 'white',
        textAlign: 'center',
        py: 8,
        mb: 4,
      }}>
        <Typography variant="h2" fontWeight={700} gutterBottom>
          Forecasted Accident Hotspots
        </Typography>
        <Typography variant="h5" fontWeight={400} sx={{ mb: 2 }}>
          ML model driven probability maps highlight when and where collisions are most likely to occur.
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, maxWidth: 700, mx: 'auto' }}>
          Our models blend historical crash data and location to project collision risks in advance.
        </Typography>
      </Box>

      {/* Collision Visualization */}
      <Box sx={{ maxWidth: 1400, mx: 'auto', mb: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom sx={{ color: 'white', mt: 2 }}>
          Collision Visualization
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, color: '#ccc' }}>
          Visualization of data from the collision prediction model.
        </Typography>
        <Box sx={{ width: '100%', height: '110vh', borderRadius: 4, mb: 2, overflow: 'hidden' }}>
          <iframe
            src="http://localhost:5173/visualization/collision_viz/index.html"
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Collision Visualization"
          />
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default PredictionsCollision;
