import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Button, Tooltip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Chip } from '@mui/material';
import ReportIcon from '@mui/icons-material/Report';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import Footer from '../components/Footer';

interface CollisionData {
  _id: string;
  borough: string | null;
  collision_id: string;
  injured: string;
  killed: string;
  lat: number;
  lon: number;
  timestamp: string;
  vehicle_types: (string | null)[];
}

interface ApiResponse {
  collection: string;
  data: CollisionData[];
}

const Collision: React.FC = () => {
  const [collisions, setCollisions] = useState(20);
  const [injuriesLastHour, setInjuriesLastHour] = useState("NA");
  const [mostImpactedBorough, setMostImpactedBorough] = useState("NA");
  const [metricsLoaded, setMetricsLoaded] = useState(false);
  const [collisionData, setCollisionData] = useState<CollisionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const BACKEND_URL = 'http://localhost:5002';
    const fetchRealtimeCollisions = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/realtime-collision-metrics`);
        const data = await response.json();
        if (data.status === 'success') {
          setCollisions(data.collisions);
          setInjuriesLastHour(data.totalInjuries);
          setMostImpactedBorough(data.mostImpactedBorough);
        }
      } catch (error) {
        console.error('Error fetching collision metrics:', error);
      } finally {
        setMetricsLoaded(true);
      }
    };

    fetchRealtimeCollisions();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5002/api/collisions?days=90&limit=100');
        const data: ApiResponse = await response.json();
        setCollisionData(data.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching collision data:', error);
        setError('Failed to fetch collision data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getSeverityColor = (injured: string, killed: string) => {
    const injuredNum = parseInt(injured);
    const killedNum = parseInt(killed);
    if (killedNum > 0) return 'error';
    if (injuredNum > 0) return 'warning';
    return 'success';
  };

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
                <Typography variant="h6">Total Injuries</Typography>
                <Typography variant="h4">{injuriesLastHour}</Typography>
              </CardContent>
            </Card>
          </Tooltip>
        </Box>
        <Box flex="1 1 220px" minWidth={220} maxWidth={300}>
          <Tooltip title="Borough with highest collision count (60 min).">
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
          Live Collision Data
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Displaying collision MongoDB Data in tabular format
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
            <Table sx={{ minWidth: 650 }} aria-label="collision table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>CollisionID</TableCell>
                  <TableCell sx={{ color: 'white' }}>Time</TableCell>
                  <TableCell sx={{ color: 'white' }}>Borough</TableCell>
                  <TableCell sx={{ color: 'white' }}>Location</TableCell>
                  <TableCell sx={{ color: 'white' }}>Severity</TableCell>
                  <TableCell sx={{ color: 'white' }}>Vehicles Involved</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {collisionData.map((collision) => (
                  <TableRow
                    key={collision._id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell sx={{ color: 'white' }}>{collision.collision_id}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{formatDate(collision.timestamp)}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{collision.borough || 'Unknown'}</TableCell>
                    <TableCell sx={{ color: 'white' }}>
                      {collision.lat.toFixed(4)}, {collision.lon.toFixed(4)}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={`${collision.injured} injured, ${collision.killed} killed`}
                        color={getSeverityColor(collision.injured, collision.killed)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ color: 'white' }}>
                      {collision.vehicle_types.filter(v => v).join(', ')}
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
