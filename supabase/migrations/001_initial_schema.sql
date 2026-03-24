-- Profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  polar_customer_id TEXT,
  subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro')),
  subscription_status TEXT DEFAULT 'inactive',
  polar_subscription_id TEXT,
  trial_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Stores
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE CHECK (slug NOT IN ('app', 'api', 'admin', 'www')),
  name TEXT NOT NULL,
  description TEXT,
  design_settings JSONB NOT NULL DEFAULT '{}',
  language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en','fr','ar','es','pt','de','it','nl','tr','ru','zh','ja','ko','hi','id','ms','pl','sv','th','vi')),
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_methods TEXT[] DEFAULT '{cod}' CHECK (payment_methods = '{cod}'),
  is_published BOOLEAN NOT NULL DEFAULT false,
  custom_domain TEXT UNIQUE,
  domain_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_stores_owner ON stores(owner_id);
CREATE INDEX idx_stores_custom_domain ON stores(custom_domain) WHERE custom_domain IS NOT NULL;

-- Collections
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(store_id, slug)
);
CREATE INDEX idx_collections_store ON collections(store_id);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  collection_id UUID REFERENCES collections(id) ON DELETE SET NULL,
  slug TEXT,
  sku TEXT,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  image_urls TEXT[] DEFAULT '{}' CHECK (array_length(image_urls, 1) IS NULL OR array_length(image_urls, 1) <= 20),
  options JSONB NOT NULL DEFAULT '[]',
  faqs JSONB NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft')),
  stock INTEGER,
  is_available BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_products_store ON products(store_id);
CREATE INDEX idx_products_collection ON products(collection_id);
CREATE UNIQUE INDEX idx_products_store_slug ON products(store_id, slug);

-- Product Variants
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  options JSONB NOT NULL DEFAULT '{}',
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  stock INTEGER,
  sku TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_variants_product ON product_variants(product_id);

-- Discounts (coupon codes + automatic discounts)
CREATE TABLE discounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'code' CHECK (type IN ('code')),
  code TEXT,
  label TEXT DEFAULT '',
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  minimum_order_amount DECIMAL(10,2),
  max_uses INTEGER,
  max_uses_per_customer INTEGER,
  times_used INTEGER NOT NULL DEFAULT 0,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  market_ids UUID[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX idx_discounts_code ON discounts(store_id, code) WHERE code IS NOT NULL;
CREATE INDEX idx_discounts_store ON discounts(store_id);
CREATE INDEX idx_discounts_active ON discounts(store_id, is_active) WHERE is_active = true;

-- Markets (multi-market support per store)
CREATE TABLE markets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  countries TEXT[] NOT NULL DEFAULT '{}',
  currency TEXT NOT NULL,
  pricing_mode TEXT NOT NULL DEFAULT 'auto' CHECK (pricing_mode IN ('fixed', 'auto')),
  price_adjustment DECIMAL(5,2) NOT NULL DEFAULT 0,
  rounding_rule TEXT NOT NULL DEFAULT 'none' CHECK (rounding_rule IN ('none','0.99','0.95','0.00','nearest_5')),
  manual_exchange_rate DECIMAL(18,8),
  is_default BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(store_id, slug)
);
CREATE INDEX idx_markets_store ON markets(store_id);
CREATE INDEX idx_markets_active ON markets(store_id, is_active) WHERE is_active = true;

-- Market Prices (per-market fixed pricing overrides)
CREATE TABLE market_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id UUID NOT NULL REFERENCES markets(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2)
);
CREATE UNIQUE INDEX idx_market_prices_product_unique
  ON market_prices(market_id, product_id) WHERE variant_id IS NULL;
CREATE UNIQUE INDEX idx_market_prices_variant_unique
  ON market_prices(market_id, product_id, variant_id) WHERE variant_id IS NOT NULL;
CREATE INDEX idx_market_prices_market ON market_prices(market_id);
CREATE INDEX idx_market_prices_product ON market_prices(product_id);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  order_number INTEGER NOT NULL DEFAULT 0,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  customer_city TEXT,
  customer_country TEXT NOT NULL DEFAULT 'Unknown',
  customer_address TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'returned', 'canceled')),
  payment_method TEXT NOT NULL DEFAULT 'cod' CHECK (payment_method = 'cod'),
  subtotal DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  discount_id UUID REFERENCES discounts(id) ON DELETE SET NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  note TEXT,
  ip_address TEXT,
  market_id UUID REFERENCES markets(id) ON DELETE SET NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_orders_store ON orders(store_id);
CREATE INDEX idx_orders_status ON orders(store_id, status);
CREATE INDEX idx_orders_created_at ON orders(store_id, created_at DESC);
CREATE UNIQUE INDEX idx_orders_store_number ON orders(store_id, order_number);

-- Auto-assign per-store sequential order number
CREATE OR REPLACE FUNCTION public.set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  SELECT COALESCE(MAX(order_number), 14) + 1 INTO NEW.order_number
  FROM public.orders
  WHERE store_id = NEW.store_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION public.set_order_number();

-- Order Items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_price DECIMAL(10,2) NOT NULL,
  variant_options JSONB,
  quantity INTEGER NOT NULL DEFAULT 1,
  image_url TEXT
);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- Store Views Hourly (aggregated visitor tracking — one row per store per hour per market)
CREATE TABLE store_views_hourly (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  market_id UUID REFERENCES markets(id) ON DELETE SET NULL,
  view_hour TIMESTAMPTZ NOT NULL DEFAULT date_trunc('hour', now()),
  view_count INTEGER NOT NULL DEFAULT 1
);
CREATE UNIQUE INDEX idx_store_views_hourly_upsert
  ON store_views_hourly (store_id, view_hour, COALESCE(market_id, '00000000-0000-0000-0000-000000000000'));

-- Store Images (central gallery)
CREATE TABLE store_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_store_images_store ON store_images(store_id);

-- Increment discount usage counter (atomic)
CREATE OR REPLACE FUNCTION public.increment_discount_usage(p_discount_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.discounts
  SET times_used = times_used + 1
  WHERE id = p_discount_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Atomic stock decrement (returns false if insufficient stock)
CREATE OR REPLACE FUNCTION public.decrement_stock(
  p_items JSONB -- array of { product_id, variant_id, quantity }
) RETURNS BOOLEAN AS $$
DECLARE
  item RECORD;
  current_stock INTEGER;
BEGIN
  FOR item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(product_id UUID, variant_id UUID, quantity INTEGER)
  LOOP
    IF item.variant_id IS NOT NULL THEN
      SELECT stock INTO current_stock FROM public.product_variants WHERE id = item.variant_id FOR UPDATE;
      IF current_stock IS NOT NULL THEN
        IF current_stock < item.quantity THEN RETURN FALSE; END IF;
        UPDATE public.product_variants SET stock = stock - item.quantity WHERE id = item.variant_id;
      END IF;
    ELSE
      SELECT stock INTO current_stock FROM public.products WHERE id = item.product_id FOR UPDATE;
      IF current_stock IS NOT NULL THEN
        IF current_stock < item.quantity THEN RETURN FALSE; END IF;
        UPDATE public.products SET stock = stock - item.quantity WHERE id = item.product_id;
      END IF;
    END IF;
  END LOOP;
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Increment store view (atomic upsert for hourly counter per market)
CREATE OR REPLACE FUNCTION public.increment_store_view(p_store_id UUID, p_hour TIMESTAMPTZ, p_market_id UUID DEFAULT NULL)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.store_views_hourly (store_id, view_hour, market_id, view_count)
  VALUES (p_store_id, p_hour, p_market_id, 1)
  ON CONFLICT (store_id, view_hour, COALESCE(market_id, '00000000-0000-0000-0000-000000000000'))
  DO UPDATE SET view_count = store_views_hourly.view_count + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = '';

CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON stores FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON discounts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON markets FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON shipping_zones FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON store_integrations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON abandoned_checkouts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-generate unique product slug on INSERT (immutable after creation unless explicitly changed)
CREATE OR REPLACE FUNCTION public.generate_product_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 2;
BEGIN
  -- Auto-generate slug from name if not provided
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    base_slug := lower(trim(regexp_replace(regexp_replace(NEW.name, '[^\w\s-]', '', 'g'), '[\s_-]+', '-', 'g'), '-'));
    IF base_slug = '' THEN
      base_slug := 'product';
    END IF;
  ELSE
    base_slug := NEW.slug;
  END IF;
  -- Ensure uniqueness within the store
  final_slug := base_slug;
  LOOP
    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM products WHERE store_id = NEW.store_id AND slug = final_slug AND id IS DISTINCT FROM NEW.id
    );
    final_slug := base_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;
  NEW.slug := final_slug;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = '';

CREATE TRIGGER generate_product_slug BEFORE INSERT ON products FOR EACH ROW EXECUTE FUNCTION public.generate_product_slug();

-- Auto-create profile on signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, subscription_status, trial_ends_at)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    'trialing',
    now() + interval '14 days'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Row Level Security

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING ((select auth.uid()) = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING ((select auth.uid()) = id);

-- Stores
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published stores" ON stores FOR SELECT USING (is_published = true);
CREATE POLICY "Owners can view own stores" ON stores FOR SELECT USING ((select auth.uid()) = owner_id);
CREATE POLICY "Owners can insert stores" ON stores FOR INSERT WITH CHECK ((select auth.uid()) = owner_id);
CREATE POLICY "Owners can update own stores" ON stores FOR UPDATE USING ((select auth.uid()) = owner_id);
CREATE POLICY "Owners can delete own stores" ON stores FOR DELETE USING ((select auth.uid()) = owner_id);

-- Products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view products of published stores" ON products FOR SELECT
  USING (EXISTS (SELECT 1 FROM stores WHERE stores.id = products.store_id AND (stores.is_published = true OR stores.owner_id = (select auth.uid()))));
CREATE POLICY "Owners can insert products" ON products FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM stores WHERE stores.id = products.store_id AND stores.owner_id = (select auth.uid())));
CREATE POLICY "Owners can update products" ON products FOR UPDATE
  USING (EXISTS (SELECT 1 FROM stores WHERE stores.id = products.store_id AND stores.owner_id = (select auth.uid())));
CREATE POLICY "Owners can delete products" ON products FOR DELETE
  USING (EXISTS (SELECT 1 FROM stores WHERE stores.id = products.store_id AND stores.owner_id = (select auth.uid())));

-- Product Variants
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view variants of published stores" ON product_variants FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM products JOIN stores ON stores.id = products.store_id
    WHERE products.id = product_variants.product_id AND (stores.is_published = true OR stores.owner_id = (select auth.uid()))
  ));
CREATE POLICY "Owners can insert variants" ON product_variants FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM products JOIN stores ON stores.id = products.store_id
    WHERE products.id = product_variants.product_id AND stores.owner_id = (select auth.uid())
  ));
CREATE POLICY "Owners can update variants" ON product_variants FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM products JOIN stores ON stores.id = products.store_id
    WHERE products.id = product_variants.product_id AND stores.owner_id = (select auth.uid())
  ));
CREATE POLICY "Owners can delete variants" ON product_variants FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM products JOIN stores ON stores.id = products.store_id
    WHERE products.id = product_variants.product_id AND stores.owner_id = (select auth.uid())
  ));

-- Collections
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view collections of published stores" ON collections FOR SELECT
  USING (EXISTS (SELECT 1 FROM stores WHERE stores.id = collections.store_id AND (stores.is_published = true OR stores.owner_id = (select auth.uid()))));
CREATE POLICY "Owners can insert collections" ON collections FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM stores WHERE stores.id = collections.store_id AND stores.owner_id = (select auth.uid())));
CREATE POLICY "Owners can update collections" ON collections FOR UPDATE
  USING (EXISTS (SELECT 1 FROM stores WHERE stores.id = collections.store_id AND stores.owner_id = (select auth.uid())));
CREATE POLICY "Owners can delete collections" ON collections FOR DELETE
  USING (EXISTS (SELECT 1 FROM stores WHERE stores.id = collections.store_id AND stores.owner_id = (select auth.uid())));

-- Discounts
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active discounts of published stores" ON discounts FOR SELECT
  USING (is_active = true AND EXISTS (SELECT 1 FROM stores WHERE stores.id = discounts.store_id AND stores.is_published = true));
CREATE POLICY "Owners can view own discounts" ON discounts FOR SELECT
  USING (EXISTS (SELECT 1 FROM stores WHERE stores.id = discounts.store_id AND stores.owner_id = (select auth.uid())));
CREATE POLICY "Owners can insert discounts" ON discounts FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM stores WHERE stores.id = discounts.store_id AND stores.owner_id = (select auth.uid())));
CREATE POLICY "Owners can update discounts" ON discounts FOR UPDATE
  USING (EXISTS (SELECT 1 FROM stores WHERE stores.id = discounts.store_id AND stores.owner_id = (select auth.uid())));
CREATE POLICY "Owners can delete discounts" ON discounts FOR DELETE
  USING (EXISTS (SELECT 1 FROM stores WHERE stores.id = discounts.store_id AND stores.owner_id = (select auth.uid())));

-- Orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- No INSERT policy — all writes go through service-role admin client in the orders API
CREATE POLICY "Owners can view orders" ON orders FOR SELECT
  USING (EXISTS (SELECT 1 FROM stores WHERE stores.id = orders.store_id AND stores.owner_id = (select auth.uid())));
CREATE POLICY "Owners can update orders" ON orders FOR UPDATE
  USING (EXISTS (SELECT 1 FROM stores WHERE stores.id = orders.store_id AND stores.owner_id = (select auth.uid())));

-- Order Items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
-- No INSERT/UPDATE/DELETE policies — writes happen via service-role (admin client) in the orders API
CREATE POLICY "Owners can view order items" ON order_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM orders
    JOIN stores ON stores.id = orders.store_id
    WHERE orders.id = order_items.order_id AND stores.owner_id = (select auth.uid())
  ));

-- Store Views Hourly
ALTER TABLE store_views_hourly ENABLE ROW LEVEL SECURITY;
-- No INSERT/UPDATE policies — writes go through SECURITY DEFINER function increment_store_view()
CREATE POLICY "Owners can view store views" ON store_views_hourly FOR SELECT
  USING (EXISTS (SELECT 1 FROM stores WHERE stores.id = store_views_hourly.store_id AND stores.owner_id = (select auth.uid())));

-- Store Images
ALTER TABLE store_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners can view own store images" ON store_images FOR SELECT
  USING (EXISTS (SELECT 1 FROM stores WHERE stores.id = store_images.store_id AND stores.owner_id = (select auth.uid())));
CREATE POLICY "Public can view images of published stores" ON store_images FOR SELECT
  USING (EXISTS (SELECT 1 FROM stores WHERE stores.id = store_images.store_id AND stores.is_published = true));
CREATE POLICY "Owners can insert store images" ON store_images FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM stores WHERE stores.id = store_images.store_id AND stores.owner_id = (select auth.uid())));
CREATE POLICY "Owners can delete store images" ON store_images FOR DELETE
  USING (EXISTS (SELECT 1 FROM stores WHERE stores.id = store_images.store_id AND stores.owner_id = (select auth.uid())));

-- Markets
ALTER TABLE markets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active markets of published stores" ON markets
  FOR SELECT USING (
    is_active = true AND EXISTS (
      SELECT 1 FROM stores WHERE stores.id = markets.store_id AND stores.is_published = true
    )
  );
CREATE POLICY "Owners can view own markets" ON markets
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM stores WHERE stores.id = markets.store_id AND stores.owner_id = (select auth.uid())
  ));
CREATE POLICY "Owners can insert markets" ON markets
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM stores WHERE stores.id = markets.store_id AND stores.owner_id = (select auth.uid())
  ));
CREATE POLICY "Owners can update markets" ON markets
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM stores WHERE stores.id = markets.store_id AND stores.owner_id = (select auth.uid())
  ));
CREATE POLICY "Owners can delete markets" ON markets
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM stores WHERE stores.id = markets.store_id AND stores.owner_id = (select auth.uid())
  ));

-- Market Prices
ALTER TABLE market_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view market prices of published stores" ON market_prices
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM markets
    JOIN stores ON stores.id = markets.store_id
    WHERE markets.id = market_prices.market_id
    AND markets.is_active = true
    AND stores.is_published = true
  ));
CREATE POLICY "Owners can view own market prices" ON market_prices
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM markets
    JOIN stores ON stores.id = markets.store_id
    WHERE markets.id = market_prices.market_id
    AND stores.owner_id = (select auth.uid())
  ));
CREATE POLICY "Owners can insert market prices" ON market_prices
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM markets
    JOIN stores ON stores.id = markets.store_id
    WHERE markets.id = market_prices.market_id
    AND stores.owner_id = (select auth.uid())
  ));
CREATE POLICY "Owners can update market prices" ON market_prices
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM markets
    JOIN stores ON stores.id = markets.store_id
    WHERE markets.id = market_prices.market_id
    AND stores.owner_id = (select auth.uid())
  ));
CREATE POLICY "Owners can delete market prices" ON market_prices
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM markets
    JOIN stores ON stores.id = markets.store_id
    WHERE markets.id = market_prices.market_id
    AND stores.owner_id = (select auth.uid())
  ));

-- Market Exclusions (products hidden per market)
CREATE TABLE market_exclusions (
  market_id UUID NOT NULL REFERENCES markets(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  PRIMARY KEY (market_id, product_id)
);
CREATE INDEX idx_market_exclusions_market ON market_exclusions(market_id);
CREATE INDEX idx_market_exclusions_product ON market_exclusions(product_id);

ALTER TABLE market_exclusions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view market exclusions of published stores" ON market_exclusions
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM markets
    JOIN stores ON stores.id = markets.store_id
    WHERE markets.id = market_exclusions.market_id
    AND markets.is_active = true
    AND stores.is_published = true
  ));
CREATE POLICY "Owners can view own market exclusions" ON market_exclusions
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM markets
    JOIN stores ON stores.id = markets.store_id
    WHERE markets.id = market_exclusions.market_id
    AND stores.owner_id = (select auth.uid())
  ));
CREATE POLICY "Owners can insert market exclusions" ON market_exclusions
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM markets
    JOIN stores ON stores.id = markets.store_id
    WHERE markets.id = market_exclusions.market_id
    AND stores.owner_id = (select auth.uid())
  ));
CREATE POLICY "Owners can delete market exclusions" ON market_exclusions
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM markets
    JOIN stores ON stores.id = markets.store_id
    WHERE markets.id = market_exclusions.market_id
    AND stores.owner_id = (select auth.uid())
  ));

-- Exchange Rate Cache (last-known-good rates for resilience)
CREATE TABLE exchange_rate_cache (
  base_currency TEXT NOT NULL,
  target_currency TEXT NOT NULL,
  rate DECIMAL(18,8) NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (base_currency, target_currency)
);

ALTER TABLE exchange_rate_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read exchange rates" ON exchange_rate_cache
  FOR SELECT USING (true);

-- Shipping Zones (per-country delivery fee config)
CREATE TABLE shipping_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  market_id UUID REFERENCES markets(id) ON DELETE CASCADE,
  country_code TEXT NOT NULL,
  country_name TEXT NOT NULL,
  default_rate DECIMAL(10,2) NOT NULL DEFAULT 0,
  free_shipping_threshold DECIMAL(10,2) DEFAULT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX idx_shipping_zones_store_country_market
  ON shipping_zones (store_id, country_code, COALESCE(market_id, '00000000-0000-0000-0000-000000000000'));
CREATE INDEX idx_shipping_zones_store ON shipping_zones(store_id);
CREATE INDEX idx_shipping_zones_active ON shipping_zones(store_id, is_active) WHERE is_active = true;

-- Shipping City Rates (per-city overrides within a zone)
CREATE TABLE shipping_city_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id UUID NOT NULL REFERENCES shipping_zones(id) ON DELETE CASCADE,
  city_name TEXT NOT NULL,
  rate DECIMAL(10,2),
  is_excluded BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(zone_id, city_name)
);
CREATE INDEX idx_shipping_city_rates_zone ON shipping_city_rates(zone_id);

ALTER TABLE shipping_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active shipping zones of published stores" ON shipping_zones
  FOR SELECT USING (
    is_active = true AND EXISTS (
      SELECT 1 FROM stores WHERE stores.id = shipping_zones.store_id AND stores.is_published = true
    )
  );
CREATE POLICY "Owners can view own shipping zones" ON shipping_zones
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM stores WHERE stores.id = shipping_zones.store_id AND stores.owner_id = (select auth.uid())
  ));
CREATE POLICY "Owners can insert shipping zones" ON shipping_zones
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM stores WHERE stores.id = shipping_zones.store_id AND stores.owner_id = (select auth.uid())
  ));
CREATE POLICY "Owners can update shipping zones" ON shipping_zones
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM stores WHERE stores.id = shipping_zones.store_id AND stores.owner_id = (select auth.uid())
  ));
CREATE POLICY "Owners can delete shipping zones" ON shipping_zones
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM stores WHERE stores.id = shipping_zones.store_id AND stores.owner_id = (select auth.uid())
  ));

ALTER TABLE shipping_city_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view city rates of published stores" ON shipping_city_rates
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM shipping_zones
    JOIN stores ON stores.id = shipping_zones.store_id
    WHERE shipping_zones.id = shipping_city_rates.zone_id
    AND shipping_zones.is_active = true
    AND stores.is_published = true
  ));
CREATE POLICY "Owners can view own city rates" ON shipping_city_rates
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM shipping_zones
    JOIN stores ON stores.id = shipping_zones.store_id
    WHERE shipping_zones.id = shipping_city_rates.zone_id
    AND stores.owner_id = (select auth.uid())
  ));
CREATE POLICY "Owners can insert city rates" ON shipping_city_rates
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM shipping_zones
    JOIN stores ON stores.id = shipping_zones.store_id
    WHERE shipping_zones.id = shipping_city_rates.zone_id
    AND stores.owner_id = (select auth.uid())
  ));
CREATE POLICY "Owners can update city rates" ON shipping_city_rates
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM shipping_zones
    JOIN stores ON stores.id = shipping_zones.store_id
    WHERE shipping_zones.id = shipping_city_rates.zone_id
    AND stores.owner_id = (select auth.uid())
  ));
CREATE POLICY "Owners can delete city rates" ON shipping_city_rates
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM shipping_zones
    JOIN stores ON stores.id = shipping_zones.store_id
    WHERE shipping_zones.id = shipping_city_rates.zone_id
    AND stores.owner_id = (select auth.uid())
  ));

-- Store Integrations (installed apps per store)
CREATE TABLE store_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  integration_id TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',
  installed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(store_id, integration_id)
);
CREATE INDEX idx_store_integrations_store ON store_integrations(store_id);

ALTER TABLE store_integrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners can view own integrations" ON store_integrations FOR SELECT
  USING (EXISTS (SELECT 1 FROM stores WHERE stores.id = store_integrations.store_id AND stores.owner_id = (select auth.uid())));
CREATE POLICY "Owners can insert integrations" ON store_integrations FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM stores WHERE stores.id = store_integrations.store_id AND stores.owner_id = (select auth.uid())));
CREATE POLICY "Owners can update integrations" ON store_integrations FOR UPDATE
  USING (EXISTS (SELECT 1 FROM stores WHERE stores.id = store_integrations.store_id AND stores.owner_id = (select auth.uid())));
CREATE POLICY "Owners can delete integrations" ON store_integrations FOR DELETE
  USING (EXISTS (SELECT 1 FROM stores WHERE stores.id = store_integrations.store_id AND stores.owner_id = (select auth.uid())));

-- Integration Events (event log for webhook dispatch)
CREATE TABLE integration_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  integration_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'abandoned')),
  error TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  max_retries INTEGER NOT NULL DEFAULT 3,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_integration_events_store ON integration_events(store_id);
CREATE INDEX idx_integration_events_status ON integration_events(status) WHERE status = 'pending';
CREATE INDEX idx_integration_events_failed_retryable ON integration_events(status, retry_count, max_retries)
  WHERE status = 'failed';

-- Retry failed integration events: re-inserts failed events as new pending rows
-- so the Supabase webhook (on INSERT) picks them up again.
-- Call via pg_cron: SELECT public.retry_failed_integration_events();
CREATE OR REPLACE FUNCTION public.retry_failed_integration_events()
RETURNS INTEGER AS $$
DECLARE
  retried INTEGER := 0;
  rec RECORD;
BEGIN
  FOR rec IN
    SELECT id, store_id, integration_id, event_type, payload, retry_count, max_retries
    FROM public.integration_events
    WHERE status = 'failed'
      AND retry_count < max_retries
      AND integration_id != '_trigger'
    ORDER BY created_at ASC
    LIMIT 50
    FOR UPDATE SKIP LOCKED
  LOOP
    -- Insert a new pending row (triggers the Supabase webhook on INSERT)
    INSERT INTO public.integration_events (store_id, integration_id, event_type, payload, status, retry_count, max_retries)
    VALUES (rec.store_id, rec.integration_id, rec.event_type, rec.payload, 'pending', rec.retry_count, rec.max_retries);

    -- Mark the original failed row as abandoned so it's not retried again
    UPDATE public.integration_events SET status = 'abandoned' WHERE id = rec.id;

    retried := retried + 1;
  END LOOP;

  RETURN retried;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

ALTER TABLE integration_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners can view own events" ON integration_events FOR SELECT
  USING (EXISTS (SELECT 1 FROM stores WHERE stores.id = integration_events.store_id AND stores.owner_id = (select auth.uid())));
CREATE POLICY "Owners can delete own events" ON integration_events FOR DELETE
  USING (EXISTS (SELECT 1 FROM stores WHERE stores.id = integration_events.store_id AND stores.owner_id = (select auth.uid())));

-- Trigger: log event when order is created
CREATE OR REPLACE FUNCTION public.handle_order_created()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.store_integrations
    WHERE store_id = NEW.store_id
  ) THEN
    INSERT INTO public.integration_events (store_id, integration_id, event_type, payload)
    VALUES (
      NEW.store_id,
      '_trigger',
      'order.created',
      jsonb_build_object(
        'order_id', NEW.id,
        'order_number', NEW.order_number,
        'store_id', NEW.store_id,
        'customer_name', NEW.customer_name,
        'customer_phone', NEW.customer_phone,
        'customer_email', NEW.customer_email,
        'customer_city', NEW.customer_city,
        'customer_country', NEW.customer_country,
        'customer_address', NEW.customer_address,
        'status', NEW.status,
        'total', NEW.total,
        'subtotal', NEW.subtotal,
        'discount_id', NEW.discount_id,
        'discount_amount', NEW.discount_amount,
        'note', NEW.note,
        'ip_address', NEW.ip_address,
        'market_id', NEW.market_id,
        'currency', NEW.currency,
        'delivery_fee', NEW.delivery_fee,
        'created_at', NEW.created_at
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE TRIGGER on_order_created
  AFTER INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_order_created();

-- Trigger: log event when order status changes
CREATE OR REPLACE FUNCTION public.handle_order_status_changed()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    IF EXISTS (
      SELECT 1 FROM public.store_integrations
      WHERE store_id = NEW.store_id
    ) THEN
      INSERT INTO public.integration_events (store_id, integration_id, event_type, payload)
      VALUES (
        NEW.store_id,
        '_trigger',
        'order.status_changed',
        jsonb_build_object(
          'order_id', NEW.id,
          'order_number', NEW.order_number,
          'store_id', NEW.store_id,
          'customer_name', NEW.customer_name,
          'customer_phone', NEW.customer_phone,
          'customer_email', NEW.customer_email,
          'customer_country', NEW.customer_country,
          'customer_city', NEW.customer_city,
          'customer_address', NEW.customer_address,
          'old_status', OLD.status,
          'new_status', NEW.status,
          'total', NEW.total,
          'subtotal', NEW.subtotal,
          'discount_id', NEW.discount_id,
          'discount_amount', NEW.discount_amount,
          'note', NEW.note,
          'ip_address', NEW.ip_address,
          'market_id', NEW.market_id,
          'currency', NEW.currency,
          'delivery_fee', NEW.delivery_fee,
          'updated_at', now()
        )
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE TRIGGER on_order_status_changed
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_order_status_changed();

-- ===================================================
-- Abandoned Checkouts (checkout recovery tracking)
-- ===================================================

CREATE TABLE abandoned_checkouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  customer_phone TEXT NOT NULL,
  customer_name TEXT,
  customer_email TEXT,
  customer_country TEXT,
  customer_city TEXT,
  customer_address TEXT,
  cart_items JSONB NOT NULL DEFAULT '[]',
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount_code TEXT,
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL,
  market_id UUID REFERENCES markets(id) ON DELETE SET NULL,
  recovery_token TEXT NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'sent', 'recovered', 'expired')),
  recovered_order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  sent_at TIMESTAMPTZ,
  recovered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_abandoned_checkouts_token
  ON abandoned_checkouts(recovery_token);

CREATE INDEX idx_abandoned_checkouts_store ON abandoned_checkouts(store_id);
CREATE INDEX idx_abandoned_checkouts_status ON abandoned_checkouts(status, created_at)
  WHERE status = 'pending';

ALTER TABLE abandoned_checkouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view abandoned checkouts" ON abandoned_checkouts
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM stores WHERE stores.id = abandoned_checkouts.store_id
    AND stores.owner_id = (select auth.uid())
  ));

CREATE POLICY "Owners can update abandoned checkouts" ON abandoned_checkouts
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM stores WHERE stores.id = abandoned_checkouts.store_id
    AND stores.owner_id = (select auth.uid())
  ));

-- No INSERT policy — writes go through SECURITY DEFINER function upsert_abandoned_checkout()

CREATE OR REPLACE FUNCTION public.upsert_abandoned_checkout(
  p_store_id UUID,
  p_customer_phone TEXT,
  p_customer_name TEXT DEFAULT NULL,
  p_customer_email TEXT DEFAULT NULL,
  p_customer_country TEXT DEFAULT NULL,
  p_customer_city TEXT DEFAULT NULL,
  p_customer_address TEXT DEFAULT NULL,
  p_cart_items JSONB DEFAULT '[]',
  p_subtotal DECIMAL DEFAULT 0,
  p_total DECIMAL DEFAULT 0,
  p_currency TEXT DEFAULT 'USD',
  p_delivery_fee DECIMAL DEFAULT 0,
  p_discount_code TEXT DEFAULT NULL,
  p_discount_amount DECIMAL DEFAULT 0,
  p_market_id UUID DEFAULT NULL,
  p_recovery_token TEXT DEFAULT NULL
) RETURNS TABLE(checkout_id UUID, checkout_token TEXT) AS $$
BEGIN
  IF p_recovery_token IS NOT NULL THEN
    UPDATE public.abandoned_checkouts SET
      customer_phone = p_customer_phone,
      customer_name = COALESCE(p_customer_name, abandoned_checkouts.customer_name),
      customer_email = COALESCE(p_customer_email, abandoned_checkouts.customer_email),
      customer_country = COALESCE(p_customer_country, abandoned_checkouts.customer_country),
      customer_city = COALESCE(p_customer_city, abandoned_checkouts.customer_city),
      customer_address = COALESCE(p_customer_address, abandoned_checkouts.customer_address),
      cart_items = p_cart_items,
      subtotal = p_subtotal,
      delivery_fee = p_delivery_fee,
      discount_code = p_discount_code,
      discount_amount = p_discount_amount,
      total = p_total,
      currency = p_currency,
      market_id = p_market_id,
      status = 'pending',
      updated_at = now()
    WHERE recovery_token = p_recovery_token
      AND store_id = p_store_id
      AND status IN ('pending', 'sent')
    RETURNING id, recovery_token INTO checkout_id, checkout_token;

    IF FOUND THEN RETURN NEXT; RETURN; END IF;
  END IF;

  INSERT INTO public.abandoned_checkouts (
    store_id, customer_phone, customer_name, customer_email,
    customer_country, customer_city, customer_address,
    cart_items, subtotal, delivery_fee, discount_code, discount_amount,
    total, currency, market_id, status, updated_at
  ) VALUES (
    p_store_id, p_customer_phone, p_customer_name, p_customer_email,
    p_customer_country, p_customer_city, p_customer_address,
    p_cart_items, p_subtotal, p_delivery_fee, p_discount_code, p_discount_amount,
    p_total, p_currency, p_market_id, 'pending', now()
  )
  RETURNING id, recovery_token INTO checkout_id, checkout_token;
  RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

GRANT EXECUTE ON FUNCTION public.upsert_abandoned_checkout TO anon;
GRANT EXECUTE ON FUNCTION public.upsert_abandoned_checkout TO authenticated;

-- Order Confirmations (WhatsApp COD confirmation tracking)
CREATE TABLE order_confirmations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  customer_phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'canceled')),
  sent_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_order_confirmations_order ON order_confirmations(order_id);
CREATE INDEX idx_order_confirmations_pending ON order_confirmations(customer_phone, store_id)
  WHERE status = 'pending';

ALTER TABLE order_confirmations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view order confirmations" ON order_confirmations
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM stores WHERE stores.id = order_confirmations.store_id
    AND stores.owner_id = (select auth.uid())
  ));

-- Enforce valid order status transitions
CREATE OR REPLACE FUNCTION public.enforce_order_status_transition()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status = 'pending' AND NEW.status NOT IN ('confirmed', 'canceled') THEN
    RAISE EXCEPTION 'Invalid transition from pending to %', NEW.status;
  END IF;
  IF OLD.status = 'confirmed' AND NEW.status NOT IN ('shipped', 'canceled') THEN
    RAISE EXCEPTION 'Invalid transition from confirmed to %', NEW.status;
  END IF;
  IF OLD.status = 'shipped' AND NEW.status NOT IN ('delivered', 'returned') THEN
    RAISE EXCEPTION 'Invalid transition from shipped to %', NEW.status;
  END IF;
  IF OLD.status IN ('delivered', 'returned', 'canceled') THEN
    RAISE EXCEPTION 'Cannot change status of a % order', OLD.status;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = '';

CREATE TRIGGER enforce_status_transition
  BEFORE UPDATE OF status ON orders
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION public.enforce_order_status_transition();

-- ============================================================
-- Customers (auto-populated from orders via trigger)
-- ============================================================

-- Phone normalization function (E.164-like, handles MENA formats)
CREATE OR REPLACE FUNCTION public.normalize_phone(phone TEXT, country TEXT DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
  cleaned TEXT;
  code_map JSONB := '{
    "AF":"93","Afghanistan":"93",
    "AL":"355","Albania":"355",
    "DZ":"213","Algeria":"213",
    "AD":"376","Andorra":"376",
    "AO":"244","Angola":"244",
    "AG":"1268","Antigua and Barbuda":"1268",
    "AR":"54","Argentina":"54",
    "AM":"374","Armenia":"374",
    "AU":"61","Australia":"61",
    "AT":"43","Austria":"43",
    "AZ":"994","Azerbaijan":"994",
    "BS":"1242","Bahamas":"1242",
    "BH":"973","Bahrain":"973",
    "BD":"880","Bangladesh":"880",
    "BB":"1246","Barbados":"1246",
    "BY":"375","Belarus":"375",
    "BE":"32","Belgium":"32",
    "BZ":"501","Belize":"501",
    "BJ":"229","Benin":"229",
    "BT":"975","Bhutan":"975",
    "BO":"591","Bolivia":"591",
    "BA":"387","Bosnia and Herzegovina":"387",
    "BW":"267","Botswana":"267",
    "BR":"55","Brazil":"55",
    "BN":"673","Brunei":"673",
    "BG":"359","Bulgaria":"359",
    "BF":"226","Burkina Faso":"226",
    "BI":"257","Burundi":"257",
    "KH":"855","Cambodia":"855",
    "CM":"237","Cameroon":"237",
    "CA":"1","Canada":"1",
    "CV":"238","Cape Verde":"238","Cabo Verde":"238",
    "CF":"236","Central African Republic":"236",
    "TD":"235","Chad":"235",
    "CL":"56","Chile":"56",
    "CN":"86","China":"86",
    "CO":"57","Colombia":"57",
    "KM":"269","Comoros":"269",
    "CG":"242","Congo":"242","Republic of the Congo":"242",
    "CD":"243","DR Congo":"243","Democratic Republic of the Congo":"243",
    "CR":"506","Costa Rica":"506",
    "CI":"225","Ivory Coast":"225","Côte d Ivoire":"225",
    "HR":"385","Croatia":"385",
    "CU":"53","Cuba":"53",
    "CY":"357","Cyprus":"357",
    "CZ":"420","Czech Republic":"420","Czechia":"420",
    "DK":"45","Denmark":"45",
    "DJ":"253","Djibouti":"253",
    "DM":"1767","Dominica":"1767",
    "DO":"1809","Dominican Republic":"1809",
    "EC":"593","Ecuador":"593",
    "EG":"20","Egypt":"20",
    "SV":"503","El Salvador":"503",
    "GQ":"240","Equatorial Guinea":"240",
    "ER":"291","Eritrea":"291",
    "EE":"372","Estonia":"372",
    "SZ":"268","Eswatini":"268","Swaziland":"268",
    "ET":"251","Ethiopia":"251",
    "FJ":"679","Fiji":"679",
    "FI":"358","Finland":"358",
    "FR":"33","France":"33",
    "GA":"241","Gabon":"241",
    "GM":"220","Gambia":"220",
    "GE":"995","Georgia":"995",
    "DE":"49","Germany":"49",
    "GH":"233","Ghana":"233",
    "GR":"30","Greece":"30",
    "GD":"1473","Grenada":"1473",
    "GT":"502","Guatemala":"502",
    "GN":"224","Guinea":"224",
    "GW":"245","Guinea-Bissau":"245",
    "GY":"592","Guyana":"592",
    "HT":"509","Haiti":"509",
    "HN":"504","Honduras":"504",
    "HK":"852","Hong Kong":"852",
    "HU":"36","Hungary":"36",
    "IS":"354","Iceland":"354",
    "IN":"91","India":"91",
    "ID":"62","Indonesia":"62",
    "IR":"98","Iran":"98",
    "IQ":"964","Iraq":"964",
    "IE":"353","Ireland":"353",
    "IL":"972","Israel":"972",
    "IT":"39","Italy":"39",
    "JM":"1876","Jamaica":"1876",
    "JP":"81","Japan":"81",
    "JO":"962","Jordan":"962",
    "KZ":"7","Kazakhstan":"7",
    "KE":"254","Kenya":"254",
    "KI":"686","Kiribati":"686",
    "KP":"850","North Korea":"850",
    "KR":"82","South Korea":"82",
    "KW":"965","Kuwait":"965",
    "KG":"996","Kyrgyzstan":"996",
    "LA":"856","Laos":"856",
    "LV":"371","Latvia":"371",
    "LB":"961","Lebanon":"961",
    "LS":"266","Lesotho":"266",
    "LR":"231","Liberia":"231",
    "LY":"218","Libya":"218",
    "LI":"423","Liechtenstein":"423",
    "LT":"370","Lithuania":"370",
    "LU":"352","Luxembourg":"352",
    "MO":"853","Macau":"853",
    "MG":"261","Madagascar":"261",
    "MW":"265","Malawi":"265",
    "MY":"60","Malaysia":"60",
    "MV":"960","Maldives":"960",
    "ML":"223","Mali":"223",
    "MT":"356","Malta":"356",
    "MH":"692","Marshall Islands":"692",
    "MR":"222","Mauritania":"222",
    "MU":"230","Mauritius":"230",
    "MX":"52","Mexico":"52",
    "FM":"691","Micronesia":"691",
    "MD":"373","Moldova":"373",
    "MC":"377","Monaco":"377",
    "MN":"976","Mongolia":"976",
    "ME":"382","Montenegro":"382",
    "MA":"212","Morocco":"212",
    "MZ":"258","Mozambique":"258",
    "MM":"95","Myanmar":"95",
    "NA":"264","Namibia":"264",
    "NR":"674","Nauru":"674",
    "NP":"977","Nepal":"977",
    "NL":"31","Netherlands":"31",
    "NZ":"64","New Zealand":"64",
    "NI":"505","Nicaragua":"505",
    "NE":"227","Niger":"227",
    "NG":"234","Nigeria":"234",
    "MK":"389","North Macedonia":"389",
    "NO":"47","Norway":"47",
    "OM":"968","Oman":"968",
    "PK":"92","Pakistan":"92",
    "PW":"680","Palau":"680",
    "PS":"970","Palestine":"970",
    "PA":"507","Panama":"507",
    "PG":"675","Papua New Guinea":"675",
    "PY":"595","Paraguay":"595",
    "PE":"51","Peru":"51",
    "PH":"63","Philippines":"63",
    "PL":"48","Poland":"48",
    "PT":"351","Portugal":"351",
    "QA":"974","Qatar":"974",
    "RO":"40","Romania":"40",
    "RU":"7","Russia":"7","Russian Federation":"7",
    "RW":"250","Rwanda":"250",
    "KN":"1869","Saint Kitts and Nevis":"1869",
    "LC":"1758","Saint Lucia":"1758",
    "VC":"1784","Saint Vincent and the Grenadines":"1784",
    "WS":"685","Samoa":"685",
    "SM":"378","San Marino":"378",
    "ST":"239","Sao Tome and Principe":"239",
    "SA":"966","Saudi Arabia":"966",
    "SN":"221","Senegal":"221",
    "RS":"381","Serbia":"381",
    "SC":"248","Seychelles":"248",
    "SL":"232","Sierra Leone":"232",
    "SG":"65","Singapore":"65",
    "SK":"421","Slovakia":"421",
    "SI":"386","Slovenia":"386",
    "SB":"677","Solomon Islands":"677",
    "SO":"252","Somalia":"252",
    "ZA":"27","South Africa":"27",
    "SS":"211","South Sudan":"211",
    "ES":"34","Spain":"34",
    "LK":"94","Sri Lanka":"94",
    "SD":"249","Sudan":"249",
    "SR":"597","Suriname":"597",
    "SE":"46","Sweden":"46",
    "CH":"41","Switzerland":"41",
    "SY":"963","Syria":"963",
    "TW":"886","Taiwan":"886",
    "TJ":"992","Tajikistan":"992",
    "TZ":"255","Tanzania":"255",
    "TH":"66","Thailand":"66",
    "TL":"670","Timor-Leste":"670","East Timor":"670",
    "TG":"228","Togo":"228",
    "TO":"676","Tonga":"676",
    "TT":"1868","Trinidad and Tobago":"1868",
    "TN":"216","Tunisia":"216",
    "TR":"90","Turkey":"90","Türkiye":"90",
    "TM":"993","Turkmenistan":"993",
    "TV":"688","Tuvalu":"688",
    "UG":"256","Uganda":"256",
    "UA":"380","Ukraine":"380",
    "AE":"971","United Arab Emirates":"971",
    "GB":"44","United Kingdom":"44",
    "US":"1","United States":"1",
    "UY":"598","Uruguay":"598",
    "UZ":"998","Uzbekistan":"998",
    "VU":"678","Vanuatu":"678",
    "VA":"379","Vatican City":"379",
    "VE":"58","Venezuela":"58",
    "VN":"84","Vietnam":"84",
    "YE":"967","Yemen":"967",
    "ZM":"260","Zambia":"260",
    "ZW":"263","Zimbabwe":"263"
  }'::JSONB;
  cc TEXT;
  country_lower TEXT;
  k TEXT;
  v TEXT;
BEGIN
  IF phone IS NULL OR phone = '' THEN RETURN ''; END IF;
  cleaned := regexp_replace(phone, '[^0-9+]', '', 'g');

  -- Helper: resolve country code (case-insensitive for both ISO codes and country names)
  IF country IS NOT NULL THEN
    -- Try exact match first (fast path)
    cc := code_map ->> country;
    -- Try uppercase (for ISO codes like "dz" → "DZ")
    IF cc IS NULL THEN cc := code_map ->> upper(country); END IF;
    -- Try case-insensitive scan (for "algeria" → "Algeria", "saudi arabia" → "Saudi Arabia")
    IF cc IS NULL THEN
      country_lower := lower(country);
      FOR k, v IN SELECT * FROM jsonb_each_text(code_map)
      LOOP
        IF lower(k) = country_lower THEN
          cc := v;
          EXIT;
        END IF;
      END LOOP;
    END IF;
  END IF;

  -- Already has + prefix → strip + and return digits
  IF cleaned LIKE '+%' THEN
    cleaned := regexp_replace(cleaned, '^\+', '');
    -- Strip embedded local zero after country code: +213(0)555... → 2130555... → 213555...
    IF cc IS NOT NULL AND cleaned LIKE (cc || '0%') AND length(cleaned) > length(cc) + 8 THEN
      cleaned := cc || substring(cleaned FROM length(cc) + 2);
    END IF;
    RETURN cleaned;
  END IF;

  -- Starts with 00 → international format, strip 00
  IF cleaned LIKE '00%' THEN
    cleaned := substring(cleaned FROM 3);
    -- Same embedded-zero fix for 00213(0)555... format
    IF cc IS NOT NULL AND cleaned LIKE (cc || '0%') AND length(cleaned) > length(cc) + 8 THEN
      cleaned := cc || substring(cleaned FROM length(cc) + 2);
    END IF;
    RETURN cleaned;
  END IF;

  -- Starts with 0 → local format, needs country code
  IF cleaned LIKE '0%' AND cc IS NOT NULL THEN
    RETURN cc || substring(cleaned FROM 2);
  END IF;

  -- No leading 0 but short number with known country → might be missing country code
  IF length(cleaned) >= 7 AND length(cleaned) <= 10 AND cc IS NOT NULL THEN
    IF NOT cleaned LIKE (cc || '%') THEN
      RETURN cc || cleaned;
    END IF;
  END IF;

  -- Fallback: return cleaned digits as-is
  RETURN cleaned;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  customer_phone TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_city TEXT,
  customer_country TEXT,
  customer_address TEXT,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  currency TEXT,
  total_spent DECIMAL(10,2) NOT NULL DEFAULT 0,
  order_count INTEGER NOT NULL DEFAULT 0,
  first_order_at TIMESTAMPTZ,
  last_order_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(store_id, customer_phone)
);

CREATE INDEX idx_customers_store ON customers(store_id);
CREATE INDEX idx_customers_store_phone ON customers(store_id, customer_phone);
CREATE INDEX idx_customers_store_name ON customers(store_id, customer_name);
CREATE INDEX idx_customers_total_spent ON customers(store_id, total_spent DESC);
CREATE INDEX idx_customers_order_count ON customers(store_id, order_count DESC);
CREATE INDEX idx_customers_last_order ON customers(store_id, last_order_at DESC);
CREATE INDEX idx_customers_tags ON customers USING GIN(tags);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Functional index for efficient customer→orders lookup using normalized phone
CREATE INDEX idx_orders_norm_phone ON orders(store_id, (public.normalize_phone(customer_phone, customer_country)));

-- Auto-upsert customer on order creation
CREATE OR REPLACE FUNCTION public.upsert_customer_from_order()
RETURNS TRIGGER AS $$
DECLARE
  norm_phone TEXT;
BEGIN
  norm_phone := public.normalize_phone(NEW.customer_phone, NEW.customer_country);

  INSERT INTO public.customers (
    store_id, customer_phone, customer_name, customer_email,
    customer_city, customer_country, customer_address,
    currency, total_spent, order_count, first_order_at, last_order_at
  ) VALUES (
    NEW.store_id, norm_phone, NEW.customer_name, NEW.customer_email,
    NEW.customer_city, NEW.customer_country, NEW.customer_address,
    NEW.currency, NEW.total, 1, NEW.created_at, NEW.created_at
  )
  ON CONFLICT (store_id, customer_phone) DO UPDATE SET
    customer_name = EXCLUDED.customer_name,
    customer_email = COALESCE(EXCLUDED.customer_email, customers.customer_email),
    customer_city = COALESCE(EXCLUDED.customer_city, customers.customer_city),
    customer_country = COALESCE(EXCLUDED.customer_country, customers.customer_country),
    customer_address = COALESCE(EXCLUDED.customer_address, customers.customer_address),
    currency = COALESCE(EXCLUDED.currency, customers.currency),
    total_spent = customers.total_spent + EXCLUDED.total_spent,
    order_count = customers.order_count + 1,
    last_order_at = GREATEST(customers.last_order_at, EXCLUDED.last_order_at),
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE TRIGGER on_order_created_upsert_customer
  AFTER INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION public.upsert_customer_from_order();

-- Incremental update on order status change (cancellations/returns)
CREATE OR REPLACE FUNCTION public.update_customer_on_order_status()
RETURNS TRIGGER AS $$
DECLARE
  cancel_statuses TEXT[] := ARRAY['canceled', 'returned'];
  norm_phone TEXT;
  was_canceled BOOLEAN;
  now_canceled BOOLEAN;
BEGIN
  IF OLD.status = NEW.status THEN RETURN NEW; END IF;

  norm_phone := public.normalize_phone(NEW.customer_phone, NEW.customer_country);
  was_canceled := OLD.status = ANY(cancel_statuses);
  now_canceled := NEW.status = ANY(cancel_statuses);

  IF was_canceled = now_canceled THEN RETURN NEW; END IF;

  IF now_canceled AND NOT was_canceled THEN
    UPDATE public.customers SET
      total_spent = GREATEST(total_spent - NEW.total, 0),
      order_count = GREATEST(order_count - 1, 0),
      updated_at = now()
    WHERE store_id = NEW.store_id AND customer_phone = norm_phone;
  ELSIF was_canceled AND NOT now_canceled THEN
    UPDATE public.customers SET
      total_spent = total_spent + NEW.total,
      order_count = order_count + 1,
      updated_at = now()
    WHERE store_id = NEW.store_id AND customer_phone = norm_phone;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE TRIGGER on_order_status_update_customer
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION public.update_customer_on_order_status();

-- Customers RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view own customers" ON customers FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM stores WHERE stores.id = customers.store_id AND stores.owner_id = (select auth.uid())
  ));

CREATE POLICY "Owners can update own customers" ON customers FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM stores WHERE stores.id = customers.store_id AND stores.owner_id = (select auth.uid())
  ));

-- Backfill function (one-time, for existing orders)
CREATE OR REPLACE FUNCTION public.backfill_customers()
RETURNS INTEGER AS $$
DECLARE
  row_count INTEGER;
BEGIN
  INSERT INTO public.customers (
    store_id, customer_phone, customer_name, customer_email,
    customer_city, customer_country, customer_address,
    currency, total_spent, order_count, first_order_at, last_order_at
  )
  SELECT
    store_id,
    public.normalize_phone(customer_phone, customer_country),
    (array_agg(customer_name ORDER BY created_at DESC))[1],
    (array_agg(customer_email ORDER BY created_at DESC) FILTER (WHERE customer_email IS NOT NULL))[1],
    (array_agg(customer_city ORDER BY created_at DESC) FILTER (WHERE customer_city IS NOT NULL))[1],
    (array_agg(customer_country ORDER BY created_at DESC) FILTER (WHERE customer_country IS NOT NULL AND customer_country != 'Unknown'))[1],
    (array_agg(customer_address ORDER BY created_at DESC))[1],
    (array_agg(currency ORDER BY created_at DESC) FILTER (WHERE currency IS NOT NULL))[1],
    COALESCE(SUM(total) FILTER (WHERE status NOT IN ('canceled', 'returned')), 0),
    COUNT(*) FILTER (WHERE status NOT IN ('canceled', 'returned')),
    MIN(created_at),
    MAX(created_at)
  FROM public.orders
  GROUP BY store_id, public.normalize_phone(customer_phone, customer_country)
  ON CONFLICT (store_id, customer_phone) DO NOTHING;

  GET DIAGNOSTICS row_count = ROW_COUNT;
  RETURN row_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- RPC: get orders for a customer by normalized phone (uses functional index)
CREATE OR REPLACE FUNCTION public.get_customer_orders(p_store_id UUID, p_norm_phone TEXT, p_limit INTEGER DEFAULT 100)
RETURNS TABLE (id UUID, order_number INTEGER, status TEXT, total DECIMAL(10,2), currency TEXT, created_at TIMESTAMPTZ)
AS $$
BEGIN
  RETURN QUERY
  SELECT o.id, o.order_number, o.status, o.total, o.currency, o.created_at
  FROM public.orders o
  WHERE o.store_id = p_store_id
    AND public.normalize_phone(o.customer_phone, o.customer_country) = p_norm_phone
  ORDER BY o.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '';

-- ============================================================
-- Storage: product-images bucket
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Anyone can view product images (public bucket)
CREATE POLICY "Public read access on product-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Authenticated users can upload to their own store folder
CREATE POLICY "Authenticated upload to product-images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'product-images'
    AND EXISTS (
      SELECT 1 FROM stores WHERE stores.id::text = (storage.foldername(name))[1]
      AND stores.owner_id = (select auth.uid())
    )
  );

-- Authenticated users can update files in their own store folder
CREATE POLICY "Authenticated update on product-images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'product-images'
    AND EXISTS (
      SELECT 1 FROM stores WHERE stores.id::text = (storage.foldername(name))[1]
      AND stores.owner_id = (select auth.uid())
    )
  );

-- Authenticated users can delete files in their own store folder
CREATE POLICY "Authenticated delete from product-images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'product-images'
    AND EXISTS (
      SELECT 1 FROM stores WHERE stores.id::text = (storage.foldername(name))[1]
      AND stores.owner_id = (select auth.uid())
    )
  );
