import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

interface ThemeToggleProps {
  onToggle: () => void;
  mode: 'light' | 'dark';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ onToggle, mode }) => (
  <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
    <IconButton color="inherit" onClick={onToggle} size="large">
      {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
    </IconButton>
  </Tooltip>
);

export default ThemeToggle; 