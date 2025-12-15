import { z } from "zod";

/**
 * Schema de validacion para variables de entorno del servidor
 *
 * NOTA: Las API keys de Gemini y Perplexity ya no son requeridas
 * en el servidor porque ahora se manejan via BYOK (Bring Your Own Key)
 * donde cada usuario proporciona sus propias keys en el cliente.
 */
const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

/**
 * Tipo inferido del schema de entorno
 */
export type ServerEnv = z.infer<typeof serverEnvSchema>;

/**
 * Valida y parsea las variables de entorno
 */
function validateEnv(): ServerEnv {
  const parsed = serverEnvSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const errorMessages = Object.entries(errors)
      .map(([field, messages]) => `  - ${field}: ${messages?.join(", ")}`)
      .join("\n");

    throw new Error(
      `Variables de entorno invalidas:\n${errorMessages}`
    );
  }

  return parsed.data;
}

/**
 * Variables de entorno validadas del servidor
 */
export const env = validateEnv();

/**
 * Helper para verificar si estamos en desarrollo
 */
export const isDevelopment = env.NODE_ENV === "development";

/**
 * Helper para verificar si estamos en produccion
 */
export const isProduction = env.NODE_ENV === "production";
