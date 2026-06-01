
-- Restore public read access to professionnels via the public view.
-- Use security_definer so the view bypasses RLS on the base table,
-- while only exposing safe columns (no contact info other than the curated ones already in the view).

ALTER VIEW public.professionnels_public SET (security_invoker = false);

-- Ensure Data API can reach the view for anonymous and authenticated visitors.
GRANT SELECT ON public.professionnels_public TO anon, authenticated;
GRANT ALL ON public.professionnels_public TO service_role;

-- Ensure the base table has the standard grants required by the Data API for admin operations.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.professionnels TO authenticated;
GRANT ALL ON public.professionnels TO service_role;
