-- Extensions
create extension if not exists "uuid-ossp";

-- Quizzes (MCQ sets)
create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  topic text,
  created_by uuid references public.profiles(id) on delete set null,
  start_at timestamptz not null,
  end_at timestamptz not null,
  questions jsonb not null, -- [{ "q": "...", "options": ["a","b","c","d"], "answerIndex": 0 }]
  status text not null default 'draft', -- 'draft' | 'published'
  created_at timestamptz default now()
);

-- Quiz Attempts
create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  answers jsonb not null,  -- [0,2,1,...]
  score int not null,
  attempted_at timestamptz not null default now(),
  unique (quiz_id, user_id) -- one attempt per user
);

-- Enable RLS
alter table public.quizzes enable row level security;
alter table public.quiz_attempts enable row level security;

-- Helper: admin check by email
create or replace function public.is_admin_email(uid uuid)
returns boolean
language sql
stable
security definer
as $$
  select coalesce((select p.full_name is not null from public.profiles p where p.id = uid), false)
  and exists (
    select 1 from auth.users u 
    where u.id = uid 
    and u.email = 'techyogeeknirvana@gmail.com'
  );
$$;

-- Policies: quizzes
create policy "public can read published quizzes" on public.quizzes
for select using (status = 'published');

create policy "admin can manage quizzes" on public.quizzes
for all using (is_admin_email(auth.uid()))
with check (is_admin_email(auth.uid()));

-- Policies: quiz_attempts
create policy "user can read own attempts" on public.quiz_attempts
for select using (auth.uid() = user_id or is_admin_email(auth.uid()));

create policy "user can create attempt within schedule" on public.quiz_attempts
for insert with check (
  auth.uid() = user_id
  and exists (
    select 1 from public.quizzes q
    where q.id = quiz_id
      and q.status = 'published'
      and now() between q.start_at and q.end_at
  )
);

create policy "admin can update attempts" on public.quiz_attempts
for update using (is_admin_email(auth.uid()))
with check (is_admin_email(auth.uid()));