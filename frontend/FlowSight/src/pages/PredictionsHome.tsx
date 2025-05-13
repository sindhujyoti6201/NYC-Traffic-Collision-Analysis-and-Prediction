import React from 'react';
import { Box, Typography, Card, CardContent, Button, Tooltip, Paper } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SpeedIcon from '@mui/icons-material/Speed';
import ReportIcon from '@mui/icons-material/Report';
import TimelineIcon from '@mui/icons-material/Timeline';
import Footer from '../components/Footer';

const PredictionsHome: React.FC = () => {
  const predictedSpeed = 35;
  const expectedCollisions = 10;
  const topRiskWindow = "09:00–11:00";
  const congestionArea = "Manhattna";

  return (
    <Box sx={{ minHeight: '100vh', background: '#181818' }}>
      <Box sx={{
        width: '100vw',
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.1)), url(/src/assets/nine.jpg) center/cover',
        color: 'white',
        textAlign: 'center',
        py: 8,
        mb: 4,
      }}>
        <Typography variant="h2" fontWeight={700} gutterBottom>
         The Future - See the Road Ahead
        </Typography>
        <Typography variant="h5" fontWeight={400} sx={{ mb: 2 }}>
        Predict traffic and collisons based on historical data of NYC traffic flow.
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, maxWidth: 700, mx: 'auto' }}>
          We leverage our machine learning model to predict traffic and improve roadway safety before congestion and incidents unfold.
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
          <Tooltip title="Weighted across all segments.">
            <Card sx={{ bgcolor: '#232323', color: 'white', height: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <SpeedIcon color="primary" sx={{ fontSize: 32 }} />
                <Typography variant="h6">Predicted Citywide Average Speed</Typography>
                <Typography variant="h4">{predictedSpeed} mph</Typography>
              </CardContent>
            </Card>
          </Tooltip>
        </Box>
        <Box flex="1 1 220px" minWidth={220} maxWidth={300}>
          <Tooltip title="Model tally (all severities).">
            <Card sx={{ bgcolor: '#232323', color: 'white', height: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <ReportIcon color="error" sx={{ fontSize: 32 }} />
                <Typography variant="h6">Expected New No. of Collisions</Typography>
                <Typography variant="h4">{expectedCollisions}</Typography>
              </CardContent>
            </Card>
          </Tooltip>
        </Box>
        <Box flex="1 1 220px" minWidth={220} maxWidth={300}>
          <Tooltip title="When collision probability peaks (next 3h).">
            <Card sx={{ bgcolor: '#232323', color: 'white', height: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <AccessTimeIcon color="secondary" sx={{ fontSize: 32 }} />
                <Typography variant="h6">Busiest Time Window</Typography>
                <Typography variant="h4">{topRiskWindow}</Typography>
              </CardContent>
            </Card>
          </Tooltip>
        </Box>
        <Box flex="1 1 220px" minWidth={220} maxWidth={300}>
          <Tooltip title="Most congested area.">
            <Card sx={{ bgcolor: '#232323', color: 'white', height: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <TimelineIcon color="warning" sx={{ fontSize: 32 }} />
                <Typography variant="h6">Most Congested Area</Typography>
                <Typography variant="h4">{congestionArea}</Typography>
              </CardContent>
            </Card>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 900, mx: 'auto', mb: 4 }}>
        <Typography variant="h6" gutterBottom>How our ML Models Works</Typography>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2">Data Inputs</Typography>
          <Typography variant="body2" color="#aaa">Historical speed, traffic and collision records are taken from MongoDB.</Typography>
          <Typography variant="subtitle2" sx={{ mt: 2 }}>ML Pipeline</Typography>
          <Typography variant="body2" color="#aaa">An ML based regression model is created to generate predictions based on historical data. The Model gives us probability of traffic and collisons which are mapped and displayed on the dashboard.</Typography>
          <Typography variant="subtitle2" sx={{ mt: 2 }}>Continuous Updation</Typography>
          <Typography variant="body2" color="#aaa">As we are using streaming data, each time the predictions are updated based on current realtime data.</Typography>
        </Paper>
      </Box>

      <Box sx={{ maxWidth: 900, mx: 'auto', mb: 4 }}>
        <Typography variant="h6" gutterBottom>Model Confidence</Typography>
        <Paper sx={{ p: 2, minHeight: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="body1" color="#aaa">Current model confidence: <b>0.5</b></Typography>
        </Paper>
      </Box>

      <Box sx={{ maxWidth: 900, mx: 'auto', mb: 4 }}>
        <Typography variant="h6" gutterBottom>Use Case Scenarios</Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            justifyContent: 'center',
            alignItems: 'stretch',
          }}
        >
          <Paper
            sx={{
              p: 2,
              minWidth: 220,
              maxWidth: 400,
              flex: '1 1 300px',
              bgcolor: '#232323',
              color: 'white',
            }}
          >
            <Typography variant="subtitle2">Commuter Passengers</Typography>
            <Typography variant="body2" color="#aaa">
              Delay departure when collision risk are high or traffic is heavy.
            </Typography>
          </Paper>
          <Paper
            sx={{
              p: 2,
              minWidth: 220,
              maxWidth: 400,
              flex: '1 1 300px',
              bgcolor: '#232323',
              color: 'white',
            }}
          >
            <Typography variant="subtitle2">Emergency Services</Typography>
            <Typography variant="body2" color="#aaa">
              Allocate emergency service vehicles to the predicted hotspots and navigate the traffic.
            </Typography>
          </Paper>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 900, mx: 'auto', mb: 4, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
        <Button variant="contained" color="primary" href="/predictions/traffic">
          View Traffic Predictions
        </Button>
        <Button variant="contained" color="secondary" href="/predictions/collision">
          View Collision Predictions
        </Button>
      </Box>
      <Footer />
    </Box>
  );
};

export default PredictionsHome; 