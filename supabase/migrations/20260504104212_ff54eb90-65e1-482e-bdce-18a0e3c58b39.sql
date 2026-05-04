DROP POLICY IF EXISTS "Admins can manage professionals" ON public.professionnels;
DROP POLICY IF EXISTS "Only admins can access professionnels table directly" ON public.professionnels;
DROP POLICY IF EXISTS "Admins can manage public professional profiles" ON public.professionnels_public_profiles;
DROP POLICY IF EXISTS "Admins can manage ateliers" ON public.ateliers;
DROP POLICY IF EXISTS "Admins can manage site content" ON public.site_content;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

CREATE POLICY "Admins can manage professionals"
ON public.professionnels
FOR ALL
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'::app_role
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'::app_role
  )
);

CREATE POLICY "Admins can view professionnels table directly"
ON public.professionnels
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'::app_role
  )
);

CREATE POLICY "Admins can manage public professional profiles"
ON public.professionnels_public_profiles
FOR ALL
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'::app_role
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'::app_role
  )
);

CREATE POLICY "Admins can manage ateliers"
ON public.ateliers
FOR ALL
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'::app_role
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'::app_role
  )
);

CREATE POLICY "Admins can manage site content"
ON public.site_content
FOR ALL
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'::app_role
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'::app_role
  )
);

DROP POLICY IF EXISTS "Admins can upload site images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update site images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete site images" ON storage.objects;

CREATE POLICY "Admins can upload site images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'site-images'
  AND auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'::app_role
  )
);

CREATE POLICY "Admins can update site images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'site-images'
  AND auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'::app_role
  )
);

CREATE POLICY "Admins can delete site images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'site-images'
  AND auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'::app_role
  )
);