import React from 'react';
import { Box, Typography, Card, CardContent, Tooltip } from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import TimelineIcon from '@mui/icons-material/Timeline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Footer from '../components/Footer';

const PredictionsTraffic: React.FC = () => {
  const avgSpeed = 33;
  const predBur = "Brooklyn";
  const avgTravelTime = 45;

  return (
    <Box sx={{ minHeight: '100vh', background: '#181818' }}>
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
        Our ML regression model analyze historical patterns and data to predict traffic flow for the future.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 3,
          mb: 4,
        }}
      >
        <Box flex="1 1 220px" minWidth={220} maxWidth={300}>
          <Tooltip title="Weighted mean across all segments.">
            <Card sx={{ bgcolor: '#232323', color: 'white', height: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <SpeedIcon color="primary" sx={{ fontSize: 32 }} />
                <Typography variant="h6">Predicted Average Speed</Typography>
                <Typography variant="h4">{avgSpeed} mph</Typography>
              </CardContent>
            </Card>
          </Tooltip>
        </Box>
        <Box flex="1 1 220px" minWidth={220} maxWidth={300}>
          <Tooltip title="Ratio of predicted travel time to free-flow.">
            <Card sx={{ bgcolor: '#232323', color: 'white', height: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <TimelineIcon color="secondary" sx={{ fontSize: 32 }} />
                <Typography variant="h6">Predicted Busiest Burrough</Typography>
                <Typography variant="h4">{predBur}</Typography>
              </CardContent>
            </Card>
          </Tooltip>
        </Box>
        <Box flex="1 1 220px" minWidth={220} maxWidth={300}>
          <Tooltip title="Highest congestion period (next 3h).">
            <Card sx={{ bgcolor: '#232323', color: 'white', height: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <WarningAmberIcon color="warning" sx={{ fontSize: 32 }} />
                <Typography variant="h6">Average Travel Time</Typography>
                <Typography variant="h4">{avgTravelTime}</Typography>
              </CardContent>
            </Card>
          </Tooltip>
        </Box>
    
      </Box>

      <Box sx={{ maxWidth: 1400, mx: 'auto', mb: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Congestion Visualization
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Understand the predicted traffic flow and congestion levels across the city by visualizing the forecasted data.
        </Typography>
        <Box sx={{ width: '100%', height: 500, borderRadius: 4, mb: 2, overflow: 'hidden' }}>
          <iframe
            src="http://localhost:5173/visualization/traffic_viz/index.html"
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Traffic Visualization"
          />
        </Box>
      </Box>


      <Box sx={{ maxWidth: 900, mx: 'auto', mb: 2, textAlign: 'center' }}>
      </Box>
      <Footer />
    </Box>
  );
};

export default PredictionsTraffic; 