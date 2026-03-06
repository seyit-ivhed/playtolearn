-- Play events table for first-party anonymous analytics
-- No personal identifiers are stored. session_id is a memory-only UUID
-- generated fresh per app load and is never written to localStorage.

CREATE TABLE IF NOT EXISTS public.play_events (
    id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id  text        NOT NULL,
    event_type  text        NOT NULL,
    payload     jsonb,
    attribution jsonb,
    created_at  timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.play_events ENABLE ROW LEVEL SECURITY;

-- Allow anonymous and authenticated users to insert events (fire-and-forget)
CREATE POLICY "Allow insert for all users"
    ON public.play_events
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);
