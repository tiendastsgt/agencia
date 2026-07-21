-- Script para arreglar columnas faltantes en la base de datos
-- Ejecutar este script en el SQL Editor de Supabase

-- 1. Agregar columna created_by a la tabla content
ALTER TABLE content 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- 2. Agregar columna created_by a la tabla strategies
ALTER TABLE strategies 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- 3. Agregar columna created_by a la tabla market_research
ALTER TABLE market_research 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- 4. Agregar columna campaign_type a la tabla campaigns
ALTER TABLE campaigns 
ADD COLUMN IF NOT EXISTS campaign_type VARCHAR(50) DEFAULT 'general';

-- 5. Crear función encrypt_credential
CREATE OR REPLACE FUNCTION encrypt_credential(credential_value TEXT)
RETURNS TEXT AS $$
BEGIN
  -- En un entorno real, aquí usarías pgcrypto para encriptar
  -- Por ahora, devolvemos el valor tal como está
  RETURN credential_value;
END;
$$ LANGUAGE plpgsql;

-- 6. Crear función decrypt_credential
CREATE OR REPLACE FUNCTION decrypt_credential(encrypted_value TEXT)
RETURNS TEXT AS $$
BEGIN
  -- En un entorno real, aquí desencriptarías el valor
  -- Por ahora, devolvemos el valor tal como está
  RETURN encrypted_value;
END;
$$ LANGUAGE plpgsql;

-- 7. Actualizar políticas RLS para las nuevas columnas
-- Para content
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Users can view their own content" ON content;
DROP POLICY IF EXISTS "Users can insert their own content" ON content;
DROP POLICY IF EXISTS "Users can update their own content" ON content;

CREATE POLICY "Users can view their own content" ON content
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can insert their own content" ON content
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own content" ON content
  FOR UPDATE USING (auth.uid() = created_by);

-- Para strategies
ALTER TABLE strategies ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Users can view their own strategies" ON strategies;
DROP POLICY IF EXISTS "Users can insert their own strategies" ON strategies;
DROP POLICY IF EXISTS "Users can update their own strategies" ON strategies;

CREATE POLICY "Users can view their own strategies" ON strategies
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can insert their own strategies" ON strategies
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own strategies" ON strategies
  FOR UPDATE USING (auth.uid() = created_by);

-- Para market_research
ALTER TABLE market_research ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Users can view their own research" ON market_research;
DROP POLICY IF EXISTS "Users can insert their own research" ON market_research;
DROP POLICY IF EXISTS "Users can update their own research" ON market_research;

CREATE POLICY "Users can view their own research" ON market_research
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can insert their own research" ON market_research
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own research" ON market_research
  FOR UPDATE USING (auth.uid() = created_by);

-- 8. Actualizar registros existentes con el usuario actual (opcional)
-- Solo ejecutar si quieres asignar registros existentes al usuario actual
-- UPDATE content SET created_by = auth.uid() WHERE created_by IS NULL;
-- UPDATE strategies SET created_by = auth.uid() WHERE created_by IS NULL;
-- UPDATE market_research SET created_by = auth.uid() WHERE created_by IS NULL;
