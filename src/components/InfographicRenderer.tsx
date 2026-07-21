import React from 'react'
import { InfographicData } from '@/lib/types/infographic'

interface InfographicRendererProps {
  data: InfographicData
  className?: string
}

export default function InfographicRenderer({ data, className = '' }: InfographicRendererProps) {
  const renderSection = (section: any, index: number) => {
    switch (section.type) {
      case 'header':
        return (
          <div key={section.id} className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2" style={{ color: data.theme?.primaryColor }}>
              {section.title}
            </h1>
            {section.content?.text?.content && (
              <p className="text-lg text-muted-foreground">
                {section.content.text.content}
              </p>
            )}
          </div>
        )

      case 'stats':
        return (
          <div key={section.id} className="mb-6">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: data.theme?.primaryColor }}>
              {section.title}
            </h2>
            <div className={`grid gap-4 ${section.content?.stats?.layout === 'horizontal' ? 'grid-cols-4' : 'grid-cols-2'}`}>
              {section.content?.stats?.items?.map((stat: any, statIndex: number) => (
                <div key={statIndex} className="text-center p-4 rounded-lg border" style={{ backgroundColor: data.theme?.backgroundColor }}>
                  <div className="text-3xl font-bold" style={{ color: data.theme?.primaryColor }}>
                    {stat.value}{stat.unit}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'text':
        return (
          <div key={section.id} className="mb-6">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: data.theme?.primaryColor }}>
              {section.title}
            </h2>
            <div className="prose max-w-none">
              <p className="text-base leading-relaxed">
                {section.content?.text?.content}
              </p>
            </div>
          </div>
        )

      case 'list':
        return (
          <div key={section.id} className="mb-6">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: data.theme?.primaryColor }}>
              {section.title}
            </h2>
            <ul className="space-y-2">
              {section.content?.list?.items?.map((item: any, itemIndex: number) => (
                <li key={itemIndex} className="flex items-center gap-2">
                  {section.content?.list?.type === 'checkmark' ? (
                    <span className="text-green-500">✓</span>
                  ) : (
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: data.theme?.primaryColor }}></span>
                  )}
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )

      case 'chart':
        return (
          <div key={section.id} className="mb-6">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: data.theme?.primaryColor }}>
              {section.title}
            </h2>
            <div className="bg-white p-4 rounded-lg border">
              <div className="space-y-3">
                {section.content?.chart?.data?.map((item: any, itemIndex: number) => (
                  <div key={itemIndex} className="flex items-center gap-4">
                    <div className="w-20 text-sm font-medium">{item.label}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                      <div 
                        className="h-6 rounded-full flex items-center justify-end pr-2"
                        style={{ 
                          width: `${(item.value / Math.max(...section.content.chart.data.map((d: any) => d.value))) * 100}%`,
                          backgroundColor: data.theme?.primaryColor 
                        }}
                      >
                        {section.content?.chart?.showValues && (
                          <span className="text-white text-xs font-medium">{item.value}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'comparison':
        return (
          <div key={section.id} className="mb-6">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: data.theme?.primaryColor }}>
              {section.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.content?.comparison?.items?.map((item: any, itemIndex: number) => (
                <div key={itemIndex} className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                  
                  {item.pros && item.pros.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-green-600 mb-1">Ventajas:</h4>
                      <ul className="text-sm space-y-1">
                        {item.pros.map((pro: string, proIndex: number) => (
                          <li key={proIndex} className="flex items-center gap-1">
                            <span className="text-green-500">+</span>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {item.cons && item.cons.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-red-600 mb-1">Desventajas:</h4>
                      <ul className="text-sm space-y-1">
                        {item.cons.map((con: string, conIndex: number) => (
                          <li key={conIndex} className="flex items-center gap-1">
                            <span className="text-red-500">-</span>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {item.score && (
                    <div className="text-center">
                      <div className="text-2xl font-bold" style={{ color: data.theme?.primaryColor }}>
                        {item.score}/100
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return (
          <div key={section.id} className="mb-6 p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
            <p className="text-sm text-muted-foreground">
              Tipo de sección no soportado: {section.type}
            </p>
          </div>
        )
    }
  }

  return (
    <div 
      className={`infographic-renderer p-8 rounded-lg ${className}`}
      style={{ 
        backgroundColor: data.theme?.backgroundColor || '#FFFFFF',
        color: data.theme?.textColor || '#1F2937',
        fontFamily: data.theme?.fontFamily || 'Inter, sans-serif'
      }}
    >
      {/* Header principal */}
      {data.title && (
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: data.theme?.primaryColor }}>
            {data.title}
          </h1>
          {data.subtitle && (
            <p className="text-xl text-muted-foreground">
              {data.subtitle}
            </p>
          )}
        </div>
      )}

      {/* Secciones */}
      <div className="space-y-6">
        {data.sections?.map((section, index) => renderSection(section, index))}
      </div>

      {/* Footer */}
      {data.metadata && (
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-muted-foreground">
          <p>
            {data.metadata.author && `Creado por ${data.metadata.author}`}
            {data.metadata.createdAt && ` • ${new Date(data.metadata.createdAt).toLocaleDateString()}`}
          </p>
        </div>
      )}
    </div>
  )
}




