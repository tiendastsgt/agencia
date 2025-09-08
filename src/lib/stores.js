import { writable, derived } from 'svelte/store';
import { supabase } from './supabase.js';
import type { Client } from './supabase.js';

// Estado de autenticación
export const user = writable(null);
export const isAuthenticated = writable(false);
export const isAuthorized = writable(false);
export const userRole = writable('viewer');

// Estado del cliente activo
export const activeClient = writable<Client | null>(null);
export const availableClients = writable<Client[]>([]);
export const isLoadingClient = writable(false);

// Estado de las APIs configuradas
export const configuredAPIs = writable<{ [platform: string]: boolean }>({});

// Estado de métricas
export const metricsData = writable({});
export const isLoadingMetrics = writable(false);

// Función para verificar autorización
export async function checkAuthorization(userEmail: string) {
  try {
    const { data, error } = await supabase.functions.invoke('auth-manager', {
      body: {
        action: 'check_authorization',
        user_email: userEmail
      }
    });

    if (error) throw error;

    const { is_authorized, user_info } = data.data;
    isAuthorized.set(is_authorized);
    
    if (is_authorized && user_info) {
      userRole.set(user_info.role);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error verificando autorización:', error);
    isAuthorized.set(false);
    return false;
  }
}

// Función para obtener clientes disponibles
export async function loadAvailableClients() {
  try {
    const { data, error } = await supabase.functions.invoke('auth-manager', {
      body: {
        action: 'get_clients'
      }
    });

    if (error) throw error;

    availableClients.set(data.data);
    return data.data;
  } catch (error) {
    console.error('Error cargando clientes:', error);
    availableClients.set([]);
    return [];
  }
}

// Función para obtener cliente activo
export async function loadActiveClient(userEmail: string) {
  try {
    isLoadingClient.set(true);
    
    const { data, error } = await supabase.functions.invoke('auth-manager', {
      body: {
        action: 'get_active_client',
        user_email: userEmail
      }
    });

    if (error) throw error;

    const { client_info } = data.data;
    activeClient.set(client_info);
    
    // También cargar el estado de APIs configuradas para este cliente
    if (client_info) {
      await loadConfiguredAPIs(client_info.id);
    }
    
    return client_info;
  } catch (error) {
    console.error('Error cargando cliente activo:', error);
    activeClient.set(null);
    return null;
  } finally {
    isLoadingClient.set(false);
  }
}

// Función para cambiar cliente activo
export async function setActiveClient(userEmail: string, clientId: string) {
  try {
    isLoadingClient.set(true);
    
    const { data, error } = await supabase.functions.invoke('auth-manager', {
      body: {
        action: 'set_active_client',
        user_email: userEmail,
        client_id: clientId
      }
    });

    if (error) throw error;

    const { client_info } = data.data;
    activeClient.set(client_info);
    
    // Limpiar métricas anteriores y cargar APIs del nuevo cliente
    metricsData.set({});
    await loadConfiguredAPIs(clientId);
    
    return client_info;
  } catch (error) {
    console.error('Error cambiando cliente activo:', error);
    throw error;
  } finally {
    isLoadingClient.set(false);
  }
}

// Función para cargar APIs configuradas
export async function loadConfiguredAPIs(clientId: string) {
  try {
    const { data, error } = await supabase.functions.invoke('manage-api-credentials', {
      body: {
        action: 'get',
        client_id: clientId
      }
    });

    if (error) throw error;

    const configured = {};
    data.data.forEach((credential: any) => {
      configured[credential.platform] = credential.is_active;
    });
    
    configuredAPIs.set(configured);
    return configured;
  } catch (error) {
    console.error('Error cargando APIs configuradas:', error);
    configuredAPIs.set({});
    return {};
  }
}

// Función para cargar métricas consolidadas
export async function loadConsolidatedMetrics(clientId: string, dateRange: string = 'last_7d') {
  try {
    isLoadingMetrics.set(true);
    
    const { data, error } = await supabase.functions.invoke('get-consolidated-metrics', {
      body: {
        client_id: clientId,
        date_range: dateRange
      }
    });

    if (error) throw error;

    metricsData.set(data.data);
    return data.data;
  } catch (error) {
    console.error('Error cargando métricas consolidadas:', error);
    metricsData.set({});
    return null;
  } finally {
    isLoadingMetrics.set(false);
  }
}

// Store derivado para verificar si todas las APIs están configuradas
export const allAPIsConfigured = derived(
  configuredAPIs,
  ($configuredAPIs) => {
    const requiredAPIs = ['meta', 'twitter', 'linkedin', 'tiktok', 'google_analytics'];
    return requiredAPIs.every(api => $configuredAPIs[api] === true);
  }
);

// Store derivado para el estado general de carga
export const isLoading = derived(
  [isLoadingClient, isLoadingMetrics],
  ([$isLoadingClient, $isLoadingMetrics]) => $isLoadingClient || $isLoadingMetrics
);

// Inicializar autenticación
supabase.auth.onAuthStateChange((event, session) => {
  if (session?.user) {
    user.set(session.user);
    isAuthenticated.set(true);
    
    // Verificar autorización automáticamente
    checkAuthorization(session.user.email!).then(authorized => {
      if (authorized) {
        // Cargar cliente activo y clientes disponibles
        Promise.all([
          loadActiveClient(session.user.email!),
          loadAvailableClients()
        ]).catch(console.error);
      }
    });
  } else {
    user.set(null);
    isAuthenticated.set(false);
    isAuthorized.set(false);
    activeClient.set(null);
    availableClients.set([]);
    configuredAPIs.set({});
    metricsData.set({});
  }
});