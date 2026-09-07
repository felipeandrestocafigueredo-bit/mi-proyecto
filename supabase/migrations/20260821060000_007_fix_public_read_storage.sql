-- =============================================================================
-- MIGRATION 007 — Fix Public Read Access for academic-files bucket
-- =============================================================================
-- Fuente: audit PreviewTab.tsx + storageService.ts + RLS policies
--
-- Problema: El bucket es public: true pero las RLS policies solo permiten
-- SELECT a usuarios autenticados. Google Docs Viewer hace peticiones anónimas
-- para previsualizar PPT/PDF, y recibe 403.
--
-- Solución: Añadir política de lectura pública para rol anon.
-- =============================================================================

-- Permitir lectura pública (anon) para el bucket academic-files
CREATE POLICY "Public read access for academic-files"
    ON storage.objects FOR SELECT
    TO anon
    USING (bucket_id = 'academic-files');

-- También permitir a roles authenticated (redundante pero explícito)
CREATE POLICY "Public read access for academic-files (authenticated)"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (bucket_id = 'academic-files');
