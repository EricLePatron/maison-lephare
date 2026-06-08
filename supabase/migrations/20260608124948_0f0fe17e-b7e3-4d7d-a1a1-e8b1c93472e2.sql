GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION public.am_i_admin() TO authenticated, service_role;