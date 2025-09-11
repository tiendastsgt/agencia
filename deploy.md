# 🚀 Guía de Despliegue - MarketPro GT

## 📋 Estado del Proyecto

✅ **Build completado exitosamente**
- TypeScript compilado sin errores
- Vite build generado en `/dist`
- Archivos de configuración creados

## 🌐 Opciones de Despliegue

### 1. **Vercel (Recomendado)**

#### Pasos para desplegar en Vercel:

1. **Instalar Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login en Vercel:**
   ```bash
   vercel login
   ```

3. **Desplegar:**
   ```bash
   vercel --prod
   ```

4. **Configurar variables de entorno en Vercel Dashboard:**
   - `VITE_SUPABASE_URL`: Tu URL de Supabase
   - `VITE_SUPABASE_ANON_KEY`: Tu clave anónima de Supabase
   - `VITE_OPENAI_API_KEY`: Tu clave de OpenAI (opcional)

#### Configuración automática:
- ✅ `vercel.json` configurado
- ✅ Build command: `pnpm build`
- ✅ Output directory: `dist`
- ✅ Framework: Vite

### 2. **Netlify**

#### Pasos para desplegar en Netlify:

1. **Instalar Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login en Netlify:**
   ```bash
   netlify login
   ```

3. **Desplegar:**
   ```bash
   netlify deploy --prod --dir=dist
   ```

4. **Configurar variables de entorno en Netlify Dashboard:**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_OPENAI_API_KEY`

#### Configuración automática:
- ✅ `netlify.toml` configurado
- ✅ Build command: `pnpm build`
- ✅ Publish directory: `dist`

### 3. **GitHub Pages**

#### Pasos para desplegar en GitHub Pages:

1. **Instalar gh-pages:**
   ```bash
   pnpm add -D gh-pages
   ```

2. **Agregar script al package.json:**
   ```json
   "scripts": {
     "deploy": "gh-pages -d dist"
   }
   ```

3. **Desplegar:**
   ```bash
   pnpm run deploy
   ```

### 4. **Firebase Hosting**

#### Pasos para desplegar en Firebase:

1. **Instalar Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login en Firebase:**
   ```bash
   firebase login
   ```

3. **Inicializar proyecto:**
   ```bash
   firebase init hosting
   ```

4. **Configurar firebase.json:**
   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

5. **Desplegar:**
   ```bash
   firebase deploy
   ```

## ⚙️ Configuración de Variables de Entorno

### Variables Requeridas:

```env
# Supabase (Requerido)
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_aqui

# OpenAI (Opcional - para generación de contenido)
VITE_OPENAI_API_KEY=sk-tu_clave_openai_aqui
```

### Cómo obtener las credenciales:

1. **Supabase:**
   - Ve a [supabase.com](https://supabase.com)
   - Crea un proyecto
   - Ve a Settings > API
   - Copia URL y anon key

2. **OpenAI:**
   - Ve a [platform.openai.com](https://platform.openai.com)
   - Crea una API key
   - Copia la clave

## 🔧 Comandos de Despliegue Rápido

### Vercel (Más rápido):
```bash
npx vercel --prod
```

### Netlify:
```bash
npx netlify-cli deploy --prod --dir=dist
```

### GitHub Pages:
```bash
pnpm build && pnpm run deploy
```

## 📊 Estadísticas del Build

- **Tamaño total:** ~1.7MB (309KB gzipped)
- **CSS:** 33KB (6.35KB gzipped)
- **JavaScript:** 1.68MB (309KB gzipped)
- **Tiempo de build:** ~47 segundos

## ⚠️ Notas Importantes

1. **Variables de entorno:** Asegúrate de configurar todas las variables necesarias en la plataforma de despliegue.

2. **Supabase:** El proyecto requiere una base de datos Supabase configurada con las tablas necesarias.

3. **Dominio personalizado:** Puedes configurar un dominio personalizado en cualquier plataforma.

4. **SSL:** Todas las plataformas mencionadas incluyen SSL automático.

## 🆘 Solución de Problemas

### Error de build:
```bash
pnpm clean && pnpm install && pnpm build
```

### Error de variables de entorno:
- Verifica que todas las variables estén configuradas
- Asegúrate de que no tengan espacios extra
- Reinicia el despliegue después de cambiar variables

### Error de Supabase:
- Verifica que la URL y la clave sean correctas
- Asegúrate de que las tablas estén creadas
- Revisa las políticas RLS

---

**¡Tu aplicación MarketPro GT está lista para desplegar! 🚀**
