import { useState, useEffect } from 'react';
import { getBaseUrl, getEmbedCodes } from '../lib/config';

export default function DynamicEmbedExample() {
  const [baseUrl, setBaseUrl] = useState<string>('');
  const [embedCodes, setEmbedCodes] = useState<any>({});

  useEffect(() => {
    const url = getBaseUrl();
    setBaseUrl(url);
    setEmbedCodes(getEmbedCodes(url));
  }, []);

  if (!baseUrl) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif',
      maxWidth: 1200,
      margin: '0 auto',
      padding: 20
    }}>
      <h1>Sistema de Consulta de Hóspedes - Embed Dinâmico</h1>
      <p>URL atual: <strong>{baseUrl}</strong></p>
      
      <h2>Códigos de Embed</h2>
      
      <div style={{ marginBottom: 30 }}>
        <h3>Versão Completa</h3>
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: 15, 
          borderRadius: 8,
          fontFamily: 'monospace',
          fontSize: '14px'
        }}>
          {`<iframe src="${embedCodes.full}" width="100%" height="600"></iframe>`}
        </div>
      </div>

      <div style={{ marginBottom: 30 }}>
        <h3>Versão Compacta (Iframe)</h3>
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: 15, 
          borderRadius: 8,
          fontFamily: 'monospace',
          fontSize: '14px'
        }}>
          {`<iframe src="${embedCodes.iframe}" width="400" height="300"></iframe>`}
        </div>
      </div>

      <div style={{ marginBottom: 30 }}>
        <h3>Com Parâmetro de Idioma</h3>
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: 15, 
          borderRadius: 8,
          fontFamily: 'monospace',
          fontSize: '14px'
        }}>
          <div style={{ marginBottom: 10 }}>
            <strong>Espanhol:</strong><br />
            {`<iframe src="${embedCodes.fullSpanish}" width="100%" height="600"></iframe>`}
          </div>
          <div style={{ marginBottom: 10 }}>
            <strong>Iframe em Espanhol:</strong><br />
            {`<iframe src="${embedCodes.iframeSpanish}" width="400" height="300"></iframe>`}
          </div>
        </div>
      </div>

      <h2>Exemplos em Funcionamento</h2>
      
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 300 }}>
          <h3>Versão Completa</h3>
          <iframe src={embedCodes.full} width="100%" height="400" style={{ border: '1px solid #ddd', borderRadius: 8 }}></iframe>
        </div>
        
        <div style={{ flex: 1, minWidth: 300 }}>
          <h3>Versão Compacta</h3>
          <iframe src={embedCodes.iframe} width="100%" height="300" style={{ border: '1px solid #ddd', borderRadius: 8 }}></iframe>
        </div>
      </div>

      <h2>URLs Disponíveis</h2>
      <ul>
        <li><code>{embedCodes.full}</code> - Versão completa (Português)</li>
        <li><code>{embedCodes.fullSpanish}</code> - Versão completa (Espanhol)</li>
        <li><code>{embedCodes.iframe}</code> - Versão compacta (Português)</li>
        <li><code>{embedCodes.iframeSpanish}</code> - Versão compacta (Espanhol)</li>
      </ul>
    </div>
  );
} 