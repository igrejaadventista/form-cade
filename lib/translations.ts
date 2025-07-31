export type Language = 'pt' | 'es';

export interface Translations {
  title: string;
  loading: string;
  error: string;
  dataLoaded: string;
  guestsAvailable: string;
  searchGuest: string;
  searchPlaceholder: string;
  searchButton: string;
  guestFound: string;
  name: string;
  documentType: string;
  document: string;
  hotel: string;
  noGuestFound: string;
  invalidInput: string;
  errorLoadingData: string;
}

export const translations: Record<Language, Translations> = {
  pt: {
    title: 'Consulta de Hóspedes',
    loading: 'Carregando dados dos hóspedes...',
    error: 'Erro ao carregar os dados dos hóspedes. Verifique se a planilha do Google está disponível.',
    dataLoaded: '✓ Dados carregados',
    guestsAvailable: 'hóspedes disponíveis para consulta',
    searchGuest: 'Buscar hóspede',
    searchPlaceholder: 'Digite o nome ou documento',
    searchButton: 'Buscar',
    guestFound: '✓ Hóspede encontrado',
    name: 'Nome',
    documentType: 'Tipo de Documento',
    document: 'Documento',
    hotel: 'Hotel',
    noGuestFound: '❌ Nenhum hóspede encontrado com este nome ou documento.',
    invalidInput: '❌ Nome inválido. Digite um nome válido.',
    errorLoadingData: 'Erro ao carregar os dados dos hóspedes da planilha do Google.'
  },
  es: {
    title: 'Consulta de Huéspedes',
    loading: 'Cargando datos de huéspedes...',
    error: 'Error al cargar los datos de huéspedes. Verifique si la hoja de Google está disponible.',
    dataLoaded: '✓ Datos cargados',
    guestsAvailable: 'huéspedes disponibles para consulta',
    searchGuest: 'Buscar huésped',
    searchPlaceholder: 'Digite el nombre o documento',
    searchButton: 'Buscar',
    guestFound: '✓ Huésped encontrado',
    name: 'Nombre',
    documentType: 'Tipo de Documento',
    document: 'Documento',
    hotel: 'Hotel',
    noGuestFound: '❌ No se encontró ningún huésped con este nombre o documento.',
    invalidInput: '❌ Nombre inválido. Digite un nombre válido.',
    errorLoadingData: 'Error al cargar los datos de huéspedes de la hoja de Google.'
  }
}; 