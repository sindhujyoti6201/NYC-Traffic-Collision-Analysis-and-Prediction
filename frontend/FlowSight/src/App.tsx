import React, { useState, Suspense, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import Navbar from './components/Navbar';
import { getTheme } from './theme';
import { routes } from './routes';

const AppRoutes = () => useRoutes(routes);

const App: React.FC = () => {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('themeMode') as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const toggleTheme = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeProvider theme={getTheme(mode)}>
      <CssBaseline />
      <BrowserRouter>
        <Navbar onToggleTheme={toggleTheme} themeMode={mode} />
        <Suspense fallback={<div>Loading...</div>}>
          <AppRoutes />
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;