/**
 * Constantes centralizadas para MarketPro GT
 * 
 * Este archivo contiene todas las constantes que antes estaban hardcodeadas
 * en diferentes archivos del proyecto.
 * 
 * @fileoverview Constantes centralizadas
 * @version 2.4.0
 * @since 2025-01-27
 */

// Timeouts para generación de videos
export const VIDEO_GENERATION_TIMEOUTS = {
  RUNWAY: 30000, // 30 segundos
  PIKA: 25000,   // 25 segundos
  LUMA: 30000,   // 30 segundos
} as const;

// Dimensiones de canvas para infografías
export const CANVAS_DIMENSIONS = {
  WIDTH: 1200,
  HEIGHT: 1600,
  HEADER_HEIGHT: 100,
  CONTENT_MARGIN: 50,
  SECTION_SPACING: 30,
} as const;

// URLs de APIs externas
export const API_URLS = {
  PLACEHOLDER_IMAGE: 'https://via.placeholder.com',
  PICSUM_IMAGE: 'https://picsum.photos',
  GOOGLE_FONTS: 'https://fonts.googleapis.com/css2',
} as const;

// Configuración de monedas por región
export const CURRENCY_CONFIG = {
  GUATEMALA: {
    code: 'GTQ',
    locale: 'es-GT',
  },
  DEFAULT: {
    code: 'USD',
    locale: 'en-US',
  },
} as const;

// Intervalos de actualización
export const UPDATE_INTERVALS = {
  REALTIME_ANALYTICS: 30000, // 30 segundos
  MAB_REFRESH: 5000,         // 5 segundos
  CAMPAIGN_MONITORING: 60000, // 1 minuto
} as const;

// Límites de paginación
export const PAGINATION_LIMITS = {
  DEFAULT: 100,
  LARGE: 1000,
  SMALL: 50,
} as const;

// Configuración de colores para badges
export const BADGE_COLORS = {
  SUCCESS: 'bg-green-100 text-green-800',
  WARNING: 'bg-yellow-100 text-yellow-800',
  ERROR: 'bg-red-100 text-red-800',
  INFO: 'bg-blue-100 text-blue-800',
  SECONDARY: 'bg-gray-100 text-gray-800',
  PURPLE: 'bg-purple-100 text-purple-800',
  PINK: 'bg-pink-100 text-pink-800',
  ORANGE: 'bg-orange-100 text-orange-800',
  CYAN: 'bg-cyan-100 text-cyan-800',
} as const;

// Configuración de canales de tráfico
export const TRAFFIC_CHANNEL_COLORS = {
  'Organic Search': 'bg-green-100 text-green-800',
  'Paid Search': 'bg-blue-100 text-blue-800',
  'Direct': 'bg-gray-100 text-gray-800',
  'Social': 'bg-purple-100 text-purple-800',
  'Email': 'bg-yellow-100 text-yellow-800',
  'Referral': 'bg-orange-100 text-orange-800',
  'Display': 'bg-pink-100 text-pink-800',
  'Video': 'bg-red-100 text-red-800',
} as const;

// Configuración de dispositivos
export const DEVICE_COLORS = {
  mobile: 'bg-green-100 text-green-800',
  desktop: 'bg-blue-100 text-blue-800',
  tablet: 'bg-purple-100 text-purple-800',
} as const;

// Configuración de estados de campaña
export const CAMPAIGN_STATUS_COLORS = {
  active: 'bg-green-100 text-green-800',
  paused: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-blue-100 text-blue-800',
  failed: 'bg-red-100 text-red-800',
  draft: 'bg-gray-100 text-gray-800',
} as const;

// Configuración de tipos de credenciales
export const CREDENTIAL_TYPE_COLORS = {
  api_key: 'bg-blue-100 text-blue-800',
  oauth2: 'bg-green-100 text-green-800',
  service_account: 'bg-purple-100 text-purple-800',
} as const;

// Configuración de plataformas sociales
export const SOCIAL_PLATFORM_COLORS = {
  facebook: 'bg-blue-100 text-blue-800',
  instagram: 'bg-pink-100 text-pink-800',
  linkedin: 'bg-blue-100 text-blue-800',
  twitter: 'bg-cyan-100 text-cyan-800',
  tiktok: 'bg-gray-100 text-gray-800',
  youtube: 'bg-red-100 text-red-800',
} as const;

// Configuración de fases de estrategia
export const STRATEGY_PHASE_COLORS = {
  research: 'bg-blue-100 text-blue-800',
  engagement: 'bg-yellow-100 text-yellow-800',
  relationship: 'bg-green-100 text-green-800',
  promotion: 'bg-purple-100 text-purple-800',
} as const;

// Configuración de estados de experimentos RL
export const RL_EXPERIMENT_STATUS_COLORS = {
  active: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  paused: 'bg-yellow-100 text-yellow-800',
} as const;

// Configuración de estados de contenido
export const CONTENT_STATUS_COLORS = {
  published: 'bg-blue-100 text-blue-800',
  draft: 'bg-gray-100 text-gray-800',
  scheduled: 'bg-yellow-100 text-yellow-800',
  archived: 'bg-gray-100 text-gray-800',
} as const;

// Configuración de tipos de contenido
export const CONTENT_TYPE_LABELS = {
  social_post: 'Post de Red Social',
  blog_post: 'Artículo de Blog',
  email: 'Email Marketing',
  ad_copy: 'Copia Publicitaria',
  story: 'Story/Historia',
  video_script: 'Guión de Video',
} as const;

// Configuración de plataformas
export const PLATFORM_LABELS = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  twitter: 'Twitter',
  tiktok: 'TikTok',
  youtube: 'YouTube',
} as const;

// Configuración de tipos de autenticación
export const AUTH_TYPE_LABELS = {
  api_key: 'API Key',
  oauth_token: 'OAuth Token',
  service_account: 'Service Account',
} as const;

// Configuración de tipos de estrategia
export const STRATEGY_TYPE_LABELS = {
  dream_100: 'Dream 100',
  value_ladder: 'Value Ladder',
  webinar: 'Webinar',
  funnel: 'Funnel',
} as const;

// Configuración de tipos de análisis
export const ANALYSIS_TYPE_LABELS = {
  market_research: 'Investigación de Mercado',
  competitor_analysis: 'Análisis de Competencia',
  audience_analysis: 'Análisis de Audiencia',
  content_analysis: 'Análisis de Contenido',
} as const;

// Configuración de tipos de contenido generado
export const CONTENT_GENERATION_TYPE_LABELS = {
  social_post: 'Post de Red Social',
  blog_post: 'Artículo de Blog',
  email: 'Email Marketing',
  ad_copy: 'Copia Publicitaria',
  story: 'Story/Historia',
  video_script: 'Guión de Video',
} as const;

// Configuración de tonos de contenido
export const CONTENT_TONE_LABELS = {
  professional: 'Profesional',
  casual: 'Casual',
  persuasive: 'Persuasivo',
  informative: 'Informativo',
  friendly: 'Amigable',
  authoritative: 'Autoritario',
} as const;

// Configuración de plataformas de contenido
export const CONTENT_PLATFORM_LABELS = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  twitter: 'Twitter',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  email: 'Email',
  blog: 'Blog',
} as const;

// Configuración de rangos de fechas
export const DATE_RANGES = {
  LAST_7_DAYS: 'last_7d',
  LAST_30_DAYS: 'last_30d',
  LAST_90_DAYS: 'last_90d',
  LAST_YEAR: 'last_year',
} as const;

// Configuración de métricas de rendimiento
export const PERFORMANCE_METRICS = {
  ENGAGEMENT_RATE_THRESHOLD: 0.05, // 5%
  CLICK_THROUGH_RATE_THRESHOLD: 0.02, // 2%
  CONVERSION_RATE_THRESHOLD: 0.01, // 1%
  BOUNCE_RATE_THRESHOLD: 0.7, // 70%
} as const;

// Configuración de límites de API
export const API_LIMITS = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 segundo
  TIMEOUT: 30000, // 30 segundos
  RATE_LIMIT_DELAY: 100, // 100ms
} as const;

// Configuración de tamaños de archivo
export const FILE_SIZE_LIMITS = {
  IMAGE_MAX_SIZE: 10 * 1024 * 1024, // 10MB
  VIDEO_MAX_SIZE: 100 * 1024 * 1024, // 100MB
  DOCUMENT_MAX_SIZE: 5 * 1024 * 1024, // 5MB
} as const;

// Configuración de formatos de archivo
export const SUPPORTED_FORMATS = {
  IMAGES: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  VIDEOS: ['mp4', 'avi', 'mov', 'wmv', 'flv'],
  DOCUMENTS: ['pdf', 'doc', 'docx', 'txt', 'rtf'],
} as const;

// Configuración de colores de tema
export const THEME_COLORS = {
  PRIMARY: '#3B82F6',
  SECONDARY: '#6B7280',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#3B82F6',
} as const;

// Configuración de breakpoints responsive
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px',
} as const;

// Configuración de animaciones
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Configuración de z-index
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
} as const;
