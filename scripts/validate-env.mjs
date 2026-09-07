/* ===========================================================================
 * validate-env.mjs
 * ===========================================================================
 * Verifica que las variables de entorno críticas de Supabase están presentes
 * y que la conexión al proyecto funciona (bucket, tablas).
 *
 * Uso:  node scripts/validate-env.mjs
 * ========================================================================== */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
];

function loadEnv(path) {
  const content = readFileSync(path, "utf8");
  const result = {};
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (key) result[key] = value;
  }
  return result;
}

const env = loadEnv(join(process.cwd(), ".env.local"));

const missing = required.filter((k) => !env[k]);
if (missing.length > 0) {
  console.error("🔴 Variables de entorno críticas faltantes:");
  for (const k of missing) console.error("   - " + k);
  console.error("\n📋 Copia .env.example → .env.local y completa los valores.");
  process.exit(1);
}

const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

/* Un service_role_key válida empieza con "eyJ" (JWT antiguo) o "sb_secret_" (formato nuevo 2025+) */
const isValidServiceKey =
  serviceKey.startsWith("eyJ") ||
  serviceKey.startsWith("sb_secret_");

if (!isValidServiceKey) {
  console.error("🔴 SUPABASE_SERVICE_ROLE_KEY no tiene formato válido.");
  console.error("   Valor actual: " + serviceKey.substring(0, 50));
  console.error("   Un service_role_key empieza con 'eyJ' (JWT) o 'sb_secret_' (formato nuevo).");
  console.error("   Lo que tienes no parece ser una key JWT válida.");
  console.error("\n📋 Instrucciones:");
  console.error("   1. Abre https://supabase.com/dashboard");
  console.error("   2. Navega a tu proyecto (lbrqyadurqixmfjyutxu)");
  console.error("   3. Settings > API > service_role key");
  console.error("   4. Copia la key COMPLETA");
  console.error("   5. Reemplaza el valor en .env.local");
  console.error("   6. Vuelve a ejecutar: node scripts/validate-env.mjs");
  process.exit(1);
}

if (serviceKey.includes("your_service_role_key_here")) {
  console.error("🔴 SUPABASE_SERVICE_ROLE_KEY sigue siendo un placeholder.");
  console.error("\n📋 Instrucciones:");
  console.error("   1. Abre https://supabase.com/dashboard/project/_/settings/api");
  console.error("   2. Copia la service_role key (JWT que empieza con 'eyJ')");
  console.error("   3. Pégala en .env.local reemplazando el placeholder");
  console.error("   4. Vuelve a ejecutar: node scripts/validate-env.mjs");
  process.exit(1);
}

console.log("✅ Variables de entorno presentes y con formato válido.");

const client = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  const { data: buckets, error: bucketError } = await client.storage.listBuckets();
  if (bucketError) {
    console.error("🔴 Error listando buckets:", bucketError.message);
    console.error("   Posible causa: key expirada o de otro proyecto.");
    process.exit(1);
  }

  const hasBucket = buckets && buckets.some((b) => b.name === "academic-files");
  if (hasBucket) {
    console.log("✅ Bucket 'academic-files' existe.");
  } else {
    console.log("🟡 Bucket 'academic-files' no existe. Se creará en runtime vía storageActions.ts");
  }

  const { count, error: countError } = await client
    .from("lessons")
    .select("*", { count: "exact", head: true });

  if (countError) {
    console.error("🔴 Error consultando lessons:", countError.message);
    process.exit(1);
  }

  console.log("✅ Tabla 'lessons' accesible. Registros: " + count);

  const { count: profileCount, error: profileError } = await client
    .from("profiles")
    .select("*", { count: "exact", head: true });

  if (profileError) {
    console.error("🔴 Error consultando profiles:", profileError.message);
    process.exit(1);
  }

  console.log("✅ Tabla 'profiles' accesible. Registros: " + profileCount);

  console.log("\n✅ Validación completada. Todo funciona.");
  process.exit(0);
}

main().catch((e) => {
  console.error("🔴 Error inesperado:", e.message || e);
  process.exit(1);
});
