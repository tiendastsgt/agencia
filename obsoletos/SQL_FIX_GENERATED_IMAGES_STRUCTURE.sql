-- =====================================================
-- CORRECCIÓN DE ESTRUCTURA DE TABLA generated_images
-- =====================================================
-- Este script verifica y corrige la estructura de la tabla

-- 1. Verificar estructura actual de la tabla
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'generated_images' 
ORDER BY ordinal_position;

-- 2. Agregar columnas faltantes si no existen
-- Agregar user_id si no existe
ALTER TABLE generated_images 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Agregar prompt si no existe
ALTER TABLE generated_images 
ADD COLUMN IF NOT EXISTS prompt TEXT;

-- Agregar style si no existe
ALTER TABLE generated_images 
ADD COLUMN IF NOT EXISTS style VARCHAR(50) DEFAULT 'realistic';

-- Agregar size si no existe
ALTER TABLE generated_images 
ADD COLUMN IF NOT EXISTS size VARCHAR(20) DEFAULT '1K';

-- Agregar quality si no existe
ALTER TABLE generated_images 
ADD COLUMN IF NOT EXISTS quality VARCHAR(20) DEFAULT 'standard';

-- Agregar image_url si no existe
ALTER TABLE generated_images 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Agregar revised_prompt si no existe
ALTER TABLE generated_images 
ADD COLUMN IF NOT EXISTS revised_prompt TEXT;

-- Agregar created_at si no existe
ALTER TABLE generated_images 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Agregar updated_at si no existe
ALTER TABLE generated_images 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 3. Hacer campos requeridos NOT NULL si es necesario
-- (Solo si no causan problemas con datos existentes)
-- ALTER TABLE generated_images ALTER COLUMN prompt SET NOT NULL;
-- ALTER TABLE generated_images ALTER COLUMN image_url SET NOT NULL;

-- 4. Verificar estructura final
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'generated_images' 
ORDER BY ordinal_position;

-- 5. Verificar que RLS está habilitado
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename = 'generated_images';

-- 6. Verificar políticas existentes
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

-- =====================================================
-- INSTRUCCIONES DE USO:
-- =====================================================
-- 1. Ve al SQL Editor de Supabase
-- 2. Copia y pega todo este script
-- 3. Ejecuta el script
-- 4. Verifica que no hay errores
-- 5. Regresa a la aplicación y prueba generar imágenes
-- =====================================================




