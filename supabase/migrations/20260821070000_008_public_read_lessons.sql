-- El catálogo académico debe poder cargarse después de una recarga
-- incluso antes de que exista una sesión autenticada.
CREATE POLICY "Public users can read lessons"
    ON public.lessons FOR SELECT
    TO anon
    USING (true);
