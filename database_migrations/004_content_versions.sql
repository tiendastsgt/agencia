-- Migración 004: Sistema de versionado de contenido
-- Fecha: 10 de Septiembre, 2025
-- Descripción: Agrega tabla para versionado de contenido

-- Crear tabla de versiones de contenido
CREATE TABLE IF NOT EXISTS content_versions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content_id UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    content_body TEXT NOT NULL,
    changes_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    
    -- Restricciones
    UNIQUE(content_id, version_number)
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_content_versions_content_id ON content_versions(content_id);
CREATE INDEX IF NOT EXISTS idx_content_versions_created_at ON content_versions(created_at);
CREATE INDEX IF NOT EXISTS idx_content_versions_version_number ON content_versions(content_id, version_number);

-- Habilitar RLS (Row Level Security)
ALTER TABLE content_versions ENABLE ROW LEVEL SECURITY;

-- Política RLS: Los usuarios solo pueden ver versiones de contenido de sus clientes
CREATE POLICY "Users can view content versions of their clients" ON content_versions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM content c
            JOIN clients cl ON c.client_id = cl.id
            WHERE c.id = content_versions.content_id
            AND (
                cl.user_id = auth.uid()
                OR cl.user_id IS NULL  -- Para contenido demo
            )
        )
    );

-- Política RLS: Los usuarios solo pueden crear versiones de contenido de sus clientes
CREATE POLICY "Users can create content versions of their clients" ON content_versions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM content c
            JOIN clients cl ON c.client_id = cl.id
            WHERE c.id = content_versions.content_id
            AND (
                cl.user_id = auth.uid()
                OR cl.user_id IS NULL  -- Para contenido demo
            )
        )
    );

-- Política RLS: Los usuarios solo pueden actualizar versiones de contenido de sus clientes
CREATE POLICY "Users can update content versions of their clients" ON content_versions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM content c
            JOIN clients cl ON c.client_id = cl.id
            WHERE c.id = content_versions.content_id
            AND (
                cl.user_id = auth.uid()
                OR cl.user_id IS NULL  -- Para contenido demo
            )
        )
    );

-- Política RLS: Los usuarios solo pueden eliminar versiones de contenido de sus clientes
CREATE POLICY "Users can delete content versions of their clients" ON content_versions
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM content c
            JOIN clients cl ON c.client_id = cl.id
            WHERE c.id = content_versions.content_id
            AND (
                cl.user_id = auth.uid()
                OR cl.user_id IS NULL  -- Para contenido demo
            )
        )
    );

-- Función para obtener la última versión de un contenido
CREATE OR REPLACE FUNCTION get_latest_content_version(content_uuid UUID)
RETURNS TABLE (
    id UUID,
    content_id UUID,
    version_number INTEGER,
    content_body TEXT,
    changes_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    created_by UUID
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cv.id,
        cv.content_id,
        cv.version_number,
        cv.content_body,
        cv.changes_summary,
        cv.created_at,
        cv.created_by
    FROM content_versions cv
    WHERE cv.content_id = content_uuid
    ORDER BY cv.version_number DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener el historial de versiones de un contenido
CREATE OR REPLACE FUNCTION get_content_version_history(content_uuid UUID)
RETURNS TABLE (
    id UUID,
    content_id UUID,
    version_number INTEGER,
    content_body TEXT,
    changes_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    created_by UUID
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cv.id,
        cv.content_id,
        cv.version_number,
        cv.content_body,
        cv.changes_summary,
        cv.created_at,
        cv.created_by
    FROM content_versions cv
    WHERE cv.content_id = content_uuid
    ORDER BY cv.version_number DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para crear una nueva versión de contenido
CREATE OR REPLACE FUNCTION create_content_version(
    p_content_id UUID,
    p_content_body TEXT,
    p_changes_summary TEXT DEFAULT NULL,
    p_created_by UUID DEFAULT auth.uid()
)
RETURNS UUID AS $$
DECLARE
    v_version_number INTEGER;
    v_new_version_id UUID;
BEGIN
    -- Obtener el siguiente número de versión
    SELECT COALESCE(MAX(version_number), 0) + 1
    INTO v_version_number
    FROM content_versions
    WHERE content_id = p_content_id;
    
    -- Crear la nueva versión
    INSERT INTO content_versions (
        content_id,
        version_number,
        content_body,
        changes_summary,
        created_by
    ) VALUES (
        p_content_id,
        v_version_number,
        p_content_body,
        p_changes_summary,
        p_created_by
    ) RETURNING id INTO v_new_version_id;
    
    RETURN v_new_version_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentarios para documentación
COMMENT ON TABLE content_versions IS 'Versiones de contenido para control de cambios';
COMMENT ON COLUMN content_versions.content_id IS 'ID del contenido original';
COMMENT ON COLUMN content_versions.version_number IS 'Número de versión (incremental)';
COMMENT ON COLUMN content_versions.content_body IS 'Cuerpo del contenido en esta versión';
COMMENT ON COLUMN content_versions.changes_summary IS 'Resumen de cambios en esta versión';
COMMENT ON COLUMN content_versions.created_by IS 'Usuario que creó esta versión';

COMMENT ON FUNCTION get_latest_content_version(UUID) IS 'Obtiene la última versión de un contenido';
COMMENT ON FUNCTION get_content_version_history(UUID) IS 'Obtiene el historial completo de versiones de un contenido';
COMMENT ON FUNCTION create_content_version(UUID, TEXT, TEXT, UUID) IS 'Crea una nueva versión de contenido';
