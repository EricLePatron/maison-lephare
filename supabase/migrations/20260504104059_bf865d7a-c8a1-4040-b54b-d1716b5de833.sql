DROP POLICY IF EXISTS "Public can view site images" ON storage.objects;

CREATE POLICY "Public can view known site images"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (
  bucket_id = 'site-images'
  AND name ~ '^(logo-main|chateau-main|feature-consultation|feature-association|feature-cafe|grid-consulter|grid-programmation|grid-lieu|grid-rejoindre|grid-proposer|grid-accompagner|grid-louer|grid-installer|grid-cafe|cabinet-room|association-room|cafe-phare|lieu-solidarity|atelier-collectif)\.(png|jpg|jpeg|webp|gif|svg)$'
);