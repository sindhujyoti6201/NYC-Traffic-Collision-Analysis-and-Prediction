import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

interface SummaryStatsProps {
  data?: {
    totalVolume: number;
    averageDaily: number;
    peakHour: number;
    busiestBorough: string;
  };
}

const SummaryStats: React.FC<SummaryStatsProps> = ({ data }) => {
  const stats = [
    {
      title: 'Total Traffic Volume',
      value: data?.totalVolume || 0,
      unit: 'vehicles',
    },
    {
      title: 'Average Daily Traffic',
      value: data?.averageDaily || 0,
      unit: 'vehicles/day',
    },
    {
      title: 'Peak Hour Volume',
      value: data?.peakHour || 0,
      unit: 'vehicles/hour',
    },
    {
      title: 'Busiest Borough',
      value: data?.busiestBorough || 'N/A',
      unit: '',
    },
  ];

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Summary Statistics
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {stats.map((stat, index) => (
          <Box key={index} sx={{ flex: 1, minWidth: 220, m: 1 }}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 140,
              }}
            >
              <Typography color="textSecondary" gutterBottom>
                {stat.title}
              </Typography>
              <Typography component="p" variant="h4">
                {stat.value}
              </Typography>
              {stat.unit && (
                <Typography color="textSecondary">
                  {stat.unit}
                </Typography>
              )}
            </Paper>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default SummaryStats; 