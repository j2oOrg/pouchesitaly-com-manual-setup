-- Create storage bucket for SEO/metadata images
INSERT INTO storage.buckets (id, name, public)
VALUES ('seo-images', 'seo-images', true);

-- Allow anyone to view SEO images (public bucket)
CREATE POLICY "Anyone can view SEO images"
ON storage.objects FOR SELECT
USING (bucket_id = 'seo-images');

-- Allow admins to upload SEO images
CREATE POLICY "Admins can upload SEO images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'seo-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow admins to update SEO images
CREATE POLICY "Admins can update SEO images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'seo-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow admins to delete SEO images
CREATE POLICY "Admins can delete SEO images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'seo-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);