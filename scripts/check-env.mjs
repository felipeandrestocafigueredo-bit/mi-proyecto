/* ===========================================================================
 * check-env.mjs
 * ===========================================================================
 * Verifica en build time que las variables de Vercel estén presentes.
 * ========================================================================== */

const missing = [];
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missing.push("NEXT_PUBLIC_SUPABASE_URL");
if (!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) missing.push("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) missing.push("SUPABASE_SERVICE_ROLE_KEY");

if (missing.length > 0) {
  console.error("❌ Missing env vars at build time:", missing.join(", "));
  process.exit(1);
}

console.log("✅ Env vars present at build time:");
console.log("   NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "set" : "MISSING");
console.log("   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:", process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ? "set" : "MISSING");
console.log("   SUPABASE_SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "set" : "MISSING");
process.exit(0);
