
ALTER TABLE public.professionnels
  ADD COLUMN IF NOT EXISTS telephone text,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS doctolib_url text;

ALTER TABLE public.professionnels_public_profiles
  ADD COLUMN IF NOT EXISTS doctolib_url text;

-- Update sync trigger function to include doctolib_url (telephone & email stay private)
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
    ordre_affichage, created_at, updated_at, doctolib_url
  ) VALUES (
    NEW.id, NEW.nom, NEW.prenom, NEW.profession, NEW.specialites,
    NEW.description, NEW.approche, NEW.public_cible, NEW.jours_presence,
    NEW.photo_url, NEW.hero_photo_url, NEW.actif, NEW.ordre_affichage,
    NEW.created_at, NEW.updated_at, NEW.doctolib_url
  )
  ON CONFLICT (id) DO UPDATE SET
    nom = EXCLUDED.nom, prenom = EXCLUDED.prenom, profession = EXCLUDED.profession,
    specialites = EXCLUDED.specialites, description = EXCLUDED.description,
    approche = EXCLUDED.approche, public_cible = EXCLUDED.public_cible,
    jours_presence = EXCLUDED.jours_presence, photo_url = EXCLUDED.photo_url,
    hero_photo_url = EXCLUDED.hero_photo_url, actif = EXCLUDED.actif,
    ordre_affichage = EXCLUDED.ordre_affichage,
    created_at = EXCLUDED.created_at, updated_at = EXCLUDED.updated_at,
    doctolib_url = EXCLUDED.doctolib_url;

  RETURN NEW;
END;
$function$;

-- Recreate public view to expose site_web and doctolib_url (email & phone redirected via contact form)
DROP VIEW IF EXISTS public.professionnels_public;
CREATE VIEW public.professionnels_public
WITH (security_invoker=on) AS
SELECT
  p.id, p.nom, p.prenom, p.profession, p.specialites, p.description,
  p.approche, p.public_cible, p.jours_presence,
  pp.photo_url, pp.hero_photo_url, pp.actif, pp.ordre_affichage,
  pp.created_at, pp.updated_at,
  p.site_web,
  p.doctolib_url
FROM public.professionnels_public_profiles pp
JOIN public.professionnels p ON p.id = pp.id;

GRANT SELECT ON public.professionnels_public TO anon, authenticated;

-- Backfill existing rows so the trigger has data in sync
UPDATE public.professionnels SET updated_at = now();
