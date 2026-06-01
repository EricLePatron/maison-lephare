
-- Switch the view back to security_invoker to satisfy the security linter.
ALTER VIEW public.professionnels_public SET (security_invoker = true);

-- Allow public read of active professionals at the RLS level (row filter).
DROP POLICY IF EXISTS "Public can view active professionnels" ON public.professionnels;
CREATE POLICY "Public can view active professionnels"
  ON public.professionnels
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.professionnels_public_profiles pp
      WHERE pp.id = professionnels.id AND pp.actif = true
    )
  );

-- Grant SELECT only on the safe columns that the public view already exposes.
-- This lets security_invoker view succeed without leaking extra columns via direct PostgREST queries.
GRANT SELECT
  (id, nom, prenom, profession, specialites, description, approche,
   public_cible, jours_presence, site_web, doctolib_url, telephone, email)
  ON public.professionnels TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.professionnels TO authenticated;
GRANT ALL ON public.professionnels TO service_role;

-- Ensure the view itself is reachable.
GRANT SELECT ON public.professionnels_public TO anon, authenticated;
GRANT ALL ON public.professionnels_public TO service_role;
