-- Run after 001_initial_schema.sql (or with it). Prevents users from changing their own role.
-- Role can only be set via: employee invite (use_employee_invite RPC) or manual SQL by you.

CREATE OR REPLACE FUNCTION public.prevent_self_role_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.id = auth.uid() AND OLD.role IS DISTINCT FROM NEW.role THEN
    RAISE EXCEPTION 'Role can only be changed via invite or by an administrator';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS prevent_self_role_change_trigger ON public.profiles;
CREATE TRIGGER prevent_self_role_change_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_self_role_change();
