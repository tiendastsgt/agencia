-- =====================================================
-- LIMPIEZA SIMPLE DE TABLA generated_images
-- =====================================================
-- Este script solo actualiza estadísticas (sin VACUUM)

-- Actualizar estadísticas de la tabla
ANALYZE generated_images;

-- Verificar que las estadísticas se actualizaron
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
-- INSTRUCCIONES DE USO:
-- =====================================================
-- 1. Ejecuta este script en el SQL Editor de Supabase
-- 2. Verifica que last_analyze se actualizó
-- 3. La tabla ya está optimizada (0 datos muertos)
-- =====================================================



