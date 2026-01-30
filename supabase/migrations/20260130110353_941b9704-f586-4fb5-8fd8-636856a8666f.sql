-- Create the professionals table
CREATE TABLE public.professionnels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  profession TEXT NOT NULL,
  specialites TEXT[] DEFAULT '{}',
  description TEXT,
  approche TEXT,
  public_cible TEXT,
  jours_presence TEXT,
  contact TEXT,
  site_web TEXT,
  photo_url TEXT,
  actif BOOLEAN NOT NULL DEFAULT true,
  ordre_affichage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.professionnels ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (everyone can see active professionals)
CREATE POLICY "Anyone can view active professionals"
ON public.professionnels
FOR SELECT
USING (actif = true);

-- Create policy for authenticated users to manage professionals (admin)
-- For now, any authenticated user can manage professionals
-- In production, you would add role-based access
CREATE POLICY "Authenticated users can manage professionals"
ON public.professionnels
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_professionnels_updated_at
BEFORE UPDATE ON public.professionnels
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_professionnels_profession ON public.professionnels(profession);
CREATE INDEX idx_professionnels_actif ON public.professionnels(actif);

-- Add some sample data
INSERT INTO public.professionnels (nom, prenom, profession, specialites, description, approche, public_cible, jours_presence, ordre_affichage)
VALUES 
  ('Dupont', 'Marie', 'Psychiatre', ARRAY['Troubles de l''humeur', 'Anxiété', 'Addictions'], 'Psychiatre depuis 15 ans, je propose un accompagnement personnalisé alliant écoute et thérapeutiques adaptées.', 'Approche intégrative', 'Adultes', 'Lundi, Mercredi, Vendredi', 1),
  ('Martin', 'Sophie', 'Psychologue clinicienne', ARRAY['Thérapie cognitive', 'Trauma', 'Gestion du stress'], 'Psychologue spécialisée en TCC, j''accompagne les personnes dans la compréhension et le dépassement de leurs difficultés.', 'Thérapie cognitive et comportementale', 'Adultes, Adolescents', 'Mardi, Jeudi', 2),
  ('Bernard', 'Thomas', 'Psychologue', ARRAY['Psychanalyse', 'Troubles de la personnalité'], 'Formé à la psychanalyse, je propose un espace de parole libre pour explorer les fondements de la souffrance psychique.', 'Psychanalytique', 'Adultes', 'Lundi, Mardi, Jeudi', 3),
  ('Petit', 'Claire', 'Infirmière en santé mentale', ARRAY['Suivi thérapeutique', 'Éducation à la santé', 'Pair-aidance'], 'Infirmière diplômée d''État spécialisée en psychiatrie, j''accompagne les personnes dans leur parcours de rétablissement.', 'Accompagnement global', 'Tous publics', 'Lundi au Vendredi', 4),
  ('Moreau', 'Julie', 'Art-thérapeute', ARRAY['Expression créative', 'Gestion des émotions', 'Développement personnel'], 'Artiste et thérapeute, j''utilise la création comme médiation pour favoriser l''expression et le mieux-être.', 'Art-thérapie', 'Adultes, Enfants', 'Mercredi, Samedi', 5),
  ('Dubois', 'Antoine', 'Psychomotricien', ARRAY['Relaxation', 'Conscience corporelle', 'Anxiété'], 'Je travaille sur le lien corps-esprit pour aider à retrouver un équilibre et une harmonie intérieure.', 'Psychomotricité relationnelle', 'Tous publics', 'Mardi, Vendredi', 6);