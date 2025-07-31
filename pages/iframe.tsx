import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { loadGoogleSheetData, Guest } from '../lib/parseCsv';
import { translations, Language } from '../lib/translations';

export default function IframeGuestSearch() {
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
        padding: 15, 
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        border: '1px solid #dee2e6'
      }}>
        <p>{t.loading}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: 15, 
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        backgroundColor: '#f8d7da',
        border: '1px solid #f5c6cb',
        borderRadius: 8,
        color: '#721c24'
      }}>
        <p><strong>Error:</strong> {error}</p>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: 15, 
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      backgroundColor: '#ffffff',
      borderRadius: 8,
      border: '1px solid #dee2e6',
      maxWidth: '100%'
    }}>
      <div style={{ 
        marginBottom: 15 
      }}>
        <h3 style={{ 
          margin: 0, 
          color: '#333',
          fontSize: '16px',
          textAlign: 'center'
        }}>
          {t.title}
        </h3>
      </div>



      <div style={{ marginBottom: 15 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
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
            style={{ 
              flex: 1, 
              padding: 8, 
              border: '1px solid #ccc', 
              borderRadius: 4,
              fontSize: '13px'
            }}
          />
          <button 
            onClick={handleSearch}
            style={{ 
              padding: '8px 12px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: '13px',
              whiteSpace: 'nowrap'
            }}
          >
            {t.searchButton}
          </button>
        </div>
      </div>

      {results.length > 0 ? (
        <div>
          <p style={{ marginBottom: 8, color: '#28a745', fontWeight: 'bold', fontSize: '11px' }}>
            ✓ {results.length} hóspede(s) encontrado(s)
          </p>
          {results.map((result, index) => (
            <div key={index} style={{ 
              padding: 12, 
              backgroundColor: '#f8f9fa', 
              border: '1px solid #dee2e6', 
              borderRadius: 6,
              fontSize: '12px',
              marginBottom: 10
            }}>
              <p style={{ margin: '4px 0' }}><strong>{t.name}:</strong> {result.Nome}</p>
              <p style={{ margin: '4px 0' }}><strong>{t.hotel}:</strong> {result.Hotel}</p>
              
              <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
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
                    padding: '4px 8px',
                    backgroundColor: '#4285f4',
                    color: 'white',
                    border: 'none',
                    borderRadius: 3,
                    cursor: 'pointer',
                    fontSize: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  Maps
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
                    padding: '4px 8px',
                    backgroundColor: '#33ccff',
                    color: 'white',
                    border: 'none',
                    borderRadius: 3,
                    cursor: 'pointer',
                    fontSize: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
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
            padding: 12, 
            backgroundColor: '#f8d7da', 
            border: '1px solid #f5c6cb', 
            borderRadius: 6,
            color: '#721c24',
            fontSize: '12px'
          }}>
            <p style={{ margin: 0 }}>{t.invalidInput}</p>
          </div>
        ) : hasSearched && doc && (
          <div style={{ 
            padding: 12, 
            backgroundColor: '#f8d7da', 
            border: '1px solid #f5c6cb', 
            borderRadius: 6,
            color: '#721c24',
            fontSize: '12px'
          }}>
            <p style={{ margin: 0 }}>{t.noGuestFound}</p>
          </div>
        )}
    </div>
  );
} 