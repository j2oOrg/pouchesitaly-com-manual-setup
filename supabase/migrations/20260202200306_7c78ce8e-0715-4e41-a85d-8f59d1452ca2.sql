-- Add Italian description column to products table
ALTER TABLE public.products ADD COLUMN description_it text DEFAULT NULL;