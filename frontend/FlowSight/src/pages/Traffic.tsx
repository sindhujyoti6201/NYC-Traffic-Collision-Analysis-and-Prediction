import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Button, CardHeader, CircularProgress } from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import TrafficIcon from '@mui/icons-material/Traffic';
import TimelineIcon from '@mui/icons-material/Timeline';
import Footer from '../components/Footer';

const Traffic: React.FC = () => {
  const [avgSpeed, setAvgSpeed] = useState("NA");
  const [busiestStreet, setBusiestStreet] = useState("NA");
  const [avgVehiclePerStreet, setAvgVehiclePerStreet] = useState("NA");
  const [metricsLoaded, setMetricsLoaded] = useState(false);

  useEffect(() => {
    const BACKEND_URL = 'http://localhost:5002';
    const fetchRealtimeMetrics = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/realtime-traffic-metrics`);
        const data = await response.json();
        if (data.status === 'success') {
          setAvgSpeed(data.avgSpeed);
          setBusiestStreet(data.busiestStreet);
          setAvgVehiclePerStreet(data.avgVehiclesPerStreet);
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
        background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.1)), url(/src/assets/twelve.jpg) center/cover',
        color: 'white',
        textAlign: 'center',
        py: 8,
        mb: 4,
      }}>
        <Typography variant="h2" fontWeight={700} gutterBottom>
         Live Congestion Data Across NYC
        </Typography>
        <Typography variant="h5" fontWeight={400} sx={{ mb: 2 }}>
          Instant Traffic data streamed and displayed in tabular format. Powered by our real time MongoDB stream
        </Typography>
      </Box>

      {/* Equal height cards */}
      <Box display="flex" flexWrap="wrap" justifyContent="center" gap={3} sx={{ mb: 4 }}>
        <Box flex="1 1 220px" minWidth={220} maxWidth={300}>
          <Card sx={{ bgcolor: '#232323', color: 'white', height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <CardHeader avatar={<SpeedIcon color="primary" />} title="Average City-wide Speed" />
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h4">{avgSpeed} mph</Typography>
            </CardContent>
          </Card>
        </Box>

        <Box flex="1 1 220px" minWidth={220} maxWidth={300}>
          <Card sx={{ bgcolor: '#232323', color: 'white', height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <CardHeader avatar={<TrafficIcon color="error" />} title="Busiest Street" />
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography
                variant="h6"
                sx={{
                  maxHeight: 80,
                  overflowY: 'auto',
                  wordWrap: 'break-word',
                  textAlign: 'center'
                }}
              >
                {busiestStreet}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box flex="1 1 220px" minWidth={220} maxWidth={300}>
          <Card sx={{ bgcolor: '#232323', color: 'white', height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <CardHeader avatar={<TimelineIcon color="secondary" />} title="Average vehicle per street" />
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h4">{avgVehiclePerStreet}</Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1400, mx: 'auto', mb: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Live Congestion Data
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
          Curious to know how today's traffic jams could impact your commute?
        </Typography>
        <Button variant="contained" color="secondary" href="/predictions/traffic">
          View Collision Risk & Traffic Predictions
        </Button>
      </Box>
      <Footer />
    </Box>
  );
};

export default Traffic;
