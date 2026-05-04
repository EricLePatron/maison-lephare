CREATE TABLE IF NOT EXISTS public.professionnels_public_profiles (
  id uuid PRIMARY KEY,
  nom text NOT NULL,
  prenom text NOT NULL,
  profession text NOT NULL,
  specialites text[] DEFAULT '{}'::text[],
  description text,
  approche text,
  public_cible text,
  jours_presence text,
  photo_url text,
  actif boolean NOT NULL DEFAULT true,
  ordre_affichage integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.professionnels_public_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active public professional profiles" ON public.professionnels_public_profiles;
CREATE POLICY "Anyone can view active public professional profiles"
ON public.professionnels_public_profiles
FOR SELECT
TO anon, authenticated
USING (actif = true);

DROP POLICY IF EXISTS "Admins can manage public professional profiles" ON public.professionnels_public_profiles;
CREATE POLICY "Admins can manage public professional profiles"
ON public.professionnels_public_profiles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

GRANT SELECT ON public.professionnels_public_profiles TO anon, authenticated;

INSERT INTO public.professionnels_public_profiles (
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
  actif,
  ordre_affichage,
  created_at,
  updated_at
)
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
  actif,
  ordre_affichage,
  created_at,
  updated_at
FROM public.professionnels
ON CONFLICT (id) DO UPDATE SET
  nom = EXCLUDED.nom,
  prenom = EXCLUDED.prenom,
  profession = EXCLUDED.profession,
  specialites = EXCLUDED.specialites,
  description = EXCLUDED.description,
  approche = EXCLUDED.approche,
  public_cible = EXCLUDED.public_cible,
  jours_presence = EXCLUDED.jours_presence,
  photo_url = EXCLUDED.photo_url,
  actif = EXCLUDED.actif,
  ordre_affichage = EXCLUDED.ordre_affichage,
  created_at = EXCLUDED.created_at,
  updated_at = EXCLUDED.updated_at;

CREATE OR REPLACE FUNCTION public.sync_professionnels_public_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    DELETE FROM public.professionnels_public_profiles WHERE id = OLD.id;
    RETURN OLD;
  END IF;

  INSERT INTO public.professionnels_public_profiles (
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
    actif,
    ordre_affichage,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.nom,
    NEW.prenom,
    NEW.profession,
    NEW.specialites,
    NEW.description,
    NEW.approche,
    NEW.public_cible,
    NEW.jours_presence,
    NEW.photo_url,
    NEW.actif,
    NEW.ordre_affichage,
    NEW.created_at,
    NEW.updated_at
  )
  ON CONFLICT (id) DO UPDATE SET
    nom = EXCLUDED.nom,
    prenom = EXCLUDED.prenom,
    profession = EXCLUDED.profession,
    specialites = EXCLUDED.specialites,
    description = EXCLUDED.description,
    approche = EXCLUDED.approche,
    public_cible = EXCLUDED.public_cible,
    jours_presence = EXCLUDED.jours_presence,
    photo_url = EXCLUDED.photo_url,
    actif = EXCLUDED.actif,
    ordre_affichage = EXCLUDED.ordre_affichage,
    created_at = EXCLUDED.created_at,
    updated_at = EXCLUDED.updated_at;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sync_professionnels_public_profile ON public.professionnels;
CREATE TRIGGER sync_professionnels_public_profile
AFTER INSERT OR UPDATE OR DELETE ON public.professionnels
FOR EACH ROW
EXECUTE FUNCTION public.sync_professionnels_public_profile();

DROP VIEW IF EXISTS public.professionnels_public;
CREATE VIEW public.professionnels_public
WITH (security_invoker = on)
AS
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
  actif,
  ordre_affichage,
  created_at,
  updated_at
FROM public.professionnels_public_profiles
WHERE actif = true;

GRANT SELECT ON public.professionnels_public TO anon, authenticated;

DROP POLICY IF EXISTS "Public can read active professionnels" ON public.professionnels;

REVOKE ALL ON public.professionnels FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.professionnels TO authenticated;

COMMENT ON TABLE public.professionnels_public_profiles IS 'Sanitized public copy of professional profiles. This table intentionally excludes contact and website fields.';
COMMENT ON VIEW public.professionnels_public IS 'Public directory of healthcare professionals. Sensitive contact and website fields are excluded and remain admin-only on the private professionnels table.';