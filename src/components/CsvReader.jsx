import { Place } from '../models/Place';
import Papa from 'papaparse';

const importCsv = (file) => {
  Papa.parse(file, {
    header: true,
    complete: (result) => {
      const places = result.data.map(row =>
        new Place({
          name: row.Nom,
          city: row.Ville,
          district: row.Quartier,
          activityType: row["Type d'activité"],
          description: row.Description,
          link: row["lieux/site"],
          comment: row.Commentaire
        })
      );
    }
  });
};
