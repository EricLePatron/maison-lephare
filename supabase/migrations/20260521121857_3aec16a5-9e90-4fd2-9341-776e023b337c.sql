CREATE POLICY "Public can view professionnels and ateliers images"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'site-images' AND (name LIKE 'professionnels/%' OR name LIKE 'ateliers/%'));