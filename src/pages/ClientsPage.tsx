import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase, Client } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Search,
  Plus,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  TrendingUp,
  Target,
  Calendar,
  MoreVertical,
  Eye
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('all')

  // Fetch clients
  const { data: clients, isLoading, error } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as Client[]
    }
  })

  // Get unique business types for filter
  const industries = clients ? [...new Set(clients.map(client => client.business_type))] : []

  // Filter clients based on search and industry
  const filteredClients = clients?.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesIndustry = selectedIndustry === 'all' || client.business_type === selectedIndustry
    return matchesSearch && matchesIndustry
  }) || []

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-300 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error al cargar clientes: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona tu cartera de clientes y sus campañas
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedIndustry}
          onChange={(e) => setSelectedIndustry(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todas las industrias</option>
          {industries.map(industry => (
            <option key={industry} value={industry}>{industry}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Clientes</p>
                <p className="text-2xl font-bold text-gray-900">{clients?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Clientes Activos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clients?.filter(c => c.is_active).length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Industrias</p>
                <p className="text-2xl font-bold text-gray-900">{industries.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients Grid */}
      {filteredClients.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {searchTerm || selectedIndustry !== 'all' ? 'No se encontraron clientes' : 'No hay clientes aún'}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {searchTerm || selectedIndustry !== 'all' 
                  ? 'Intenta cambiar los filtros de búsqueda'
                  : 'Comienza agregando tu primer cliente'
                }
              </p>
              {!searchTerm && selectedIndustry === 'all' && (
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Cliente
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      )}
    </div>
  )
}

function ClientCard({ client }: { client: Client }) {
  const targetAudience = client.target_audience || 'No definido'
  const socialProfiles = client.social_profiles || {}

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">
              {client.name}
            </CardTitle>
            <CardDescription className="mt-1">
              <Badge variant="secondary" className="text-xs">
                {client.business_type}
              </Badge>
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              client.is_active ? 'bg-green-400' : 'bg-gray-400'
            }`}></div>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2">
          {client.description}
        </p>

        {/* Key Info */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <Target className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{targetAudience}</span>
          </div>
          
          {client.website_url && (
            <div className="flex items-center text-sm text-gray-500">
              <Globe className="h-4 w-4 mr-2 flex-shrink-0" />
              <a 
                href={client.website_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="truncate hover:text-blue-600"
              >
                {client.website_url.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          
          {socialProfiles.facebook && (
            <div className="flex items-center text-sm text-gray-500">
              <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">Facebook: {socialProfiles.facebook}</span>
            </div>
          )}
          
          {socialProfiles.instagram && (
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>Instagram: {socialProfiles.instagram}</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <div className="text-center">
              <p className="font-medium text-gray-900">{client.primary_goal}</p>
              <p className="text-gray-500">Objetivo</p>
            </div>
            <div className="text-center">
              <p className="font-medium text-gray-900">
                {new Date(client.created_at).toLocaleDateString()}
              </p>
              <p className="text-gray-500">Cliente desde</p>
            </div>
            <div className="text-center">
              <p className="font-medium text-gray-900">
                {client.is_active ? 'Activo' : 'Inactivo'}
              </p>
              <p className="text-gray-500">Estado</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            Ver Detalles
          </Button>
          <Button asChild size="sm" className="flex-1">
            <Link to={`/campaigns?client=${client.id}`}>
              Ver Campañas
            </Link>
          </Button>
        </div>

        {/* Primary Goal */}
        {client.primary_goal && (
          <div className="bg-blue-50 rounded-lg p-3 mt-4">
            <p className="text-xs font-medium text-blue-900 mb-1">Objetivo Principal</p>
            <p className="text-sm text-blue-800 line-clamp-2">
              {client.primary_goal}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}