
-- Extend role enum with the four tier roles
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname='app_role' AND e.enumlabel='supreme') THEN
    ALTER TYPE public.app_role ADD VALUE 'supreme';
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname='app_role' AND e.enumlabel='co_admin') THEN
    ALTER TYPE public.app_role ADD VALUE 'co_admin';
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname='app_role' AND e.enumlabel='elite') THEN
    ALTER TYPE public.app_role ADD VALUE 'elite';
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname='app_role' AND e.enumlabel='operator') THEN
    ALTER TYPE public.app_role ADD VALUE 'operator';
  END IF;
END $$;
