import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { Link } from "react-router-dom";
import { Place } from "../../models/Place";
import {
  Box,
  IconButton,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import './CsvDataCards.css';

const STORAGE_KEY_BASE = "placesData";

const normalizeName = (name: string): string =>
  name
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-');

const CsvDataCards: React.FC = () => {
  const browserLang = navigator.language.startsWith("fr") ? "fr" : "en";
  const [lang, setLang] = useState<string>(browserLang);
  const STORAGE_KEY = `${STORAGE_KEY_BASE}_${lang}`;
  const [places, setPlaces] = useState<Place[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterCity, setFilterCity] = useState<string>("");
  const [filterDistrict, setFilterDistrict] = useState<string>("");
  const [filterActivityType, setFilterActivityType] = useState<string>("");

  const [filteredDistricts, setFilteredDistricts] = useState<string[]>([]);

  useEffect(() => {
    if (places.length === 0) {
      setLoading(true);
      const fileName = lang === "fr" ? "/Places_fr.csv" : "/Places_en.csv";
      fetch(fileName)
        .then(response => {
          if (!response.ok) throw new Error("Erreur lors du chargement du fichier CSV.");
          return response.text();
        })
        .then(csvText => {
          const parsed = Papa.parse<Record<string, string>>(csvText, { header: true, skipEmptyLines: true });
          
          const filteredData = parsed.data.filter(item => {
            const rawName = item.Nom || item.Name || "";
            return rawName.trim() !== "" && rawName.trim() !== "-";
          });

          const placeInstances = filteredData.map(item => {
            const rawName = item.Nom || item.Name || "";
            return new Place({
              id: normalizeName(rawName),
              name: rawName,
              city: item.Ville || item.City || "",
              district: item.Quartier || item.District || "",
              activityType: item["Type d'activité"] || item["Activity Type"] || "",
              description: item.Description || "",
              link: item["lieux/site"] || item.Link || "",
              comment: item.Commentaire || item.Comment || "",
            });
          });

          setPlaces(placeInstances);
          setLoading(false);
        })
        .catch(error => {
          console.error("Erreur analyse CSV:", error);
          setLoading(false);
        });
    }
  }, [lang, places.length]);

  useEffect(() => {
    if (places.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(places));
    }
  }, [places, STORAGE_KEY]);

  const cities = Array.from(new Set(places.map(p => p.city))).sort();
  const districts = Array.from(new Set(places.map(p => p.district))).sort();
  const activityTypes = Array.from(new Set(places.map(p => p.activityType))).sort();

  useEffect(() => {
    if (filterCity !== "") {
      const districtsPourVille = Array.from(
        new Set(places.filter(p => p.city === filterCity).map(p => p.district))
      ).sort();
      setFilteredDistricts(districtsPourVille);
    } else {
      setFilteredDistricts(districts);
    }
  }, [filterCity, places, districts]);

  const filteredPlaces = places.filter(place =>
    place.name.trim() !== "" && place.name.trim() !== "-" &&
    place.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterCity === "" || place.city === filterCity) &&
    (filterDistrict === "" || place.district === filterDistrict) &&
    (filterActivityType === "" || place.activityType === filterActivityType)
  );

  const toggleLanguage = () => {
    const newLang = lang === "fr" ? "en" : "fr";
    setLang(newLang);
    setPlaces([]);
    setSearchTerm("");
    setFilterCity("");
    setFilterDistrict("");
    setFilterActivityType("");
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'nowrap',
          alignItems: 'center',
          gap: 2,
          mb: 3,
          overflowX: 'auto',
          px: 1,
        }}
      >
        <IconButton onClick={toggleLanguage} aria-label="Changer langue" size="large">
          {lang === 'fr' ? 'EN' : 'FR'}
        </IconButton>

        <TextField
          label={lang === "fr" ? "Rechercher par nom" : "Search by name"}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ minWidth: 200, flexShrink: 0 }}
        />

        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel>{lang === "fr" ? "Villes" : "Cities"}</InputLabel>
          <Select
            value={filterCity}
            label={lang === "fr" ? "Villes" : "Cities"}
            onChange={(e) => setFilterCity(e.target.value)}
          >
            <MenuItem value="">{lang === "fr" ? "Villes" : "Cities"}</MenuItem>
            {cities.map((city, i) => (
              <MenuItem key={i} value={city}>{city}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel>{lang === "fr" ? "Quartiers" : "Districts"}</InputLabel>
          <Select
            value={filterDistrict}
            label={lang === "fr" ? "Quartiers" : "Districts"}
            onChange={(e) => setFilterDistrict(e.target.value)}
          >
            <MenuItem value="">{lang === "fr" ? "Quartiers" : "Districts"}</MenuItem>
            {filteredDistricts.map((district, i) => (
              <MenuItem key={i} value={district}>{district}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel>{lang === "fr" ? "Activité" : "Activity"}</InputLabel>
          <Select
            value={filterActivityType}
            label={lang === "fr" ? "Activité" : "Activity"}
            onChange={(e) => setFilterActivityType(e.target.value)}
          >
            <MenuItem value="">{lang === "fr" ? "Activité" : "Activity"}</MenuItem>
            {activityTypes.map((type, i) => (
              <MenuItem key={i} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
            
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 2 }}>
          {filteredPlaces.map((place) => (
            <Link
              key={place.id}
              to={`/place/${place.id}`}
              style={{ textDecoration: 'none' }}
              aria-label={`Voir détails de ${place.name}`}
            >
              <Card sx={{
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                cursor: 'pointer', 
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: 6,
                  zIndex: 1,
                }
              }}>
                <CardContent>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {place.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>{lang === "fr" ? "Ville" : "City"}:</strong> {place.city}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>{lang === "fr" ? "Quartier" : "District"}:</strong> {place.district}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>{lang === "fr" ? "Type d'activité" : "Activity Type"}:</strong> {place.activityType}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>{lang === "fr" ? "Description" : "Description"}:</strong> {place.description}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CsvDataCards;
