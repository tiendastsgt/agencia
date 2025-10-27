-- Asegurar que api_credentials.user_id se asigne automáticamente al usuario autenticado

-- Función que asigna user_id = auth.uid() si no viene en el INSERT
CREATE OR REPLACE FUNCTION set_api_credentials_user_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id = auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger BEFORE INSERT
DROP TRIGGER IF EXISTS trg_set_api_credentials_user_id ON api_credentials;
CREATE TRIGGER trg_set_api_credentials_user_id
  BEFORE INSERT ON api_credentials
  FOR EACH ROW
  EXECUTE FUNCTION set_api_credentials_user_id();




