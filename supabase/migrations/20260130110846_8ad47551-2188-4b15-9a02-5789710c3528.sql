-- Create ateliers table
CREATE TABLE public.ateliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titre TEXT NOT NULL,
  categorie TEXT NOT NULL,
  description TEXT,
  format TEXT,
  public_cible TEXT,
  objectifs TEXT[] DEFAULT '{}'::TEXT[],
  icone TEXT DEFAULT 'Brain',
  actif BOOLEAN NOT NULL DEFAULT true,
  ordre_affichage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ateliers ENABLE ROW LEVEL SECURITY;

-- Public can view active ateliers
CREATE POLICY "Anyone can view active ateliers"
ON public.ateliers
FOR SELECT
USING (actif = true);

-- Authenticated users can manage ateliers
CREATE POLICY "Authenticated users can manage ateliers"
ON public.ateliers
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Trigger for updated_at
CREATE TRIGGER update_ateliers_updated_at
BEFORE UPDATE ON public.ateliers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();