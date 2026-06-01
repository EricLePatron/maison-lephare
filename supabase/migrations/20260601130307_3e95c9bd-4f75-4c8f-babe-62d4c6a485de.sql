DROP VIEW IF EXISTS public.professionnels_public;
CREATE VIEW public.professionnels_public
WITH (security_invoker=on) AS
SELECT id, nom, prenom, profession, specialites, description, approche,
  public_cible, jours_presence, photo_url, actif,
  ordre_affichage, created_at, updated_at, hero_photo_url
FROM professionnels_public_profiles
WHERE actif = true;

GRANT SELECT ON public.professionnels_public TO anon, authenticated;