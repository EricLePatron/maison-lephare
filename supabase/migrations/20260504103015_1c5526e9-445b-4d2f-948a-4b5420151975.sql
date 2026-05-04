
-- 1. Make the view enforce RLS of the caller
ALTER VIEW public.professionnels_public SET (security_invoker = on);

-- 2. Allow public read of active professionals on the base table (RLS gate)
DROP POLICY IF EXISTS "Public can read active professionnels" ON public.professionnels;
CREATE POLICY "Public can read active professionnels"
ON public.professionnels
FOR SELECT
TO anon, authenticated
USING (actif = true);

-- 3. Revoke sensitive columns from public roles so they can never be read
--    directly from the base table or any future view that selects them.
REVOKE SELECT ON public.professionnels FROM anon, authenticated;

GRANT SELECT (
  id, nom, prenom, profession, specialites, description, approche,
  public_cible, jours_presence, photo_url, actif, ordre_affichage,
  created_at, updated_at
) ON public.professionnels TO anon, authenticated;
-- Note: 'contact' and 'site_web' are intentionally NOT granted to anon/authenticated.
-- Admins retain full access via the "Admins can manage professionals" policy
-- and the postgres role / service_role keep full access.
