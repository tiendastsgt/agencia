# 🤖 Configuración de Google Gemini

## 📋 Resumen

Guía paso a paso para configurar Google Gemini API en el sistema de infografías.

## 🔑 **Paso 1: Obtener API Key de Gemini**

### 1.1 Acceder a Google AI Studio
1. Ve a [Google AI Studio](https://aistudio.google.com/)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en "Get API Key"

### 1.2 Crear API Key
1. Haz clic en "Create API Key"
2. Selecciona un proyecto de Google Cloud (o crea uno nuevo)
3. Copia la API key generada

## ⚙️ **Paso 2: Configurar Variables de Entorno**

### 2.1 Ejecutar Script de Configuración
```bash
node scripts/setup-env.js
```

### 2.2 Editar Archivo .env.local
Abre el archivo `.env.local` y configura tu API key:

```env
# Google Gemini API Key
VITE_GEMINI_API_KEY=tu_api_key_aqui
```

### 2.3 Reiniciar Servidor
```bash
npm run dev
# o
pnpm dev
```

## 🧪 **Paso 3: Probar Integración**

### 3.1 Verificar en Consola
Abre las herramientas de desarrollador y verifica que no aparezcan errores de API key:

```
✅ INFO Starting infographic image generation {"provider":"gemini"}
✅ INFO Infographic image generation completed {"provider":"gemini","success":true}
```

### 3.2 Probar Generación
1. Ve a la página de Infografías
2. Crea una nueva infografía
3. Selecciona "Gemini" como proveedor
4. Haz clic en "Generar"

## 🔧 **Configuración Avanzada**

### Configuración de Timeout
```typescript
// En src/lib/config/index.ts
gemini: {
  provider: 'gemini',
  apiKey: this.getEnvVar('VITE_GEMINI_API_KEY', ''),
  timeout: 30000,        // 30 segundos
  retryAttempts: 3,      // 3 reintentos
  retryDelay: 1000       // 1 segundo entre reintentos
}
```

### Configuración de Logging
```typescript
// Para debug detallado
VITE_LOG_LEVEL=debug
```

## 🚨 **Solución de Problemas**

### Error: "API key not configured for gemini"
**Causa**: La API key no está configurada o no se está leyendo correctamente.

**Solución**:
1. Verifica que el archivo `.env.local` existe
2. Verifica que `VITE_GEMINI_API_KEY` está configurado
3. Reinicia el servidor de desarrollo
4. Verifica que la API key es válida

### Error: "API key is invalid"
**Causa**: La API key no es válida o ha expirado.

**Solución**:
1. Genera una nueva API key en Google AI Studio
2. Actualiza el archivo `.env.local`
3. Reinicia el servidor

### Error: "Rate limit exceeded"
**Causa**: Has excedido el límite de requests de la API.

**Solución**:
1. Espera unos minutos
2. Verifica tu cuota en Google AI Studio
3. Considera implementar rate limiting

## 📊 **Monitoreo y Métricas**

### Logs de Debugging
```typescript
// Habilitar logs detallados
VITE_LOG_LEVEL=debug
```

### Métricas de Rendimiento
El sistema registra automáticamente:
- Tiempo de generación
- Tasa de éxito/fallo
- Errores específicos
- Uso de fallback

## 🔒 **Seguridad**

### Mejores Prácticas
1. **Nunca** commitees el archivo `.env.local`
2. Usa diferentes API keys para desarrollo y producción
3. Rota las API keys regularmente
4. Monitorea el uso de la API

### Variables de Entorno Seguras
```env
# ✅ Correcto
VITE_GEMINI_API_KEY=AIzaSyC...

# ❌ Incorrecto - No hardcodear en el código
const apiKey = "AIzaSyC..."
```

## 🚀 **Optimizaciones**

### Cache de Respuestas
```typescript
// Implementar cache para evitar requests duplicados
const cacheKey = `gemini_${hash(prompt)}`
```

### Batch Processing
```typescript
// Procesar múltiples infografías en lote
const batchSize = 5
const results = await Promise.all(
  infographics.map(infographic => 
    generateWithGemini(infographic)
  )
)
```

## 📈 **Límites y Cuotas**

### Límites de Gemini
- **Requests por minuto**: 60
- **Tokens por minuto**: 32,000
- **Tamaño de imagen**: 1024x1024, 1024x1792, 1792x1024

### Monitoreo de Uso
```typescript
// Verificar uso actual
const usage = await geminiService.getUsage()
console.log('Usage:', usage)
```

## 🎯 **Resultado Esperado**

Una vez configurado correctamente, deberías ver:

```bash
✅ INFO Starting infographic image generation {"provider":"gemini","title":"Mi Infografía"}
✅ INFO Infographic image generation completed {"provider":"gemini","success":true,"duration":2500}
```

¡Gemini está listo para generar infografías profesionales! 🎨✨




