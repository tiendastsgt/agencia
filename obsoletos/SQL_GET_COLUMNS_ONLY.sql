-- =====================================================
-- OBTENER SOLO LAS COLUMNAS DE TABLA generated_images
-- =====================================================
-- Este script obtiene solo las columnas de la tabla

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

-- =====================================================
-- INSTRUCCIONES DE USO:
-- =====================================================
-- 1. Ve al SQL Editor de Supabase
-- 2. Copia y pega todo este script
-- 3. Ejecuta el script
-- 4. Copia y pega el resultado aquí
-- =====================================================
  



