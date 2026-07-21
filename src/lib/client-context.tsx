// Context para manejo de cliente activo - PRODUCCIÓN
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { logDebug, logWarn, logError } from '../utils/logger'
import { useAuth } from '@/lib/authSimple'
import type { Client } from '@/lib/supabase'

interface ClientContextType {
  activeClient: Client | null
  setActiveClient: (client: Client | null) => void
  clients: Client[]
  isLoading: boolean
  refreshClients: () => Promise<void>
}

const ClientContext = createContext<ClientContextType | undefined>(undefined)

export function ClientProvider({ children }: { children: ReactNode }) {
  const [activeClient, setActiveClient] = useState<Client | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  const refreshClients = async () => {
    setIsLoading(true)
    try {
      // Si no hay usuario autenticado, no hacer nada
      if (!user) {
        logDebug('❌ No hay usuario autenticado - saltando carga de clientes')
        setClients([])
        setActiveClient(null)
        return
      }

      let query = supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })
      
      // Si hay usuario autenticado, filtrar por user_id
      // Para el usuario tiendastsgt@gmail.com, mostrar todos los clientes
      if (user.email === 'tiendastsgt@gmail.com') {
        // No aplicar filtro, mostrar todos los clientes
        logDebug('🔍 Usuario tiendastsgt@gmail.com - cargando todos los clientes')
      } else {
        query = query.eq('user_id', user.id)
        logDebug('🔍 Usuario normal - filtrando por user_id:', user.id)
      }
      
      const { data, error } = await query
      
      if (error) {
        console.warn('Error al cargar clientes de Supabase:', error.message)
        setClients([])
        setActiveClient(null)
        return
      }
      
      setClients(data || [])
      
      // Si no hay cliente activo, seleccionar el primero
      if (!activeClient && data && data.length > 0) {
        setActiveClient(data[0])
      }
    } catch (error) {
      console.error('Error de conexión a Supabase:', error)
      // En caso de error, simplemente limpiar los datos sin lanzar excepción
      setClients([])
      setActiveClient(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshClients()
  }, [user])

  return (
    <ClientContext.Provider value={{
      activeClient,
      setActiveClient,
      clients,
      isLoading,
      refreshClients
    }}>
      {children}
    </ClientContext.Provider>
  )
}

export function useActiveClient() {
  const context = useContext(ClientContext)
  if (context === undefined) {
    throw new Error('useActiveClient must be used within a ClientProvider')
  }
  return context
}

export type { Client }