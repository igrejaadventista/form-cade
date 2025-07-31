import Papa from 'papaparse';

export type Guest = {
  Nome: string;
  Tipo_Documento: string;
  Documento: string;
  Hotel: string;
  Google_Maps_URL?: string;
  Waze_URL?: string;
  Waze_Venue_ID?: string;
};

export async function loadGoogleSheetData(): Promise<Guest[]> {
  try {
    // Google Sheets ID from the URL
    const SHEET_ID = '1hmLnmeQzR26U6CcrWwXuU6JIPAwxdyQOr84PPV1Zbpw';
    
    // Use direct CSV export URL for better data access
    const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;
    
    const response = await fetch(csvUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const csvText = await response.text();
    
    console.log('CSV data length:', csvText.length);
    console.log('CSV lines count:', csvText.split('\n').length);
    
    // Parse CSV using PapaParse
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results: Papa.ParseResult<Guest>) => {
          console.log('Parsed data count:', results.data.length);
          
          // Filter out any empty rows
          const validData = results.data.filter(row => 
            row.Nome && row.Tipo_Documento && row.Documento && row.Hotel
          );
          
          console.log('Valid data count:', validData.length);
          resolve(validData);
        },
        error: (error: Error) => reject(error),
      });
    });
  } catch (error) {
    console.error('Error loading Google Sheet data:', error);
    throw new Error('Failed to load data from Google Sheets');
  }
}

// Keep the old function for backward compatibility
export function parseCSV(file: File): Promise<Guest[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<Guest>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: Papa.ParseResult<Guest>) => resolve(results.data),
      error: (error: Error) => reject(error),
    });
  });
}

export function loadCSVData(): Promise<Guest[]> {
  return new Promise((resolve, reject) => {
    Papa.parse('/dados_hospedes_hotel.csv', {
      header: true,
      skipEmptyLines: true,
      download: true,
      complete: (results: Papa.ParseResult<Guest>) => resolve(results.data),
      error: (error: Error) => reject(error),
    });
  });
}
