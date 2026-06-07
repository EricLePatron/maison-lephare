-- 1) Remove public read access on the raw professionnels table
DROP POLICY IF EXISTS "Public can view active professionnels" ON public.professionnels;

-- 2) Restrict admin uploads & updates in site-images to known paths
DROP POLICY IF EXISTS "Admins can upload site images" ON storage.objects;
CREATE POLICY "Admins can upload site images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'site-images'
  AND public.has_role(auth.uid(), 'admin')
  AND (
    name LIKE 'professionnels/%'
    OR name LIKE 'ateliers/%'
    OR name ~ '^(logo-main|chateau-main|feature-consultation|feature-association|feature-cafe|grid-consulter|grid-programmation|grid-lieu|grid-rejoindre|grid-proposer|grid-accompagner|grid-louer|grid-installer|grid-cafe|cabinet-room|association-room|cafe-phare|lieu-solidarity|atelier-collectif)\.(png|jpg|jpeg|webp|gif|svg)$'
  )
);

DROP POLICY IF EXISTS "Admins can update site images" ON storage.objects;
CREATE POLICY "Admins can update site images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'site-images'
  AND public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  bucket_id = 'site-images'
  AND public.has_role(auth.uid(), 'admin')
  AND (
    name LIKE 'professionnels/%'
    OR name LIKE 'ateliers/%'
    OR name ~ '^(logo-main|chateau-main|feature-consultation|feature-association|feature-cafe|grid-consulter|grid-programmation|grid-lieu|grid-rejoindre|grid-proposer|grid-accompagner|grid-louer|grid-installer|grid-cafe|cabinet-room|association-room|cafe-phare|lieu-solidarity|atelier-collectif)\.(png|jpg|jpeg|webp|gif|svg)$'
  )
);