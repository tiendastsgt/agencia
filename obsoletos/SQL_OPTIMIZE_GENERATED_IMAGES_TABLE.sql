-- =====================================================
-- OPTIMIZACIÓN DE TABLA generated_images
-- =====================================================
-- Este script optimiza la tabla para mejorar el rendimiento

-- 1. Crear índices para mejorar consultas
CREATE INDEX IF NOT EXISTS idx_generated_images_created_at 
ON generated_images(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_generated_images_user_id 
ON generated_images(user_id);

CREATE INDEX IF NOT EXISTS idx_generated_images_style 
ON generated_images(style);

-- 2. Limpiar datos muertos y actualizar estadísticas
VACUUM ANALYZE generated_images;

-- 3. Verificar que los índices se crearon
SELECT 
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'generated_images'
ORDER BY indexname;

-- 4. Verificar estadísticas actualizadas
SELECT 
  schemaname,
  tablename,
  n_live_tup,
  n_dead_tup,
  last_vacuum,
  last_analyze
FROM pg_stat_user_tables 
WHERE relname = 'generated_images';

-- =====================================================
-- INSTRUCCIONES DE USO:
-- =====================================================
-- 1. Ve al SQL Editor de Supabase
-- 2. Copia y pega todo este script
-- 3. Ejecuta el script
-- 4. Verifica que no hay errores
-- 5. Regresa a la aplicación y prueba generar imágenes
-- =====================================================




