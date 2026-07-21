/**
 * Script de prueba para verificar conexión a Supabase
 */

import { supabase } from './supabase'
import { logDebug, logInfo, logWarn, logError } from '../utils/logger'

export async function testSupabaseConnection() {
  logInfo('🔍 Probando conexión a Supabase...')
  
  // Verificar variables de entorno
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  
  logDebug('📋 Variables de entorno:')
  logDebug('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Configurada' : '❌ No configurada')
  logDebug('VITE_SUPABASE_ANON_KEY:', supabaseKey ? '✅ Configurada' : '❌ No configurada')
  
  if (!supabaseUrl || !supabaseKey) {
    logError('❌ Variables de entorno no configuradas correctamente')
    return false
  }
  
  try {
    // Probar conexión básica
    const { data, error } = await supabase.from('clients').select('count').limit(1)
    
    if (error) {
      logError('❌ Error de conexión a Supabase:', error.message)
      return false
    }
    
    logInfo('✅ Conexión a Supabase exitosa')
    
    // Verificar autenticación actual
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      logError('❌ Error obteniendo sesión:', sessionError.message)
      return false
    }
    
    if (session) {
      logInfo('✅ Usuario autenticado:', session.user.email)
      return true
    } else {
      logWarn('⚠️  No hay usuario autenticado - redirigiendo a login')
      return false
    }
    
  } catch (error) {
    logError('❌ Error inesperado:', error)
    return false
  }
}

export async function forceLogout() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('❌ Error al hacer logout:', error.message)
  } else {
  }
}

export async function checkAuthStatus() {
  const { data: { session } } = await supabase.auth.getSession()
  return {
    isAuthenticated: !!session,
    user: session?.user || null,
    session: session
  }
}
