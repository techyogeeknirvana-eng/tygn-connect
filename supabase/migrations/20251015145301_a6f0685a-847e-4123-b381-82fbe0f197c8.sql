-- Create questions table for community Q&A
CREATE TABLE IF NOT EXISTS public.community_questions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  file_urls text[],
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  views integer DEFAULT 0,
  upvotes integer DEFAULT 0
);

-- Create answers table
CREATE TABLE IF NOT EXISTS public.community_answers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id uuid NOT NULL REFERENCES public.community_questions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  is_accepted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  upvotes integer DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.community_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_answers ENABLE ROW LEVEL SECURITY;

-- Policies for questions
CREATE POLICY "Anyone can view questions"
  ON public.community_questions
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create questions"
  ON public.community_questions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own questions"
  ON public.community_questions
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own questions"
  ON public.community_questions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for answers
CREATE POLICY "Anyone can view answers"
  ON public.community_answers
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create answers"
  ON public.community_answers
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own answers"
  ON public.community_answers
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own answers"
  ON public.community_answers
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create storage bucket for question attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('question-attachments', 'question-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for attachments
CREATE POLICY "Anyone can view attachments"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'question-attachments');

CREATE POLICY "Authenticated users can upload attachments"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'question-attachments' 
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can update own attachments"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'question-attachments' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own attachments"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'question-attachments' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );