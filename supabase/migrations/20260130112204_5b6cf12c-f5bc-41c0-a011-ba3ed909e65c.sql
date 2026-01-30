-- Fix 1: Create a public view for professionnels that hides contact info
-- and restrict direct table access

CREATE VIEW public.professionnels_public
WITH (security_invoker = on) AS
  SELECT 
    id,
    nom,
    prenom,
    profession,
    specialites,
    description,
    approche,
    public_cible,
    jours_presence,
    photo_url,
    actif,
    ordre_affichage,
    created_at,
    updated_at
  FROM public.professionnels
  WHERE actif = true;
-- Excludes: contact, site_web (sensitive contact information)

-- Drop the old public policy
DROP POLICY IF EXISTS "Anyone can view active professionals" ON public.professionnels;

-- Create restrictive policy: only admins can directly access the table
CREATE POLICY "Only admins can access professionnels table directly"
ON public.professionnels
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Fix 2: Add explicit authentication check for user_roles
-- The existing policy already uses auth.uid() but let's make it explicit

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

CREATE POLICY "Authenticated users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Also ensure unauthenticated users cannot access at all
CREATE POLICY "Deny unauthenticated access to user_roles"
ON public.user_roles
FOR SELECT
TO anon
USING (false);