CREATE OR REPLACE FUNCTION public.claim_upi_slot(
  p_day integer,
  p_event_name text,
  p_registration_id text
)
RETURNS TABLE (
  registration_id text,
  assigned_day integer,
  assigned_upi_account text,
  assigned_upi_name text,
  assigned_upi_id text,
  daily_transaction_slot integer
)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_today date := current_date;
  v_account record;
  v_row record;
BEGIN
  IF p_day NOT IN (1, 2)
    OR p_event_name IS NULL OR btrim(p_event_name) = ''
    OR p_registration_id IS NULL OR btrim(p_registration_id) = '' THEN
    RETURN;
  END IF;

  FOR v_account IN
    SELECT ua.id, ua.day, ua.account_name, ua.display_name, ua.upi_id
    FROM public.upi_accounts ua
    LEFT JOIN public.upi_daily_usage udu
      ON udu.usage_date = v_today
     AND udu.day = ua.day
     AND udu.account_name = ua.account_name
    WHERE ua.day = p_day
    ORDER BY COALESCE(udu.used_count, 0), ua.id
  LOOP
    INSERT INTO public.upi_daily_usage (usage_date, day, account_name, upi_id, daily_limit, used_count)
    VALUES (v_today, v_account.day, v_account.account_name, v_account.upi_id, 0, 1)
    ON CONFLICT (usage_date, day, account_name)
    DO UPDATE SET used_count = public.upi_daily_usage.used_count + 1;

    SELECT used_count INTO v_row
    FROM public.upi_daily_usage
    WHERE usage_date = v_today
      AND day = v_account.day
      AND account_name = v_account.account_name;

    registration_id := p_registration_id;
    assigned_day := p_day;
    assigned_upi_account := v_account.account_name;
    assigned_upi_name := v_account.display_name;
    assigned_upi_id := v_account.upi_id;
    daily_transaction_slot := v_row.used_count;
    RETURN NEXT;
    RETURN;
  END LOOP;
END;
$$;