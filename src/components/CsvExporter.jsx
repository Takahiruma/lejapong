import { CSVLink } from 'react-csv';
import { Place } from '../models/Place';

const data = [
  new Place({ name: '...', city: '...', district: '...', activityType: '...', description: '...', link: '...', comment: '...' }),
];
const headers = [
  { label: 'Name', key: 'name' },
  { label: 'City', key: 'city' },
  { label: 'District', key: 'district' },
  { label: 'Activity Type', key: 'activityType' },
  { label: 'Description', key: 'description' },
  { label: 'Link', key: 'link' },
  { label: 'Comment', key: 'comment' }
];

<CSVLink data={data} headers={headers} filename={'activité global - Activité.csv'}>Exporter fichier CSV</CSVLink>
