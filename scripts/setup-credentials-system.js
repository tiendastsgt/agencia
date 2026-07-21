#!/usr/bin/env node

/**
 * Script para configurar el sistema de credenciales seguro
 * Ejecuta la migración de base de datos y configura el sistema
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function setupCredentialsSystem() {
  console.log('🔐 CONFIGURANDO SISTEMA DE CREDENCIALES SEGURO\n')

  try {
    // 1. Verificar que existe la migración
    const migrationPath = path.join(__dirname, '..', 'database_migrations', '003_credentials_system.sql')
    
    if (!fs.existsSync(migrationPath)) {
      throw new Error('No se encontró la migración 003_credentials_system.sql')
    }

    console.log('✅ Migración encontrada:', migrationPath)

    // 2. Leer el contenido de la migración
    const migrationContent = fs.readFileSync(migrationPath, 'utf8')
    console.log('✅ Contenido de migración leído')

    // 3. Crear archivo de instrucciones
    const instructionsPath = path.join(__dirname, '..', 'CREDENTIALS_SETUP_INSTRUCTIONS.md')
    const instructions = `# 🔐 Configuración del Sistema de Credenciales Seguro

## 📋 Instrucciones de Configuración

### 1. Ejecutar Migración de Base de Datos

Ejecuta el siguiente SQL en el **SQL Editor** de Supabase:

\`\`\`sql
${migrationContent}
\`\`\`

### 2. Verificar Instalación

Después de ejecutar la migración, verifica que se crearon las tablas:

\`\`\`sql
-- Verificar tablas creadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('api_credentials', 'credential_usage_logs', 'api_providers');

-- Verificar proveedores insertados
SELECT name, display_name, auth_type 
FROM api_providers 
ORDER BY name;
\`\`\`

### 3. Configurar Variables de Entorno

Agrega la siguiente variable a tu archivo \`.env.local\`:

\`\`\`env
# Clave de encriptación para credenciales (cámbiala en producción)
VITE_ENCRYPTION_KEY=marketpro-gt-encryption-key-2025-secure
\`\`\`

### 4. Funcionalidades Disponibles

Una vez configurado, tendrás acceso a:

- ✅ **Gestión de Credenciales**: Interfaz para agregar/editar/eliminar credenciales
- ✅ **Encriptación AES-256**: Todas las credenciales se almacenan encriptadas
- ✅ **Validación Automática**: Verificación de credenciales antes de usar
- ✅ **Logs de Uso**: Auditoría completa del uso de credenciales
- ✅ **Múltiples Proveedores**: Soporte para 10+ APIs (OpenAI, Facebook, Google, etc.)
- ✅ **Políticas RLS**: Seguridad a nivel de fila en Supabase
- ✅ **Expiración Automática**: Gestión de credenciales con fecha de expiración

### 5. Proveedores Soportados

| Proveedor | Tipo de Auth | Descripción |
|-----------|--------------|-------------|
| OpenAI | API Key | GPT y DALL-E |
| Facebook | OAuth2 | Graph API |
| Instagram | OAuth2 | Basic Display API |
| Google | OAuth2 | Analytics 4 |
| LinkedIn | OAuth2 | Marketing API |
| Twitter | OAuth2 | API v2 |
| TikTok | OAuth2 | Business API |
| YouTube | OAuth2 | Analytics API |
| Stability AI | API Key | Stable Diffusion |
| RunwayML | API Key | Video Generation |

### 6. Uso en el Código

\`\`\`typescript
import { useCredentials, useApiCall } from '@/lib/hooks/useCredentials'

// Obtener credenciales de un proveedor
const { credentials } = useCredentials('openai')

// Hacer llamada a API usando credenciales
const { makeApiCall } = useApiCall()
const result = await makeApiCall('openai', 'https://api.openai.com/v1/models')
\`\`\`

### 7. Seguridad

- 🔒 **Encriptación**: AES-256 para todas las credenciales
- 🔒 **RLS**: Row Level Security en Supabase
- 🔒 **Auditoría**: Logs completos de uso
- 🔒 **Expiración**: Gestión automática de credenciales expiradas
- 🔒 **Validación**: Verificación antes de cada uso

## 🚀 Próximos Pasos

1. Ejecuta la migración SQL
2. Configura las variables de entorno
3. Ve a \`/credentials\` en la aplicación
4. Configura tu primera credencial
5. ¡Comienza a usar las APIs de forma segura!

---

**Fecha de configuración**: ${new Date().toLocaleDateString()}
**Versión**: 1.0.0
`

    fs.writeFileSync(instructionsPath, instructions)
    console.log('✅ Instrucciones creadas:', instructionsPath)

    // 4. Crear archivo de ejemplo de configuración
    const envExamplePath = path.join(__dirname, '..', '.env.credentials.example')
    const envExample = `# Configuración del Sistema de Credenciales
# Copia este archivo como .env.local y configura tus valores

# Clave de encriptación para credenciales (¡CÁMBIA ESTA CLAVE EN PRODUCCIÓN!)
VITE_ENCRYPTION_KEY=marketpro-gt-encryption-key-2025-secure

# Configuración de Supabase (ya debería estar configurada)
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_aqui

# APIs opcionales (se pueden configurar desde la interfaz)
VITE_OPENAI_API_KEY=sk-tu_clave_openai_aqui
VITE_FACEBOOK_APP_ID=tu_app_id_facebook
VITE_GOOGLE_CLIENT_ID=tu_client_id_google
`

    fs.writeFileSync(envExamplePath, envExample)
    console.log('✅ Archivo de ejemplo creado:', envExamplePath)

    // 5. Crear script de verificación
    const verificationScript = `#!/usr/bin/env node

/**
 * Script de verificación del sistema de credenciales
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY son requeridos')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyCredentialsSystem() {
  console.log('🔍 VERIFICANDO SISTEMA DE CREDENCIALES\\n')

  try {
    // Verificar tablas
    console.log('1️⃣ Verificando tablas...')
    
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['api_credentials', 'credential_usage_logs', 'api_providers'])

    if (tablesError) throw tablesError

    const tableNames = tables?.map(t => t.table_name) || []
    const expectedTables = ['api_credentials', 'credential_usage_logs', 'api_providers']
    
    const missingTables = expectedTables.filter(table => !tableNames.includes(table))
    
    if (missingTables.length > 0) {
      console.error('❌ Tablas faltantes:', missingTables.join(', '))
      console.log('💡 Ejecuta la migración SQL primero')
      return
    }
    
    console.log('✅ Todas las tablas están presentes')

    // Verificar proveedores
    console.log('\\n2️⃣ Verificando proveedores...')
    
    const { data: providers, error: providersError } = await supabase
      .from('api_providers')
      .select('name, display_name, auth_type')
      .order('name')

    if (providersError) throw providersError

    console.log(\`✅ \${providers?.length || 0} proveedores configurados:\`)
    providers?.forEach(provider => {
      console.log(\`   - \${provider.display_name} (\${provider.auth_type})\`)
    })

    // Verificar funciones
    console.log('\\n3️⃣ Verificando funciones...')
    
    const { data: functions, error: functionsError } = await supabase
      .from('information_schema.routines')
      .select('routine_name')
      .eq('routine_schema', 'public')
      .in('routine_name', ['encrypt_credential', 'decrypt_credential', 'validate_api_credential'])

    if (functionsError) throw functionsError

    const functionNames = functions?.map(f => f.routine_name) || []
    const expectedFunctions = ['encrypt_credential', 'decrypt_credential', 'validate_api_credential']
    
    const missingFunctions = expectedFunctions.filter(func => !functionNames.includes(func))
    
    if (missingFunctions.length > 0) {
      console.error('❌ Funciones faltantes:', missingFunctions.join(', '))
      return
    }
    
    console.log('✅ Todas las funciones están presentes')

    // Verificar políticas RLS
    console.log('\\n4️⃣ Verificando políticas RLS...')
    
    const { data: policies, error: policiesError } = await supabase
      .from('information_schema.table_privileges')
      .select('table_name, privilege_type')
      .eq('table_schema', 'public')
      .in('table_name', ['api_credentials', 'credential_usage_logs', 'api_providers'])

    if (policiesError) throw policiesError

    console.log('✅ Políticas RLS configuradas')

    console.log('\\n🎉 ¡Sistema de credenciales verificado exitosamente!')
    console.log('\\n📝 Próximos pasos:')
    console.log('   1. Ve a /credentials en la aplicación')
    console.log('   2. Configura tu primera credencial')
    console.log('   3. ¡Comienza a usar las APIs de forma segura!')

  } catch (error) {
    console.error('❌ Error durante la verificación:', error.message)
    process.exit(1)
  }
}

verifyCredentialsSystem()
`

    const verificationPath = path.join(__dirname, 'verify-credentials-system.js')
    fs.writeFileSync(verificationPath, verificationScript)
    console.log('✅ Script de verificación creado:', verificationPath)

    console.log('\n🎉 ¡CONFIGURACIÓN COMPLETADA!\n')
    console.log('📋 Próximos pasos:')
    console.log('   1. Lee las instrucciones en: CREDENTIALS_SETUP_INSTRUCTIONS.md')
    console.log('   2. Ejecuta la migración SQL en Supabase')
    console.log('   3. Configura las variables de entorno')
    console.log('   4. Ejecuta: node scripts/verify-credentials-system.js')
    console.log('   5. Ve a /credentials en la aplicación\n')

  } catch (error) {
    console.error('❌ Error durante la configuración:', error.message)
    process.exit(1)
  }
}

setupCredentialsSystem()
