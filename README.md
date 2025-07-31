# Sistema Hotel - Consulta de Hóspedes

Este é um sistema simples para consulta de hóspedes através de arquivos CSV.

## Funcionalidades

- Carregamento automático dos dados de hóspedes do arquivo CSV
- Busca de hóspedes por nome
- Interface simples e intuitiva
- Busca case-insensitive
- **Embeddable em iframe** - Pode ser integrado em outros websites

## Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

## Instalação

1. Clone ou baixe este projeto
2. Instale as dependências:
   ```bash
   npm install
   ```

## Executando o projeto

Para desenvolvimento:
```bash
npm run dev
```

Para build de produção:
```bash
npm run build
npm start
```

## URLs disponíveis

- `YOUR_APP_URL` - Versão completa da aplicação (Português)
- `YOUR_APP_URL?lang=es` - Versão completa da aplicação (Espanhol)
- `YOUR_APP_URL/iframe` - Versão compacta para embed em iframe (Português)
- `YOUR_APP_URL/iframe?lang=es` - Versão compacta para embed em iframe (Espanhol)
- `YOUR_APP_URL/embed-example.html` - Exemplo estático de como usar o iframe
- `YOUR_APP_URL/embed-dynamic` - Exemplo dinâmico com URLs automáticas

## Embedding em outros websites

Para embedar o sistema em outro website, use um dos seguintes códigos:

```html
<!-- Versão completa -->
<iframe src="YOUR_APP_URL" width="100%" height="600"></iframe>

<!-- Versão compacta para iframe -->
<iframe src="YOUR_APP_URL/iframe" width="400" height="300"></iframe>

<!-- Com parâmetro de idioma -->
<iframe src="YOUR_APP_URL?lang=es" width="100%" height="600"></iframe>
<iframe src="YOUR_APP_URL/iframe?lang=pt" width="400" height="300"></iframe>
```

## Fonte de Dados

O sistema agora carrega dados diretamente de uma planilha do Google Sheets. A planilha deve conter as seguintes colunas obrigatórias:
- **Nome**: Nome completo do hóspede
- **Tipo_Documento**: Tipo do documento (RG, CPF, RNE)
- **Documento**: Número do documento do hóspede
- **Hotel**: Nome do hotel

**Busca flexível:** O sistema busca hóspedes por nome OU documento (busca parcial, case-insensitive, aceita qualquer caractere)

**Colunas opcionais para navegação:**
- **Google_Maps_URL**: URL específica do Google Maps (opcional)
- **Waze_URL**: URL específica do Waze (opcional)
- **Waze_Venue_ID**: ID específico do venue no Waze para localização precisa (opcional)

**Planilha atual:** https://docs.google.com/spreadsheets/d/1hmLnmeQzR26U6CcrWwXuU6JIPAwxdyQOr84PPV1Zbpw/edit?usp=sharing

Exemplo do formato:
```
Nome,Tipo_Documento,Documento,Hotel,Google_Maps_URL,Waze_URL,Waze_Venue_ID
Maria Pereira,RG,69.501.149-2,Hotel Jardins Palace,https://maps.google.com/...,https://waze.com/...,200214025.2001878106.2164449
Lucas Almeida,RG,85.554.418-8,Hotel Encanto Palace,https://maps.google.com/...,https://waze.com/...,200214025.2001878106.2164448
Rafael Souza,CPF,735.694.188-52,Hotel Mar Palace,https://maps.google.com/...,https://waze.com/...,200214025.2001878106.2164447
```

### Prioridade das URLs de Navegação

O sistema usa a seguinte prioridade para determinar as URLs de navegação:

**Google Maps:**
1. **Google_Maps_URL** - Usa a URL personalizada da planilha
2. **Fallback** - Gera URL baseada no nome do hotel

**Waze:**
1. **Waze_Venue_ID** (mais preciso) - Usa o venue_id específico do Waze
2. **Waze_URL** - Usa a URL personalizada da planilha
3. **Fallback** - Gera URL baseada no nome do hotel

## Tecnologias utilizadas

- Next.js
- React
- TypeScript
- PapaParse (para parsing de CSV) 