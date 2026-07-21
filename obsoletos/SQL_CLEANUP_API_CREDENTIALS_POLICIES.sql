-- =====================================================
-- LIMPIEZA DE POLÍTICAS RLS DUPLICADAS PARA api_credentials
-- =====================================================
-- Este script elimina las políticas antiguas que están causando conflictos
-- y mantiene solo las políticas nuevas que funcionan correctamente

-- 1. Eliminar políticas antiguas problemáticas (que requieren user_id)
DROP POLICY IF EXISTS "Users can view own credentials" ON api_credentials;
DROP POLICY IF EXISTS "Users can insert own credentials" ON api_credentials;
DROP POLICY IF EXISTS "Users can update own credentials" ON api_credentials;
DROP POLICY IF EXISTS "Users can delete own credentials" ON api_credentials;

-- 2. Verificar que solo quedan las políticas correctas
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
-- RESULTADO ESPERADO:
-- =====================================================
-- Deberías ver solo 4 políticas:
-- 1. "Authenticated users can delete api credentials"
-- 2. "Authenticated users can insert api credentials"  
-- 3. "Authenticated users can update api credentials"
-- 4. "Authenticated users can view api credentials"
-- =====================================================
