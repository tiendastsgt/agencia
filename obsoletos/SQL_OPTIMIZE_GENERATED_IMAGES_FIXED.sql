-- =====================================================
-- OPTIMIZACIÓN DE TABLA generated_images (CORREGIDO)
-- =====================================================
-- Este script optimiza la tabla para mejorar el rendimiento

-- 1. Crear índices para mejorar consultas
CREATE INDEX IF NOT EXISTS idx_generated_images_created_at 
ON generated_images(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_generated_images_user_id 
ON generated_images(user_id);

CREATE INDEX IF NOT EXISTS idx_generated_images_style 
ON generated_images(style);

-- 2. Verificar que los índices se crearon
SELECT 
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'generated_images'
ORDER BY indexname;

-- 3. Verificar estadísticas de la tabla (consulta corregida)
SELECT 
  schemaname,
  relname as tablename,
  n_live_tup,
  n_dead_tup,
  last_vacuum,
  last_analyze
FROM pg_stat_user_tables 
WHERE relname = 'generated_images';

-- =====================================================
-- INSTRUCCIONES ADICIONALES:
-- =====================================================
-- Después de ejecutar este script, ejecuta por separado:
-- VACUUM ANALYZE generated_images;
-- =====================================================




