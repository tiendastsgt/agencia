import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import InfographicManager from '@/components/InfographicManager'
import CourseInfographicGenerator from '@/components/CourseInfographicGenerator'
import { InfographicData } from '@/lib/types/infographic'

export default function InfographicPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [generatedInfographic, setGeneratedInfographic] = useState<InfographicData | null>(null)

  const handleInfographicGenerated = (infographicData: InfographicData) => {
    setGeneratedInfographic(infographicData)
    setActiveTab('general') // Cambiar a la pestaña general para mostrar el resultado
  }

  return (
    <div className="container mx-auto py-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">Infografías Generales</TabsTrigger>
          <TabsTrigger value="courses">Infografías de Cursos</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <InfographicManager />
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          <CourseInfographicGenerator onInfographicGenerated={handleInfographicGenerated} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
