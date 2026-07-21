import React from 'react'
import { InfographicData } from '@/lib/types/infographic'

interface ProfessionalInfographicRendererProps {
  data: InfographicData
  className?: string
}

export default function ProfessionalInfographicRenderer({ data, className = '' }: ProfessionalInfographicRendererProps) {
  const renderStatsSection = (section: any) => {
    return (
      <div key={section.id} className="stats-section mb-8">
        <div className="section-header mb-6">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: data.theme?.primaryColor }}>
            {section.title}
          </h2>
          <div className="w-16 h-1 mx-auto rounded-full" style={{ backgroundColor: data.theme?.accentColor }}></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {section.content?.stats?.items?.map((stat: any, index: number) => (
            <div key={index} className="stat-card text-center p-6 rounded-2xl shadow-lg border-2 border-transparent hover:border-opacity-20 transition-all duration-300" 
                 style={{ 
                   backgroundColor: data.theme?.backgroundColor,
                   borderColor: data.theme?.primaryColor,
                   boxShadow: `0 8px 32px ${data.theme?.primaryColor}20`
                 }}>
              <div className="stat-value text-4xl font-bold mb-2" style={{ color: data.theme?.primaryColor }}>
                {stat.value}
                <span className="text-xl ml-1" style={{ color: data.theme?.secondaryColor }}>
                  {stat.unit}
                </span>
              </div>
              <div className="stat-label text-sm font-medium text-gray-600 uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderTextSection = (section: any) => {
    return (
      <div key={section.id} className="text-section mb-8">
        <div className="section-header mb-6">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: data.theme?.primaryColor }}>
            {section.title}
          </h2>
          <div className="w-16 h-1 mx-auto rounded-full" style={{ backgroundColor: data.theme?.accentColor }}></div>
        </div>
        
        <div className="text-content max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4" 
               style={{ borderLeftColor: data.theme?.primaryColor }}>
            <p className="text-lg leading-relaxed text-gray-700" style={{ fontFamily: data.theme?.fontFamily }}>
              {section.content?.text?.content}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const renderListSection = (section: any) => {
    return (
      <div key={section.id} className="list-section mb-8">
        <div className="section-header mb-6">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: data.theme?.primaryColor }}>
            {section.title}
          </h2>
          <div className="w-16 h-1 mx-auto rounded-full" style={{ backgroundColor: data.theme?.accentColor }}></div>
        </div>
        
        <div className="list-content max-w-3xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.content?.list?.items?.map((item: any, index: number) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-xl hover:shadow-md transition-all duration-200"
                     style={{ backgroundColor: `${data.theme?.primaryColor}05` }}>
                  {section.content?.list?.type === 'checkmark' ? (
                    <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold"
                         style={{ backgroundColor: data.theme?.primaryColor }}>
                      ✓
                    </div>
                  ) : (
                    <div className="flex-shrink-0 w-3 h-3 rounded-full mt-2"
                         style={{ backgroundColor: data.theme?.primaryColor }}></div>
                  )}
                  <span className="text-gray-700 font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderChartSection = (section: any) => {
    const maxValue = Math.max(...(section.content?.chart?.data?.map((item: any) => item.value) || [0]))
    
    return (
      <div key={section.id} className="chart-section mb-8">
        <div className="section-header mb-6">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: data.theme?.primaryColor }}>
            {section.title}
          </h2>
          <div className="w-16 h-1 mx-auto rounded-full" style={{ backgroundColor: data.theme?.accentColor }}></div>
        </div>
        
        <div className="chart-content max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="space-y-6">
              {section.content?.chart?.data?.map((item: any, index: number) => {
                const percentage = (item.value / maxValue) * 100
                return (
                  <div key={index} className="chart-item">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-700">{item.label}</span>
                      <span className="text-lg font-bold" style={{ color: data.theme?.primaryColor }}>
                        {item.value}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: data.theme?.primaryColor,
                          background: `linear-gradient(90deg, ${data.theme?.primaryColor} 0%, ${data.theme?.secondaryColor} 100%)`
                        }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderComparisonSection = (section: any) => {
    return (
      <div key={section.id} className="comparison-section mb-8">
        <div className="section-header mb-6">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: data.theme?.primaryColor }}>
            {section.title}
          </h2>
          <div className="w-16 h-1 mx-auto rounded-full" style={{ backgroundColor: data.theme?.accentColor }}></div>
        </div>
        
        <div className="comparison-content max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {section.content?.comparison?.items?.map((item: any, index: number) => (
              <div key={index} className="comparison-card bg-white p-8 rounded-2xl shadow-lg border-2 border-transparent hover:shadow-xl transition-all duration-300"
                   style={{ borderColor: data.theme?.primaryColor }}>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2" style={{ color: data.theme?.primaryColor }}>
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                
                {item.pros && item.pros.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3 text-green-600">✅ Ventajas</h4>
                    <ul className="space-y-2">
                      {item.pros.map((pro: string, proIndex: number) => (
                        <li key={proIndex} className="flex items-center gap-2 text-sm">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {item.cons && item.cons.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3 text-red-600">❌ Desventajas</h4>
                    <ul className="space-y-2">
                      {item.cons.map((con: string, conIndex: number) => (
                        <li key={conIndex} className="flex items-center gap-2 text-sm">
                          <span className="w-2 h-2 rounded-full bg-red-500"></span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {item.score && (
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full text-2xl font-bold text-white"
                         style={{ backgroundColor: data.theme?.primaryColor }}>
                      {item.score}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Puntuación</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderSection = (section: any, index: number) => {
    switch (section.type) {
      case 'stats':
        return renderStatsSection(section)
      case 'text':
        return renderTextSection(section)
      case 'list':
        return renderListSection(section)
      case 'chart':
        return renderChartSection(section)
      case 'comparison':
        return renderComparisonSection(section)
      default:
        return (
          <div key={section.id} className="unknown-section mb-8 p-6 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
            <p className="text-gray-600">Tipo de sección no soportado: {section.type}</p>
          </div>
        )
    }
  }

  return (
    <div 
      className={`professional-infographic p-8 rounded-2xl shadow-2xl ${className}`}
      style={{ 
        backgroundColor: data.theme?.backgroundColor || '#FFFFFF',
        color: data.theme?.textColor || '#1F2937',
        fontFamily: data.theme?.fontFamily || 'Inter, sans-serif',
        background: `linear-gradient(135deg, ${data.theme?.backgroundColor || '#FFFFFF'} 0%, ${data.theme?.primaryColor}05 100%)`
      }}
    >
      {/* Header principal con diseño profesional */}
      {data.title && (
        <div className="main-header text-center mb-12">
          <div className="inline-block p-6 rounded-2xl shadow-lg mb-6" 
               style={{ backgroundColor: data.theme?.primaryColor }}>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              {data.title}
            </h1>
          </div>
          {data.subtitle && (
            <div className="max-w-3xl mx-auto">
              <p className="text-xl md:text-2xl text-gray-600 font-medium leading-relaxed">
                {data.subtitle}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Secciones con diseño profesional */}
      <div className="sections-container space-y-12">
        {data.sections?.map((section, index) => renderSection(section, index))}
      </div>

      {/* Footer profesional */}
      {data.metadata && (
        <div className="footer mt-16 pt-8 border-t-2 border-gray-200">
          <div className="text-center">
            <div className="inline-flex items-center gap-4 p-4 rounded-xl" 
                 style={{ backgroundColor: `${data.theme?.primaryColor}10` }}>
              {data.metadata.author && (
                <span className="text-sm font-medium" style={{ color: data.theme?.primaryColor }}>
                  👤 {data.metadata.author}
                </span>
              )}
              {data.metadata.createdAt && (
                <span className="text-sm text-gray-500">
                  📅 {new Date(data.metadata.createdAt).toLocaleDateString('es-ES')}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}




