-- =====================================================
-- CORRECCIÓN DE POLÍTICAS RLS PARA TABLA generated_images
-- =====================================================
-- Este script corrige las políticas de Row Level Security
-- que están bloqueando el guardado de imágenes generadas

-- 1. Verificar estructura de la tabla generated_images
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'generated_images' 
ORDER BY ordinal_position;

-- 2. Eliminar políticas existentes problemáticas
DROP POLICY IF EXISTS "Users can view their own generated images" ON generated_images;
DROP POLICY IF EXISTS "Users can insert their own generated images" ON generated_images;
DROP POLICY IF EXISTS "Users can update their own generated images" ON generated_images;
DROP POLICY IF EXISTS "Users can delete their own generated images" ON generated_images;

-- 3. Crear nuevas políticas más permisivas para usuarios autenticados
-- Política para SELECT: permitir a usuarios autenticados ver todas las imágenes
CREATE POLICY "Authenticated users can view generated images" ON generated_images
  FOR SELECT USING (auth.role() = 'authenticated');

-- Política para INSERT: permitir a usuarios autenticados insertar imágenes
CREATE POLICY "Authenticated users can insert generated images" ON generated_images
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para UPDATE: permitir a usuarios autenticados actualizar imágenes
CREATE POLICY "Authenticated users can update generated images" ON generated_images
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Política para DELETE: permitir a usuarios autenticados eliminar imágenes
CREATE POLICY "Authenticated users can delete generated images" ON generated_images
  FOR DELETE USING (auth.role() = 'authenticated');

-- 4. Verificar que las políticas se crearon correctamente
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
