# Guía de Contribución - MarketPro GT

¡Gracias por tu interés en contribuir a MarketPro GT! 🎉

## Código de Conducta

Este proyecto sigue un código de conducta. Al participar, se espera que mantengas este código.

## ¿Cómo contribuir?

### Reportar Bugs

1. **Busca primero** si el bug ya fue reportado
2. Si no existe, crea un **nuevo issue**
3. Incluye:
   - Descripción clara del problema
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Screenshots si es aplicable
   - Información del entorno (OS, navegador, versión)

### Sugerir Mejoras

1. Abre un **issue** con la etiqueta "enhancement"
2. Describe claramente la mejora propuesta
3. Explica por qué sería útil para el proyecto

### Pull Requests

1. **Fork** el repositorio
2. Crea una **rama** desde `main`:
   ```bash
   git checkout -b feature/nombre-descriptivo
   # o
   git checkout -b fix/descripcion-del-fix
   ```
3. Realiza tus cambios
4. **Commits** claros y descriptivos:
   ```bash
   git commit -m "feat: agregar selector de cliente en header"
   git commit -m "fix: corregir dropdown de clientes en A/B testing"
   ```
5. **Push** a tu fork:
   ```bash
   git push origin feature/nombre-descriptivo
   ```
6. Abre un **Pull Request**

## Estándares de Código

### TypeScript
- Usa tipos explícitos siempre que sea posible
- Evita `any`, usa tipos específicos
- Documenta interfaces complejas

### React
- Componentes funcionales con hooks
- Props tipadas con interfaces
- Usa `useCallback` y `useMemo` para optimización

### Styling
- Usa Tailwind CSS para estilos
- Componentes de Radix UI para funcionalidad
- Mantén consistencia con el design system

### Estructura de Archivos
```
src/
├── components/
│   ├── ui/           # Componentes base
│   └── feature/      # Componentes específicos
├── pages/            # Páginas de la app
├── lib/              # Utilidades y configuración
└── types/            # Definiciones de tipos
```

## Testing

- Escribe tests para nuevas funcionalidades
- Asegúrate de que todos los tests pasen
- Incluye tests de integración para flujos críticos

## Commit Messages

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato (no afectan funcionalidad)
- `refactor:` Refactoring de código
- `test:` Agregar o corregir tests
- `chore:` Tareas de mantenimiento

**Ejemplos:**
```
feat: agregar autenticación con Supabase
fix: corregir carga de clientes en dashboard
docs: actualizar README con instrucciones de deploy
```

## Proceso de Review

1. Todos los PRs requieren al menos **1 review**
2. Los cambios deben pasar **todos los checks**
3. Se require que los tests pasen
4. El código debe seguir los estándares establecidos

## Configuración del Entorno de Desarrollo

1. **Clona el repo:**
   ```bash
   git clone https://github.com/tu-usuario/marketpro-gt.git
   cd marketpro-gt
   ```

2. **Instala dependencias:**
   ```bash
   pnpm install
   ```

3. **Configura variables de entorno:**
   ```bash
   cp .env.example .env.local
   # Edita .env.local con tus credenciales
   ```

4. **Inicia el servidor de desarrollo:**
   ```bash
   pnpm dev
   ```

## Estructura de Branches

- `main`: Rama principal (producción)
- `develop`: Rama de desarrollo
- `feature/*`: Nuevas funcionalidades
- `fix/*`: Correcciones de bugs
- `release/*`: Preparación de releases

## Release Process

1. Crear rama `release/vX.X.X` desde `develop`
2. Actualizar version en `package.json`
3. Actualizar `CHANGELOG.md`
4. Merge a `main` y tag
5. Merge back a `develop`

## ¿Necesitas Ayuda?

- 📧 Email: dev@marketpro.gt
- 💬 Discord: [MarketPro GT Community](link-discord)
- 📖 Docs: [docs.marketpro.gt](link-docs)

¡Gracias por contribuir! 🚀