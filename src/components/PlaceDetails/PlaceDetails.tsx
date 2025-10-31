import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Link as MuiLink, CircularProgress, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { Place } from '../../models/Place';

const STORAGE_KEY_BASE = "placesData";

const PlaceDetails: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const browserLang = navigator.language.startsWith("fr") ? "fr" : "en";
  const STORAGE_KEY = `${STORAGE_KEY_BASE}_${browserLang}`;
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored && name) {
      const places: Place[] = JSON.parse(stored);

      const normalizeName = (str: string) =>
        str
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .replace(/\s+/g, '-')
          .trim();

      const decodedName = decodeURIComponent(name);
      const normalizedDecodedName = normalizeName(decodedName);

      const found = places.find(p => normalizeName(p.name) === normalizedDecodedName);

      setPlace(found || null);
    } else {
      setPlace(null);
    }
    setLoading(false);
  }, [name, STORAGE_KEY]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!place) {
    return (
      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <Typography variant="h6">
          {browserLang === "fr" ? "Lieu non trouvé." : "Place not found."}
        </Typography>
        <IconButton aria-label={browserLang === 'fr' ? "Retour à l'accueil" : "Back to Home"} onClick={() => navigate('/')}>
          <HomeIcon />
        </IconButton>
      </Box>
    );
  }

  const renderIfNotEmpty = (label: string, value?: string | null) => {
    if (!value || value.trim() === '') return null;
    return (
      <Typography variant="body1" sx={{ mb: 1 }}>
        <strong>{label} </strong>{value}
      </Typography>
    );
  };

  const isGmapLink = place.link && place.link.includes('google.com/maps');

  return (
    <Box sx={{
      maxWidth: 600,
      mx: 'auto',
      py: 4,
      px: 2,
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      boxShadow: 3,
      borderRadius: 2,
      backgroundColor: 'background.paper',
    }}>
      <IconButton aria-label={browserLang === 'fr' ? "Retour à l'accueil" : "Back to Home"} onClick={() => navigate('/')} sx={{ alignSelf: 'center', mt: 3 }}>
        <HomeIcon />
      </IconButton>

      <Typography variant="h4" gutterBottom>{place.name}</Typography>

      {renderIfNotEmpty(browserLang === "fr" ? "Ville:" : "City:", place.city)}
      {renderIfNotEmpty(browserLang === "fr" ? "Quartier:" : "District:", place.district)}
      {renderIfNotEmpty(browserLang === "fr" ? "Type d'activité:" : "Activity Type:", place.activityType)}
      {renderIfNotEmpty(browserLang === "fr" ? "Description:" : "Description:", place.description)}
      {renderIfNotEmpty(browserLang === "fr" ? "Commentaire:" : "Comment:", place.comment)}

      {place.link && place.link.trim() !== '' && (
        isGmapLink ? (
          <MuiLink href={place.link} target="_blank" rel="noopener noreferrer" sx={{ mt: 2, display: 'block', fontWeight: 'bold' }}>
            {browserLang === "fr" ? "liens vers maps" : "link to maps"}
          </MuiLink>
        ) : (
          <MuiLink href={place.link} target="_blank" rel="noopener noreferrer" sx={{ mt: 2, display: 'block', fontWeight: 'bold' }}>
            {browserLang === "fr" ? "lien vers le site" : "link to website"}
          </MuiLink>
        )
      )}
    </Box>
  );
};

export default PlaceDetails;
