// Auto-detect the current URL for the application
export function getBaseUrl(): string {
  // Check if we're in the browser
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Check environment variable
  if (process.env.BASE_URL) {
    return process.env.BASE_URL;
  }
  
  // Default fallback
  return 'http://localhost:3000';
}

// Get the current URL with path
export function getCurrentUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.href;
  }
  return getBaseUrl();
}

// Generate iframe embed codes
export function getEmbedCodes(baseUrl: string = getBaseUrl()) {
  return {
    full: `${baseUrl}`,
    iframe: `${baseUrl}/iframe`,
    fullSpanish: `${baseUrl}?lang=es`,
    iframePortuguese: `${baseUrl}/iframe?lang=pt`,
    iframeSpanish: `${baseUrl}/iframe?lang=es`,
  };
} 