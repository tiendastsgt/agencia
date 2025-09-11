// Context para manejo de cliente activo - PRODUCCIÓN
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
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
      let query = supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })
      
      // Si hay usuario autenticado, filtrar por user_id
      if (user) {
        // Para el usuario tiendastsgt@gmail.com, mostrar todos los clientes
        if (user.email === 'tiendastsgt@gmail.com') {
          // No aplicar filtro, mostrar todos los clientes
        } else {
          query = query.eq('user_id', user.id)
        }
      }
      // Si no hay usuario, cargar todos los clientes (modo demo/desarrollo)
      
      const { data, error } = await query
      
      if (error) throw error
      
      setClients(data || [])
      
      // Si no hay cliente activo, seleccionar el primero
      if (!activeClient && data && data.length > 0) {
        setActiveClient(data[0])
      }
    } catch (error) {
      console.error('Error loading clients:', error)
      setClients([])
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