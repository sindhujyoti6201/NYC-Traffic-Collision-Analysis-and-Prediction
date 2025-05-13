import React from 'react';
import { Box, Typography, Card, CardContent, Tooltip } from '@mui/material';
import ReportIcon from '@mui/icons-material/Report';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Footer from '../components/Footer';

const PredictionsCollision: React.FC = () => {
  const expectedCollisions = 6;
  const topRiskBorough = "Queens";
  const collProbPerct = "22%";

  return (
    <Box sx={{ minHeight: '100vh', background: '#181818' }}>
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
          <Tooltip title="Sum of grid-level probabilities ≥ 0.5.">
            <Card sx={{ bgcolor: '#232323', color: 'white', height: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <ReportIcon color="error" sx={{ fontSize: 32 }} />
                <Typography variant="h6">Expected New Collisions</Typography>
                <Typography variant="h4">{expectedCollisions}</Typography>
              </CardContent>
            </Card>
          </Tooltip>
        </Box>
        <Box flex="1 1 220px" minWidth={220} maxWidth={300}>
          <Tooltip title="Highest aggregate risk score.">
            <Card sx={{ bgcolor: '#232323', color: 'white', height: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <LocationCityIcon color="secondary" sx={{ fontSize: 32 }} />
                <Typography variant="h6">Top Risk Borough</Typography>
                <Typography variant="h4">{topRiskBorough}</Typography>
              </CardContent>
            </Card>
          </Tooltip>
        </Box>
        <Box flex="1 1 220px" minWidth={220} maxWidth={300}>
          <Tooltip title="City‑wide chance of ≥ 1 severe (injury / fatal) crash.">
            <Card sx={{ bgcolor: '#232323', color: 'white', height: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <WarningAmberIcon color="warning" sx={{ fontSize: 32 }} />
                <Typography variant="h6">Collision Probability</Typography>
                <Typography variant="h4">{collProbPerct}%</Typography>
              </CardContent>
            </Card>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1400, mx: 'auto', mb: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Collision Visualization
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Visualization of data from the collision prediction model.
        </Typography>
        <Box sx={{ width: '100%', height: 350, bgcolor: '#222', borderRadius: 4, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="caption" color="#aaa">[Visualization placeholder]</Typography>
        </Box>
      </Box>
      <Box sx={{ maxWidth: 900, mx: 'auto', mb: 2, textAlign: 'center' }}>
      </Box>
      <Footer />
    </Box>
  );
};

export default PredictionsCollision; 