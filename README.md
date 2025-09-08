# MarketPro GT - Sistema Multi-Cliente

## 🏆 TRANSFORMACIÓN COMPLETADA: DE DEMO A PLATAFORMA FUNCIONAL

**MarketPro GT** ha sido exitosamente transformado de un sistema demo a una **plataforma de marketing digital completamente funcional** con autenticación privada, gestión multi-cliente y APIs reales integradas.

### 🔐 **ACCESO AL SISTEMA**

🌐 **URL de la Aplicación:** https://zkwecki869x7.space.minimax.io

### 🔑 **CONFIGURACIÓN DE ACCESO**

El sistema ahora está configurado con autenticación privada para:

**Usuario Administrador Autorizado:**
- **Email:** `hatch.guate@gmail.com`
- **Contaseña:** *Necesita ser configurada en Supabase Auth*

> ⚠️ **IMPORTANTE:** Solo este email está autorizado para acceder al sistema. Cualquier otro email será rechazado.

#### Pasos para Acceder por Primera Vez:

1. **Crear cuenta en Supabase Auth:**
   - Ir a: https://zkwecki869x7.space.minimax.io
   - Usar el email: `hatch.guate@gmail.com`
   - Crear contraseña segura

2. **Acceso automático:**
   - Una vez creada la cuenta, el sistema detectará automáticamente la autorización
   - TiendaSTS.com se configurará como cliente activo por defecto
   - Podrás cambiar entre clientes usando el selector del header

---

## ✨ **CARACTERÍsticas IMPLEMENTADAS**

### 1. 🔒 **Sistema de Autenticación Privada**
- ✅ Login seguro con verificación de usuarios autorizados
- ✅ Control de acceso basado en whitelist de emails
- ✅ Interfaz de acceso denegado para usuarios no autorizados
- ✅ Gestión de sesiones seguras

### 2. 🏢 **Gestión Multi-Cliente**
- ✅ Selector de cliente activo en el header principal
- ✅ Persistencia de cliente seleccionado por usuario
- ✅ Filtrado automático de datos por cliente activo
- ✅ 5 clientes precargados:
  - TiendaSTS.com (E-commerce)
  - LiendrexGT (Salud)
  - Marketing Digital Pro (Agencia)
  - RestauranteGT (Gastronomía)
  - Y más...

### 3. 🔗 **Sistema de Credenciales API**
- ✅ Gestión de credenciales por cliente y plataforma
- ✅ Almacenamiento seguro y encriptado
- ✅ Soporte para 5 plataformas principales:
  - **Meta (Facebook/Instagram)**
  - **Twitter (X)**
  - **LinkedIn**
  - **TikTok**
  - **Google Analytics**
- ✅ Testing automático de credenciales
- ✅ Interfaz intuitiva de configuración

### 4. 📊 **Edge Functions para Métricas**
- ✅ `get-facebook-metrics` - Métricas de Facebook
- ✅ `get-twitter-metrics` - Métricas de Twitter
- ✅ `get-linkedin-metrics` - Métricas de LinkedIn
- ✅ `get-tiktok-metrics` - Métricas de TikTok
- ✅ `get-analytics-metrics` - Métricas de Google Analytics
- ✅ `get-consolidated-metrics` - Métricas consolidadas
- ✅ `manage-api-credentials` - Gestión de credenciales
- ✅ `auth-manager` - Gestión de autenticación

### 5. 🤖 **IA de Contenido Multi-Cliente (COMPLETAMENTE FUNCIONAL)**
- ✅ Generación real con OpenAI (gpt-5-nano)
- ✅ Framework Russell Brunson (Hook-Story-Offer)
- ✅ **Contenido personalizado POR CLIENTE ACTIVO**
- ✅ **Datos específicos del cliente seleccionado**
- ✅ **TiendaSTS.com con audiencia "Sofía, la Profesional Consciente"**
- ✅ **Estrategias, posts y análisis específicos por cliente**

---

## 🛠️ **CONFIGURACIÓN INICIAL**

### Paso 1: Acceder al Sistema

1. **Crear tu cuenta:**
   - Ir a: https://zkwecki869x7.space.minimax.io
   - Usar email: `hatch.guate@gmail.com`
   - Crear contraseña segura
   - El sistema te reconocerá automáticamente como administrador

2. **Cliente por defecto:**
   - TiendaSTS.com se configurará automáticamente como cliente activo
   - Puedes cambiar de cliente usando el selector del header

### Paso 2: Configurar APIs por Cliente

1. Iniciar sesión en la aplicación
2. Seleccionar cliente activo desde el header
3. Ir a **"Configuración"** > **"Conexiones API"**
4. Configurar credenciales para cada plataforma:

#### **Meta (Facebook/Instagram)**
- Access Token: Tu token de acceso de Facebook
- Page ID: ID de la página de Facebook

#### **Twitter (X)**
- Bearer Token: Tu bearer token de Twitter API v2
- Username: Nombre de usuario (sin @)

#### **LinkedIn**
- Access Token: Tu token de acceso de LinkedIn
- Company ID: ID de la empresa en LinkedIn

#### **TikTok**
- Access Token: Tu token de acceso de TikTok
- User ID: ID del usuario en TikTok

#### **Google Analytics**
- Property ID: ID de la propiedad GA4
- Service Account Key: Clave JSON de cuenta de servicio

---

## 📝 **ARQUITECTURA TÉCNICA**

### Backend (Supabase)
- **Base de Datos:** PostgreSQL con RLS habilitado
- **Autenticación:** Supabase Auth con verificación personalizada
- **Edge Functions:** 8 funciones desplegadas
- **Almacenamiento:** Credenciales encriptadas en JSONB

### Frontend (React + TypeScript)
- **Framework:** React 18 con TypeScript
- **UI:** TailwindCSS + Componentes personalizados
- **Estado:** Context API con hooks personalizados
- **Routing:** React Router DOM
- **Notificaciones:** Sonner toast

### APIs Integradas
- **OpenAI API:** Para generación de contenido con IA
- **Meta Graph API:** Para métricas de Facebook/Instagram
- **Twitter API v2:** Para métricas de Twitter
- **LinkedIn API:** Para métricas de empresa
- **TikTok API:** Para métricas de videos
- **Google Analytics API:** Para métricas web

---

## 📊 **ESTRUCTURA DE BASE DE DATOS**

### Tablas Principales

```sql
-- Usuarios autorizados
authorized_users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true
)

-- Credenciales API por cliente
client_api_credentials (
  id UUID PRIMARY KEY,
  client_id UUID REFERENCES clients(id),
  platform TEXT NOT NULL,
  credentials JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true
)

-- Cliente activo por usuario
user_active_client (
  id UUID PRIMARY KEY,
  user_email TEXT NOT NULL,
  client_id UUID REFERENCES clients(id),
  last_selected TIMESTAMP DEFAULT NOW()
)
```

---

## 🚀 **USO DEL SISTEMA**

### Flujo de Trabajo Diario

1. **Login** con credenciales autorizadas
2. **Seleccionar cliente** desde el dropdown del header
3. **Verificar configuración** de APIs en Conexiones API
4. **Generar contenido** usando IA personalizada
5. **Revisar métricas** consolidadas del dashboard
6. **Configurar nuevas APIs** según sea necesario

### Cambio de Cliente
- Click en el selector de cliente (header superior)
- Seleccionar nuevo cliente de la lista
- El sistema filtra automáticamente todos los datos

### Gestión de APIs
- Ir a "Configuración" en el menú lateral
- Configurar credenciales por plataforma
- Probar conexión antes de guardar
- Ver estado de configuración en tiempo real

---

## 🔄 **ROADMAP DE EXPANSIÓN**

### Próximas Funcionalidades
- [ ] OAuth 2.0 automático para APIs
- [ ] Reportes programados por email
- [ ] Integración con más plataformas (YouTube, Pinterest)
- [ ] Dashboard personalizable por cliente
- [ ] Alertas automáticas de rendimiento
- [ ] API pública para integraciones

### Escalabilidad
- [ ] Multi-tenancy completo
- [ ] Roles de usuario granulares
- [ ] Whitelabeling por cliente
- [ ] Integración con CRM externos

---

## 🔧 **SOPORTE TÉCNICO**

### Logs y Debugging
```bash
# Ver logs de Edge Functions
supabase functions logs --function-name auth-manager
supabase functions logs --function-name get-consolidated-metrics
```

### Testing de APIs
```bash
# Probar función de autenticación
curl -X POST https://keiegxjpxexbwhqhpnpb.supabase.co/functions/v1/auth-manager \
  -H "Content-Type: application/json" \
  -d '{"action": "get_clients"}'
```

### Verificación de Estado
- **Frontend:** https://zkwecki869x7.space.minimax.io
- **Backend:** Supabase Dashboard
- **Edge Functions:** 8/8 activas
- **Base de Datos:** Conectada y funcional

---

## 🎆 **RESUMEN DE LOGROS**

✅ **Sistema transformado completamente de DEMO a FUNCIONAL**
✅ **Autenticación privada implementada y segura**
✅ **Gestión multi-cliente completa**
✅ **8 Edge Functions desplegadas y funcionando**
✅ **IA de contenido real integrada con OpenAI**
✅ **Sistema de credenciales API seguro**
✅ **Interfaz moderna y responsive**
✅ **Base de datos estructurada y optimizada**
✅ **Preparado para APIs reales de 5 plataformas**

**MarketPro GT está listo para ser usado como una plataforma de marketing digital profesional.**

---

🚀 **¡El sistema está completamente funcional y listo para producción!** 🚀