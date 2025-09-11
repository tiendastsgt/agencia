import React, { useState } from 'react'
import { useActiveClient } from '@/lib/client-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Users, Plus, RefreshCw, Eye, Edit, Trash2 } from 'lucide-react'
import { toast } from '@/components/ui/sonner'
import { supabase } from '@/lib/supabase'

export default function ClientsPage() {
  const { clients, isLoading, forceRefresh } = useActiveClient()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRefresh = async () => {
    try {
      await forceRefresh()
      toast.success('Clientes actualizados')
    } catch (error) {
      console.error('Error refreshing clients:', error)
      toast.error('Error al actualizar clientes')
    }
  }

  const handleCreateClient = async (clientData: any) => {
    try {
      setIsSubmitting(true)
      const { error } = await supabase
        .from('clients')
        .insert([clientData])

      if (error) throw error
      
      toast.success('Cliente creado exitosamente')
      setIsCreateDialogOpen(false)
      await forceRefresh()
    } catch (error) {
      console.error('Error creating client:', error)
      toast.error('Error al crear cliente')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditClient = async (clientData: any) => {
    try {
      setIsSubmitting(true)
      const { error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', selectedClient.id)

      if (error) throw error
      
      toast.success('Cliente actualizado exitosamente')
      setIsEditDialogOpen(false)
      setSelectedClient(null)
      await forceRefresh()
    } catch (error) {
      console.error('Error updating client:', error)
      toast.error('Error al actualizar cliente')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este cliente?')) return

    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId)

      if (error) throw error
      
      toast.success('Cliente eliminado exitosamente')
      await forceRefresh()
    } catch (error) {
      console.error('Error deleting client:', error)
      toast.error('Error al eliminar cliente')
    }
  }

  const handleViewClient = (client: any) => {
    setSelectedClient(client)
    // Aquí podrías abrir un modal de detalles o navegar a una página de detalles
    toast.info(`Viendo detalles de ${client.name}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600 mt-2">
            Gestiona tus clientes y sus configuraciones
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nuevo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Cliente</DialogTitle>
                <DialogDescription>
                  Agrega un nuevo cliente al sistema
                </DialogDescription>
              </DialogHeader>
              <CreateClientForm onSubmit={handleCreateClient} isSubmitting={isSubmitting} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <Card key={client.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{client.name}</CardTitle>
                <CardDescription>{client.business_type}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Industria:</strong> {client.industry}</p>
                  <p><strong>País:</strong> {client.country}</p>
                  <p><strong>Sitio web:</strong> {client.website_url}</p>
                </div>
                
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewClient(client)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedClient(client)
                      setIsEditDialogOpen(true)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteClient(client.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {clients.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay clientes
              </h3>
              <p className="text-gray-600 mb-4">
                Crea tu primer cliente para comenzar
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primer Cliente
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Dialog de Edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>
              Modifica la información del cliente
            </DialogDescription>
          </DialogHeader>
          {selectedClient && (
            <EditClientForm 
              client={selectedClient}
              onSubmit={handleEditClient} 
              isSubmitting={isSubmitting} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Componente del formulario de creación
function CreateClientForm({ onSubmit, isSubmitting }: { onSubmit: (data: any) => void, isSubmitting: boolean }) {
  const [formData, setFormData] = useState({
    name: '',
    business_type: '',
    description: '',
    website_url: '',
    industry: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    country: '',
    target_audience: '',
    primary_goal: '',
    is_active: true
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre del Cliente</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="business_type">Tipo de Negocio</Label>
        <Input
          id="business_type"
          value={formData.business_type}
          onChange={(e) => setFormData({...formData, business_type: e.target.value})}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="industry">Industria</Label>
        <Input
          id="industry"
          value={formData.industry}
          onChange={(e) => setFormData({...formData, industry: e.target.value})}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="website_url">Sitio Web</Label>
        <Input
          id="website_url"
          type="url"
          value={formData.website_url}
          onChange={(e) => setFormData({...formData, website_url: e.target.value})}
        />
      </div>
      
      <div>
        <Label htmlFor="contact_email">Email de Contacto</Label>
        <Input
          id="contact_email"
          type="email"
          value={formData.contact_email}
          onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
        />
      </div>
      
      <div>
        <Label htmlFor="country">País</Label>
        <Input
          id="country"
          value={formData.country}
          onChange={(e) => setFormData({...formData, country: e.target.value})}
        />
      </div>
      
      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
      </div>
      
      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Creando...' : 'Crear Cliente'}
        </Button>
      </div>
    </form>
  )
}

// Componente del formulario de edición
function EditClientForm({ client, onSubmit, isSubmitting }: { client: any, onSubmit: (data: any) => void, isSubmitting: boolean }) {
  const [formData, setFormData] = useState({
    name: client.name || '',
    business_type: client.business_type || '',
    description: client.description || '',
    website_url: client.website_url || '',
    industry: client.industry || '',
    contact_email: client.contact_email || '',
    contact_phone: client.contact_phone || '',
    address: client.address || '',
    country: client.country || '',
    target_audience: client.target_audience || '',
    primary_goal: client.primary_goal || '',
    is_active: client.is_active ?? true
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="edit-name">Nombre del Cliente</Label>
        <Input
          id="edit-name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="edit-business_type">Tipo de Negocio</Label>
        <Input
          id="edit-business_type"
          value={formData.business_type}
          onChange={(e) => setFormData({...formData, business_type: e.target.value})}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="edit-industry">Industria</Label>
        <Input
          id="edit-industry"
          value={formData.industry}
          onChange={(e) => setFormData({...formData, industry: e.target.value})}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="edit-website_url">Sitio Web</Label>
        <Input
          id="edit-website_url"
          type="url"
          value={formData.website_url}
          onChange={(e) => setFormData({...formData, website_url: e.target.value})}
        />
      </div>
      
      <div>
        <Label htmlFor="edit-contact_email">Email de Contacto</Label>
        <Input
          id="edit-contact_email"
          type="email"
          value={formData.contact_email}
          onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
        />
      </div>
      
      <div>
        <Label htmlFor="edit-country">País</Label>
        <Input
          id="edit-country"
          value={formData.country}
          onChange={(e) => setFormData({...formData, country: e.target.value})}
        />
      </div>
      
      <div>
        <Label htmlFor="edit-description">Descripción</Label>
        <Textarea
          id="edit-description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
      </div>
      
      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Actualizando...' : 'Actualizar Cliente'}
        </Button>
      </div>
    </form>
  )
}