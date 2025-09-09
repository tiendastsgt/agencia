# Política de Seguridad - MarketPro GT

## 🛡️ Compromiso de Seguridad

La seguridad es una prioridad fundamental en MarketPro GT. Nos comprometemos a mantener la confidencialidad, integridad y disponibilidad de los datos de nuestros usuarios.

## 🔐 Medidas de Seguridad Implementadas

### Autenticación y Autorización
- **JWT Tokens** con expiración automática
- **Row Level Security (RLS)** en todas las tablas de Supabase
- **Whitelist de usuarios** autorizados
- **Validación de sesiones** en cada request

### Protección de Datos
- **Encriptación en tránsito** (HTTPS/TLS)
- **Encriptación en reposo** en Supabase
- **Variables de entorno** para credenciales sensibles
- **No almacenamiento** de contraseñas en texto plano

### APIs y Edge Functions
- **Validación de entrada** en todos los endpoints
- **Rate limiting** para prevenir abuso
- **CORS** configurado correctamente
- **Logging de seguridad** para auditoría

## 🚨 Reportar Vulnerabilidades

Si descubres una vulnerabilidad de seguridad, por favor:

1. **NO** publiques la vulnerabilidad públicamente
2. Envía un email a: `security@marketpro-gt.com`
3. Incluye:
   - Descripción detallada de la vulnerabilidad
   - Pasos para reproducir
   - Impacto potencial
   - Tu información de contacto

### Proceso de Respuesta
- **Respuesta inicial**: 24 horas
- **Evaluación**: 72 horas
- **Resolución**: 7-30 días (dependiendo de la severidad)

## 🔒 Mejores Prácticas para Desarrolladores

### Variables de Entorno
```bash
# ✅ CORRECTO
VITE_SUPABASE_URL=https://proyecto.supabase.co
VITE_OPENAI_API_KEY=sk-proj-...

# ❌ INCORRECTO - Nunca hardcodear
const apiKey = "sk-proj-abc123..."
```

### Validación de Entrada
```typescript
// ✅ CORRECTO
const validateInput = (input: string) => {
  if (!input || input.length < 1) {
    throw new Error('Input inválido');
  }
  return input.trim();
};

// ❌ INCORRECTO
const processInput = (input: any) => {
  return input; // Sin validación
};
```

### Manejo de Errores
```typescript
// ✅ CORRECTO
try {
  const result = await apiCall();
  return result;
} catch (error) {
  console.error('Error en API:', error.message);
  throw new Error('Error interno del servidor');
}

// ❌ INCORRECTO
const result = await apiCall(); // Sin manejo de errores
```

## 🛠️ Configuración de Seguridad

### Variables de Entorno Requeridas
```env
# Supabase
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI
VITE_OPENAI_API_KEY=sk-proj-...

# Producción (opcional)
VITE_APP_URL=https://tu-dominio.com
```

### Configuración de Supabase
```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Política de ejemplo para clients
CREATE POLICY "Users can only see their own clients" ON clients
  FOR SELECT USING (auth.uid() = user_id);
```

## 🔍 Auditoría de Seguridad

### Checklist de Seguridad
- [ ] Variables de entorno configuradas correctamente
- [ ] RLS habilitado en todas las tablas
- [ ] Validación de entrada en todas las APIs
- [ ] Logging de errores implementado
- [ ] Rate limiting configurado
- [ ] CORS configurado correctamente
- [ ] HTTPS habilitado en producción
- [ ] API keys rotadas regularmente

### Monitoreo
- **Logs de Supabase** para actividad sospechosa
- **Métricas de OpenAI** para uso anormal
- **Alertas de seguridad** en producción

## 📋 Incidentes de Seguridad

### Clasificación de Severidad
- **Crítica**: Acceso no autorizado a datos sensibles
- **Alta**: Vulnerabilidades que permiten escalación de privilegios
- **Media**: Vulnerabilidades que afectan la funcionalidad
- **Baja**: Mejoras de seguridad menores

### Plan de Respuesta
1. **Contención**: Aislar el sistema afectado
2. **Evaluación**: Determinar el alcance del incidente
3. **Eradicación**: Eliminar la causa raíz
4. **Recuperación**: Restaurar servicios normales
5. **Lecciones aprendidas**: Documentar y mejorar

## 🔄 Actualizaciones de Seguridad

### Dependencias
```bash
# Verificar vulnerabilidades
pnpm audit

# Actualizar dependencias
pnpm update

# Actualizar dependencias con vulnerabilidades
pnpm audit fix
```

### Rotación de Credenciales
- **API Keys**: Cada 90 días
- **Tokens de acceso**: Automático (JWT)
- **Contraseñas**: Cada 6 meses

## 📞 Contacto de Seguridad

- **Email**: security@marketpro-gt.com
- **Responsable**: Equipo de Seguridad MarketPro GT
- **Horario**: 24/7 para incidentes críticos

## 📄 Cumplimiento

MarketPro GT cumple con:
- **GDPR** (Reglamento General de Protección de Datos)
- **CCPA** (Ley de Privacidad del Consumidor de California)
- **Ley de Protección de Datos Personales de Guatemala**

---

**Última actualización**: Septiembre 2025  
**Próxima revisión**: Diciembre 2025
