
ALTER TABLE public.professionnels_public_profiles
  ADD COLUMN IF NOT EXISTS telephone TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS site_web TEXT;

CREATE OR REPLACE FUNCTION public.sync_professionnels_public_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF TG_OP = 'DELETE' THEN
    DELETE FROM public.professionnels_public_profiles WHERE id = OLD.id;
    RETURN OLD;
  END IF;

  INSERT INTO public.professionnels_public_profiles (
    id, nom, prenom, profession, specialites, description, approche,
    public_cible, jours_presence, photo_url, hero_photo_url, actif,
    ordre_affichage, created_at, updated_at, doctolib_url,
    telephone, email, site_web
  ) VALUES (
    NEW.id, NEW.nom, NEW.prenom, NEW.profession, NEW.specialites,
    NEW.description, NEW.approche, NEW.public_cible, NEW.jours_presence,
    NEW.photo_url, NEW.hero_photo_url, NEW.actif, NEW.ordre_affichage,
    NEW.created_at, NEW.updated_at, NEW.doctolib_url,
    NEW.telephone, NEW.email, NEW.site_web
  )
  ON CONFLICT (id) DO UPDATE SET
    nom = EXCLUDED.nom, prenom = EXCLUDED.prenom, profession = EXCLUDED.profession,
    specialites = EXCLUDED.specialites, description = EXCLUDED.description,
    approche = EXCLUDED.approche, public_cible = EXCLUDED.public_cible,
    jours_presence = EXCLUDED.jours_presence, photo_url = EXCLUDED.photo_url,
    hero_photo_url = EXCLUDED.hero_photo_url, actif = EXCLUDED.actif,
    ordre_affichage = EXCLUDED.ordre_affichage,
    created_at = EXCLUDED.created_at, updated_at = EXCLUDED.updated_at,
    doctolib_url = EXCLUDED.doctolib_url,
    telephone = EXCLUDED.telephone,
    email = EXCLUDED.email,
    site_web = EXCLUDED.site_web;

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS sync_professionnels_public_profile_trigger ON public.professionnels;
CREATE TRIGGER sync_professionnels_public_profile_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.professionnels
FOR EACH ROW EXECUTE FUNCTION public.sync_professionnels_public_profile();

UPDATE public.professionnels_public_profiles p
SET telephone = s.telephone,
    email = s.email,
    site_web = s.site_web
FROM public.professionnels s
WHERE p.id = s.id;

DROP VIEW IF EXISTS public.professionnels_public;
CREATE VIEW public.professionnels_public
WITH (security_invoker = true) AS
SELECT
  id, nom, prenom, profession, specialites, description, approche,
  public_cible, jours_presence, photo_url, hero_photo_url, actif,
  ordre_affichage, created_at, updated_at, doctolib_url,
  telephone, email, site_web
FROM public.professionnels_public_profiles;

GRANT SELECT ON public.professionnels_public TO anon, authenticated;
GRANT ALL ON public.professionnels_public TO service_role;
