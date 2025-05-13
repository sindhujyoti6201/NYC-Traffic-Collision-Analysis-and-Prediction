import React from 'react';
import { Box, Typography, Button, Paper, Card, CardContent, CardActions } from '@mui/material';
import { Link } from 'react-router-dom';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import WarningIcon from '@mui/icons-material/Warning';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TimelineIcon from '@mui/icons-material/Timeline';
import ReportIcon from '@mui/icons-material/Report';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  return (
    <Box>
      <Box
        sx={{
          width: "100vw",
          minHeight: '49vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80) center/cover',
          color: 'white',
          textAlign: 'center',
          py: 8,
        }}
      >
        <Typography variant="h2" fontWeight={700} gutterBottom>
        <Box sx={{
          width: "10vw",
          minHeight: '10vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'url(/src/assets/data-flow.png',
          color: 'white',
          textAlign: 'center',
          py: 5,
        }}></Box>
        FlowSight : NYC Traffic & Collision Prediction System
        </Typography>
        <Typography variant="h5" sx={{ mb: 4 }}>
          Real time analysis and ML model predictions to keep New York City moving safer and faster.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            component={Link}
            to="/realtime/home"
          >
            Real Time Data
          </Button>
          <Button 
            variant="outlined" 
            color="secondary" 
            size="large"
            component="a"
            href="http://localhost:5173/predictions/home"
          >
            Predictions 
          </Button>
        </Box>
      </Box>

      <Box sx={{ py: 8, px: { xs: 2, md: 8 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 300, maxWidth: 600 }}>
            <Typography variant="h4" fontWeight={600} gutterBottom>
              Why This Matters!!
            </Typography>
            <Typography
              variant="body1"
              sx={{ mb: 3, textAlign: 'justify' }}
            >
              Every day thousands of vehicles navigate NYCs complex streets. Understanding where traffic slows and where collisions happen helps commuters, emergency responders and city officials to make smarter decisions.
            </Typography>
            <Typography variant="h6" sx={{ mb: 2, mt: 4 }}>
              Our system
            </Typography>
            <Paper sx={{ p: 2, textAlign: 'left', background: '#222', color: '#fff' }}>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <li style={{ marginBottom: 12 }}>
                  Streams real time traffic & collision data from NYC Open Data
                </li>
                <li style={{ marginBottom: 12 }}>
                  Store & processes data at scale using Kafka, HDFS and MongoDB
                </li>
                <li style={{ marginBottom: 12 }}>
                  Trains predictive models using ML regression models to identify hotspots
                </li>
                <li>
                  Visualizes trends and risk zones for easy interpretation
                </li>
              </ul>
            </Paper>
          </Box>
          <Box sx={{ flex: 1, minWidth: 300, maxWidth: 650, display: 'flex', justifyContent: 'center' }}>
            <img
              src="/src/assets/two.jpg"
              alt="NYC Traffic"
              style={{ width: '100%', maxWidth: 600, borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}
            />
          </Box>
        </Box>
      </Box>

      <Box sx={{ py: 4, px: { xs: 2, md: 8 }, textAlign: 'center' }}>
        <Typography variant="body1" sx={{ mb: 2, maxWidth: 700, mx: 'auto' }}>
          <b>Architecture Diagram</b>
        </Typography>
        <Paper sx={{ p: 2, minHeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6 }}>
          <Box
            sx={{
              width: "90vw",
              minHeight: '60vh',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 6
            }}
          >
            <img
              src="/src/assets/arc.PNG"
              alt="Architecture Diagram"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                borderRadius: 12,
                boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
                display: 'block',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                bgcolor: 'rgba(24,24,24,0.15)',
                borderRadius: 2,
                pointerEvents: 'none',
              }}
            />
          </Box>
        </Paper>
      </Box>

      <Box sx={{ 
        py: 6, 
        background: '#232323',
        maxWidth: 1800,
        mx: 'auto',
        borderRadius: 6
      }}>
        <Box
          sx={{
            maxWidth: 1100,
            mx: "auto",
            px: { xs: 2, md: 4 },
            borderRadius: 4,
          }}
        >
          <Typography 
            variant="h5" 
            fontWeight={700} 
            gutterBottom 
            align="center"
            sx={{ color: '#fff', mb: 4, textShadow: '0 2px 8px #0008' }}
          >
            Live Data Snapshot
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={3} justifyContent="center">
            <Box flex="1 1 220px" minWidth={220} maxWidth={300}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <DirectionsCarIcon color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="h6">Average Traffic Speed</Typography>
                <Typography variant="h4" fontWeight={700}>24.7 mph</Typography>
              </Paper>
            </Box>
            <Box flex="1 1 220px" minWidth={220} maxWidth={300}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <WarningIcon color="error" sx={{ fontSize: 40 }} />
                <Typography variant="h6">Active Collisions Today</Typography>
                <Typography variant="h4" fontWeight={700}>121</Typography>
              </Paper>
            </Box>
            <Box flex="1 1 220px" minWidth={220} maxWidth={300}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <LocationOnIcon color="secondary" sx={{ fontSize: 40 }} />
                <Typography variant="h6">Top Risk Borough</Typography>
                <Typography variant="h4" fontWeight={700}>Brooklyn</Typography>
              </Paper>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ py: 8, px: { xs: 2, md: 8 } }}>
        <Typography variant="h5" fontWeight={600} gutterBottom align="center">
          Explore NYC
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={3} justifyContent="center">
          <Box flex="1 1 220px" minWidth={220} maxWidth={300}>
            <Card>
              <CardContent>
                <TimelineIcon color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="h6">Traffic Trends</Typography>
                <Typography variant="body2">See speed changes and congestion patterns in real time.</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" component={Link} to="/realtime/traffic">Explore</Button>
              </CardActions>
            </Card>
          </Box>
          <Box flex="1 1 220px" minWidth={220} maxWidth={300}>
            <Card>
              <CardContent>
                <ReportIcon color="error" sx={{ fontSize: 40 }} />
                <Typography variant="h6">Collision Reports</Typography>
                <Typography variant="body2">Explore daily and historical accident data across NYC.</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" component={Link} to="/realtime/collision">Explore</Button>
              </CardActions>
            </Card>
          </Box>
          <Box flex="1 1 220px" minWidth={220} maxWidth={300}>
            <Card>
              <CardContent>
                <EmojiObjectsIcon color="secondary" sx={{ fontSize: 40 }} />
                <Typography variant="h6">Predictions</Typography>
                <Typography variant="body2">View our ML models forecast for traffic slowdowns and accidents.</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" component={Link} to="/predictions/home">Explore</Button>
              </CardActions>
            </Card>
          </Box>

        </Box>
      </Box>

      <Box sx={{ 
        py: 2, 
        background: '#232323',
        maxWidth: 1800,
        mx: 'auto',
        borderRadius: 6,
        mt: 6
      }}>
        <Box
          sx={{
            maxWidth: 1100,
            mx: "auto",
            px: { xs: 2, md: 4 },
            borderRadius: 4,
          }}
        >
          <Typography 
            variant="h5" 
            fontWeight={700} 
            gutterBottom 
            align="center"
            sx={{ color: '#fff', mb: 4, textShadow: '0 2px 8px #0008' }}
          >
            Visualizations
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={3} justifyContent="center">
            <Box flex="1 1 300px" minWidth={300} maxWidth={600}>
              <Paper sx={{ p: 2, height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#222', color: '#fff' }}>
                <img
                  src="/src/assets/Map Placeholder.png"
                  alt="Map Visualization Placeholder"
                  style={{ width: '100%', height: '100%', borderRadius: 8, objectFit: 'cover' }}
                />
              </Paper>
            </Box>
            <Box flex="1 1 300px" minWidth={300} maxWidth={600}>
              <Paper sx={{ p: 2, height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#222', color: '#fff' }}>
                <img
                  src="/src/assets/Chart Vis Placeholder.png"
                  alt="Chart Visualization Placeholder"
                  style={{ width: '100%', height: '100%', borderRadius: 8, objectFit: 'fill' }}
                />
              </Paper>
            </Box>
            <Box flex="1 1 300px" minWidth={300} maxWidth={600}>
              <Paper sx={{ p: 2, height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#222', color: '#fff' }}>
                <img
                  src="/src/assets/Heatmap Vis Placeholder.png"
                  alt="Heatmap Visualization Placeholder"
                  style={{ width: '100%', height: '100%', borderRadius: 8, objectFit: 'cover' }}
                />
              </Paper>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{ 
        py: 1, 
        maxWidth: 1800,
        mx: 'auto',
        borderRadius: 6,
        mt: 6
      }}></Box>
      <Footer />
    </Box>
  );
};

export default Home; 