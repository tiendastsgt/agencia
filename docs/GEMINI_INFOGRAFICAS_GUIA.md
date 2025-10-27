# 🤖 Guía de Uso - Gemini para Infografías

**Fecha:** 15 de Septiembre, 2025  
**Versión:** v2.4.0  
**Estado:** ✅ **GEMINI INTEGRADO Y FUNCIONAL**

---

## 🎯 **RESUMEN**

**Sí, Gemini está completamente integrado** como proveedor de IA en el sistema de infografías de MarketPro GT. Es la opción **recomendada** para generar infografías de cursos y contenido educativo.

### ✅ **GEMINI DISPONIBLE EN:**

1. **Sistema de Infografías** - Como proveedor principal
2. **Generación de Imágenes** - API completa implementada
3. **Servicio Unificado** - Integrado con otros proveedores
4. **Página Dedicada** - `/gemini-image` para uso directo

---

## 🚀 **CÓMO USAR GEMINI PARA INFOGRAFÍAS**

### **Paso 1: Acceder al Sistema**
1. Ir a `/infographics` en la aplicación
2. Seleccionar pestaña **"Infografías de Cursos"**
3. Cargar el JSON del curso

### **Paso 2: Seleccionar Gemini**
1. En el panel de generación, ver el selector de proveedores
2. **Gemini aparece como opción por defecto** (recomendado)
3. Opciones disponibles:
   - 🤖 **Google Gemini (Recomendado)**
   - 🎨 DALL-E 3 (OpenAI)
   - ⚡ Stability AI

### **Paso 3: Generar Infografía**
1. Hacer clic en **"Generar con GEMINI"**
2. El sistema usa la API de Gemini 2.5 Flash Image
3. Descargar la imagen resultante

---

## 🎨 **VENTAJAS DE GEMINI PARA INFOGRAFÍAS**

### **✅ Optimizado para Contenido Educativo**
- **Prompts especializados** para infografías educativas
- **Comprensión superior** de contenido académico
- **Generación coherente** de elementos visuales

### **✅ Calidad Profesional**
- **Modelo Gemini 2.5 Flash Image** (Nano Banana)
- **Alta resolución** y calidad de imagen
- **Diseño moderno** y profesional

### **✅ Integración Completa**
- **API nativa** implementada
- **Prompts optimizados** automáticamente
- **Manejo de errores** robusto

---

## 🔧 **CONFIGURACIÓN DE GEMINI**

### **API Key Requerida**
Para usar Gemini, necesitas configurar tu API key:

1. **Obtener API Key:**
   - Ir a [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Crear una nueva API key
   - Copiar la clave generada

2. **Configurar en Supabase:**
   ```sql
   INSERT INTO api_connections (provider, api_key, is_active)
   VALUES ('gemini', 'tu_gemini_api_key_aqui', true);
   ```

3. **Verificar Configuración:**
   - Ir a `/api-connections` en la aplicación
   - Verificar que Gemini aparece como "Activo"

---

## 📊 **ESPECIFICACIONES TÉCNICAS**

### **Modelo Utilizado**
- **Gemini 2.5 Flash Image** (Nano Banana)
- **Generación de imágenes** de alta calidad
- **Optimizado para prompts** en español

### **Parámetros Soportados**
```typescript
{
  prompt: string,           // Prompt optimizado automáticamente
  style: 'photographic' | 'artistic' | 'minimalist' | 'vintage' | 'modern' | 'abstract',
  aspect_ratio: '1:1' | '16:9' | '9:16' | '4:3' | '3:4',
  quality: 'high',          // Siempre alta calidad
  safety_filter: boolean    // Filtro de seguridad opcional
}
```

### **Formatos de Salida**
- **Resolución:** Hasta 2048x2048 píxeles
- **Formato:** PNG, JPEG
- **Calidad:** Alta definición
- **Tiempo de generación:** 5-15 segundos

---

## 🎯 **CASOS DE USO ESPECÍFICOS**

### **1. Infografías de Cursos (Recomendado)**
- **Apicultura Urbana** ✅
- **Marketing Digital**
- **Programación**
- **Diseño Gráfico**

### **2. Contenido Educativo**
- **Presentaciones académicas**
- **Material de estudio**
- **Guías de aprendizaje**
- **Tutoriales visuales**

### **3. Marketing Educativo**
- **Promoción de cursos**
- **Material de ventas**
- **Contenido para redes sociales**
- **Presentaciones comerciales**

---

## 🔄 **FLUJO DE TRABAJO CON GEMINI**

### **1. Procesamiento Automático**
```
JSON del Curso → Conversión a Infografía → Prompt Optimizado → Gemini API → Imagen Final
```

### **2. Optimización de Prompts**
El sistema automáticamente:
- **Analiza el contenido** del curso
- **Genera prompts específicos** para Gemini
- **Aplica mejores prácticas** de prompt engineering
- **Optimiza para infografías** educativas

### **3. Generación de Imagen**
- **Llamada a Gemini API** con prompt optimizado
- **Procesamiento** de la solicitud
- **Generación** de imagen de alta calidad
- **Retorno** de URL de descarga

---

## 📋 **EJEMPLO DE USO COMPLETO**

### **JSON de Entrada (Apicultura Urbana)**
```json
{
  "nombre": "Apicultura Urbana: Produce tu Propia Miel de Forma Sostenible",
  "objetivos": [
    "Iniciarse en la apicultura de forma segura y responsable",
    "Contribuir a la conservación de polinizadores"
  ],
  "duración": "6 semanas (12 sesiones de 2 horas)",
  "créditos": 3
}
```

### **Prompt Generado para Gemini**
```
Create a professional modern infographic titled 'Apicultura Urbana' with subtitle 'Produce tu Propia Miel de Forma Sostenible'. The infographic should have a vertical layout with 7 main sections. Section 1: header section with title and subtitle. Section 2: statistics section with 4 key metrics showing duration (6 weeks), sessions (12), hours per session (2), and credits (3). Section 3: text section describing target audience as young adults and parents interested in home self-sufficiency. Section 4: list section with 4 objectives including safe beekeeping initiation, pollinator conservation, family honey production, and additional income generation. Section 5: timeline section with 4 modules covering fundamentals, installation and management, sustainable production, and commercialization over 6 weeks. Section 6: text section describing the 3-hour pilot workshop. Section 7: footer with course route information. Use a modern design style with primary color #10B981 (nature green) and secondary color #059669. The background should be #FFFFFF with #1F2937 text. Include professional typography using Inter font family. Make it visually appealing, modern, and suitable for educational content. Ensure all text is readable and the layout is clean and organized. High quality, professional design, suitable for print and digital use. Clean typography, proper spacing, and visual hierarchy. Include bee and honey-related visual elements. Modern, engaging, and educational design.
```

### **Resultado Esperado**
- **Infografía vertical** (1024x1792)
- **Tema verde naturaleza** (#10B981, #059669)
- **6 secciones organizadas** con información del curso
- **Iconos temáticos** (🐝, 🍯, 🌱)
- **Timeline de módulos** del curso
- **Calidad profesional** lista para uso

---

## 🆚 **COMPARACIÓN DE PROVEEDORES**

| Característica | Gemini | DALL-E 3 | Stability AI |
|----------------|--------|----------|--------------|
| **Contenido Educativo** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Velocidad** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Calidad** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Costo** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Prompts en Español** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |

### **Recomendación:**
- **Gemini** para infografías educativas y cursos
- **DALL-E 3** para contenido creativo y artístico
- **Stability AI** para generación masiva y rápida

---

## 🚀 **PRÓXIMOS PASOS**

### **Para Usar Gemini Inmediatamente**
1. **Configurar API key** de Gemini en Supabase
2. **Probar con el JSON** de apicultura urbana
3. **Generar primera infografía** con Gemini
4. **Descargar y usar** el resultado

### **Para Optimizar Resultados**
1. **Experimentar con diferentes estilos** (photographic, artistic, modern)
2. **Ajustar prompts** según el tipo de curso
3. **Crear templates** específicos para diferentes categorías
4. **Automatizar generación** masiva de infografías

---

## 🎉 **CONCLUSIÓN**

**Gemini está completamente integrado y es la opción recomendada** para generar infografías de cursos en MarketPro GT. Ofrece:

✅ **Integración completa** con el sistema  
✅ **Optimización automática** de prompts  
✅ **Calidad profesional** para contenido educativo  
✅ **Fácil configuración** y uso  
✅ **Resultados consistentes** y de alta calidad  

**¡Gemini está listo para generar infografías profesionales de cualquier curso!**

---

**MarketPro GT v2.4.0** - Sistema de Marketing Digital con IA  
*Gemini integrado para infografías educativas*  
*15 de Septiembre, 2025*




