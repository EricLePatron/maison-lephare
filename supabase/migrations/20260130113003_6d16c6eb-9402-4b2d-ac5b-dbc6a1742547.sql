-- Create an RPC function to check if current user is admin (server-side validation)
CREATE OR REPLACE FUNCTION public.am_i_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin');
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.am_i_admin() TO authenticated;

-- Add comment to professionnels_public view documenting intentional public access
COMMENT ON VIEW public.professionnels_public IS 'Public directory of healthcare professionals. This view intentionally exposes non-sensitive professional information (names, specialties, schedule) to anonymous and authenticated users. Sensitive contact information (email, phone, website) is explicitly excluded. Access is granted to anon and authenticated roles by design for the public-facing professional directory feature.';