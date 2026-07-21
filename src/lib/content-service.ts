import { supabase } from './supabase'
import { Content } from './supabase'

export interface ContentGenerationResult {
  success: boolean
  content?: string
  error?: string
  metadata?: {
    content_type: string
    platform: string
    topic: string
    tone: string
    client_id: string
    generated_at: string
  }
}

export interface SaveContentRequest {
  title: string
  content_body: string
  content_type: string
  platform: string
  client_id: string
  campaign_id?: string
  hook?: string
  story?: string
  offer?: string
  tone?: string
  topic?: string
  status?: 'draft' | 'published' | 'scheduled' | 'archived'
  scheduled_for?: string
  metadata?: any
}

export interface ContentVersion {
  id: string
  content_id: string
  version_number: number
  content_body: string
  changes_summary: string
  created_at: string
  created_by: string
}

class ContentService {
  /**
   * Guarda contenido generado automáticamente
   */
  async saveGeneratedContent(
    content: string,
    metadata: ContentGenerationResult['metadata'],
    clientId: string,
    campaignId?: string
  ): Promise<{ success: boolean; contentId?: string; error?: string }> {
    try {
      if (!metadata) {
        throw new Error('Metadatos requeridos para guardar contenido')
      }

      // Crear título basado en el tema y plataforma
      const title = `${metadata.topic} - ${metadata.platform.toUpperCase()}`
      
      const contentData: SaveContentRequest = {
        title,
        content_body: content,
        content_type: metadata.content_type,
        platform: metadata.platform,
        client_id: clientId,
        campaign_id: campaignId,
        tone: metadata.tone,
        topic: metadata.topic,
        status: 'draft',
        metadata: {
          ...metadata,
          generated_with_ai: true,
          ai_model: 'gpt-5-nano-2025-08-07'
        }
      }

      const { data, error } = await supabase
        .from('content')
        .insert([contentData])
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        contentId: data.id
      }
    } catch (error) {
      console.error('Error saving generated content:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  /**
   * Crea una nueva versión de contenido existente usando la función de base de datos
   */
  async createContentVersion(
    contentId: string,
    newContent: string,
    changesSummary: string,
    userId: string
  ): Promise<{ success: boolean; versionId?: string; error?: string }> {
    try {
      const { data, error } = await supabase.rpc('create_content_version', {
        p_content_id: contentId,
        p_content_body: newContent,
        p_changes_summary: changesSummary,
        p_created_by: userId
      })

      if (error) throw error

      return {
        success: true,
        versionId: data
      }
    } catch (error) {
      console.error('Error creating content version:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  /**
   * Obtiene todas las versiones de un contenido usando la función de base de datos
   */
  async getContentVersions(contentId: string): Promise<{ success: boolean; versions?: ContentVersion[]; error?: string }> {
    try {
      const { data, error } = await supabase.rpc('get_content_version_history', {
        content_uuid: contentId
      })

      if (error) throw error

      return {
        success: true,
        versions: data || []
      }
    } catch (error) {
      console.error('Error getting content versions:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  /**
   * Obtiene la última versión de un contenido
   */
  async getLatestContentVersion(contentId: string): Promise<{ success: boolean; version?: ContentVersion; error?: string }> {
    try {
      const { data, error } = await supabase.rpc('get_latest_content_version', {
        content_uuid: contentId
      })

      if (error) throw error

      return {
        success: true,
        version: data && data.length > 0 ? data[0] : null
      }
    } catch (error) {
      console.error('Error getting latest content version:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  /**
   * Actualiza contenido existente
   */
  async updateContent(
    contentId: string,
    updates: Partial<SaveContentRequest & { changes_summary?: string }>,
    userId: string,
    createVersion: boolean = true
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Si se debe crear una versión, obtener el contenido actual
      if (createVersion) {
        const { data: currentContent, error: fetchError } = await supabase
          .from('content')
          .select('content_body')
          .eq('id', contentId)
          .single()

        if (fetchError) throw fetchError

        // Crear versión del contenido actual
        await this.createContentVersion(
          contentId,
          currentContent.content_body,
          updates.changes_summary || 'Versión anterior antes de actualización',
          userId
        )
      }

      // Separar changes_summary de los updates para no guardarlo en la tabla content
      const { changes_summary, ...contentUpdates } = updates

      // Actualizar el contenido
      const { error } = await supabase
        .from('content')
        .update({
          ...contentUpdates,
          updated_at: new Date().toISOString()
        })
        .eq('id', contentId)

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Error updating content:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  /**
   * Obtiene contenido por cliente
   */
  async getContentByClient(clientId: string): Promise<{ success: boolean; content?: Content[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return {
        success: true,
        content: data || []
      }
    } catch (error) {
      console.error('Error getting content by client:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  /**
   * Obtiene contenido por campaña
   */
  async getContentByCampaign(campaignId: string): Promise<{ success: boolean; content?: Content[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return {
        success: true,
        content: data || []
      }
    } catch (error) {
      console.error('Error getting content by campaign:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  /**
   * Elimina contenido
   */
  async deleteContent(contentId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Primero eliminar las versiones
      const { error: versionsError } = await supabase
        .from('content_versions')
        .delete()
        .eq('content_id', contentId)

      if (versionsError) throw versionsError

      // Luego eliminar el contenido
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', contentId)

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Error deleting content:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  /**
   * Duplica contenido existente
   */
  async duplicateContent(
    contentId: string,
    newTitle: string,
    clientId: string
  ): Promise<{ success: boolean; newContentId?: string; error?: string }> {
    try {
      // Obtener el contenido original
      const { data: originalContent, error: fetchError } = await supabase
        .from('content')
        .select('*')
        .eq('id', contentId)
        .single()

      if (fetchError) throw fetchError

      // Crear copia con nuevo título
      const { data, error } = await supabase
        .from('content')
        .insert([{
          ...originalContent,
          id: undefined, // Generar nuevo ID
          title: newTitle,
          client_id: clientId,
          status: 'draft',
          created_at: undefined, // Generar nueva fecha
          updated_at: undefined,
          campaign_id: null // No asociar con campaña
        }])
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        newContentId: data.id
      }
    } catch (error) {
      console.error('Error duplicating content:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }
}

export const contentService = new ContentService()
