import React from 'react';
import { Box, Typography, Card, CardContent, Button, Tooltip } from '@mui/material';
import ReportIcon from '@mui/icons-material/Report';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import Footer from '../components/Footer';

const Collision: React.FC = () => {
  const collisions = 20;
  const injuriesLastHour = 10;
  const mostImpactedBorough = "Brooklyn";

  return (
    <Box sx={{ minHeight: '100vh', background: '#181818' }}>
      <Box sx={{
        width: '100vw',
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.1)), url(/src/assets/thirteen.jpg) center/cover',
        color: 'white',
        textAlign: 'center',
        py: 8,
        mb: 4,
      }}>
        <Typography variant="h2" fontWeight={700} gutterBottom>
          NYC Collisions Data - Incidents Unfolding Now
        </Typography>
        <Typography variant="h5" fontWeight={400} sx={{ mb: 2 }}>
          Live crash data and hotspot detection.
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, maxWidth: 700, mx: 'auto' }}>
          Powered by our realtime MongoDB stream we highlight accident incidents.
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
          <Tooltip title="Count of unique reports (all severities) in last 60 min.">
            <Card sx={{ bgcolor: '#232323', color: 'white', height: 140, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <CardContent>
                <ReportIcon color="error" sx={{ fontSize: 32 }} />
                <Typography variant="h6">Collisions</Typography>
                <Typography variant="h4">{collisions}</Typography>
              </CardContent>
            </Card>
          </Tooltip>
        </Box>
        <Box flex="1 1 220px" minWidth={220} maxWidth={300}>
          <Tooltip title="Sum of persons injured in last 60 min.">
            <Card sx={{ bgcolor: '#232323', color: 'white', height: 140, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <CardContent>
                <LocalHospitalIcon color="primary" sx={{ fontSize: 32 }} />
                <Typography variant="h6">Total Injuries (60 min)</Typography>
                <Typography variant="h4">{injuriesLastHour}</Typography>
              </CardContent>
            </Card>
          </Tooltip>
        </Box>
        <Box flex="1 1 220px" minWidth={220} maxWidth={300}>
          <Tooltip title="Borough with highest collision count (24h).">
            <Card sx={{ bgcolor: '#232323', color: 'white', height: 140, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <CardContent>
                <LocationCityIcon color="secondary" sx={{ fontSize: 32 }} />
                <Typography variant="h6">Most Impacted Borough</Typography>
                <Typography variant="h4">{mostImpactedBorough}</Typography>
              </CardContent>
            </Card>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1400, mx: 'auto', mb: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Live Collision Map
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
        Display MongoDB Data in a table format
        </Typography>
        <Box sx={{ width: '100%', height: 350, bgcolor: '#222', borderRadius: 4, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="caption" color="#aaa">[Placeholder]</Typography>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 900, mx: 'auto', mb: 4, bgcolor: '#1976d2', color: 'white', borderRadius: 3, p: 3, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Wondering where crashes may occur next?
        </Typography>
        <Button variant="contained" color="secondary" href="/predictions/collision">
          Explore Collision Predictions
        </Button>
      </Box>

      <Box sx={{ maxWidth: 900, mx: 'auto', mb: 2, textAlign: 'center' }}>
      </Box>
      <Footer />
    </Box>
  );
};

export default Collision; 