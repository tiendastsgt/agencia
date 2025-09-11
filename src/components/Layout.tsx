import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  BarChart3, 
  Users, 
  Megaphone, 
  FileText, 
  TrendingUp, 
  Brain, 
  Search,
  Settings,
  ChevronDown,
  Menu,
  X,
  Zap,
  Key
} from 'lucide-react'
import { useActiveClient } from '@/lib/client-context'
import { useAuth } from '@/lib/authSimple'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'

interface LayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Clientes', href: '/clients', icon: Users },
  { name: 'Campañas', href: '/campaigns', icon: Megaphone },
  { name: 'A/B Testing', href: '/ab-testing', icon: BarChart3 },
  { name: 'RL Experiments', href: '/rl-experiments', icon: Zap },
  { name: 'Contenido IA', href: '/ai-content', icon: Brain },
  { name: 'Análisis IA', href: '/ai-analysis', icon: TrendingUp },
  { name: 'Contenido', href: '/content', icon: FileText },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp },
  { name: 'Estrategias', href: '/strategies', icon: Search },
  { name: 'Investigación', href: '/research', icon: Search },
  { name: 'Credenciales', href: '/credentials', icon: Key },
  { name: 'Conexiones API', href: '/api-connections', icon: Settings },
]

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const { user, signOut } = useAuth()
  const { activeClient, setActiveClient, clients } = useActiveClient()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b">
            <h1 className="text-xl font-bold text-blue-600">MarketPro GT</h1>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex h-16 shrink-0 items-center px-4 border-b">
            <h1 className="text-xl font-bold text-blue-600">MarketPro GT</h1>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto">
            <nav className="flex-1 space-y-1 px-2 py-4">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-blue-100 text-blue-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm lg:px-6">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-4 justify-between lg:gap-x-6">
            {/* Client selector */}
            <div className="flex items-center gap-4">
              <div className="w-64">
                <Select
                  value={activeClient?.id || ''}
                  onValueChange={(value) => {
                    const client = clients.find(c => c.id === value)
                    setActiveClient(client || null)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* User menu */}
            <div className="flex items-center gap-x-4">
              <div className="text-sm text-gray-700">
                Hola, {user ? user.email : 'Usuario Demo'}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/login'}
              >
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}