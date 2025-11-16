import React from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';

import './FilterPanel.scss';
import UKIcon from '../../assets/united-kingdom.png';
import FranceIcon from '../../assets/france.png';


interface FilterPanelProps {
  lang: string;
  setLang: (lang: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterCity: string;
  setFilterCity: (city: string) => void;
  filterDistrict: string;
  setFilterDistrict: (district: string) => void;
  filterActivityType: string;
  setFilterActivityType: (activity: string) => void;
  cities: string[];
  districts: string[];
  activityTypes: string[];
  toggleLanguage: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  lang,
  setLang,
  searchTerm,
  setSearchTerm,
  filterCity,
  setFilterCity,
  filterDistrict,
  setFilterDistrict,
  filterActivityType,
  setFilterActivityType,
  cities,
  districts,
  activityTypes,
  toggleLanguage
}) => {
  return (
    <div style={{ display: 'flex', gap: 16, overflowX: 'auto' }}>
      <IconButton onClick={toggleLanguage} aria-label="Changer langue" size="large">
        {lang === 'fr' ? (
          <img src={UKIcon} alt="English" style={{ width: 24, height: 24 }} />
        ) : (
          <img src={FranceIcon} alt="Français" style={{ width: 24, height: 24 }} />
        )}
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
        <Select value={filterCity} onChange={(e) => setFilterCity(e.target.value)}>
          <MenuItem value="">{lang === "fr" ? "Villes" : "Cities"}</MenuItem>
          {cities.map(city => <MenuItem key={city} value={city}>{city}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 150 }} size="small">
        <InputLabel>{lang === "fr" ? "Quartiers" : "Districts"}</InputLabel>
        <Select value={filterDistrict} onChange={(e) => setFilterDistrict(e.target.value)}>
          <MenuItem value="">{lang === "fr" ? "Quartiers" : "Districts"}</MenuItem>
          {districts.map(district => <MenuItem key={district} value={district}>{district}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 150 }} size="small">
        <InputLabel>{lang === "fr" ? "Activité" : "Activity"}</InputLabel>
        <Select value={filterActivityType} onChange={(e) => setFilterActivityType(e.target.value)}>
          <MenuItem value="">{lang === "fr" ? "Activité" : "Activity"}</MenuItem>
          {activityTypes.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
        </Select>
      </FormControl>
    </div>
  );
};

export default FilterPanel;
