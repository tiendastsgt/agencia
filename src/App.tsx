import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/lib/auth'
import { Toaster } from '@/components/ui/sonner'

// Import pages
import LoginPage from '@/pages/LoginPage'
import AuthCallback from '@/pages/AuthCallback'
import Dashboard from '@/pages/Dashboard'
import ClientsPage from '@/pages/ClientsPage'
import CampaignsPage from '@/pages/CampaignsPage'
import ContentPage from '@/pages/ContentPage'
import AnalyticsPage from '@/pages/AnalyticsPage'
import StrategiesPage from '@/pages/StrategiesPage'
import ResearchPage from '@/pages/ResearchPage'
import AIContentGenerator from '@/pages/AIContentGenerator'
import AIMarketAnalysis from '@/pages/AIMarketAnalysis'
import ApiConnectionsPage from '@/app/main/api-connections/ApiConnectionsPage'
import Layout from '@/components/Layout'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isAuthorized, signOut } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-red-900">Acceso Denegado</h2>
            <p className="mt-2 text-sm text-red-600">Tu cuenta no está autorizada para acceder a MarketPro GT</p>
          </div>
          
          <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
            <div className="text-center space-y-4">
              <p className="text-gray-700">
                El email <strong>{user.email}</strong> no tiene permisos para acceder al sistema.
              </p>
              
              <p className="text-sm text-gray-500">
                Si crees que esto es un error, contacta al administrador del sistema.
              </p>
              
              <button
                onClick={signOut}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

function AppRoutes() {
  const { user } = useAuth()

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/campaigns" element={<CampaignsPage />} />
        <Route path="/ai-content" element={<AIContentGenerator />} />
        <Route path="/ai-analysis" element={<AIMarketAnalysis />} />
        <Route path="/content" element={<ContentPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/strategies" element={<StrategiesPage />} />
        <Route path="/research" element={<ResearchPage />} />
        <Route path="/api-connections" element={<ApiConnectionsPage />} />
        <Route path="/login" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <AppRoutes />
            <Toaster position="top-right" richColors />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App