import React from 'react';
import { Box, Typography, Avatar, Card, CardContent, Paper, Divider } from '@mui/material';
import Footer from '../components/Footer';

const team = [
  {
    name: 'Ojas Gramopadhye',
    email: 'og2186@nyu.edu',
    photo: '/src/assets/oj.PNG',
  },
  {
    name: 'Omkar Waikar',
    email: 'ow2130@nyu.edu',
    photo: '/src/assets/ow.PNG',
  },
  {
    name: 'Pranav Narayanan',
    email: 'pn2330@nyu.edu',
    photo: '/src/assets/pnv.PNG',
  },
  {
    name: 'Sindhujyoti Dutta',
    email: 'sd6201@nyu.edu',
    photo: '/src/assets/sid.PNG',
  },
];

const About: React.FC = () => (
  <Box>
    <Box
      sx={{
        width: "100vw",
        minHeight: '40vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'url(/src/assets/six.jpg) center/cover',
        color: 'white',
        textAlign: 'center',
        py: 8,
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          bgcolor: 'rgba(24,24,24,0.55)',
          zIndex: 1,
        }}
      />
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        <Typography variant="h3" fontWeight={700} gutterBottom sx={{ textShadow: '0 2px 12px #000, 0 0 4px #000', px: 2 }}>
          About Our Project
        </Typography>
        <Typography variant="h5" fontWeight={500} sx={{ mb: 4, textShadow: '0 2px 8px #000, 0 0 2px #000', px: 2 }}>
          Team Members
        </Typography>
      </Box>
    </Box>
    <Box sx={{ py: 6, px: { xs: 2, md: 8 }, textAlign: 'center' }}>
      
      <Divider sx={{ my: 4 }} />
      <Box display="flex" flexWrap="wrap" gap={4} justifyContent="center" sx={{ mb: 6 }}>
        {team.map((member, idx) => (
          <Box key={idx} flex="1 1 220px" minWidth={300} maxWidth={300}>
            <Card sx={{ p: 2, alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
              <Avatar src={member.photo} alt={member.name} sx={{ width: 90, height: 90, mb: 2 }}  />
              <CardContent>
                <Typography variant="h6" fontWeight={600}>{member.name}</Typography>
                <Typography variant="body2" color="text.secondary">{member.email}</Typography>
                <link rel="email" href="member.email" />
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
      <Divider sx={{ my: 4 }} />
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Why We Chose This Topic
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, maxWidth: 800, mx: 'auto', textAlign: 'justify' }}>
        New York City's traffic and collision rates are among the highest in the world. We wanted to leverage real time data and machine learning to help make NYCs streets safer and more efficient. By predicting traffic slowdowns and collision hotspots our system can help city officials, commuters and emergency responders make smarter decisions based on data.
      </Typography>
      <Divider sx={{ my: 4 }} />
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Benefits of Our System
      </Typography>
      <Box sx={{ mb: 4, maxWidth: 800, mx: 'auto', textAlign: 'center' }}>
        <ul style={{ display: 'inline-block', textAlign: 'left', margin: 0, paddingLeft: 24 }}>
          <li style={{ marginBottom: 16 }}>Real time monitoring of traffic and collision data</li>
          <li style={{ marginBottom: 16 }}>Predictive analytics for identifying high risk zones</li>
          <li style={{ marginBottom: 16 }}>Visual dashboards for easy interpretation</li>
          <li style={{ marginBottom: 16 }}>Supports smarter urban planning and emergency response</li>
          <li style={{ marginBottom: 16 }}>Open NYC data and open source approach for transparency</li>
        </ul>
      </Box>
      <Divider sx={{ my: 4 }} />
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Technologies Used
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', mb: 4 }}>
        <Paper sx={{ p: 2, minWidth: 120 }}>Python</Paper>
        <Paper sx={{ p: 2, minWidth: 120 }}>Apache Kafka</Paper>
        <Paper sx={{ p: 2, minWidth: 120 }}>Hadoop HDFS</Paper>
        <Paper sx={{ p: 2, minWidth: 120 }}>MongoDB</Paper>
        <Paper sx={{ p: 2, minWidth: 120 }}>Express</Paper>
        <Paper sx={{ p: 2, minWidth: 120 }}>React</Paper>
      </Box>
      <Divider sx={{ my: 4 }} />
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Dataset Used
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', mb: 4 }}>
        <a href="https://data.cityofnewyork.us/Transportation/DOT-Traffic-Speeds-NBE/i4gi-tjb9/about_data" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
          <Paper sx={{ p: 2, minWidth: 120, cursor: 'pointer' }}>Traffic Data</Paper>
        </a>
        <a href="https://data.cityofnewyork.us/Public-Safety/Motor-Vehicle-Collisions-Crashes/h9gi-nx95/about_data" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
          <Paper sx={{ p: 2, minWidth: 120, cursor: 'pointer' }}>Collision Data</Paper>
        </a>
      </Box>
    </Box>
    <Footer />
  </Box>
);

export default About; 