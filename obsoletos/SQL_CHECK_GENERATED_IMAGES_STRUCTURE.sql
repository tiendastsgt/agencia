-- =====================================================
-- VERIFICAR ESTRUCTURA DE TABLA generated_images
-- =====================================================
-- Este script verifica la estructura actual de la tabla

-- 1. Verificar estructura actual de la tabla
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'generated_images' 
ORDER BY ordinal_position;

-- 2. Verificar que RLS está habilitado
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename = 'generated_images';

-- 3. Verificar políticas existentes
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual 
FROM pg_policies 
WHERE tablename = 'generated_images'
ORDER BY policyname;

-- 4. Verificar si hay datos en la tabla
SELECT COUNT(*) as total_images FROM generated_images;

-- =====================================================
-- INSTRUCCIONES DE USO:
-- =====================================================
-- 1. Ve al SQL Editor de Supabase
-- 2. Copia y pega todo este script
-- 3. Ejecuta el script
-- 4. Copia y pega el resultado aquí
-- =====================================================




