import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Paper, Button } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Footer from '../components/Footer';

const PredictionsHome = () => {
  const [mostDeadlyStreet, setMostDeadlyStreet] = useState('N/A');
  const [mostDeadlyScore, setMostDeadlyScore] = useState(0);
  const [avgCrashScore, setAvgCrashScore] = useState(0);

  useEffect(() => {
    fetch('http://localhost:5002/api/predictions?days=5&limit=5000')
      .then(res => res.json())
      .then(res => {
        const data = res.data || [];
        if (data.length > 0) {
          const max = data.reduce((prev, current) => (prev.crash_score > current.crash_score) ? prev : current);
          const avg = data.reduce((sum, item) => sum + item.crash_score, 0) / data.length;
          setMostDeadlyStreet(max.street);
          setMostDeadlyScore(max.crash_score.toFixed(2));
          setAvgCrashScore(avg.toFixed(2));
        }
      }).catch(err => console.error(err));
  }, []);

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
          Predict traffic and collisions based on historical data of NYC traffic flow.
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, maxWidth: 700, mx: 'auto' }}>
          Our machine learning model predicts the most risky streets and gives crash risk estimates to improve roadway safety.
        </Typography>
      </Box>

      {/* 🔥 3 model cards now */}
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 3,
        mb: 4,
      }}>
        <MetricCard icon={<WarningAmberIcon color="error" sx={{ fontSize: 32 }} />} title="Most Deadly Street" value={mostDeadlyStreet} />
        <MetricCard icon={<WarningAmberIcon color="warning" sx={{ fontSize: 32 }} />} title="Most Deadly Street Crash Score" value={mostDeadlyScore} />
        <MetricCard icon={<WarningAmberIcon color="warning" sx={{ fontSize: 32 }} />} title="Average Crash Score" value={avgCrashScore} />
      </Box>

      {/* ✅ Explanation sections */}
      <Box sx={{ maxWidth: 900, mx: 'auto', mb: 4 }}>
        <Typography variant="h6" gutterBottom>How our ML Models Works</Typography>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2">Data Inputs</Typography>
          <Typography variant="body2" color="#aaa">Historical speed, traffic and collision records are taken from MongoDB.</Typography>
          <Typography variant="subtitle2" sx={{ mt: 2 }}>ML Pipeline</Typography>
          <Typography variant="body2" color="#aaa">An ML based regression model is created to generate predictions based on historical data. The Model gives us probability of traffic and collisions which are mapped and displayed on the dashboard.</Typography>
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
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          justifyContent: 'center',
          alignItems: 'stretch',
        }}>
          <Paper sx={{ p: 2, minWidth: 220, maxWidth: 400, flex: '1 1 300px', bgcolor: '#232323', color: 'white' }}>
            <Typography variant="subtitle2">Commuter Passengers</Typography>
            <Typography variant="body2" color="#aaa">
              Delay departure when collision risk are high or traffic is heavy.
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, minWidth: 220, maxWidth: 400, flex: '1 1 300px', bgcolor: '#232323', color: 'white' }}>
            <Typography variant="subtitle2">Emergency Services</Typography>
            <Typography variant="body2" color="#aaa">
              Allocate emergency service vehicles to the predicted hotspots and navigate the traffic.
            </Typography>
          </Paper>
        </Box>
      </Box>

      {/* View buttons */}
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

// Reusable metric card with increased size
const MetricCard = ({ icon, title, value }) => (
  <Card sx={{ bgcolor: '#232323', color: 'white', height: 220, display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 280, maxWidth: 360, p: 2 }}>
    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
      {icon}
      <Typography variant="h6">{title}</Typography>
      <Typography variant="h4" sx={{ wordBreak: 'break-word', fontSize: '1.5rem' }}>{value}</Typography>
    </CardContent>
  </Card>
);

export default PredictionsHome;
