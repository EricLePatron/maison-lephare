-- Drop old permissive policies for professionnels
DROP POLICY IF EXISTS "Authenticated users can manage professionals" ON public.professionnels;

-- Create admin-only policies for professionnels
CREATE POLICY "Admins can manage professionals"
ON public.professionnels
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Drop old permissive policies for ateliers
DROP POLICY IF EXISTS "Authenticated users can manage ateliers" ON public.ateliers;

-- Create admin-only policies for ateliers
CREATE POLICY "Admins can manage ateliers"
ON public.ateliers
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));