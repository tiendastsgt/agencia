-- =====================================================
-- DIAGNÓSTICO DE RENDIMIENTO DE BASE DE DATOS
-- =====================================================
-- Este script diagnostica problemas de rendimiento en la base de datos

-- 1. Verificar tamaño de la tabla generated_images
SELECT 
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats 
WHERE tablename = 'generated_images';

-- 2. Verificar índices en la tabla generated_images
SELECT 
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'generated_images';

-- 3. Verificar estadísticas de la tabla
SELECT 
  schemaname,
  tablename,
  n_tup_ins,
  n_tup_upd,
  n_tup_del,
  n_live_tup,
  n_dead_tup,
  last_vacuum,
  last_autovacuum,
  last_analyze,
  last_autoanalyze
FROM pg_stat_user_tables 
WHERE relname = 'generated_images';

-- 4. Verificar consultas lentas
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  rows
FROM pg_stat_statements 
WHERE query LIKE '%generated_images%'
ORDER BY mean_time DESC
LIMIT 5;

-- 5. Verificar si hay locks en la tabla
SELECT 
  pid,
  mode,
  granted,
  query
FROM pg_locks l
JOIN pg_stat_activity a ON l.pid = a.pid
WHERE l.relation = 'generated_images'::regclass;

-- =====================================================
-- SOLUCIONES RECOMENDADAS:
-- =====================================================
-- 1. Crear índices para mejorar rendimiento
-- 2. Limpiar datos muertos (VACUUM)
-- 3. Actualizar estadísticas (ANALYZE)
-- 4. Optimizar consultas
-- =====================================================




