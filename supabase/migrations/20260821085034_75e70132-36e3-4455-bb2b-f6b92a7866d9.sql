ALTER TABLE public.ateliers
  ADD COLUMN IF NOT EXISTS type_offre text NOT NULL DEFAULT 'benevole',
  ADD COLUMN IF NOT EXISTS tarif text;