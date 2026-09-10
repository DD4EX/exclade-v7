CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.upi_accounts (
  id text PRIMARY KEY,
  day integer NOT NULL CHECK (day IN (1,2)),
  account_name text NOT NULL,
  display_name text NOT NULL,
  upi_id text NOT NULL,
  daily_limit integer NOT NULL DEFAULT 20
);

INSERT INTO public.upi_accounts (id, day, account_name, display_name, upi_id, daily_limit)
VALUES
  ('nandhini-day1', 1, 'Nandhini S', 'Nandhini S', '9944981163@ptaxis', 50),
  ('santhosh-day1', 1, 'Santhosh Gurunathan', 'Santhosh Gurunathan', 'itsmesanthosh.guru-1@okaxis', 50),
  ('dhayalan-day2', 2, 'Dhayalan', 'Dhayalan', 'dhayalanb2@okhdfcbank', 50),
  ('vinishka-day2', 2, 'Vinishka G', 'Vinishka G', 'vinika03042006@oksbi', 50)
ON CONFLICT (id) DO UPDATE SET daily_limit = EXCLUDED.daily_limit;

CREATE TABLE IF NOT EXISTS public.upi_daily_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usage_date date NOT NULL,
  day integer NOT NULL CHECK (day IN (1,2)),
  account_name text NOT NULL,
  upi_id text NOT NULL,
  daily_limit integer NOT NULL DEFAULT 20,
  used_count integer NOT NULL DEFAULT 0,
  UNIQUE (usage_date, day, account_name)
);

ALTER TABLE public.upi_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upi_daily_usage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read upi_accounts" ON public.upi_accounts;
DROP POLICY IF EXISTS "Public read upi_daily_usage" ON public.upi_daily_usage;
DROP POLICY IF EXISTS "Public insert upi_daily_usage" ON public.upi_daily_usage;
DROP POLICY IF EXISTS "Public update upi_daily_usage" ON public.upi_daily_usage;

CREATE POLICY "Public read upi_accounts" ON public.upi_accounts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read upi_daily_usage" ON public.upi_daily_usage FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public insert upi_daily_usage" ON public.upi_daily_usage
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    usage_date IS NOT NULL
    AND day IN (1, 2)
    AND account_name IS NOT NULL
    AND upi_id IS NOT NULL
    AND daily_limit > 0
    AND used_count >= 0
  );
CREATE POLICY "Public update upi_daily_usage" ON public.upi_daily_usage
  FOR UPDATE TO anon, authenticated
  USING (
    usage_date IS NOT NULL
    AND day IN (1, 2)
    AND account_name IS NOT NULL
  )
  WITH CHECK (
    usage_date IS NOT NULL
    AND day IN (1, 2)
    AND account_name IS NOT NULL
    AND upi_id IS NOT NULL
    AND daily_limit > 0
    AND used_count >= 0
  );

CREATE TABLE IF NOT EXISTS public.registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id text NOT NULL UNIQUE,
  event_id text NOT NULL,
  event_name text NOT NULL,
  event_day integer NOT NULL,
  registration_amount integer NOT NULL,
  registration_type text NOT NULL DEFAULT 'solo',
  team_name text,
  team_leader_name text NOT NULL,
  team_leader_gmail text NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  college text NOT NULL,
  department text NOT NULL,
  year text NOT NULL,
  team_members jsonb NOT NULL DEFAULT '[]'::jsonb,
  assigned_upi_account text NOT NULL,
  assigned_upi_name text NOT NULL,
  assigned_upi_id text NOT NULL,
  daily_transaction_slot integer NOT NULL,
  payment_note text NOT NULL,
  payment_screenshot_path text,
  payment_screenshot_url text,
  qr_data_url text,
  registration_timestamp timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'pending',
  confirmed_at timestamptz,
  details_sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS team_name text;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS team_leader_name text;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS team_leader_gmail text;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS college text;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS department text;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS year text;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS team_members jsonb;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS assigned_upi_account text;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS assigned_upi_name text;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS assigned_upi_id text;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS daily_transaction_slot integer;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS payment_note text;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS payment_screenshot_path text;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS payment_screenshot_url text;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS qr_data_url text;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS registration_timestamp timestamptz;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS status text;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS confirmed_at timestamptz;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS details_sent_at timestamptz;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS created_at timestamptz;

ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public registration inserts" ON public.registrations;
DROP POLICY IF EXISTS "Admin portal registration reads" ON public.registrations;
DROP POLICY IF EXISTS "Admin portal registration updates" ON public.registrations;
CREATE POLICY "Public registration inserts" ON public.registrations
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    registration_id IS NOT NULL
    AND event_id IS NOT NULL
    AND event_name IS NOT NULL
    AND event_day IN (1, 2)
    AND registration_amount > 0
    AND team_leader_name IS NOT NULL
    AND team_leader_gmail IS NOT NULL
    AND full_name IS NOT NULL
    AND email IS NOT NULL
    AND phone IS NOT NULL
    AND college IS NOT NULL
    AND department IS NOT NULL
    AND year IS NOT NULL
    AND assigned_upi_account IS NOT NULL
    AND assigned_upi_name IS NOT NULL
    AND assigned_upi_id IS NOT NULL
    AND payment_note IS NOT NULL
    AND status IS NOT NULL
  );
CREATE POLICY "Admin portal registration reads" ON public.registrations FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin portal registration updates" ON public.registrations
  FOR UPDATE TO anon, authenticated
  USING (registration_id IS NOT NULL)
  WITH CHECK (
    registration_id IS NOT NULL
    AND event_id IS NOT NULL
    AND event_name IS NOT NULL
    AND event_day IN (1, 2)
    AND status IS NOT NULL
  );

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
  IF p_day NOT IN (1, 2) THEN
    RETURN;
  END IF;

  IF p_event_name IS NULL OR btrim(p_event_name) = '' THEN
    RETURN;
  END IF;

  IF p_registration_id IS NULL OR btrim(p_registration_id) = '' THEN
    RETURN;
  END IF;

  FOR v_account IN
    SELECT ua.id, ua.day, ua.account_name, ua.display_name, ua.upi_id, ua.daily_limit
    FROM public.upi_accounts ua
    LEFT JOIN public.upi_daily_usage udu
      ON udu.usage_date = v_today
     AND udu.day = ua.day
     AND udu.account_name = ua.account_name
    WHERE ua.day = p_day
    ORDER BY COALESCE(udu.used_count, 0), ua.id
  LOOP
    INSERT INTO public.upi_daily_usage (usage_date, day, account_name, upi_id, daily_limit, used_count)
    VALUES (v_today, v_account.day, v_account.account_name, v_account.upi_id, v_account.daily_limit, 1)
    ON CONFLICT (usage_date, day, account_name)
    DO NOTHING;

    SELECT * INTO v_row
    FROM public.upi_daily_usage
    WHERE usage_date = v_today
      AND day = v_account.day
      AND account_name = v_account.account_name;

    UPDATE public.upi_daily_usage
    SET used_count = used_count + 1
    WHERE usage_date = v_today
      AND day = v_account.day
      AND account_name = v_account.account_name;

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

  RETURN;
END;
$$;

INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public payment proof uploads" ON storage.objects;
DROP POLICY IF EXISTS "Public payment proof reads" ON storage.objects;
CREATE POLICY "Public payment proof uploads" ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (
    bucket_id = 'payment-proofs'
    AND (storage.foldername(name))[1] LIKE 'day-%'
  );