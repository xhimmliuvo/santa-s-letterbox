-- Create santa_letters table
CREATE TABLE public.santa_letters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER,
  email TEXT,
  phone TEXT,
  behavior TEXT NOT NULL DEFAULT 'nice' CHECK (behavior IN ('nice', 'naughty')),
  wishlist TEXT NOT NULL,
  image_url TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.santa_letters ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (children can submit without auth)
CREATE POLICY "Anyone can submit a letter"
ON public.santa_letters
FOR INSERT
WITH CHECK (true);

-- Create storage bucket for letter images
INSERT INTO storage.buckets (id, name, public)
VALUES ('letter-images', 'letter-images', true);

-- Allow anyone to upload images to the bucket
CREATE POLICY "Anyone can upload letter images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'letter-images');

-- Allow anyone to view images (public bucket)
CREATE POLICY "Anyone can view letter images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'letter-images');