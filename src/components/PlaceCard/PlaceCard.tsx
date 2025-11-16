import React from 'react';
import { Box, Card, CardContent, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Place } from '../../models/Place';

import './PlaceCard.scss';

interface PlaceCardProps {
  place: Place;
  lang: string;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place, lang }) => {
  return (
    <Link
      component={RouterLink}
      to={`/place/${encodeURIComponent(place.id)}`}
      underline="none"
      aria-label={`Voir détails de ${place.name}`}
      sx={{ display: 'block' }}
    >
      <Box
        sx={{
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: 6,
            zIndex: 1,
          },
        }}
      >
        <Card>
          <CardContent>
            <Typography variant="h6" component="h2" gutterBottom>
              {place.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>{lang === 'fr' ? 'Ville' : 'City'}:</strong> {place.city}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>{lang === 'fr' ? 'Quartier' : 'District'}:</strong> {place.district}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>{lang === 'fr' ? "Type d'activité" : 'Activity Type'}:</strong> {place.activityType}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>{lang === 'fr' ? 'Description' : 'Description'}:</strong> {place.description}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Link>
  );
};

export default PlaceCard;
