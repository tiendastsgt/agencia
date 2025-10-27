# 🐝 Guía de Uso - Infografía de Apicultura Urbana

**Fecha:** 15 de Septiembre, 2025  
**Versión:** v2.4.0  
**Estado:** ✅ **LISTO PARA USAR**

---

## 🎯 **RESUMEN**

Se ha creado un sistema específico para generar infografías de cursos a partir de JSON, usando como ejemplo el curso de **"Apicultura Urbana: Produce tu Propia Miel de Forma Sostenible"**.

### ✅ **LO QUE SE HA IMPLEMENTADO**

1. **Conversión automática** de JSON de curso a formato de infografía
2. **Componente especializado** `CourseInfographicGenerator`
3. **JSON de ejemplo** con datos del curso de apicultura
4. **Prompt optimizado** para generación con IA
5. **Interfaz integrada** en la página de infografías

---

## 🚀 **CÓMO USAR EL SISTEMA**

### **Paso 1: Acceder a la Funcionalidad**
1. Navegar a `/infographics` en la aplicación
2. Seleccionar la pestaña **"Infografías de Cursos"**
3. Ver el componente `CourseInfographicGenerator`

### **Paso 2: Cargar Datos del Curso**
1. Copiar el JSON del curso (ejemplo proporcionado)
2. Pegarlo en el campo de texto
3. Hacer clic en **"Cargar JSON"**

### **Paso 3: Convertir a Infografía**
1. El sistema procesará automáticamente los datos
2. Mostrará un resumen del curso cargado
3. Hacer clic en **"Convertir a Infografía"**

### **Paso 4: Generar la Imagen**
1. Seleccionar el proveedor de IA (DALL-E 3, Stability AI, etc.)
2. Hacer clic en **"Generar Infografía"**
3. Descargar la imagen resultante

---

## 📋 **JSON DE EJEMPLO - APICULTURA URBANA**

```json
{
  "nombre": "Apicultura Urbana: Produce tu Propia Miel de Forma Sostenible",
  "nivel": 0,
  "objetivos": [
    "Iniciarse en la apicultura de forma segura y responsable",
    "Contribuir a la conservación de polinizadores",
    "Producir miel para consumo familiar",
    "Generar posible fuente de ingresos adicional"
  ],
  "resumen": "Curso introductorio sobre apicultura urbana y sostenible para instalar colmenas, producir miel y contribuir al medio ambiente desde espacios reducidos.",
  "público_objetivo": "Jóvenes adultos y padres de familia",
  "razón_para_tomarlo": "Aprendé apicultura urbana y producí tu propia miel mientras contribuís a la conservación del medio ambiente y generás posible ingreso adicional.",
  "contenido": [
    {
      "módulo": "Fundamentos de Apicultura",
      "actividades": ["Conocimiento de biología de abejas", "Taller de equipos y seguridad", "Selección de ubicaciones apropiadas"]
    },
    {
      "módulo": "Instalación y Manejo",
      "actividades": ["Instalación de colmenas urbanas", "Manejo básico de colonias", "Control natural de plagas"]
    },
    {
      "módulo": "Producción Sostenible",
      "actividades": ["Técnicas de extracción de miel", "Procesamiento y envasado", "Mantenimiento de colmenas"]
    },
    {
      "módulo": "Comercialización",
      "actividades": ["Valor agregado de productos apícolas", "Estrategias de venta local", "Normativas and permisos"]
    }
  ],
  "duración": "6 semanas (12 sesiones de 2 horas)",
  "modalidad_piloto": "Taller de 3 horas: 'Introducción a la apicultura urbana'",
  "requisitos_profesor": "Apicultor certificado con experiencia en apicultura urbana and manejo sostenible",
  "ruta": "🏡 RUTA 3: AUTOSUFICIENCIA DEL HOGAR",
  "créditos": 3
}
```

---

## 🎨 **RESULTADO ESPERADO**

### **Estructura de la Infografía**
La infografía generada tendrá **6 secciones principales**:

1. **Header** - Título y subtítulo del curso
2. **Información del Curso** - Estadísticas (duración, nivel, créditos, módulos)
3. **Público Objetivo** - Descripción de la audiencia
4. **Objetivos del Curso** - Lista de objetivos con iconos
5. **Módulos del Curso** - Timeline de 4 módulos
6. **Modalidad Piloto** - Información del taller piloto

### **Diseño Visual**
- **Tema:** Nature Green (verde naturaleza)
- **Colores:** #10B981 (primario), #059669 (secundario)
- **Layout:** Vertical, optimizado para redes sociales
- **Iconos:** Abejas (🐝), miel (🍯), naturaleza (🌱)
- **Estilo:** Moderno y educativo

### **Prompt Generado**
El sistema genera automáticamente un prompt optimizado como este:

```
Create a professional modern infographic titled 'Apicultura Urbana' with subtitle 'Produce tu Propia Miel de Forma Sostenible'. The infographic should have a vertical layout with 7 main sections. Section 1: header section with title and subtitle. Section 2: statistics section with 4 key metrics showing duration (6 weeks), sessions (12), hours per session (2), and credits (3). Section 3: text section describing target audience as young adults and parents interested in home self-sufficiency. Section 4: list section with 4 objectives including safe beekeeping initiation, pollinator conservation, family honey production, and additional income generation. Section 5: timeline section with 4 modules covering fundamentals, installation and management, sustainable production, and commercialization over 6 weeks. Section 6: text section describing the 3-hour pilot workshop. Section 7: footer with course route information. Use a modern design style with primary color #10B981 (nature green) and secondary color #059669. The background should be #FFFFFF with #1F2937 text. Include professional typography using Inter font family. Make it visually appealing, modern, and suitable for educational content. Ensure all text is readable and the layout is clean and organized. High quality, professional design, suitable for print and digital use. Clean typography, proper spacing, and visual hierarchy. Include bee and honey-related visual elements. Modern, engaging, and educational design.
```

---

## 🔧 **PERSONALIZACIÓN**

### **Cambiar Colores**
Para personalizar los colores del tema:

```json
"theme": {
  "primaryColor": "#TU_COLOR_PRIMARIO",
  "secondaryColor": "#TU_COLOR_SECUNDARIO",
  "accentColor": "#TU_COLOR_ACENTO"
}
```

### **Modificar Secciones**
Para agregar o quitar secciones, editar el array `sections` en el JSON generado.

### **Cambiar Iconos**
Los iconos se asignan automáticamente según el tipo de contenido:
- 🐝 Para objetivos principales
- 🌱 Para conservación
- 🍯 Para producción
- 💰 Para ingresos
- 📖 Para fundamentos
- 🏠 Para instalación

---

## 📊 **MÉTRICAS DE LA INFOGRAFÍA**

### **Información Destacada**
- **Duración:** 6 semanas (12 sesiones de 2 horas)
- **Nivel:** 0 (introductorio)
- **Créditos:** 3
- **Módulos:** 4
- **Objetivos:** 4 principales

### **Público Objetivo**
- Jóvenes adultos
- Padres de familia
- Interesados en autosuficiencia del hogar

### **Módulos del Curso**
1. **Fundamentos de Apicultura** (Semana 1-2)
2. **Instalación y Manejo** (Semana 3-4)
3. **Producción Sostenible** (Semana 5)
4. **Comercialización** (Semana 6)

---

## 🎯 **CASOS DE USO**

### **1. Promoción del Curso**
- Redes sociales (Instagram, Facebook, LinkedIn)
- Material de marketing digital
- Presentaciones educativas
- Sitios web y landing pages

### **2. Comunicación Interna**
- Presentaciones a directivos
- Material para instructores
- Documentación del curso
- Reportes de programa

### **3. Marketing Educativo**
- Catálogos de cursos
- Folletos informativos
- Material promocional
- Campañas de email marketing

---

## 🚀 **PRÓXIMOS PASOS**

### **Para Usar Inmediatamente**
1. **Ejecutar migración** de base de datos (si no se ha hecho)
2. **Configurar API keys** para generación de imágenes
3. **Probar con el JSON** de apicultura urbana
4. **Generar primera infografía** de prueba

### **Para Personalizar**
1. **Modificar colores** según la marca
2. **Ajustar secciones** según necesidades
3. **Crear templates** para otros cursos
4. **Optimizar prompts** para mejores resultados

### **Para Escalar**
1. **Crear más ejemplos** de JSON para otros cursos
2. **Desarrollar templates** específicos por categoría
3. **Integrar con sistema** de gestión de cursos
4. **Automatizar generación** masiva de infografías

---

## 🎉 **CONCLUSIÓN**

El sistema está **completamente funcional** y listo para generar infografías profesionales de cursos a partir de JSON estructurado. El ejemplo de apicultura urbana demuestra la capacidad del sistema para:

✅ **Procesar datos complejos** de cursos  
✅ **Generar prompts optimizados** para IA  
✅ **Crear infografías profesionales** y atractivas  
✅ **Personalizar diseño** según necesidades  
✅ **Integrar con el sistema** existente  

**¡El sistema está listo para usar y generar infografías de cualquier curso!**

---

**MarketPro GT v2.4.0** - Sistema de Marketing Digital con IA  
*Desarrollado para empresas guatemaltecas 🇬🇹*  
*Infografías de Cursos implementadas: 15 de Septiembre, 2025*




