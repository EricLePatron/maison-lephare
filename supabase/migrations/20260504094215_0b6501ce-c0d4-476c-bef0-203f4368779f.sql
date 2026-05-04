
INSERT INTO public.site_content (page_key, section_key, content_key, content_value) VALUES
('le-lieu', 'hero', 'tagline', 'Maison dédiée à la Santé Mentale'),
('le-lieu', 'hero', 'image_alt', 'Château LePhare'),
('le-lieu', 'stat', 'headline', '13 millions de personnes'),
('le-lieu', 'stat', 'subline', 'souffrent de troubles psychiques en France'),
('le-lieu', 'welcome', 'intro', 'Tous, sont les bienvenues à la Maison LePhare :'),
('le-lieu', 'welcome', 'item_1', 'les enfants,'),
('le-lieu', 'welcome', 'item_2', 'les étudiants,'),
('le-lieu', 'welcome', 'item_3', 'les aidants,'),
('le-lieu', 'welcome', 'item_4', 'les jeunes parents,'),
('le-lieu', 'welcome', 'item_5', 'les personnes en activité ou non,'),
('le-lieu', 'welcome', 'item_6', 'les personnes vivant des souffrances parfois très intenses ou parfois plus diffuses.'),
('le-lieu', 'why', 'title', 'Pourquoi ouvrir une maison ?'),
('le-lieu', 'why', 'paragraph', 'Les lieux ouverts où des personnes concernées peuvent se retrouver, échanger collectivement et partager une expérience commune restent peu nombreux, surtout en dehors du cadre strict du soin.'),
('le-lieu', 'banner', 'title', 'Soutenir le rétablissement dans un lieu dédié à la Santé Mentale'),
('le-lieu', 'banner', 'image_alt', 'Soutien collectif et rétablissement'),
('le-lieu', 'cta', 'label', 'Nous contacter')
ON CONFLICT (page_key, section_key, content_key) DO NOTHING;
