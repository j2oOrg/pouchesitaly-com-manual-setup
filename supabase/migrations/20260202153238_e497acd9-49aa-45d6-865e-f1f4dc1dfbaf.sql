-- Create app_role enum for admin roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create profiles table for user information
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Create products table
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    strength TEXT NOT NULL DEFAULT 'Regular',
    strength_mg INTEGER NOT NULL DEFAULT 6,
    flavor TEXT NOT NULL DEFAULT 'Mint',
    price NUMERIC(10,2) NOT NULL DEFAULT 4.99,
    image TEXT,
    description TEXT,
    popularity INTEGER DEFAULT 50,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

-- Profiles policies
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- User roles policies
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Products policies: Public can read active products, admins can manage all
CREATE POLICY "Anyone can view active products"
ON public.products FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can view all products"
ON public.products FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert products"
ON public.products FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update products"
ON public.products FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete products"
ON public.products FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user creation (creates profile automatically)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Insert initial products (the current product catalog)
INSERT INTO public.products (name, brand, strength, strength_mg, flavor, price, description, popularity) VALUES
('Polar Freeze 10mg', 'ZYN', 'Strong', 10, 'Mint', 4.99, 'Fresh mint flavor with strong nicotine content. Perfect for those seeking a powerful experience.', 95),
('Ice Cool 6mg', 'LYFT', 'Regular', 6, 'Mint', 4.49, 'Cooling menthol with balanced strength. A classic favorite.', 88),
('Freeze 15mg', 'VELO', 'Extra Strong', 15, 'Mint', 5.49, 'Ice cold sensation with extra high nicotine content. For the experienced user.', 92),
('Citrus 10mg', 'LYFT', 'Strong', 10, 'Citrus', 4.79, 'Zesty citrus with refreshing taste. Strong nicotine satisfaction.', 78),
('Polar Mint 6mg', 'VELO', 'Regular', 6, 'Mint', 4.49, 'Smooth mint experience with balanced strength. Great for daily use.', 85),
('Berry Frost 15mg', 'LYFT', 'Extra Strong', 15, 'Berry', 5.49, 'Mixed berries with icy finish. Maximum nicotine content.', 82),
('Spearmint 6mg', 'ZYN', 'Regular', 6, 'Mint', 4.29, 'Classic spearmint taste with smooth nicotine delivery. All-day satisfaction.', 90),
('Coffee 10mg', 'VELO', 'Strong', 10, 'Coffee', 4.99, 'Rich coffee flavor with robust nicotine kick. Perfect morning companion.', 75),
('Apple Mint 10mg', 'LYFT', 'Strong', 10, 'Fruit', 5.29, 'Crisp apple combined with cool mint. Strong nicotine satisfaction.', 80);