import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Tabs, Tab, Typography, IconButton, Box, Menu, MenuItem } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const tabConfig = [
  { label: 'Home', path: '/' },
  { label: 'Real Time Data', path: '/realtime/home' },
  { label: 'Predictions', path: '/predictions' },
//  { label: 'one', path: '/data-explorer' },
  { label: 'About', path: '/about' },
  { label: 'Login/Signup', path: '/login' },
];

const submenuConfig = {
  'Real Time Data': [
    { label: 'Home', path: '/realtime/home' },
    { label: 'Traffic', path: '/realtime/traffic' },
    { label: 'Collision', path: '/realtime/collision' },
  ],
  'Predictions': [
    { label: 'Home', path: '/predictions/home' },
    { label: 'Traffic', path: '/predictions/traffic' },
    { label: 'Collision', path: '/predictions/collision' },
  ],
};

const Navbar: React.FC<{ onToggleTheme: () => void; themeMode: 'light' | 'dark' }> = ({ onToggleTheme, themeMode }) => {
  const location = useLocation();
  const currentTab = tabConfig.findIndex(tab => tab.path === location.pathname) !== -1
    ? tabConfig.findIndex(tab => tab.path === location.pathname)
    : false;
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');

  useEffect(() => {
    const handleStorage = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('loginStatusChanged', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('loginStatusChanged', handleStorage);
    };
  }, []);

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpenMenu(null);
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false');
    setIsLoggedIn(false);
    alert('User logged out');
    navigate('/login');
  };

  const tabs = [
    { label: 'Home', path: '/' },
    { label: 'Real Time Data', path: '/realtime/home', hasSubmenu: true },
    { label: 'Predictions', path: '/predictions', hasSubmenu: true },
    { label: 'About', path: '/about' },
    isLoggedIn
      ? { label: 'Logout', path: '/logout', onClick: handleLogout }
      : { label: 'Login/Signup', path: '/login' },
  ];

  return (
    <AppBar position="fixed" color="default" elevation={1}>
      <Toolbar disableGutters>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        <Box><link rel="icon" type="image/svg+xml" href="/src/assets/data-flow.png" /></Box>
          FlowSight : NYC Traffic & Collision Prediction System
        </Typography>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Tabs
            value={currentTab}
            textColor="primary"
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            {tabs.map((tab) => {
              if (
                tab.hasSubmenu &&
                (tab.label === 'Real Time Data' || tab.label === 'Predictions') &&
                submenuConfig[tab.label]
              ) {
                return (
                  <Tab
                    key={tab.label}
                    label={tab.label}
                    aria-controls={openMenu === tab.label ? 'submenu' : undefined}
                    aria-haspopup="true"
                    onClick={(e) => {
                      setAnchorEl(e.currentTarget);
                      setOpenMenu(tab.label);
                    }}
                  />
                );
              } else if (tab.onClick) {
                return (
                  <Tab
                    key={tab.label}
                    label={tab.label}
                    onClick={tab.onClick}
                  />
                );
              } else {
                return (
                  <Tab
                    key={tab.path}
                    label={tab.label}
                    component={Link}
                    to={tab.path}
                  />
                );
              }
            })}
          </Tabs>
          {(Object.keys(submenuConfig) as Array<keyof typeof submenuConfig>).map((label) => (
            <Menu
              key={label}
              id="submenu"
              anchorEl={anchorEl}
              open={openMenu === label}
              onClose={handleMenuClose}
              MenuListProps={{ onMouseLeave: handleMenuClose }}
            >
              {submenuConfig[label].map((item) => (
                <MenuItem key={item.path} onClick={() => handleMenuItemClick(item.path)}>
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
          ))}
          <IconButton onClick={onToggleTheme} color="inherit" sx={{ ml: 2 }}>
            {themeMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 