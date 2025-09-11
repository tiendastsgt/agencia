import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './lib/authSimple'
import { ClientProvider } from './lib/client-context'
import { Toaster } from '@/components/ui/sonner'

import LoginPage from './pages/LoginPage'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ClientsPage from './pages/ClientsPage'
import CampaignsPage from './pages/CampaignsPage'
import ABTestingPage from './pages/ABTestingPage'
import AIContentGenerator from './pages/AIContentGenerator'
import AIMarketAnalysis from './pages/AIMarketAnalysis'
import ContentPage from './pages/ContentPage'
import AnalyticsPage from './pages/AnalyticsPage'
import StrategiesPage from './pages/StrategiesPage'
import ResearchPage from './pages/ResearchPage'
import ApiConnectionsPage from './pages/ApiConnectionsPage'
import CredentialsPage from './pages/CredentialsPage'
import AuthCallback from './components/AuthCallback'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
})

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div>Cargando...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/clients" 
        element={
          <ProtectedRoute>
            <Layout>
              <ClientsPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/campaigns" 
        element={
          <ProtectedRoute>
            <Layout>
              <CampaignsPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/ab-testing" 
        element={
          <ProtectedRoute>
            <Layout>
              <ABTestingPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/ai-content" 
        element={
          <ProtectedRoute>
            <Layout>
              <AIContentGenerator />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/ai-analysis" 
        element={
          <ProtectedRoute>
            <Layout>
              <AIMarketAnalysis />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/content" 
        element={
          <ProtectedRoute>
            <Layout>
              <ContentPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/analytics" 
        element={
          <ProtectedRoute>
            <Layout>
              <AnalyticsPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/strategies" 
        element={
          <ProtectedRoute>
            <Layout>
              <StrategiesPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/research" 
        element={
          <ProtectedRoute>
            <Layout>
              <ResearchPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/api-connections" 
        element={
          <ProtectedRoute>
            <Layout>
              <ApiConnectionsPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/credentials" 
        element={
          <ProtectedRoute>
            <Layout>
              <CredentialsPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ClientProvider>
          <Router>
            <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
              <AppRoutes />
              <Toaster position="top-right" richColors />
            </div>
          </Router>
        </ClientProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
