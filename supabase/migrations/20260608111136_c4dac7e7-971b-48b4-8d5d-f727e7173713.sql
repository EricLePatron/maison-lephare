DROP VIEW IF EXISTS public.professionnels_public;

CREATE VIEW public.professionnels_public
WITH (security_invoker = true) AS
SELECT
  id,
  nom,
  prenom,
  profession,
  specialites,
  description,
  approche,
  public_cible,
  jours_presence,
  photo_url,
  hero_photo_url,
  actif,
  ordre_affichage,
  created_at,
  updated_at,
  doctolib_url
FROM public.professionnels_public_profiles
WHERE actif = true;

GRANT SELECT ON public.professionnels_public TO anon, authenticated;
GRANT ALL ON public.professionnels_public TO service_role;

COMMENT ON VIEW public.professionnels_public IS 'Public directory of professionals backed only by the sanitized public profiles table. Private contact fields remain admin-only on the private professionnels table.';