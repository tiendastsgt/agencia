# ⚙️ Configuración de Variables de Entorno

## 📋 Resumen

Guía completa para configurar las variables de entorno en el sistema de infografías con mejores prácticas.

## 🔧 **Configuración Actual**

### Variables Disponibles
```env
# Google Gemini API Key
VITE_GEMINI_API_KEY=tu_api_key_aqui

# OpenAI DALL-E 3 API Key  
VITE_OPENAI_API_KEY=tu_api_key_aqui

# Stability AI API Key
VITE_STABILITY_API_KEY=tu_api_key_aqui

# Midjourney API Key (opcional)
VITE_MIDJOURNEY_API_KEY=tu_api_key_aqui

# Configuración de logging
VITE_LOG_LEVEL=info
```

## 🚀 **Configuración Rápida**

### 1. Verificar Archivo .env.local
```bash
# Verificar que existe
ls -la .env.local

# Ver contenido
cat .env.local
```

### 2. Configurar API Keys
Edita el archivo `.env.local` y agrega tus API keys:

```env
# Ejemplo de configuración
VITE_GEMINI_API_KEY=AIzaSyC...
VITE_OPENAI_API_KEY=sk-proj-...
VITE_STABILITY_API_KEY=sk-...
```

### 3. Reiniciar Servidor
```bash
# Detener servidor (Ctrl+C)
# Reiniciar
npm run dev
# o
pnpm dev
```

## 🧪 **Probar Configuración**

### Script de Prueba
```bash
node scripts/test-config.js
```

### Verificar en Consola del Navegador
```javascript
// Abrir DevTools y ejecutar:
console.log('Configuración:', window.__VITE_ENV__)
```

## 🔍 **Solución de Problemas**

### Error: "API key not configured"
**Causa**: Variable de entorno no configurada o no se está leyendo.

**Solución**:
1. Verificar que `.env.local` existe
2. Verificar que la variable tiene el prefijo `VITE_`
3. Reiniciar el servidor de desarrollo
4. Verificar que no hay espacios extra en la configuración

### Error: "Transform failed"
**Causa**: Error de sintaxis en el código de configuración.

**Solución**:
1. Verificar que no hay errores de TypeScript
2. Reiniciar el servidor
3. Limpiar cache: `rm -rf node_modules/.vite`

### Variables no se cargan
**Causa**: Problema con el sistema de variables de entorno.

**Solución**:
1. Verificar que las variables empiezan con `VITE_`
2. Verificar que no hay caracteres especiales
3. Usar comillas si hay espacios: `VITE_API_KEY="mi key"`

## 📊 **Monitoreo de Configuración**

### Logs de Debugging
```env
# Habilitar logs detallados
VITE_LOG_LEVEL=debug
```

### Verificar en Código
```typescript
import { configManager } from '@/lib/config'

// Verificar configuración
const config = configManager.getConfig()
console.log('AI Config:', config.ai)

// Verificar API key específica
const geminiConfig = configManager.getAIConfig('gemini')
console.log('Gemini API Key:', geminiConfig.apiKey ? 'Configurado' : 'No configurado')
```

## 🔒 **Seguridad**

### Mejores Prácticas
1. **Nunca** commitees `.env.local`
2. Usa diferentes keys para desarrollo/producción
3. Rota las API keys regularmente
4. Monitorea el uso de las APIs

### Archivos a Ignorar
```gitignore
# Variables de entorno
.env.local
.env.production
.env.development

# Archivos de configuración sensibles
config/secrets.json
```

## 🏗️ **Arquitectura de Configuración**

### Sistema Implementado
```
src/lib/config/
├── index.ts              # ConfigManager principal
├── vite-env.ts           # Manejo de variables de Vite
└── types.ts              # Tipos de configuración
```

### Flujo de Configuración
1. **Carga**: Variables desde `.env.local`
2. **Validación**: Verificación de tipos y valores
3. **Cache**: Configuración en memoria
4. **Acceso**: Métodos seguros para obtener valores

## 🎯 **Configuración por Entorno**

### Desarrollo
```env
VITE_LOG_LEVEL=debug
VITE_GEMINI_API_KEY=dev_key_here
```

### Producción
```env
VITE_LOG_LEVEL=error
VITE_GEMINI_API_KEY=prod_key_here
```

## 📈 **Métricas y Monitoreo**

### Verificar Estado de APIs
```typescript
import { AIServiceFactory } from '@/lib/ai/AIServiceFactory'

// Verificar servicios disponibles
const services = await AIServiceFactory.getAvailableServices()
console.log('Servicios disponibles:', services.map(s => s.getProvider()))
```

### Logs de Configuración
```typescript
import { logger } from '@/lib/logger'

// Log de configuración
logger.info('Configuración cargada', {
  gemini: !!config.ai.gemini.apiKey,
  dalle: !!config.ai.dalle3.apiKey,
  stability: !!config.ai.stability.apiKey
})
```

## 🚀 **Optimizaciones**

### Cache de Configuración
```typescript
// La configuración se cachea automáticamente
const config1 = configManager.getConfig()
const config2 = configManager.getConfig() // Usa cache
```

### Validación en Tiempo de Ejecución
```typescript
// Validar configuración al inicio
if (!config.ai.gemini.apiKey) {
  logger.warn('Gemini API key no configurada')
}
```

## 🎉 **Resultado Esperado**

Una vez configurado correctamente:

```bash
✅ Configuración cargada exitosamente
📊 Configuración de AI:
   🤖 Gemini: ✅ Configurado
   🎨 DALL-E 3: ✅ Configurado
   ⚡ Stability AI: ✅ Configurado
📋 Configuración de Infografías:
   📏 Tamaño por defecto: 1024x1792
   🎯 Calidad por defecto: hd
   🔄 Fallback habilitado: ✅
🎉 Configuración probada exitosamente!
```

¡El sistema está listo para generar infografías con todas las APIs configuradas! 🎨✨




