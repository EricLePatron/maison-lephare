-- Create table for editable site content
CREATE TABLE public.site_content (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    page_key text NOT NULL,
    section_key text NOT NULL,
    content_key text NOT NULL,
    content_type text NOT NULL DEFAULT 'text',
    content_value text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE(page_key, section_key, content_key)
);

-- Enable RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Public can read all content
CREATE POLICY "Anyone can view site content"
ON public.site_content
FOR SELECT
USING (true);

-- Only admins can manage content
CREATE POLICY "Admins can manage site content"
ON public.site_content
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_site_content_updated_at
BEFORE UPDATE ON public.site_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default content for homepage
INSERT INTO public.site_content (page_key, section_key, content_key, content_value) VALUES
-- Hero section
('home', 'hero', 'badge', 'Un lieu dédié à la santé mentale'),
('home', 'hero', 'title', 'Bienvenue au Phare'),
('home', 'hero', 'description', 'Une maison chaleureuse au cœur de Bordeaux, où professionnels et association s''unissent pour accompagner chacun vers le rétablissement.'),
-- Features section
('home', 'features', 'title', 'Un lieu pas comme les autres'),
('home', 'features', 'description', 'Le Phare réunit soins, accompagnement et convivialité dans un cadre exceptionnel.'),
('home', 'features', 'feature_1_title', 'Un lieu unique'),
('home', 'features', 'feature_1_description', 'Un château chargé d''histoire dédié entièrement à la santé mentale, avec vue sur un parc de 2 hectares.'),
('home', 'features', 'feature_2_title', 'Des professionnels engagés'),
('home', 'features', 'feature_2_description', 'Une équipe pluridisciplinaire de praticiens passionnés : psychiatres, psychologues, thérapeutes.'),
('home', 'features', 'feature_3_title', 'Une approche humaine'),
('home', 'features', 'feature_3_description', 'Des ateliers, groupes de parole et activités conçus pour accompagner chacun dans son parcours.'),
('home', 'features', 'feature_4_title', 'Un espace ouvert'),
('home', 'features', 'feature_4_description', 'Un café ouvert à tous pour déstigmatiser la santé mentale et créer du lien dans le quartier.'),
-- Spaces section
('home', 'spaces', 'title', 'Trois espaces, une mission'),
('home', 'spaces', 'description', 'Découvrez les différents espaces qui composent Le Phare, chacun avec sa vocation propre.'),
('home', 'spaces', 'space_1_title', 'Le Cabinet'),
('home', 'spaces', 'space_1_description', '8 cabinets de consultation lumineux donnant sur le parc, pour des accompagnements individuels.'),
('home', 'spaces', 'space_2_title', 'L''Association'),
('home', 'spaces', 'space_2_description', 'Des salles de vie pour les ateliers thérapeutiques, groupes de parole et moments de partage.'),
('home', 'spaces', 'space_3_title', 'Le Café'),
('home', 'spaces', 'space_3_description', 'Un espace chaleureux ouvert à tout le quartier, pour des café-débats et rencontres.'),
-- CTA section
('home', 'cta', 'title', 'Besoin d''être accompagné ?'),
('home', 'cta', 'description', 'Que vous cherchiez un professionnel ou souhaitiez participer à nos activités, nous sommes là pour vous accueillir.'),
-- Values section
('home', 'values', 'title', 'Nos valeurs'),
('home', 'values', 'value_1_title', 'Bienveillance'),
('home', 'values', 'value_1_description', 'Accueillir chaque personne avec respect et sans jugement, dans sa singularité.'),
('home', 'values', 'value_2_title', 'Déstigmatisation'),
('home', 'values', 'value_2_description', 'Contribuer à changer le regard sur la santé mentale, ouvrir le dialogue.'),
('home', 'values', 'value_3_title', 'Collectif'),
('home', 'values', 'value_3_description', 'Croire en la force du groupe et de l''entraide pour accompagner le rétablissement.'),
('home', 'values', 'quote', 'Un lieu où l''on prend soin de la santé mentale, ensemble.'),
-- Le Lieu page
('le-lieu', 'hero', 'badge', 'Un château à Bordeaux'),
('le-lieu', 'hero', 'title', 'Le Lieu'),
('le-lieu', 'hero', 'description', 'Un château chargé d''histoire, transformé en maison dédiée à la santé mentale. Un lieu où l''on pense différemment l''accompagnement.'),
('le-lieu', 'philosophy', 'title', 'Notre philosophie'),
('le-lieu', 'philosophy', 'paragraph_1', 'Le Phare est né d''une conviction : la santé mentale mérite un lieu à sa hauteur. Pas un hôpital froid, mais une maison chaleureuse où l''on se sent accueilli.'),
('le-lieu', 'philosophy', 'paragraph_2', 'Dans ce château aux espaces généreux, nous avons voulu créer un environnement propice au rétablissement. La lumière naturelle, la vue sur le parc, les matériaux nobles – tout contribue à apaiser et rassurer.'),
('le-lieu', 'philosophy', 'paragraph_3', 'Ici, professionnels de santé, association et café cohabitent pour offrir un accompagnement global, où le soin côtoie le lien social et la convivialité.'),
('le-lieu', 'timeline', 'title', 'Histoire du lieu'),
('le-lieu', 'spaces', 'title', 'Nos espaces'),
('le-lieu', 'spaces', 'description', 'Trois espaces distincts qui composent Le Phare, chacun avec sa vocation propre.'),
('le-lieu', 'cta', 'title', 'Envie de visiter ?'),
('le-lieu', 'cta', 'description', 'Contactez-nous pour organiser une visite du lieu ou en savoir plus sur nos activités.'),
-- Association page
('association', 'hero', 'badge', 'Association loi 1901'),
('association', 'hero', 'title', 'L''Association Le Phare'),
('association', 'hero', 'description', 'Des activités collectives et un accompagnement chaleureux pour tous ceux qui sont concernés par la santé mentale.'),
('association', 'mission', 'title', 'Notre mission'),
('association', 'mission', 'paragraph_1', 'L''association Le Phare a pour vocation d''accompagner les personnes concernées par la santé mentale, leurs proches et tous ceux qui souhaitent s''informer.'),
('association', 'mission', 'paragraph_2', 'À travers nos ateliers thérapeutiques, groupes de parole et activités psycho-éducatives, nous créons des espaces de rencontre et de partage où chacun peut avancer à son rythme.'),
('association', 'mission', 'paragraph_3', 'Nous croyons fermement au rétablissement et à la capacité de chaque personne à mener une vie épanouissante, malgré les difficultés traversées.'),
('association', 'activities', 'title', 'Nos activités'),
('association', 'activities', 'description', 'Des ateliers et moments de partage adaptés à chaque besoin et à chaque parcours.'),
('association', 'publics', 'title', 'À qui s''adresse l''association ?'),
('association', 'cta', 'title', 'Rejoignez-nous'),
('association', 'cta', 'description', 'Devenez adhérent, bénévole, ou participez simplement à nos activités. Toutes les formes d''engagement sont les bienvenues.'),
-- Contact page
('contact', 'hero', 'title', 'Contact'),
('contact', 'hero', 'description', 'Une question, une demande de rendez-vous ou simplement envie de nous rencontrer ? N''hésitez pas à nous écrire.');