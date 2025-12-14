'use server';
/**
 * @fileOverview An AI agent for technical analysis of stock charts.
 *
 * - technicalAnalysis - A function that analyzes a candlestick chart image.
 * - TechnicalAnalysisInput - The input type for the technicalAnalysis function.
 * - TechnicalAnalysisOutput - The return type for the technicalAnalysis function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TechnicalAnalysisInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a candlestick chart, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type TechnicalAnalysisInput = z.infer<typeof TechnicalAnalysisInputSchema>;

// Schema definido inline para evitar problemas de $ref con la API de Gemini
const TechnicalAnalysisOutputSchema = z.object({
  analysis: z.object({
    generalTrend: z.string().describe('Describe la tendencia general (e.g., alcista, bajista o lateral).'),
    patterns: z.string().describe('Identifica y nombra patrones de velas relevantes (e.g., martillo, doji) y explica sus implicaciones.'),
    signals: z.string().describe('Destaca otras señales tecnicas si existen (e.g., rupturas, formaciones chartistas como triangulos, etc.).'),
    conclusion: z.string().describe('Proporciona una interpretacion de lo que el analisis indica para el posible comportamiento futuro del precio.'),
  }),
  summary: z.object({
    trends: z.object({
      shortTerm: z.string().describe("La tendencia a corto plazo (e.g., Alcista, Bajista, Lateral)."),
      mediumTerm: z.string().describe("La tendencia a medio plazo."),
      longTerm: z.string().describe("La tendencia a largo plazo."),
    }),
    supports: z.array(z.object({
      level: z.string().describe("El nivel de precio (e.g., '~150.50')."),
      reason: z.string().describe("La razon por la que este nivel es importante."),
    })).describe("Una lista de niveles de soporte clave."),
    resistances: z.array(z.object({
      level: z.string().describe("El nivel de precio (e.g., '~150.50')."),
      reason: z.string().describe("La razon por la que este nivel es importante."),
    })).describe("Una lista de niveles de resistencia clave."),
  }),
  indicators: z.object({
    rsi: z.object({
      value: z.number().describe("El valor numerico del RSI (0-100). Si no es visible, estima un valor."),
      status: z.string().describe("El estado del RSI: Sobrecompra, Sobreventa o Neutral."),
      isVisible: z.boolean().describe("True si el indicador RSI es claramente visible en el grafico."),
    }),
    macd: z.object({
      status: z.string().describe("El estado del MACD: Cruce Alcista, Cruce Bajista, Sin Cruce Claro o N/A."),
      comment: z.string().describe("Un breve comentario sobre el MACD."),
      isVisible: z.boolean().describe("True si el indicador MACD es claramente visible en el grafico."),
    }),
  })
});
export type TechnicalAnalysisOutput = z.infer<typeof TechnicalAnalysisOutputSchema>;

const prompt = ai.definePrompt({
  name: 'technicalAnalysisPrompt',
  input: { schema: TechnicalAnalysisInputSchema },
  output: { schema: TechnicalAnalysisOutputSchema },
  prompt: `
# ROL
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
  - *Si NO es visible:* Establece 'isVisible' a false y el valor numérico a null (o 0). **NO INVENTES UN NÚMERO**. En su lugar, describe el "Momentum" basándote únicamente en el tamaño y cuerpo de las velas recientes (velas grandes sin mecha = momentum fuerte).
  
- **MACD:**
  - *Si es visible:* Identifica cruces de líneas o posición respecto al histograma (cero).
  - *Si NO es visible:* Establece 'isVisible' a false.

## 5. Conclusión
Sintetiza todo en una visión accionable. ¿El escenario favorece a los toros (compras) o a los osos (ventas)? Menciona un posible escenario de invalidación (e.g., "La tesis alcista se anula si el precio cierra por debajo de X").

# RESTRICCIONES DE SALIDA
- La respuesta DEBE ser exclusivamente JSON válido según el esquema proporcionado.
- El idioma DEBE ser Español técnico financiero (neutro).
- Si la imagen no es un gráfico financiero, indica error en el campo de conclusión.

Chart Image: {{media url=photoDataUri}}
  `,
});

const technicalAnalysisFlow = ai.defineFlow(
  {
    name: 'technicalAnalysisFlow',
    inputSchema: TechnicalAnalysisInputSchema,
    outputSchema: TechnicalAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("The AI model did not return a structured output.");
    }
    return output;
  }
);

export async function technicalAnalysis(input: TechnicalAnalysisInput): Promise<TechnicalAnalysisOutput> {
  return technicalAnalysisFlow(input);
}
