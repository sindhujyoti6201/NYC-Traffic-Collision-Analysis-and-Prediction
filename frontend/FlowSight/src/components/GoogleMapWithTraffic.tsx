import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { Box, Button } from '@mui/material';

const containerStyle = {
  width: '100%',
  height: '350px'
};

const center = {
  lat: 40.7128, 
  lng: -74.0060
};

const GoogleMapWithTraffic: React.FC = () => (
  <LoadScript googleMapsApiKey="YOUR_API_KEY_HERE">
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={11}
    >
    </GoogleMap>
    <Box sx={{ width: '100%', height: 350, background: '#222', borderRadius: 4, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Button
        variant="contained"
        color="primary"
        href="https://www.google.com/maps/@40.7128,-74.0060,12z/data=!5m1!1e1"
        target="_blank"
        rel="noopener noreferrer"
        size="large"
      >
        Open Live NYC Traffic Map
      </Button>
    </Box>
  </LoadScript>
);

export default GoogleMapWithTraffic;