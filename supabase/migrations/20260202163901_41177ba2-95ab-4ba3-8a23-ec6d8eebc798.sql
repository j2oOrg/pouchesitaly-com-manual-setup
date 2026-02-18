-- Create page_metadata table for SEO management
CREATE TABLE public.page_metadata (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    page_path text NOT NULL,
    language text NOT NULL DEFAULT 'en',
    title text,
    meta_description text,
    og_title text,
    og_description text,
    og_image text,
    twitter_card text DEFAULT 'summary_large_image',
    twitter_title text,
    twitter_description text,
    twitter_image text,
    keywords text,
    canonical_url text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE (page_path, language)
);

-- Enable RLS
ALTER TABLE public.page_metadata ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read metadata (for SEO to work)
CREATE POLICY "Anyone can view page metadata"
ON public.page_metadata
FOR SELECT
USING (true);

-- Only admins can manage metadata
CREATE POLICY "Admins can insert page metadata"
ON public.page_metadata
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update page metadata"
ON public.page_metadata
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete page metadata"
ON public.page_metadata
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_page_metadata_updated_at
BEFORE UPDATE ON public.page_metadata
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default metadata for all existing pages
INSERT INTO public.page_metadata (page_path, language, title, meta_description) VALUES
-- English pages
('/', 'en', 'NicoXpress - Premium Nicotine Pouches', 'Shop the best tobacco-free nicotine pouches from top brands like ZYN, VELO, and LYFT. Fast shipping across Europe.'),
('/premium-brands', 'en', 'Premium Nicotine Brands | NicoXpress', 'Discover our curated selection of premium nicotine pouch brands including ZYN, VELO, and LYFT.'),
('/shipping-info', 'en', 'Shipping Information | NicoXpress', 'Fast and reliable shipping across Europe. Learn about our delivery times and shipping policies.'),
('/why-choose-us', 'en', 'Why Choose NicoXpress', 'Discover why thousands of customers trust NicoXpress for their nicotine pouch needs.'),
('/strengths-guide', 'en', 'Nicotine Strengths Guide | NicoXpress', 'Find the perfect nicotine strength for your needs with our comprehensive guide.'),
('/tobacco-free', 'en', 'Tobacco-Free Products | NicoXpress', 'All our products are 100% tobacco-free. Experience clean nicotine satisfaction.'),
('/faq', 'en', 'Frequently Asked Questions | NicoXpress', 'Get answers to common questions about nicotine pouches and our services.'),
-- Italian pages
('/', 'it', 'NicoXpress - Bustine di Nicotina Premium', 'Acquista le migliori bustine di nicotina senza tabacco dai migliori marchi come ZYN, VELO e LYFT.'),
('/snus-brands', 'it', 'Marchi di Snus | NicoXpress', 'Scopri i marchi di snus più popolari come ZYN e VELO disponibili su NicoXpress.'),
('/snus-cose', 'it', 'Cos''è lo Snus | NicoXpress', 'Scopri tutto sullo snus e le bustine di nicotina senza tabacco.'),
('/spedizione-snus', 'it', 'Spedizione Snus in Italia | NicoXpress', 'Spedizione veloce e affidabile in tutta Italia. Scopri i nostri tempi di consegna.'),
('/perche-scegliere-nicoxpress', 'it', 'Perché Scegliere NicoXpress', 'Scopri perché migliaia di clienti si affidano a NicoXpress per le loro bustine di nicotina.'),
('/guida-intensita-gusti', 'it', 'Guida Intensità e Gusti | NicoXpress', 'Trova l''intensità e il gusto perfetti per le tue esigenze con la nostra guida.'),
('/snus-vs-nicotine-pouches', 'it', 'Snus vs Nicotine Pouches | NicoXpress', 'Scopri le differenze tra snus tradizionale e le moderne bustine di nicotina.'),
('/domande-frequenti-snus', 'it', 'Domande Frequenti sullo Snus | NicoXpress', 'Risposte alle domande più comuni sullo snus e le bustine di nicotina.');