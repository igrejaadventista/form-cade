import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { loadGoogleSheetData, Guest } from '../lib/parseCsv';
import { translations, Language } from '../lib/translations';

export default function Home() {
  const [data, setData] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [doc, setDoc] = useState('');
  const [results, setResults] = useState<Guest[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isInputValid, setIsInputValid] = useState(true);
  const router = useRouter();
  const [language, setLanguage] = useState<Language>('pt');

  const t = translations[language];

  // Handle URL parameter for language
  useEffect(() => {
    const { lang } = router.query;
    if (lang === 'es' || lang === 'pt') {
      setLanguage(lang as Language);
    }
  }, [router.query]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const guests = await loadGoogleSheetData();
        setData(guests);
        setError(null);
      } catch (err) {
        console.error('Error loading Google Sheet data:', err);
        setError(t.errorLoadingData);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const validateInput = (input: string): boolean => {
    // Allow any characters
    return true;
  };

  const handleSearch = () => {
    if (!doc.trim()) {
      return; // Don't search if input is empty
    }
    
    if (!validateInput(doc)) {
      setResults([]);
      setHasSearched(true);
      setIsInputValid(false);
      return; // Don't search if input contains invalid characters
    }
    
    setIsInputValid(true);
    const searchTerm = doc.toLowerCase();
    
    // Search by name OR document - find all matches
    const found = data.filter((p: Guest) => 
      p.Nome.toLowerCase().includes(searchTerm) || 
      p.Documento.toLowerCase().includes(searchTerm)
    );
    
    setResults(found);
    setHasSearched(true);
  };

  if (loading) {
    return (
      <div style={{ 
        padding: 20, 
        maxWidth: 600, 
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#333' }}>{t.title}</h1>
        <div style={{ padding: 40 }}>
          <p>{t.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: 20, 
        maxWidth: 600, 
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h1 style={{ color: '#333', textAlign: 'center' }}>{t.title}</h1>
        <div style={{ 
          padding: 20, 
          backgroundColor: '#f8d7da', 
          border: '1px solid #f5c6cb', 
          borderRadius: 8,
          color: '#721c24'
        }}>
          <h3>Erro ao carregar dados</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: 20, 
      maxWidth: 600, 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        marginBottom: 20 
      }}>
        <h1 style={{ color: '#333', margin: 0, textAlign: 'center' }}>{t.title}</h1>
      </div>



      <div style={{ marginBottom: 20, padding: 20, border: '1px solid #ddd', borderRadius: 8 }}>
        <h3>{t.searchGuest}</h3>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            placeholder={t.searchPlaceholder}
            value={doc}
            onChange={(e) => {
              setDoc(e.target.value);
              setHasSearched(false);
              setResults([]);
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            style={{ flex: 1, padding: 10, border: '1px solid #ccc', borderRadius: 4 }}
          />
          <button 
            onClick={handleSearch}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            {t.searchButton}
          </button>
        </div>
      </div>

      {results.length > 0 ? (
        <div>
          <p style={{ marginBottom: 10, color: '#28a745', fontWeight: 'bold' }}>
            ✓ {results.length} hóspede(s) encontrado(s)
          </p>
          {results.map((result, index) => (
            <div key={index} style={{ 
              padding: 20, 
              backgroundColor: '#f8f9fa', 
              border: '1px solid #dee2e6', 
              borderRadius: 8,
              marginBottom: 15
            }}>
              <p><strong>{t.name}:</strong> {result.Nome}</p>
              <p><strong>{t.hotel}:</strong> {result.Hotel}</p>
              
              <div style={{ marginTop: 15, display: 'flex', gap: 10 }}>
                <button
                  onClick={() => {
                    let mapsUrl: string;
                    console.log('Google_Maps_URL:', result.Google_Maps_URL);
                    
                    if (result.Google_Maps_URL && result.Google_Maps_URL.trim()) {
                      // Use custom URL from spreadsheet
                      mapsUrl = result.Google_Maps_URL.trim();
                      console.log('Using custom URL:', mapsUrl);
                    } else {
                      // Fallback to hotel name search
                      mapsUrl = `https://maps.google.com/maps?q=${encodeURIComponent(result.Hotel)}`;
                      console.log('Using fallback URL:', mapsUrl);
                    }
                    window.open(mapsUrl, '_blank');
                  }}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#4285f4',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  Google Maps
                </button>
                
                <button
                  onClick={() => {
                    let wazeUrl: string;
                    console.log('Waze_Venue_ID:', result.Waze_Venue_ID);
                    console.log('Waze_URL:', result.Waze_URL);
                    
                    if (result.Waze_Venue_ID && result.Waze_Venue_ID.trim()) {
                      // Use specific venue_id for precise location
                      const venueId = result.Waze_Venue_ID.trim();
                      wazeUrl = `https://ul.waze.com/ul?venue_id=${venueId}&navigate=yes`;
                      console.log('Using venue_id URL:', wazeUrl);
                    } else if (result.Waze_URL && result.Waze_URL.trim()) {
                      // Use custom URL from spreadsheet
                      wazeUrl = result.Waze_URL.trim();
                      console.log('Using custom URL:', wazeUrl);
                    } else {
                      // Fallback to hotel name search
                      wazeUrl = `https://waze.com/ul?q=${encodeURIComponent(result.Hotel)}&navigate=yes`;
                      console.log('Using fallback URL:', wazeUrl);
                    }
                    window.open(wazeUrl, '_blank');
                  }}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#33ccff',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  Waze
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : hasSearched && doc && !isInputValid ? (
        <div style={{ 
          padding: 20, 
          backgroundColor: '#f8d7da', 
          border: '1px solid #f5c6cb', 
          borderRadius: 8,
          color: '#721c24'
        }}>
          <p>{t.invalidInput}</p>
        </div>
      ) : hasSearched && doc && (
        <div style={{ 
          padding: 20, 
          backgroundColor: '#f8d7da', 
          border: '1px solid #f5c6cb', 
          borderRadius: 8,
          color: '#721c24'
        }}>
          <p>{t.noGuestFound}</p>
        </div>
      )}
    </div>
  );
}
