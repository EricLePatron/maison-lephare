
ALTER TABLE public.ateliers
ADD COLUMN IF NOT EXISTS statut TEXT NOT NULL DEFAULT 'dispo'
CHECK (statut IN ('dispo', 'dernieres_places', 'complet'));

CREATE TABLE IF NOT EXISTS public.publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('linkedin', 'actualite')),
  auteur TEXT NOT NULL,
  extrait TEXT NOT NULL,
  url_linkedin TEXT,
  image_url TEXT,
  categorie TEXT,
  date_publication DATE NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT false,
  actif BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.publications TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.publications TO authenticated;
GRANT ALL ON public.publications TO service_role;

ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active publications" ON public.publications;
CREATE POLICY "Public read active publications" ON public.publications
  FOR SELECT USING (actif = true);

DROP POLICY IF EXISTS "Admins manage publications" ON public.publications;
CREATE POLICY "Admins manage publications" ON public.publications
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_publications_updated_at ON public.publications;
CREATE TRIGGER update_publications_updated_at
  BEFORE UPDATE ON public.publications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.feature_flags (
  key TEXT PRIMARY KEY,
  enabled BOOLEAN NOT NULL DEFAULT false,
  label TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.feature_flags TO anon;
GRANT SELECT ON public.feature_flags TO authenticated;
GRANT ALL ON public.feature_flags TO service_role;

ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read flags" ON public.feature_flags;
CREATE POLICY "Public read flags" ON public.feature_flags
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage flags" ON public.feature_flags;
CREATE POLICY "Admins manage flags" ON public.feature_flags
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.feature_flags (key, enabled, label) VALUES
  ('actualites_header', false, 'Afficher Actualités dans le header'),
  ('actualites_home', false, 'Afficher le bloc actualités sur la home')
ON CONFLICT (key) DO NOTHING;
