# 🚀 Instrucciones para Migración v2.2.0 - MarketPro GT

## 📋 PASOS PARA EJECUTAR LA MIGRACIÓN

### 1. **Acceder a Supabase**
- Ve a tu proyecto de Supabase: https://supabase.com/dashboard
- Selecciona tu proyecto MarketPro GT

### 2. **Abrir SQL Editor**
- En el menú lateral, haz clic en **"SQL Editor"**
- Haz clic en **"New query"** para crear una nueva consulta

### 3. **Ejecutar la Migración**
- Copia todo el contenido del archivo: `database_migrations/006_social_media_ai_features.sql`
- Pégalo en el editor SQL
- Haz clic en **"Run"** para ejecutar

### 4. **Verificar la Ejecución**
- Deberías ver el mensaje: `"Migración 006 completada exitosamente"`
- Verifica que no haya errores en la consola

---

## ✅ TABLAS QUE SE CREARÁN

La migración creará **10 nuevas tablas**:

1. **`sentiment_analysis`** - Análisis de sentimientos de comentarios
2. **`generated_images`** - Imágenes generadas con IA
3. **`social_media_posts`** - Posts publicados en redes sociales
4. **`trending_topics`** - Temas trending por plataforma
5. **`custom_reports`** - Reportes personalizados
6. **`custom_dashboards`** - Dashboards personalizables
7. **`intelligent_alerts`** - Alertas inteligentes
8. **`social_media_metrics`** - Métricas de redes sociales
9. **`competitor_analysis`** - Análisis de competencia
10. **`trend_predictions`** - Predicciones de tendencias

---

## 🔒 CARACTERÍSTICAS DE SEGURIDAD

- ✅ **Row Level Security (RLS)** habilitado en todas las tablas
- ✅ **Políticas de acceso** configuradas por usuario
- ✅ **Índices optimizados** para consultas rápidas
- ✅ **Triggers automáticos** para campos updated_at
- ✅ **Validaciones de datos** con CHECK constraints

---

## ⚠️ IMPORTANTE

- **Esta migración es segura** y no afecta datos existentes
- **Se puede ejecutar múltiples veces** sin problemas
- **Las tablas se crean solo si no existen** (IF NOT EXISTS)
- **Incluye datos de ejemplo** para testing

---

## 🎉 DESPUÉS DE LA MIGRACIÓN

Una vez completada la migración, tendrás acceso a:

- 🔗 **Gestión de Redes Sociales** (`/social-media`)
- 🧠 **Análisis de Sentimientos** (`/sentiment-analysis`)
- 🎨 **Generador de Imágenes** (`/image-generator`)

---

## 📞 SOPORTE

Si encuentras algún error durante la migración:

1. **Verifica la consola** de Supabase para mensajes de error
2. **Revisa los permisos** de tu usuario
3. **Contacta al equipo** de desarrollo

---

**MarketPro GT v2.2.0** - Migración de Base de Datos  
*Desarrollado para empresas guatemaltecas 🇬🇹*
