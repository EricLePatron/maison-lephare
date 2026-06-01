
DROP VIEW IF EXISTS public.professionnels_public;
CREATE VIEW public.professionnels_public
WITH (security_invoker=on) AS
SELECT
  p.id, p.nom, p.prenom, p.profession, p.specialites, p.description,
  p.approche, p.public_cible, p.jours_presence,
  pp.photo_url, pp.hero_photo_url, pp.actif, pp.ordre_affichage,
  pp.created_at, pp.updated_at,
  p.site_web,
  p.doctolib_url,
  p.telephone,
  p.email
FROM public.professionnels_public_profiles pp
JOIN public.professionnels p ON p.id = pp.id;

GRANT SELECT ON public.professionnels_public TO anon, authenticated;
