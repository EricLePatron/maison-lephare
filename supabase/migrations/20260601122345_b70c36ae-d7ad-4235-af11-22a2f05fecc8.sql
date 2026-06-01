ALTER TABLE public.professionnels ADD COLUMN hero_photo_url text;
ALTER TABLE public.professionnels_public_profiles ADD COLUMN hero_photo_url text;

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
    ordre_affichage, created_at, updated_at
  ) VALUES (
    NEW.id, NEW.nom, NEW.prenom, NEW.profession, NEW.specialites,
    NEW.description, NEW.approche, NEW.public_cible, NEW.jours_presence,
    NEW.photo_url, NEW.hero_photo_url, NEW.actif, NEW.ordre_affichage,
    NEW.created_at, NEW.updated_at
  )
  ON CONFLICT (id) DO UPDATE SET
    nom = EXCLUDED.nom, prenom = EXCLUDED.prenom, profession = EXCLUDED.profession,
    specialites = EXCLUDED.specialites, description = EXCLUDED.description,
    approche = EXCLUDED.approche, public_cible = EXCLUDED.public_cible,
    jours_presence = EXCLUDED.jours_presence, photo_url = EXCLUDED.photo_url,
    hero_photo_url = EXCLUDED.hero_photo_url, actif = EXCLUDED.actif,
    ordre_affichage = EXCLUDED.ordre_affichage,
    created_at = EXCLUDED.created_at, updated_at = EXCLUDED.updated_at;

  RETURN NEW;
END;
$function$;