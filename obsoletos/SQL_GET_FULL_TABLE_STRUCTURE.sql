-- =====================================================
-- OBTENER ESTRUCTURA COMPLETA DE TABLA generated_images
-- =====================================================
-- Este script obtiene toda la información de la tabla

-- 1. Verificar estructura completa de la tabla
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default,
  character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'generated_images' 
ORDER BY ordinal_position;

-- 2. Verificar si la tabla tiene primary key
SELECT 
  kcu.column_name,
  tc.constraint_name,
  tc.constraint_type
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'generated_images'
  AND tc.constraint_type = 'PRIMARY KEY';

-- 3. Verificar todas las foreign keys
SELECT 
  kcu.column_name,
  tc.constraint_name,
  tc.constraint_type,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu 
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'generated_images'
  AND tc.constraint_type = 'FOREIGN KEY';

-- 4. Verificar si la tabla campaigns existe
SELECT 
  table_name, 
  table_type 
FROM information_schema.tables 
WHERE table_name = 'campaigns';

-- =====================================================
-- INSTRUCCIONES DE USO:
-- =====================================================
-- 1. Ve al SQL Editor de Supabase
-- 2. Copia y pega todo este script
-- 3. Ejecuta el script
-- 4. Copia y pega el resultado aquí
-- =====================================================




