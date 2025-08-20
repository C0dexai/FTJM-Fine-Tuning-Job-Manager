
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BarChart, LineChart } from 'recharts';

// This is to satisfy the build process if recharts is not used on first load
// In a real app with code splitting, this might not be necessary.
const _unused = [BarChart, LineChart];

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
