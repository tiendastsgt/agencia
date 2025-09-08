import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { Client } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  isAuthorized: boolean
  activeClient: Client | null
  availableClients: Client[]
  configuredAPIs: { [platform: string]: boolean }
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string) => Promise<any>
  signOut: () => Promise<any>
  setActiveClient: (clientId: string) => Promise<void>
  loadConfiguredAPIs: (clientId: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [activeClient, setActiveClientState] = useState<Client | null>(null)
  const [availableClients, setAvailableClients] = useState<Client[]>([])
  const [configuredAPIs, setConfiguredAPIs] = useState<{ [platform: string]: boolean }>({})

  // Función para verificar autorización
  const checkAuthorization = async (userEmail: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('auth-manager', {
        body: {
          action: 'check_authorization',
          user_email: userEmail
        }
      })

      if (error) throw error

      const { is_authorized } = data.data
      setIsAuthorized(is_authorized)
      return is_authorized
    } catch (error) {
      console.error('Error verificando autorización:', error)
      setIsAuthorized(false)
      return false
    }
  }

  // Función para cargar clientes disponibles
  const loadAvailableClients = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('auth-manager', {
        body: {
          action: 'get_clients'
        }
      })

      if (error) throw error

      setAvailableClients(data.data)
      return data.data
    } catch (error) {
      console.error('Error cargando clientes:', error)
      setAvailableClients([])
      return []
    }
  }

  // Función para cargar cliente activo
  const loadActiveClient = async (userEmail: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('auth-manager', {
        body: {
          action: 'get_active_client',
          user_email: userEmail
        }
      })

      if (error) throw error

      const { client_info } = data.data
      setActiveClientState(client_info)
      
      // También cargar APIs configuradas para este cliente
      if (client_info) {
        await loadConfiguredAPIsInternal(client_info.id)
      }
      
      return client_info
    } catch (error) {
      console.error('Error cargando cliente activo:', error)
      setActiveClientState(null)
      return null
    }
  }

  // Función para cambiar cliente activo
  const setActiveClient = async (clientId: string) => {
    if (!user?.email) return
    
    try {
      const { data, error } = await supabase.functions.invoke('auth-manager', {
        body: {
          action: 'set_active_client',
          user_email: user.email,
          client_id: clientId
        }
      })

      if (error) throw error

      const { client_info } = data.data
      setActiveClientState(client_info)
      
      // Cargar APIs del nuevo cliente
      await loadConfiguredAPIsInternal(clientId)
      
    } catch (error) {
      console.error('Error cambiando cliente activo:', error)
      throw error
    }
  }

  // Función interna para cargar APIs configuradas
  const loadConfiguredAPIsInternal = async (clientId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-api-credentials', {
        body: {
          action: 'get',
          client_id: clientId
        }
      })

      if (error) throw error

      const configured: { [platform: string]: boolean } = {}
      data.data.forEach((credential: any) => {
        configured[credential.platform] = credential.is_active
      })
      
      setConfiguredAPIs(configured)
      return configured
    } catch (error) {
      console.error('Error cargando APIs configuradas:', error)
      setConfiguredAPIs({})
      return {}
    }
  }

  // Función pública para cargar APIs configuradas
  const loadConfiguredAPIs = async (clientId: string) => {
    await loadConfiguredAPIsInternal(clientId)
  }

  useEffect(() => {
    // Get initial session
    async function getInitialSession() {
      setLoading(true)
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
        setUser(session?.user || null)
        
        // Si hay un usuario, verificar autorización y cargar datos
        if (session?.user?.email) {
          const authorized = await checkAuthorization(session.user.email)
          if (authorized) {
            await Promise.all([
              loadActiveClient(session.user.email),
              loadAvailableClients()
            ])
          }
        }
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user || null)
        
        if (session?.user?.email && event === 'SIGNED_IN') {
          // Verificar autorización al iniciar sesión
          const authorized = await checkAuthorization(session.user.email)
          if (authorized) {
            await Promise.all([
              loadActiveClient(session.user.email),
              loadAvailableClients()
            ])
          }
        } else if (event === 'SIGNED_OUT') {
          // Limpiar estado al cerrar sesión
          setIsAuthorized(false)
          setActiveClientState(null)
          setAvailableClients([])
          setConfiguredAPIs({})
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password })
  }

  const signUp = async (email: string, password: string) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.protocol}//${window.location.host}/auth/callback`
      }
    })
  }

  const signOut = async () => {
    return await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      isAuthorized,
      activeClient,
      availableClients,
      configuredAPIs,
      signIn, 
      signUp, 
      signOut,
      setActiveClient,
      loadConfiguredAPIs
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}