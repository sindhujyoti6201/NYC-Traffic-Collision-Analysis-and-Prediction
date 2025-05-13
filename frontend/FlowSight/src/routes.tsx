import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const RealTime = lazy(() => import('./pages/RealTime'));
const Historical = lazy(() => import('./pages/Historical'));
const Predictions = lazy(() => import('./pages/Predictions'));
const DataExplorer = lazy(() => import('./pages/DataExplorer'));
const About = lazy(() => import('./pages/About'));
const NotFound = lazy(() => import('./components/NotFound'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Traffic = lazy(() => import('./pages/Traffic'));
const Collision = lazy(() => import('./pages/Collision'));
const PredictionsHome = lazy(() => import('./pages/PredictionsHome'));
const PredictionsTraffic = lazy(() => import('./pages/PredictionsTraffic'));
const PredictionsCollision = lazy(() => import('./pages/PredictionsCollision'));

export const routes: RouteObject[] = [
  { path: '/', element: <Home /> },
  { path: '/realtime', element: <RealTime /> },
  { path: '/realtime/home', element: <RealTime /> },
  { path: '/realtime/traffic', element: <Traffic /> },
  { path: '/realtime/collision', element: <Collision /> },
  { path: '/historical', element: <Historical /> },
  { path: '/predictions', element: <Predictions /> },
  { path: '/predictions/home', element: <PredictionsHome /> },
  { path: '/predictions/traffic', element: <PredictionsTraffic /> },
  { path: '/predictions/collision', element: <PredictionsCollision /> },
  { path: '/data-explorer', element: <DataExplorer /> },
  { path: '/about', element: <About /> },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '*', element: <NotFound /> },
]; 