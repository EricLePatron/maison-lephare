REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.email_queue_dispatch() FROM anon;
REVOKE EXECUTE ON FUNCTION public.email_queue_wake() FROM anon;