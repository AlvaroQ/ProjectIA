'use client';

/**
 * Cliente de Google Gemini API para llamadas directas desde el navegador
 * Sistema BYOK (Bring Your Own Key)
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { API_CONFIG } from '@/lib/constants';

// ==========================================
// Tipos
// ==========================================

export interface TechnicalAnalysisOutput {
  analysis: {
    generalTrend: string;
    patterns: string;
    signals: string;
    conclusion: string;
  };
  summary: {
    trends: {
      shortTerm: string;
      mediumTerm: string;
      longTerm: string;
    };
    supports: Array<{
      level: string;
      reason: string;
    }>;
    resistances: Array<{
      level: string;
      reason: string;
    }>;
  };
  indicators: {
    rsi: {
      value: number;
      status: string;
      isVisible: boolean;
    };
    macd: {
      status: string;
      comment: string;
      isVisible: boolean;
    };
  };
}

export interface GeminiAnalysisOptions {
  apiKey: string;
  imageDataUri: string;
}

// ==========================================
// Prompt
// ==========================================

const TECHNICAL_ANALYSIS_PROMPT = `# ROL
Actúa como un **Analista Técnico Senior de Inversiones** con experiencia en 'Price Action' (Acción del Precio) y análisis chartista institucional. Tu objetivo es proporcionar un análisis objetivo, profesional y cauteloso basado estrictamente en la evidencia visual proporcionada.

# TAREA
Recibirás una imagen de un gráfico financiero (velas japonesas). Tu misión es extraer datos visuales y convertirlos en un análisis técnico estructurado en formato JSON.

# INSTRUCCIONES DE ANÁLISIS

## 1. Contexto Visual Inicial
Antes de analizar patrones, observa la imagen en busca de contexto (si es visible):
- Nombre del activo (Ticker).
- Temporalidad (Timeframe: 1H, 4H, Diario, Semanal).
- Precio actual de mercado.

## 2. Análisis Detallado (analysis)
- **Tendencia General:** Determina la estructura de mercado (Altos más altos = Alcista, Bajos más bajos = Bajista, Rango). Evalúa la fuerza de la tendencia.
- **Patrones de Velas:** No listes patrones irrelevantes. Busca patrones de alta probabilidad (e.g., Engulfing, Pinbar/Martillo en zona clave, Morning/Evening Star). Explica la psicología detrás del patrón detectado (quién tiene el control: compradores o vendedores).
- **Formaciones Chartistas:** Identifica estructuras complejas si existen (Triángulos, Banderas, HCH, Doble Techo/Suelo).
- **Volumen (Si es visible):** Úsalo para confirmar la validez de las rupturas o patrones.

## 3. Niveles Clave (summary)
- **Soportes y Resistencias:** Identifica zonas de liquidez, no solo líneas finas.
  - Prioriza: Mínimos/Máximos históricos recientes, Números redondos (psicológicos), o Zonas donde el precio ha rebotado múltiples veces (flip zones).
  - Justifica brevemente por qué seleccionaste ese nivel.

## 4. Indicadores (indicators)
**IMPORTANTE:** Sé extremadamente preciso con lo que ves vs. lo que infieres.

- **RSI:**
  - *Si es visible:* Extrae el valor numérico aproximado y define si hay divergencias con el precio.
  - *Si NO es visible:* Establece 'isVisible' a false y el valor numérico a 0. **NO INVENTES UN NÚMERO**. En su lugar, describe el "Momentum" basándote únicamente en el tamaño y cuerpo de las velas recientes (velas grandes sin mecha = momentum fuerte).

- **MACD:**
  - *Si es visible:* Identifica cruces de líneas o posición respecto al histograma (cero).
  - *Si NO es visible:* Establece 'isVisible' a false.

## 5. Conclusión
Sintetiza todo en una visión accionable. ¿El escenario favorece a los toros (compras) o a los osos (ventas)? Menciona un posible escenario de invalidación (e.g., "La tesis alcista se anula si el precio cierra por debajo de X").

# RESTRICCIONES DE SALIDA
- La respuesta DEBE ser exclusivamente JSON válido según el esquema proporcionado.
- El idioma DEBE ser Español técnico financiero (neutro).
- Si la imagen no es un gráfico financiero, indica error en el campo de conclusión.

# ESQUEMA JSON REQUERIDO
{
  "analysis": {
    "generalTrend": "string",
    "patterns": "string",
    "signals": "string",
    "conclusion": "string"
  },
  "summary": {
    "trends": {
      "shortTerm": "string",
      "mediumTerm": "string",
      "longTerm": "string"
    },
    "supports": [{ "level": "string", "reason": "string" }],
    "resistances": [{ "level": "string", "reason": "string" }]
  },
  "indicators": {
    "rsi": { "value": number, "status": "string", "isVisible": boolean },
    "macd": { "status": "string", "comment": "string", "isVisible": boolean }
  }
}

RESPONDE ÚNICAMENTE CON EL JSON, sin texto adicional.`;

// ==========================================
// Helpers
// ==========================================

/**
 * Convierte un Data URI a formato para Gemini
 */
function dataUriToGeminiPart(dataUri: string) {
  const match = dataUri.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    throw new Error('Formato de imagen invalido');
  }
  return {
    inlineData: {
      mimeType: match[1],
      data: match[2],
    },
  };
}

/**
 * Parsea la respuesta JSON de Gemini
 */
function parseGeminiResponse(content: string): TechnicalAnalysisOutput {
  // Limpiar bloques de codigo markdown
  let cleanContent = content.trim();
  cleanContent = cleanContent.replace(/^```json?\s*/i, '');
  cleanContent = cleanContent.replace(/```\s*$/i, '');
  cleanContent = cleanContent.trim();

  // Parsear JSON
  const parsed = JSON.parse(cleanContent);

  // Validar estructura basica
  if (!parsed.analysis || !parsed.summary || !parsed.indicators) {
    throw new Error('Respuesta con estructura invalida');
  }

  return parsed as TechnicalAnalysisOutput;
}

// ==========================================
// Cliente Principal
// ==========================================

/**
 * Analiza un grafico tecnico usando Gemini API directamente desde el cliente
 */
export async function analyzeTechnicalChart({
  apiKey,
  imageDataUri,
}: GeminiAnalysisOptions): Promise<TechnicalAnalysisOutput> {
  // Validar imagen
  if (!imageDataUri || !imageDataUri.startsWith('data:image/')) {
    throw new Error('Imagen invalida. Debe ser un Data URI de imagen.');
  }

  // Inicializar cliente
  const genAI = new GoogleGenerativeAI(apiKey);

  // Usar modelo de Gemini (extraer nombre del modelo de la config)
  const modelName = API_CONFIG.GEMINI.MODEL.replace('googleai/', '');
  const model = genAI.getGenerativeModel({ model: modelName });

  // Preparar imagen
  const imagePart = dataUriToGeminiPart(imageDataUri);

  // Generar contenido
  try {
    const result = await model.generateContent([
      TECHNICAL_ANALYSIS_PROMPT,
      imagePart,
    ]);

    const response = result.response;
    const text = response.text();

    if (!text) {
      throw new Error('No se recibio respuesta del modelo');
    }

    // Parsear respuesta
    return parseGeminiResponse(text);
  } catch (error) {
    if (error instanceof Error) {
      // Manejar errores especificos de la API
      if (error.message.includes('API_KEY_INVALID') || error.message.includes('401')) {
        throw new Error('API Key invalida. Verifica tu configuracion.');
      }
      if (error.message.includes('QUOTA_EXCEEDED') || error.message.includes('429')) {
        throw new Error('Limite de solicitudes excedido. Espera un momento.');
      }
      if (error.message.includes('SAFETY')) {
        throw new Error('La imagen fue bloqueada por filtros de seguridad.');
      }
    }
    throw error;
  }
}
