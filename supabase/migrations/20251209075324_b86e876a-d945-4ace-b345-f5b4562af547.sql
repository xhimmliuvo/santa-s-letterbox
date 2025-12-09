-- Enable realtime for the table
ALTER PUBLICATION supabase_realtime ADD TABLE public.santa_letters;

-- Add RLS policies for reading (admin will use edge function with service role)
-- For now, allow public select since admin verification happens via password
CREATE POLICY "Anyone can read letters"
ON public.santa_letters
FOR SELECT
USING (true);

-- Allow updates (for marking as read)
CREATE POLICY "Anyone can update letters"
ON public.santa_letters
FOR UPDATE
USING (true);

-- Allow deletes
CREATE POLICY "Anyone can delete letters"
ON public.santa_letters
FOR DELETE
USING (true);