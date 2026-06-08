REVOKE EXECUTE ON FUNCTION public.am_i_admin() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.am_i_admin() TO service_role;