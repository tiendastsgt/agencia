-- =====================================================
-- CORRECCIÓN DE ESTRUCTURA DE TABLA api_credentials
-- =====================================================
-- Este script verifica y corrige la estructura de la tabla
-- para que coincida con lo que espera el código

-- 1. Verificar estructura actual de la tabla
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'api_credentials' 
ORDER BY ordinal_position;

-- 2. Agregar campo credential_name si no existe
ALTER TABLE api_credentials 
ADD COLUMN IF NOT EXISTS credential_name VARCHAR(255);

-- 3. Hacer el campo credential_name requerido (NOT NULL)
-- Primero agregar valores por defecto a registros existentes
UPDATE api_credentials 
SET credential_name = provider || ' API Key'
WHERE credential_name IS NULL;

-- Luego hacer el campo NOT NULL
ALTER TABLE api_credentials 
ALTER COLUMN credential_name SET NOT NULL;

-- 4. Agregar valor por defecto para futuros registros
ALTER TABLE api_credentials 
ALTER COLUMN credential_name SET DEFAULT 'API Key';

-- 5. Verificar la estructura final
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'api_credentials' 
ORDER BY ordinal_position;

-- =====================================================
-- ESTRUCTURA ESPERADA:
-- =====================================================
-- id: uuid (PRIMARY KEY)
-- provider: varchar (NOT NULL)
-- encrypted_value: text (NOT NULL)
-- credential_name: varchar (NOT NULL)
-- is_active: boolean (DEFAULT true)
-- created_at: timestamp (DEFAULT NOW())
-- updated_at: timestamp (DEFAULT NOW())
-- =====================================================
