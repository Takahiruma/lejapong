import './App.scss';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import ErrorBoundary from "./components/ErrorBoundary";
import CsvDataCards from "./components/CsvDataCards/CsvDataCards";
import PlaceDetails from "./components/PlaceDetails/PlaceDetails";

function App() {
  const location = useLocation();
  const theme = createTheme({});

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary fallback={<div>Erreur lors du chargement des cartes CSV</div>}>
        <Routes key={location.pathname}>
          <Route path="/" element={<CsvDataCards />} />
          <Route path="/place/:id" element={<PlaceDetails />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
