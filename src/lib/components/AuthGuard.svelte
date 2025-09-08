<script>
  import { onMount } from 'svelte';
  import { supabase } from '../lib/supabase.js';
  import { isAuthenticated, isAuthorized, user } from '../lib/stores.js';
  
  let email = '';
  let password = '';
  let loading = false;
  let error = '';
  let showUnauthorized = false;
  
  $: if ($isAuthenticated && !$isAuthorized && $user) {
    showUnauthorized = true;
  }
  
  async function handleLogin() {
    if (!email || !password) {
      error = 'Por favor ingresa email y contraseña';
      return;
    }
    
    loading = true;
    error = '';
    
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (authError) {
        throw authError;
      }
      
      // La verificación de autorización se maneja automáticamente en stores.js
      
    } catch (err) {
      console.error('Error en login:', err);
      error = err.message || 'Error al iniciar sesión';
    } finally {
      loading = false;
    }
  }
  
  async function handleLogout() {
    const { error: logoutError } = await supabase.auth.signOut();
    if (logoutError) {
      console.error('Error al cerrar sesión:', logoutError);
    } else {
      showUnauthorized = false;
    }
  }
</script>

{#if !$isAuthenticated}
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <div class="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
          <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 class="mt-6 text-3xl font-bold text-gray-900">MarketPro GT</h2>
        <p class="mt-2 text-sm text-gray-600">Sistema Privado de Marketing Digital</p>
      </div>
      
      <div class="bg-white py-8 px-6 shadow-lg rounded-lg">
        <form on:submit|preventDefault={handleLogin} class="space-y-6">
          {#if error}
            <div class="bg-red-50 border border-red-200 rounded-md p-4">
              <div class="flex">
                <svg class="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div class="ml-3">
                  <p class="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          {/if}
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              bind:value={email}
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="tu@email.com"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              bind:value={password}
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tu contraseña"
            />
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {#if loading}
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Iniciando sesión...
              {:else}
                Iniciar Sesión
              {/if}
            </button>
          </div>
        </form>
      </div>
      
      <div class="text-center">
        <p class="text-xs text-gray-500">
          © 2025 MarketPro GT - Sistema Privado de Marketing
        </p>
      </div>
    </div>
  </div>
{:else if showUnauthorized}
  <div class="min-h-screen bg-red-50 flex items-center justify-center px-4">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <div class="mx-auto h-16 w-16 bg-red-500 rounded-full flex items-center justify-center">
          <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636" />
          </svg>
        </div>
        <h2 class="mt-6 text-3xl font-bold text-red-900">Acceso Denegado</h2>
        <p class="mt-2 text-sm text-red-600">Tu cuenta no está autorizada para acceder a MarketPro GT</p>
      </div>
      
      <div class="bg-white py-8 px-6 shadow-lg rounded-lg">
        <div class="text-center space-y-4">
          <p class="text-gray-700">
            El email <strong>{$user?.email}</strong> no tiene permisos para acceder al sistema.
          </p>
          
          <p class="text-sm text-gray-500">
            Si crees que esto es un error, contacta al administrador del sistema.
          </p>
          
          <button
            on:click={handleLogout}
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Asegurar que el componente ocupe toda la pantalla cuando es necesario */
  :global(body) {
    margin: 0;
    padding: 0;
  }
</style>