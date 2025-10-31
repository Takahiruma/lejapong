import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Routes, Route, Navigate } from 'react-router-dom';

import ErrorBoundary from "./components/ErrorBoundary";
import CsvDataCards from "./components/CsvDataCards/CsvDataCards";
import PlaceDetails from "./components/PlaceDetails/PlaceDetails";

const theme = createTheme({});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary fallback={<div>Erreur lors du chargement des cartes CSV</div>}>
        <Routes>
          <Route path="/" element={<CsvDataCards />} />
          <Route path="/place/:name" element={<PlaceDetails />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
