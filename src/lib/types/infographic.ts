// Tipos para el sistema de generación de infografías
export interface InfographicData {
  id?: string
  title: string
  subtitle?: string
  description?: string
  theme: InfographicTheme
  layout: InfographicLayout
  sections: InfographicSection[]
  metadata: InfographicMetadata
  style: InfographicStyle
}

export interface InfographicTheme {
  name: string
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  accentColor: string
  fontFamily: string
  style: 'modern' | 'classic' | 'minimalist' | 'corporate' | 'creative'
}

export interface InfographicLayout {
  type: 'vertical' | 'horizontal' | 'grid' | 'timeline' | 'comparison'
  columns: number
  sections: number
  spacing: 'compact' | 'normal' | 'spacious'
}

export interface InfographicSection {
  id: string
  type: 'header' | 'stats' | 'chart' | 'text' | 'image' | 'list' | 'comparison' | 'timeline'
  title?: string
  content: SectionContent
  position: {
    x: number
    y: number
    width: number
    height: number
  }
  style?: SectionStyle
}

export interface SectionContent {
  // Para sección de estadísticas
  stats?: {
    items: StatItem[]
    layout: 'horizontal' | 'vertical' | 'grid'
  }
  
  // Para sección de texto
  text?: {
    content: string
    format: 'paragraph' | 'bullet' | 'numbered'
  }
  
  // Para sección de gráficos
  chart?: {
    type: 'bar' | 'line' | 'pie' | 'doughnut' | 'area'
    data: ChartData[]
    title?: string
    showLegend: boolean
    showValues: boolean
  }
  
  // Para sección de lista
  list?: {
    items: ListItem[]
    type: 'bullet' | 'numbered' | 'checkmark' | 'icon'
  }
  
  // Para sección de comparación
  comparison?: {
    items: ComparisonItem[]
    layout: 'side-by-side' | 'before-after' | 'pros-cons'
  }
  
  // Para sección de timeline
  timeline?: {
    items: TimelineItem[]
    orientation: 'horizontal' | 'vertical'
  }
  
  // Para sección de imagen
  image?: {
    url?: string
    alt: string
    caption?: string
    size: 'small' | 'medium' | 'large' | 'full'
  }
}

export interface StatItem {
  label: string
  value: string | number
  unit?: string
  change?: {
    value: number
    type: 'increase' | 'decrease' | 'neutral'
  }
  icon?: string
  color?: string
}

export interface ChartData {
  label: string
  value: number
  color?: string
  percentage?: number
}

export interface ListItem {
  text: string
  icon?: string
  color?: string
  highlight?: boolean
}

export interface ComparisonItem {
  title: string
  description: string
  pros: string[]
  cons: string[]
  score?: number
  color?: string
}

export interface TimelineItem {
  date: string
  title: string
  description: string
  icon?: string
  color?: string
}

export interface SectionStyle {
  backgroundColor?: string
  textColor?: string
  borderColor?: string
  borderRadius?: number
  padding?: number
  margin?: number
  shadow?: boolean
  gradient?: {
    from: string
    to: string
    direction: 'horizontal' | 'vertical' | 'diagonal'
  }
}

export interface InfographicStyle {
  borderRadius: number
  shadow: boolean
  border: boolean
  borderColor?: string
  backgroundPattern?: 'none' | 'dots' | 'lines' | 'grid' | 'waves'
  watermark?: {
    text: string
    opacity: number
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
  }
}

export interface InfographicMetadata {
  author: string
  createdAt: string
  updatedAt: string
  tags: string[]
  category: string
  language: string
  version: string
  clientId?: string
  campaignId?: string
}

// Tipos para la generación de prompts
export interface InfographicPrompt {
  title: string
  description: string
  style: string
  elements: string[]
  colors: string[]
  layout: string
  targetAudience: string
  purpose: string
}

// Tipos para la respuesta de la API
export interface InfographicGenerationRequest {
  data: InfographicData
  provider: 'dalle' | 'stability' | 'midjourney' | 'gemini'
  size: '1024x1024' | '1024x1792' | '1792x1024' | '2048x2048'
  quality: 'standard' | 'hd'
  count: number
}

export interface InfographicGenerationResponse {
  success: boolean
  images: InfographicImage[]
  prompt: string
  metadata: {
    provider: string
    model: string
    generationTime: number
    cost: number
  }
  error?: string
}

export interface InfographicImage {
  id: string
  url: string
  prompt: string
  metadata: {
    size: string
    quality: string
    provider: string
    model: string
  }
}

// Tipos para templates predefinidos
export interface InfographicTemplate {
  id: string
  name: string
  description: string
  category: string
  thumbnail: string
  data: Partial<InfographicData>
  tags: string[]
  popularity: number
  createdAt: string
}

// Categorías de templates
export type InfographicCategory = 
  | 'marketing'
  | 'analytics'
  | 'social-media'
  | 'business'
  | 'education'
  | 'healthcare'
  | 'technology'
  | 'finance'
  | 'sports'
  | 'lifestyle'
  | 'news'
  | 'presentation'

// Tipos para la base de datos - Esquema mínimo actual
export interface InfographicRecord {
  id: string
  user_id: string
  title: string
  data: InfographicData
  status: 'draft' | 'generating' | 'completed' | 'failed'
  created_at: string
  updated_at: string
}

// Tipo para inserción (sin campos auto-generados)
export interface InfographicInsert {
  title: string
  data: InfographicData
  status: 'draft' | 'generating' | 'completed' | 'failed'
}

// Tipo completo para cuando se ejecute la migración completa:
export interface InfographicRecordFull {
  id: string
  user_id: string
  client_id?: string
  campaign_id?: string
  title: string
  description?: string
  data: InfographicData
  generated_images: InfographicImage[]
  status: 'draft' | 'generating' | 'completed' | 'failed'
  created_at: string
  updated_at: string
  tags: string[]
  category: InfographicCategory
  is_public: boolean
  download_count: number
  view_count: number
}
