-- =====================================================
-- CORRECCIÓN DE POLÍTICAS RLS PARA TABLA api_credentials
-- =====================================================
-- Este script corrige las políticas de Row Level Security
-- que están bloqueando la inserción de API keys

-- 1. Eliminar políticas existentes problemáticas
DROP POLICY IF EXISTS "Users can view their own api credentials" ON api_credentials;
DROP POLICY IF EXISTS "Users can insert their own api credentials" ON api_credentials;
DROP POLICY IF EXISTS "Users can update their own api credentials" ON api_credentials;
DROP POLICY IF EXISTS "Users can delete their own api credentials" ON api_credentials;

-- 2. Crear nuevas políticas más permisivas para usuarios autenticados
-- Política para SELECT: permitir a usuarios autenticados ver todas las credenciales
CREATE POLICY "Authenticated users can view api credentials" ON api_credentials
  FOR SELECT USING (auth.role() = 'authenticated');

-- Política para INSERT: permitir a usuarios autenticados insertar credenciales
CREATE POLICY "Authenticated users can insert api credentials" ON api_credentials
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para UPDATE: permitir a usuarios autenticados actualizar credenciales
CREATE POLICY "Authenticated users can update api credentials" ON api_credentials
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Política para DELETE: permitir a usuarios autenticados eliminar credenciales
CREATE POLICY "Authenticated users can delete api credentials" ON api_credentials
  FOR DELETE USING (auth.role() = 'authenticated');

-- 3. Verificar que las políticas se crearon correctamente
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual 
FROM pg_policies 
WHERE tablename = 'api_credentials'
ORDER BY policyname;

-- =====================================================
-- INSTRUCCIONES DE USO:
-- =====================================================
-- 1. Ve al SQL Editor de Supabase
-- 2. Copia y pega todo este script
-- 3. Ejecuta el script
-- 4. Verifica que no hay errores
-- 5. Regresa a la aplicación y prueba crear una API key
-- =====================================================
