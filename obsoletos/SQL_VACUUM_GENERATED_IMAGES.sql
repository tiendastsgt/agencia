-- =====================================================
-- LIMPIEZA DE TABLA generated_images
-- =====================================================
-- Este script limpia la tabla (ejecutar por separado)

-- Limpiar datos muertos y actualizar estadísticas
VACUUM ANALYZE generated_images;

-- Verificar que la limpieza fue exitosa
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
-- 1. Ejecuta primero: SQL_OPTIMIZE_GENERATED_IMAGES_FIXED.sql
-- 2. Luego ejecuta este script por separado
-- 3. Verifica que no hay errores
-- =====================================================




