-- =====================================================
-- CREAR SOLO LA TABLA generated_images
-- =====================================================
-- Este script solo crea la tabla sin tocar las políticas existentes

-- 1. Verificar si la tabla existe
SELECT 
  table_name, 
  table_type 
FROM information_schema.tables 
WHERE table_name = 'generated_images';

-- 2. Crear la tabla si no existe
CREATE TABLE IF NOT EXISTS generated_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  style VARCHAR(50) DEFAULT 'realistic',
  size VARCHAR(20) DEFAULT '1K',
  quality VARCHAR(20) DEFAULT 'standard',
  image_url TEXT NOT NULL,
  revised_prompt TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Habilitar RLS en la tabla (si no está habilitado)
ALTER TABLE generated_images ENABLE ROW LEVEL SECURITY;

-- 4. Verificar que la tabla se creó correctamente
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

-- =====================================================
-- INSTRUCCIONES DE USO:
-- =====================================================
-- 1. Ve al SQL Editor de Supabase
-- 2. Copia y pega todo este script
-- 3. Ejecuta el script
-- 4. Verifica que no hay errores
-- 5. Regresa a la aplicación y prueba generar imágenes
-- =====================================================




