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
Actua como un agente financiero experto en analisis tecnico de mercados bursatiles. Tu respuesta DEBE ser exclusivamente en español.
Recibiras una imagen de un grafico de velas. Tu tarea es realizar un analisis tecnico completo y estructurado.

La imagen puede contener el grafico principal de velas y tambien indicadores como RSI y MACD. Si estos indicadores no son visibles, debes indicarlo.

Tu analisis debe incluir:
1. **Analisis Detallado (analysis)**:
   - **Tendencia General (generalTrend)**: Describe la tendencia general (alcista, bajista o lateral).
   - **Patrones de Velas (patterns)**: Identifica y nombra patrones de velas relevantes (e.g., martillo, estrella fugaz, envolvente, doji) y explica su posible implicancia.
   - **Otras Señales Tecnicas (signals)**: Si existen, resalta otras señales (e.g., rupturas de lineas de tendencia, formaciones chartistas como triangulos, hombro-cabeza-hombro, canales).
   - **Conclusion (conclusion)**: Finaliza con una interpretacion de lo que indica el analisis para el posible comportamiento futuro del precio.

2. **Resumen y Niveles Clave (summary)**:
   - **Tendencias (trends)**: Proporciona un resumen de la tendencia a corto, medio y largo plazo.
   - **Soportes (supports)**: Señala 1-3 niveles clave de soporte, indicando el precio aproximado y por que es relevante (e.g., minimo anterior, media movil).
   - **Resistencias (resistances)**: Señala 1-3 niveles clave de resistencia.

3. **Analisis de Indicadores (indicators)**:
   - **RSI**: Si el indicador RSI es visible, determina su valor numerico (0-100) y su estado (Sobrecompra >70, Sobreventa <30, Neutral 30-70). Si no es visible, establece isVisible a false y estima un valor razonable basado en la accion del precio.
   - **MACD**: Si el indicador MACD es visible, determina si hay un cruce alcista (linea MACD cruza por encima de la señal) o bajista. Si no es visible, establece isVisible a false y status a "N/A".

Asegurate de que toda la salida este estructurada segun el esquema JSON proporcionado y completamente en español.

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
