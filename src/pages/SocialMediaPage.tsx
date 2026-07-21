import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import FacebookPagesManager from '@/components/FacebookPagesManager'
import InstagramManager from '@/components/InstagramManager'
import LinkedInManager from '@/components/LinkedInManager'
import TwitterManager from '@/components/TwitterManager'
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SocialMediaPage() {
  const [activeTab, setActiveTab] = useState('facebook')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Redes Sociales</h1>
          <p className="text-gray-600">Gestiona tus cuentas de redes sociales y visualiza métricas</p>
        </div>
        <Button onClick={() => window.open('/credentials', '_blank')}>
          <Settings className="mr-2 h-4 w-4" />
          Configurar APIs
        </Button>
      </div>

      {/* Tabs de redes sociales */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="facebook" className="flex items-center gap-2">
            <Facebook className="h-4 w-4" />
            Facebook
          </TabsTrigger>
          <TabsTrigger value="instagram" className="flex items-center gap-2">
            <Instagram className="h-4 w-4" />
            Instagram
          </TabsTrigger>
          <TabsTrigger value="linkedin" className="flex items-center gap-2">
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </TabsTrigger>
          <TabsTrigger value="twitter" className="flex items-center gap-2">
            <Twitter className="h-4 w-4" />
            Twitter
          </TabsTrigger>
          <TabsTrigger value="youtube" className="flex items-center gap-2">
            <Youtube className="h-4 w-4" />
            YouTube
          </TabsTrigger>
        </TabsList>

        <TabsContent value="facebook" className="space-y-6">
          <FacebookPagesManager />
        </TabsContent>

        <TabsContent value="instagram" className="space-y-6">
          <InstagramManager />
        </TabsContent>

        <TabsContent value="linkedin" className="space-y-6">
          <LinkedInManager />
        </TabsContent>

        <TabsContent value="twitter" className="space-y-6">
          <TwitterManager />
        </TabsContent>

        <TabsContent value="youtube" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Youtube className="h-5 w-5 text-red-600" />
                YouTube
              </CardTitle>
              <CardDescription>
                Gestiona tu canal de YouTube y visualiza métricas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Youtube className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">
                  YouTube API está en desarrollo. Próximamente disponible.
                </p>
                <Button variant="outline" disabled>
                  Próximamente
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
