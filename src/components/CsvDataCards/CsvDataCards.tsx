import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import { Place } from '../../models/Place';
import FilterPanel from '../FilterPanel/FilterPanel';
import { Box, CircularProgress } from '@mui/material';
import { normalizeName } from '../../utils/normalizeDataUtils';
import PlaceCard from '../PlaceCard/PlaceCard';

import './CsvDataCards.scss';

const STORAGE_KEY_BASE = 'placesData';

const CsvDataCards: React.FC = () => {
  const browserLang = navigator.language.startsWith('fr') ? 'fr' : 'en';
  const [lang, setLang] = useState<string>(browserLang);
  const STORAGE_KEY = useMemo(() => `${STORAGE_KEY_BASE}_${lang}`, [lang]);
  const [places, setPlaces] = useState<Place[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterCity, setFilterCity] = useState<string>('');
  const [filterDistrict, setFilterDistrict] = useState<string>('');
  const [filterActivityType, setFilterActivityType] = useState<string>('');
  const [filteredDistricts, setFilteredDistricts] = useState<string[]>([]);

  useEffect(() => {
    if (places.length === 0) {
      setLoading(true);
      const fileName = lang === 'fr' ? '/Places_fr.csv' : '/Places_en.csv';
      fetch(fileName)
        .then((response) => {
          if (!response.ok) throw new Error("Erreur lors du chargement du fichier CSV.");
          return response.text();
        })
        .then((csvText) => {
          const parsed = Papa.parse<Record<string, string>>(csvText, {
            header: true,
            skipEmptyLines: true,
          });
          const filteredData = parsed.data.filter((item) => {
            const rawName = item.Nom || item.Name || '';
            return rawName.trim() !== '' && rawName.trim() !== '-';
          });
          const placeInstances = filteredData.map((item) => {
            const rawName = item.Nom || item.Name || '';
            return new Place({
              id: normalizeName(rawName),
              name: rawName,
              city: item.Ville || item.City || '',
              district: item.Quartier || item.District || '',
              activityType: item["Type d'activité"] || item['Activity Type'] || '',
              description: item.Description || '',
              link: item['lieux/site'] || item.Link || '',
              comment: item.Commentaire || item.Comment || '',
            });
          });
          setPlaces(placeInstances);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [lang, STORAGE_KEY]);

  useEffect(() => {
    if (places.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(places));
    }
  }, [places, STORAGE_KEY]);

  const cities = Array.from(new Set(places.map((p) => p.city))).sort();
  const districts = Array.from(new Set(places.map((p) => p.district))).sort();
  const activityTypes = Array.from(new Set(places.map((p) => p.activityType))).sort();

  useEffect(() => {
    if (filterCity !== '') {
      const districtsPourVille = Array.from(
        new Set(places.filter((p) => p.city === filterCity).map((p) => p.district))
      ).sort();
      setFilteredDistricts(districtsPourVille);
    } else {
      setFilteredDistricts(districts);
    }
  }, [filterCity, places, districts]);

  const filteredPlaces = places.filter(
    (place) =>
      place.name.trim() !== '' &&
      place.name.trim() !== '-' &&
      place.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCity === '' || place.city === filterCity) &&
      (filterDistrict === '' || place.district === filterDistrict) &&
      (filterActivityType === '' || place.activityType === filterActivityType)
  );

  const toggleLanguage = () => {
    const newLang = lang === 'fr' ? 'en' : 'fr';
    setLang(newLang);
    setPlaces([]);
    setSearchTerm('');
    setFilterCity('');
    setFilterDistrict('');
    setFilterActivityType('');
  };

  return (
    <Box sx={{ p: 2 }}>
      <FilterPanel
        lang={lang}
        setLang={setLang}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterCity={filterCity}
        setFilterCity={setFilterCity}
        filterDistrict={filterDistrict}
        setFilterDistrict={setFilterDistrict}
        filterActivityType={filterActivityType}
        setFilterActivityType={setFilterActivityType}
        cities={cities}
        districts={filteredDistricts}
        activityTypes={activityTypes}
        toggleLanguage={toggleLanguage}
      />
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))',
            gap: 2,
          }}
        >
          {filteredPlaces.map((place) => (
            <PlaceCard key={place.id} place={place} lang={lang} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CsvDataCards;
