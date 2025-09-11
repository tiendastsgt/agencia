# 🔐 Sistema de Credenciales Seguro - MarketPro GT

## 📋 Resumen

Sistema completo de gestión de credenciales de API que implementa las mejores prácticas de seguridad para almacenar, encriptar y gestionar credenciales de APIs externas de forma segura.

## ✨ Características Principales

### 🔒 **Seguridad Avanzada**
- **Encriptación AES-256**: Todas las credenciales se almacenan encriptadas
- **Row Level Security (RLS)**: Políticas de seguridad a nivel de fila en Supabase
- **Auditoría Completa**: Logs detallados de uso y acceso
- **Gestión de Expiración**: Control automático de credenciales expiradas

### 🎯 **Gestión Intuitiva**
- **Interfaz Web**: Panel de administración completo
- **Múltiples Proveedores**: Soporte para 10+ APIs principales
- **Validación Automática**: Verificación de credenciales antes de usar
- **Estadísticas de Uso**: Métricas detalladas de utilización

### 🚀 **Integración Fácil**
- **Hooks React**: Hooks personalizados para uso en componentes
- **API Calls Automáticas**: Llamadas a APIs con credenciales automáticas
- **TypeScript**: Tipado completo para mejor desarrollo

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Supabase       │    │   APIs Externas │
│                 │    │                  │    │                 │
│ • CredentialsUI │◄──►│ • api_credentials│◄──►│ • OpenAI        │
│ • useCredentials│    │ • usage_logs     │    │ • Facebook      │
│ • API Calls     │    │ • providers      │    │ • Google        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 📊 Estructura de Base de Datos

### Tabla `api_credentials`
```sql
- id: UUID (PK)
- client_id: UUID (FK)
- user_id: UUID (FK)
- provider: VARCHAR(100)
- credential_name: VARCHAR(255)
- credential_type: VARCHAR(50)
- encrypted_value: TEXT (AES-256)
- encryption_key_id: VARCHAR(100)
- is_active: BOOLEAN
- expires_at: TIMESTAMP
- usage_count: INTEGER
- config: JSONB
```

### Tabla `credential_usage_logs`
```sql
- id: UUID (PK)
- credential_id: UUID (FK)
- user_id: UUID (FK)
- action: VARCHAR(100)
- endpoint: VARCHAR(255)
- status_code: INTEGER
- response_time_ms: INTEGER
- error_message: TEXT
- ip_address: INET
- user_agent: TEXT
```

### Tabla `api_providers`
```sql
- id: UUID (PK)
- name: VARCHAR(100)
- display_name: VARCHAR(255)
- auth_type: VARCHAR(50)
- base_url: VARCHAR(500)
- validation_endpoint: VARCHAR(500)
- rate_limits: JSONB
```

## 🛠️ Instalación y Configuración

### 1. Ejecutar Migración de Base de Datos

```sql
-- Ejecutar en Supabase SQL Editor
-- (Contenido completo en database_migrations/003_credentials_system.sql)
```

### 2. Configurar Variables de Entorno

```env
# .env.local
VITE_ENCRYPTION_KEY=tu-clave-secreta-aqui
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima-aqui
```

### 3. Verificar Instalación

```bash
node scripts/verify-credentials-system.js
```

## 🎯 Uso del Sistema

### Interfaz Web

1. **Acceder**: Ve a `/credentials` en la aplicación
2. **Configurar**: Agrega credenciales para los proveedores que necesites
3. **Validar**: Verifica que las credenciales funcionen correctamente
4. **Usar**: Las APIs se usarán automáticamente con las credenciales configuradas

### Uso en Código

```typescript
import { useCredentials, useApiCall } from '@/lib/hooks/useCredentials'

// Obtener credenciales de un proveedor
const { credentials, isLoading } = useCredentials('openai')

// Hacer llamada a API usando credenciales
const { makeApiCall } = useApiCall()
const result = await makeApiCall('openai', 'https://api.openai.com/v1/models')

// Verificar si hay credenciales configuradas
const { data: hasCredentials } = useHasCredentials('facebook')
```

## 🔧 Proveedores Soportados

| Proveedor | Tipo de Auth | Endpoint de Validación | Descripción |
|-----------|--------------|------------------------|-------------|
| **OpenAI** | API Key | `/v1/models` | GPT y DALL-E |
| **Facebook** | OAuth2 | `/v18.0/me` | Graph API |
| **Instagram** | OAuth2 | `/me` | Basic Display API |
| **Google** | OAuth2 | `/v1beta/properties` | Analytics 4 |
| **LinkedIn** | OAuth2 | `/v2/people/~` | Marketing API |
| **Twitter** | OAuth2 | `/2/users/me` | API v2 |
| **TikTok** | OAuth2 | `/v1.3/user/info/` | Business API |
| **YouTube** | OAuth2 | `/v2/reports` | Analytics API |
| **Stability AI** | API Key | `/v1/user/account` | Stable Diffusion |
| **RunwayML** | API Key | `/v1/account` | Video Generation |

## 🔒 Medidas de Seguridad

### Encriptación
- **Algoritmo**: AES-256
- **Implementación**: pgcrypto en Supabase
- **Clave**: Configurable via variables de entorno

### Políticas RLS
```sql
-- Los usuarios solo pueden ver sus propias credenciales
CREATE POLICY "Users can view own credentials" ON api_credentials
  FOR SELECT USING (auth.uid() = user_id);
```

### Auditoría
- **Logs de Uso**: Cada llamada a API se registra
- **Métricas**: Tiempo de respuesta, códigos de estado, errores
- **Trazabilidad**: IP, User Agent, timestamps

### Gestión de Expiración
- **Detección Automática**: Credenciales expiradas se marcan
- **Alertas**: Notificaciones en la interfaz
- **Renovación**: Proceso guiado para actualizar credenciales

## 📈 Monitoreo y Métricas

### Dashboard de Credenciales
- **Estado General**: Credenciales activas, expiradas, sin configurar
- **Uso por Proveedor**: Estadísticas de utilización
- **Alertas**: Notificaciones de problemas

### Logs de Uso
- **Historial Completo**: Todas las llamadas a APIs
- **Métricas de Rendimiento**: Tiempo de respuesta, tasa de éxito
- **Análisis de Errores**: Patrones de fallos y soluciones

## 🚨 Troubleshooting

### Problemas Comunes

1. **Credencial Inválida**
   - Verificar que la API key sea correcta
   - Comprobar permisos y límites de la API
   - Revisar logs de error en la interfaz

2. **Error de Encriptación**
   - Verificar que `VITE_ENCRYPTION_KEY` esté configurada
   - Asegurar que la clave sea consistente

3. **Problemas de RLS**
   - Verificar que el usuario esté autenticado
   - Comprobar políticas de Supabase

### Logs de Debug

```typescript
// Habilitar logs detallados
localStorage.setItem('debug', 'credentials:*')

// Ver logs en consola del navegador
```

## 🔄 Mantenimiento

### Tareas Regulares
- **Revisar Credenciales Expiradas**: Mensual
- **Auditar Logs de Uso**: Semanal
- **Actualizar Proveedores**: Según nuevas APIs
- **Rotar Claves de Encriptación**: Trimestral

### Backup y Recuperación
- **Backup de Base de Datos**: Automático en Supabase
- **Exportar Credenciales**: Función de exportación (próximamente)
- **Migración**: Scripts de migración versionados

## 🚀 Próximas Mejoras

### Versión 1.1
- [ ] **Rotación Automática**: Renovación automática de tokens OAuth
- [ ] **Múltiples Entornos**: Dev, Staging, Production
- [ ] **Webhooks**: Notificaciones de cambios de estado

### Versión 1.2
- [ ] **Análisis Avanzado**: ML para detectar patrones de uso
- [ ] **Integración CI/CD**: Credenciales para pipelines
- [ ] **API REST**: Endpoints para gestión programática

## 📞 Soporte

### Documentación
- **Guía de Usuario**: `/credentials` en la aplicación
- **API Reference**: Hooks y funciones disponibles
- **Ejemplos**: Casos de uso comunes

### Contacto
- **Issues**: Crear issue en el repositorio
- **Documentación**: README y comentarios en código
- **Comunidad**: Discord/Slack del proyecto

---

**Versión**: 1.0.0  
**Última Actualización**: ${new Date().toLocaleDateString()}  
**Compatibilidad**: React 18+, Supabase, TypeScript
