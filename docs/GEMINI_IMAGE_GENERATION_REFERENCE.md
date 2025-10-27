# 📚 Referencia Completa - Generación de Imágenes con Gemini API

**Fuente:** [Google AI for Developers - Generación de imágenes con Gemini](https://ai.google.dev/gemini-api/docs/image-generation?hl=es-419#javascript)  
**Fecha de consulta:** 16 de Septiembre, 2025  
**Versión:** v2.4.0  

---

## 🎯 **RESUMEN EJECUTIVO**

Gemini puede generar y procesar imágenes de forma conversacional usando el modelo **Gemini 2.5 Flash Image (Nano Banana)**. Esta API permite crear, editar y realizar iteraciones en elementos visuales con control sin precedentes.

---

## 🚀 **CAPACIDADES PRINCIPALES**

### **1. Text-to-Image**
- Genera imágenes de alta calidad a partir de descripciones de texto simples o complejas
- Modelo: `gemini-2.5-flash-image-preview`
- **Casos de uso:**
  - Creación de ilustraciones originales
  - Generación de conceptos visuales
  - Diseño de personajes y escenarios
  - Creación de arte abstracto y realista

### **2. Imagen + Imagen a partir de texto (Edición)**
- Proporciona una imagen y usa instrucciones de texto para:
  - Agregar, quitar o modificar elementos
  - Cambiar el estilo o ajustar la clasificación de color
  - Ajustar iluminación y composición
  - Modificar expresiones faciales
  - Cambiar fondos y entornos
- **Casos de uso:**
  - Edición fotográfica conversacional
  - Modificación de diseños existentes
  - Ajustes de estilo artístico
  - Corrección de elementos no deseados

### **3. De varias imágenes a una imagen (Composición y transferencia de estilo)**
- Usa varias imágenes de entrada para:
  - Componer una escena nueva
  - Transferir el estilo de una imagen a otra
  - Combinar elementos de múltiples fuentes
  - Crear collages y composiciones complejas
- **Casos de uso:**
  - Fusión de estilos artísticos
  - Creación de montajes
  - Transferencia de texturas y patrones
  - Composición de escenas complejas

### **4. Refinamiento iterativo**
- Participa en una conversación para refinar progresivamente la imagen
- Realiza pequeños ajustes en varios turnos hasta que quede perfecta
- **Casos de uso:**
  - Perfeccionamiento de detalles
  - Ajustes graduales de composición
  - Iteración en conceptos creativos
  - Refinamiento de estilos específicos

### **5. Renderización de texto de alta fidelidad**
- Genera con precisión imágenes que contienen texto legible y bien ubicado
- Ideal para logotipos, diagramas y pósteres
- **Casos de uso:**
  - Diseño de logotipos y marcas
  - Creación de infografías
  - Diseño de pósteres y carteles
  - Generación de diagramas técnicos

---

## 🔧 **CONFIGURACIÓN TÉCNICA**

### **Endpoint Base**
```
https://generativelanguage.googleapis.com/v1beta
```

### **Modelos Disponibles**

#### **Gemini 2.5 Flash Image (Nano Banana)**
- **Modelo:** `gemini-2.5-flash-image-preview`
- **Tipo:** Generación de imágenes conversacional
- **Características:**
  - Edición sin máscaras
  - Refinamiento iterativo
  - Comprensión contextual avanzada
  - Flexibilidad conversacional
- **Casos de uso ideales:**
  - Edición conversacional de imágenes
  - Refinamiento iterativo
  - Combinación de elementos creativos
  - Aplicación de estilos específicos

#### **Imagen API (Modelos Especializados)**
- **Modelo:** `imagen-4.0-generate-001` (Recomendado)
- **Modelo:** `imagen-4.0-generate-ultra` (Alta calidad)
- **Tipo:** Generación de imágenes especializada
- **Características:**
  - Fotorrealismo superior
  - Ortografía y tipografía avanzadas
  - Latencia baja
  - Calidad de imagen optimizada
- **Casos de uso ideales:**
  - Imágenes fotorrealistas
  - Logotipos y diseños de productos
  - Ortografía y tipografía avanzadas
  - Estilos artísticos específicos

### **Endpoint Completo**
```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent
```

### **Headers Requeridos**
```
x-goog-api-key: $GEMINI_API_KEY
Content-Type: application/json
```

---

## 📝 **ESTRUCTURA DE PETICIÓN**

### **Petición Básica (Text-to-Image)**
```json
{
  "contents": [{
    "parts": [
      {"text": "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme"}
    ]
  }]
}
```

### **Petición con Imagen (Edición)**
```json
{
  "contents": [{
    "parts": [
      {"text": "Create a picture of my cat eating a nano-banana in a fancy restaurant under the Gemini constellation"},
      {
        "inlineData": {
          "mimeType": "image/png",
          "data": "base64_encoded_image_data"
        }
      }
    ]
  }]
}
```

---

## 📊 **ESTRUCTURA DE RESPUESTA**

### **Respuesta Exitosa**
```json
{
  "candidates": [{
    "content": {
      "parts": [
        {
          "text": "Texto descriptivo (opcional)",
          "inlineData": {
            "mimeType": "image/png",
            "data": "base64_encoded_image_data"
          }
        }
      ]
    },
    "finishReason": "STOP",
    "safetyRatings": [...]
  }],
  "usageMetadata": {
    "promptTokenCount": 25,
    "candidatesTokenCount": 1290,
    "totalTokenCount": 1315
  }
}
```

---

## 💰 **INFORMACIÓN DE PRECIOS**

### **Gemini 2.5 Flash Image (Nano Banana)**
- **Precio:** USD 30 por cada 1 millón de tokens para salida de imágenes
- **Tokenización:** Los tokens de salida de imágenes se tokenizan a 1,290 tokens por imagen (hasta 1,024 x 1,024 px)
- **Disponibilidad:** Versión preliminar (se permite el uso en producción)

### **Comparación con Imagen API**
| Atributo | Imagen API | Gemini 2.5 Flash Image |
|----------|------------|------------------------|
| **Costo** | USD 0.02 a USD 0.12 por imagen | USD 30 por 1M tokens (1,290 tokens/imagen) |
| **Latencia** | Baja (tiempo real) | Mayor (más procesamiento) |
| **Disponibilidad** | General | Preliminar |
| **Ventajas** | Fotorrealismo, ortografía avanzada | Flexibilidad conversacional, edición sin máscaras |

---

## 🎨 **MEJORES PRÁCTICAS DE PROMPTS**

### **1. Instrucciones Conversacionales**
- Usa lenguaje natural: "Eso es genial, pero ¿puedes hacer que la iluminación sea un poco más cálida?"
- Mantén el contexto: "Mantén todo igual, pero cambia la expresión del personaje para que sea más seria"
- **Tipos de instrucciones:**
  - Ajustes de iluminación: "haz la iluminación más dramática"
  - Modificaciones de color: "cambia la paleta a tonos más fríos"
  - Ajustes de composición: "mueve el objeto más hacia la derecha"
  - Cambios de estilo: "aplica un estilo más minimalista"

### **2. Instrucciones Paso a Paso**
Para escenas complejas, divide en pasos:
- "Primero, crea un fondo de un bosque sereno y brumoso al amanecer"
- "Luego, en primer plano, agrega un antiguo altar de piedra cubierto de musgo"
- "Por último, coloca una sola espada brillante sobre el altar"
- **Tipos de composiciones paso a paso:**
  - Escenas narrativas complejas
  - Diseños arquitectónicos detallados
  - Ilustraciones con múltiples elementos
  - Compositions con profundidad de campo

### **3. Instrucciones Negativas Semánticas**
- ❌ Evita: "sin autos"
- ✅ Usa: "una calle vacía y desierta sin señales de tráfico"
- **Tipos de instrucciones negativas:**
  - Exclusión de elementos: "sin texto visible"
  - Evitar estilos: "sin efectos de desenfoque"
  - Exclusión de colores: "sin tonos rojos"
  - Evitar composiciones: "sin elementos centrados"

### **4. Control de Cámara**
Usa lenguaje fotográfico y cinematográfico:
- `wide-angle shot` - Para paisajes y escenas amplias
- `macro shot` - Para detalles y primeros planos
- `low-angle perspective` - Para dramatismo y poder
- `bird's eye view` - Para vistas aéreas y mapas
- `close-up` - Para retratos y detalles
- `panoramic view` - Para vistas amplias
- `depth of field` - Para controlar el enfoque

### **5. Especificaciones Técnicas**
- **Resolución:** "high resolution", "4K quality"
- **Estilo artístico:** "photorealistic", "watercolor style", "digital art"
- **Iluminación:** "soft lighting", "dramatic shadows", "golden hour"
- **Composición:** "rule of thirds", "symmetrical composition"
- **Color:** "vibrant colors", "monochromatic", "pastel palette"

---

## 🌍 **IDIOMAS SOPORTADOS**

### **Idiomas con Mejor Rendimiento**
- **EN** (Inglés)
- **es-MX** (Español México)
- **ja-JP** (Japonés)
- **zh-CN** (Chino Simplificado)
- **hi-IN** (Hindi)

---

## ⚠️ **LIMITACIONES IMPORTANTES**

### **Limitaciones Técnicas**
- No admite entradas de audio o video
- No siempre sigue la cantidad exacta de imágenes solicitadas
- Funciona mejor con hasta 3 imágenes como entrada
- Para texto en imágenes: generar primero el texto, luego pedir imagen con el texto

### **Limitaciones Geográficas**
- No se pueden subir imágenes de niños en:
  - EEE (Espacio Económico Europeo)
  - Suiza
  - Reino Unido

### **Marca de Agua**
- Todas las imágenes generadas incluyen una marca de agua de SynthID

---

## 🔄 **CUÁNDO USAR GEMINI vs IMAGEN API**

### **Usa Gemini 2.5 Flash Image cuando:**
- Necesites flexibilidad conversacional
- Quieras edición sin máscaras
- Requieras ediciones iterativas de varios turnos
- Necesites combinar elementos creativos de varias imágenes
- Quieras aplicar diseños o texturas específicas
- **Tipos de tareas específicas:**
  - Edición fotográfica conversacional
  - Modificación de elementos específicos en imágenes
  - Ajustes de estilo y composición
  - Refinamiento progresivo de conceptos
  - Transferencia de estilos entre imágenes
  - Creación de composiciones complejas

### **Usa Imagen API cuando:**
- La calidad de imagen y fotorrealismo sean prioridad
- Necesites ortografía o tipografía avanzadas
- Requieras estilos específicos (impresionismo, anime)
- Necesites generar logotipos y diseños de productos
- La latencia baja sea crítica
- **Tipos de tareas específicas:**
  - Generación de imágenes fotorrealistas
  - Creación de logotipos y marcas
  - Diseño de productos y packaging
  - Generación de arte con estilos específicos
  - Creación de infografías con texto
  - Generación de imágenes para marketing
  - Creación de ilustraciones técnicas
  - Generación de avatares y personajes

---

## 🛠️ **EJEMPLOS DE IMPLEMENTACIÓN**

### **JavaScript (Node.js)**
```javascript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

const response = await ai.models.generateContent({
  model: "gemini-2.5-flash-image-preview",
  contents: "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme",
});

for (const part of response.candidates[0].content.parts) {
  if (part.text) {
    console.log(part.text);
  } else if (part.inlineData) {
    const imageData = part.inlineData.data;
    const buffer = Buffer.from(imageData, "base64");
    fs.writeFileSync("gemini-native-image.png", buffer);
  }
}
```

### **Python**
```python
from google import genai
from PIL import Image
from io import BytesIO

client = genai.Client()

response = client.models.generate_content(
    model="gemini-2.5-flash-image-preview",
    contents=["Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme"],
)

for part in response.candidates[0].content.parts:
    if part.text is not None:
        print(part.text)
    elif part.inline_data is not None:
        image = Image.open(BytesIO(part.inline_data.data))
        image.save("generated_image.png")
```

### **REST API**
```bash
curl -s -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [
        {"text": "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme"}
      ]
    }]
  }'
```

---

## 📋 **CHECKLIST DE IMPLEMENTACIÓN**

### **Configuración Inicial**
- [ ] Obtener API key de Gemini desde Google AI Studio
- [ ] Configurar variable de entorno `GEMINI_API_KEY`
- [ ] Instalar SDK correspondiente (JavaScript, Python, Go, etc.)
- [ ] Decidir entre Gemini 2.5 Flash Image o Imagen API según necesidades

### **Implementación Básica**
- [ ] Configurar endpoint: `gemini-2.5-flash-image-preview:generateContent`
- [ ] Implementar headers: `x-goog-api-key` y `Content-Type`
- [ ] Manejar respuesta con `inlineData` para imágenes
- [ ] Implementar decodificación base64 para guardar imágenes
- [ ] Configurar manejo de errores básico

### **Funcionalidades Avanzadas**
- [ ] Implementar edición de imágenes (texto + imagen)
- [ ] Agregar soporte para múltiples imágenes de entrada
- [ ] Implementar refinamiento iterativo
- [ ] Manejar errores y limitaciones
- [ ] Implementar transferencia de estilos
- [ ] Agregar soporte para composiciones complejas

### **Optimización**
- [ ] Implementar cache de imágenes generadas
- [ ] Optimizar prompts para mejor calidad
- [ ] Manejar rate limits y cuotas
- [ ] Implementar fallbacks para errores
- [ ] Optimizar para diferentes tipos de tareas
- [ ] Implementar métricas de calidad

### **Tipos de Tareas Específicas**
- [ ] **Text-to-Image:** Implementar generación básica
- [ ] **Edición Conversacional:** Implementar modificación de imágenes existentes
- [ ] **Composición:** Implementar combinación de múltiples imágenes
- [ ] **Refinamiento:** Implementar iteración conversacional
- [ ] **Renderización de Texto:** Implementar generación con texto legible
- [ ] **Transferencia de Estilo:** Implementar aplicación de estilos artísticos

---

## 🔗 **RECURSOS ADICIONALES**

### **Documentación Oficial**
- [Generación de imágenes con Gemini](https://ai.google.dev/gemini-api/docs/image-generation?hl=es-419)
- [Modelos de Gemini](https://ai.google.dev/gemini-api/docs/models)
- [Guía de recetas](https://ai.google.dev/gemini-api/docs/recipes)

### **Herramientas Relacionadas**
- [Google AI Studio](https://aistudio.google.com/)
- [Veo (Generación de video)](https://ai.google.dev/gemini-api/docs/video-generation)
- [Lyria (Generación de música)](https://ai.google.dev/gemini-api/docs/music-generation)

---

## 📝 **NOTAS DE ACTUALIZACIÓN**

- **2025-09-16**: Documento creado basado en documentación oficial
- **Modelo actual**: `gemini-2.5-flash-image-preview` (Nano Banana)
- **Estado**: Versión preliminar (uso en producción permitido)
- **Última actualización oficial**: 2025-09-09 (UTC)

---

**⚠️ Importante:** Este documento es una referencia técnica basada en la documentación oficial de Google AI. Para información actualizada, siempre consultar la [documentación oficial](https://ai.google.dev/gemini-api/docs/image-generation?hl=es-419).
