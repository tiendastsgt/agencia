# Guía de Contribución - MarketPro GT

¡Gracias por tu interés en contribuir a MarketPro GT! Esta guía te ayudará a entender cómo contribuir de manera efectiva al proyecto.

## 🚀 Cómo Contribuir

### 1. Fork y Clone
```bash
# Fork el repositorio en GitHub
# Luego clona tu fork
git clone https://github.com/tu-usuario/marketpro-gt.git
cd marketpro-gt

# Agrega el repositorio original como upstream
git remote add upstream https://github.com/original/marketpro-gt.git
```

### 2. Configurar el Entorno
```bash
# Instalar dependencias
pnpm install

# Copiar variables de entorno
cp env.example .env.local

# Configurar variables de entorno (ver README.md)
```

### 3. Crear una Rama
```bash
# Crear rama para tu feature
git checkout -b feature/nombre-de-tu-feature

# O para bugfix
git checkout -b fix/descripcion-del-bug
```

## 📋 Tipos de Contribuciones

### 🐛 Reportar Bugs
1. Verifica que el bug no haya sido reportado
2. Crea un issue con:
   - Descripción clara del problema
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Screenshots si aplica
   - Información del entorno

### ✨ Proponer Features
1. Crea un issue con:
   - Descripción detallada de la feature
   - Casos de uso
   - Beneficios para los usuarios
   - Consideraciones técnicas

### 🔧 Contribuir Código
1. Asegúrate de que el issue existe
2. Asigna el issue a ti mismo
3. Desarrolla la feature/fix
4. Sigue las convenciones de código
5. Escribe tests
6. Actualiza documentación

## 🎯 Estándares de Código

### TypeScript
```typescript
// ✅ CORRECTO
interface User {
  id: string;
  name: string;
  email: string;
}

const getUser = async (id: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

// ❌ INCORRECTO
const getUser = async (id) => {
  const data = await supabase.from('users').select('*').eq('id', id);
  return data;
};
```

### React Components
```typescript
// ✅ CORRECTO
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  onClick,
  disabled = false
}) => {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// ❌ INCORRECTO
export const Button = ({ children, onClick }) => {
  return <button onClick={onClick}>{children}</button>;
};
```

### Edge Functions
```typescript
// ✅ CORRECTO
Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { param1, param2 } = await req.json();
    
    if (!param1 || !param2) {
      throw new Error('Parámetros requeridos faltantes');
    }

    // Lógica de la función
    const result = await processData(param1, param2);

    return new Response(
      JSON.stringify({ data: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error en función:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// ❌ INCORRECTO
Deno.serve(async (req) => {
  const data = await req.json();
  const result = await processData(data);
  return new Response(JSON.stringify(result));
});
```

## 🧪 Testing

### Tests Unitarios
```typescript
// ✅ CORRECTO
import { describe, it, expect } from 'vitest';
import { formatCurrency } from '@/lib/utils';

describe('formatCurrency', () => {
  it('should format currency correctly', () => {
    expect(formatCurrency(1000)).toBe('Q1,000.00');
    expect(formatCurrency(0)).toBe('Q0.00');
    expect(formatCurrency(1234.56)).toBe('Q1,234.56');
  });

  it('should handle invalid input', () => {
    expect(() => formatCurrency('invalid')).toThrow();
    expect(() => formatCurrency(null)).toThrow();
  });
});
```

### Tests de Integración
```typescript
// ✅ CORRECTO
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';

describe('Content Generation API', () => {
  let supabase: any;

  beforeAll(() => {
    supabase = createClient(
      process.env.VITE_SUPABASE_URL!,
      process.env.VITE_SUPABASE_ANON_KEY!
    );
  });

  it('should generate content successfully', async () => {
    const { data, error } = await supabase.functions.invoke('generate-content', {
      body: {
        client_id: 'test-client-id',
        type: 'post',
        platform: 'facebook',
        topic: 'test topic'
      }
    });

    expect(error).toBeNull();
    expect(data).toHaveProperty('data');
    expect(data.data).toHaveProperty('hook');
    expect(data.data).toHaveProperty('story');
    expect(data.data).toHaveProperty('offer');
  });
});
```

## 📝 Documentación

### Comentarios en Código
```typescript
// ✅ CORRECTO
/**
 * Genera contenido para redes sociales usando OpenAI GPT-5-nano
 * @param clientId - ID del cliente
 * @param type - Tipo de contenido (post, strategy, analysis)
 * @param platform - Plataforma objetivo (facebook, instagram, etc.)
 * @param topic - Tema del contenido
 * @returns Promise con el contenido generado
 */
const generateContent = async (
  clientId: string,
  type: 'post' | 'strategy' | 'analysis',
  platform: string,
  topic: string
): Promise<GeneratedContent> => {
  // Implementación...
};

// ❌ INCORRECTO
const generateContent = async (clientId, type, platform, topic) => {
  // código sin documentar
};
```

### README de Componentes
```markdown
# Button Component

Componente de botón reutilizable con múltiples variantes.

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| children | ReactNode | - | Contenido del botón |
| variant | 'primary' \| 'secondary' | 'primary' | Estilo del botón |
| onClick | () => void | - | Función de click |
| disabled | boolean | false | Estado deshabilitado |

## Ejemplo

```tsx
<Button variant="primary" onClick={() => console.log('clicked')}>
  Hacer clic
</Button>
```
```

## 🔄 Proceso de Pull Request

### 1. Preparar el PR
```bash
# Asegúrate de que tu rama esté actualizada
git fetch upstream
git rebase upstream/main

# Ejecuta tests
pnpm test
pnpm lint
pnpm build

# Commit tus cambios
git add .
git commit -m "feat: agregar nueva funcionalidad X"
```

### 2. Crear el PR
- Título descriptivo
- Descripción detallada
- Referencia al issue relacionado
- Screenshots si aplica
- Checklist completado

### 3. Template de PR
```markdown
## Descripción
Breve descripción de los cambios realizados.

## Tipo de cambio
- [ ] Bug fix
- [ ] Nueva feature
- [ ] Breaking change
- [ ] Documentación

## Checklist
- [ ] Código sigue las convenciones del proyecto
- [ ] Tests agregados/actualizados
- [ ] Documentación actualizada
- [ ] No hay warnings de linting
- [ ] Build exitoso

## Screenshots
Si aplica, agregar screenshots de los cambios.

## Issue relacionado
Closes #123
```

## 🏷️ Convenciones de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Tipos de commit
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
style: cambios de formato (espacios, etc.)
refactor: refactorización de código
test: agregar o modificar tests
chore: cambios en build, dependencias, etc.

# Ejemplos
git commit -m "feat: agregar generación de contenido con IA"
git commit -m "fix: corregir error en validación de formulario"
git commit -m "docs: actualizar README con instrucciones de instalación"
```

## 🎯 Roadmap

### Próximas Features
- [ ] Dashboard de analytics avanzado
- [ ] Integración con más plataformas sociales
- [ ] Sistema de plantillas de contenido
- [ ] Automatización de campañas
- [ ] Reportes personalizados

### Mejoras Técnicas
- [ ] Migración a React 19
- [ ] Implementación de PWA
- [ ] Optimización de performance
- [ ] Mejoras en testing
- [ ] Documentación de API

## 🤝 Código de Conducta

### Nuestros Compromisos
- Ambiente inclusivo y acogedor
- Respeto a todas las personas
- Aceptación de críticas constructivas
- Enfoque en el bienestar de la comunidad

### Comportamiento Inaceptable
- Lenguaje o imágenes sexualizadas
- Trolling, comentarios insultantes
- Acoso público o privado
- Publicación de información privada

## 📞 Contacto

- **Issues**: [GitHub Issues](https://github.com/tu-usuario/marketpro-gt/issues)
- **Discusiones**: [GitHub Discussions](https://github.com/tu-usuario/marketpro-gt/discussions)
- **Email**: contributors@marketpro-gt.com

---

**¡Gracias por contribuir a MarketPro GT! 🚀**
