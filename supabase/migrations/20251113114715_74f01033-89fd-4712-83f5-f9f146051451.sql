-- Add missing columns to community_questions
ALTER TABLE public.community_questions 
ADD COLUMN IF NOT EXISTS file_urls TEXT[],
ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Add missing columns to quizzes
ALTER TABLE public.quizzes
ADD COLUMN IF NOT EXISTS topic TEXT,
ADD COLUMN IF NOT EXISTS questions JSONB,
ADD COLUMN IF NOT EXISTS start_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS end_at TIMESTAMPTZ;

-- Update community_questions to reference profiles instead of auth.users
ALTER TABLE public.community_questions
DROP CONSTRAINT IF EXISTS community_questions_user_id_fkey;

ALTER TABLE public.community_questions
ADD CONSTRAINT community_questions_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;