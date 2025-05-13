import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CardHeader, Button, CircularProgress } from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import Footer from '../components/Footer';

const RealTime: React.FC = () => {
  const [avgSpeed, setAvgSpeed] = useState(35);
  const [activeIncidents, setActiveIncidents] = useState(20);
  const [mostCongested, setMostCongested] = useState('Broadway Manhattan');
  const [metricsLoaded, setMetricsLoaded] = useState(false);
  const BACKEND_URL = 'http://localhost:5002';

  useEffect(() => {
    const fetchRealtimeMetrics = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/realtime-traffic-metrics`);
        const data = await response.json();
        console.log('Response:', data);
        if (data.status === 'success') {
          console.log('Fetched Realtime Metrics:', data);
          setAvgSpeed(data.avgSpeed);
          setActiveIncidents(data.activeIncidents);
          setMostCongested(data.mostCongested);
        }
      } catch (error) {
        console.error('Error fetching realtime metrics:', error);
      } finally {
        setMetricsLoaded(true);
      }
    };

    fetchRealtimeMetrics();
  }, []);

  if (!metricsLoaded) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#181818' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: '#181818' }}>
      <Box sx={{
        width: '100vw',
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.25)), url(/src/assets/seven.jpg) center/cover',
        color: 'white',
        textAlign: 'center',
        py: 8,
        mb: 4,
      }}>
        <Typography variant="h2" fontWeight={700} gutterBottom>
          Real Time Data : NYC Streets - Right Now
        </Typography>
        <Typography variant="h5" fontWeight={400} sx={{ mb: 2 }}>
          Live traffic speeds, accidents and collsions data and more in one dashboard.
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, maxWidth: 700, mx: 'auto' }}>
          Track congestion and collisions as they happen, display data from MongoDB for traffic and collisions along with data visualization.
        </Typography>
      </Box>

      <Box display="flex" flexWrap="wrap" justifyContent="center" gap={3} sx={{ mb: 4 }}>
        <Box flex="1 1 220px" minWidth={220} maxWidth={300}>
          <Card sx={{ bgcolor: '#232323', color: 'white', height: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <CardHeader avatar={<SpeedIcon color="primary" />} title="Average City Speed" />
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h4">{avgSpeed} mph</Typography>
            </CardContent>
          </Card>
        </Box>
        <Box flex="1 1 220px" minWidth={220} maxWidth={300}>
          <Card sx={{ bgcolor: '#232323', color: 'white', height: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <CardHeader avatar={<WarningAmberIcon color="error" />} title="Active Incidents" />
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h4">{activeIncidents}</Typography>
            </CardContent>
          </Card>
        </Box>
        <Box flex="1 1 220px" minWidth={220} maxWidth={300}>
          <Card sx={{ bgcolor: '#232323', color: 'white', height: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <CardHeader avatar={<AltRouteIcon color="secondary" />} title="Most Congested Street" />
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h6">{mostCongested}</Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1400, mx: 'auto', mb: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Live Traffic Map
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Zoom into any borough to see color coded traffic.
        </Typography>
        <Box sx={{ width: '100%', height: 350, background: '#222', borderRadius: 4, mb: 2, overflow: 'hidden' }}>
          <iframe
            title="NYC Traffic Map"
            width="100%"
            height="350"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24156.69001999413!2d-74.0060!3d40.7128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQyJzQ2LjEiTiA3NMKwMDAnMjIuMiJX!5e0!3m2!1sen!2sus!4v1680000000000!5m2!1sen!2sus&layer=t"
          ></iframe>
        </Box>
        <Button
            variant="contained"
            color="primary"
            href="https://www.google.com/maps/@40.7128,-74.0060,12z/data=!5m1!1e1"
            target="_blank"
            rel="noopener noreferrer"
            size="large"
          >
          Live NYC Traffic Map
        </Button>
      </Box>

      <Box sx={{ maxWidth: 900, mx: 'auto', mb: 4, bgcolor: '#1976d2', color: 'white', borderRadius: 3, p: 3, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Planning Ahead?? Use our Predictions Dashboard
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Explore the Predictions dashboard to see congestion forecasts and collision.
        </Typography>
        <Button variant="contained" color="secondary" href="/predictions/home">
          Go to Predictions
        </Button>
      </Box>      
      <Footer />
    </Box>
  );
};

export default RealTime;
