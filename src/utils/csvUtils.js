import Papa from "papaparse";

/**
 * Fonction pour parser un fichier CSV (File object) et retourner les données formatées
 * @param {File} file - Fichier CSV sélectionné
 * @returns {Promise<Array<Object>>} - Promesse résolue avec les données CSV en format tableau d'objets
 */
export function parseCsvFile(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        
        const cleanedData = results.data.map((row) => {
          const cleanedRow = {};
          Object.keys(row).forEach((key) => {
            const cleanKey = key
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/\s+/g, "_")
              .replace(/[^\w_]/g, "");
            cleanedRow[cleanKey] = row[key];
          });
          return cleanedRow;
        });
        resolve(cleanedData);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

/**
 * Fonction pour convertir des données JSON en CSV string
 * @param {Array<Object>} jsonData - Tableau d'objets JSON à convertir en CSV
 * @returns {string} - Contenu CSV formé à partir des données JSON
 */
export function jsonToCsv(jsonData) {
  return Papa.unparse(jsonData, {
    quotes: false,
    delimiter: ",",
    header: true,
    newline: "\n",
  });
}
