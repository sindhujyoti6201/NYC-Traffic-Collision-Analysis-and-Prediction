import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Button, CardHeader, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Chip } from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import TrafficIcon from '@mui/icons-material/Traffic';
import TimelineIcon from '@mui/icons-material/Timeline';
import Footer from '../components/Footer';

interface TrafficData {
  _id: string;
  coordinates: string;
  speed_mph: number;
  street: string;
  timestamp: string;
}

interface ApiResponse {
  collection: string;
  data: TrafficData[];
}

const Traffic: React.FC = () => {
  const [avgSpeed, setAvgSpeed] = useState("NA");
  const [busiestStreet, setBusiestStreet] = useState("NA");
  const [avgVehiclePerStreet, setAvgVehiclePerStreet] = useState("NA");
  const [metricsLoaded, setMetricsLoaded] = useState(false);
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5002/api/traffic?days=90&limit=100');
        const data: ApiResponse = await response.json();
        setTrafficData(data.data);
        setError(null);
      } catch {
        setError('Failed to fetch traffic data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateString: string) => new Date(dateString).toLocaleString();

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
          Live Traffic Congestion Data
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Displaying Traffic MongoDB Data in tabular format
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 2, bgcolor: 'error.main', borderRadius: 1 }}>
            <Typography color="white">{error}</Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ bgcolor: '#232323', color: 'white' }}>
            <Table sx={{ minWidth: 650 }} aria-label="traffic table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>Traffic ID</TableCell>
                  <TableCell sx={{ color: 'white' }}>Time</TableCell>
                  <TableCell sx={{ color: 'white' }}>Street</TableCell>
                  <TableCell sx={{ color: 'white' }}>Speed(mph)</TableCell>
                  <TableCell sx={{ color: 'white' }}>Coordinates</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trafficData.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell sx={{ color: 'white' }}>{row._id}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{formatDate(row.timestamp)}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{row.street}</TableCell>
                    <TableCell>
                      <Chip
                        label={typeof row.speed_mph === 'number' ? row.speed_mph.toFixed(2) : 'N/A'}
                        color={
                          row.speed_mph > 35
                            ? 'error'
                            : row.speed_mph > 20
                            ? 'warning'
                            : 'success'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ color: 'white' }}>
                      {row.coordinates}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
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
