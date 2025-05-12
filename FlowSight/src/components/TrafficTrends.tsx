import React from 'react';
import { Box, Paper } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface TrafficTrendsProps {
  data?: {
    labels: string[];
    values: number[];
  };
}

const TrafficTrends: React.FC<TrafficTrendsProps> = ({ data }) => {
  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: 'Traffic Volume',
        data: data?.values || [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Traffic Volume Trends',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Vehicles',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Time Period',
        },
      },
    },
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Line data={chartData} options={options} />
      </Paper>
    </Box>
  );
};

export default TrafficTrends; 