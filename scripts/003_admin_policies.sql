-- Admin helper function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(
    (SELECT role = 'admin' FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Admin can select all profiles
CREATE POLICY "admin_select_all_profiles" ON public.profiles
  FOR SELECT USING (public.is_admin());

-- Admin can update all profiles
CREATE POLICY "admin_update_all_profiles" ON public.profiles
  FOR UPDATE USING (public.is_admin());

-- Admin can insert products
CREATE POLICY "admin_insert_products" ON public.products
  FOR INSERT WITH CHECK (public.is_admin());

-- Admin can update products
CREATE POLICY "admin_update_products" ON public.products
  FOR UPDATE USING (public.is_admin());

-- Admin can delete products
CREATE POLICY "admin_delete_products" ON public.products
  FOR DELETE USING (public.is_admin());

-- Admin can insert categories
CREATE POLICY "admin_insert_categories" ON public.categories
  FOR INSERT WITH CHECK (public.is_admin());

-- Admin can update categories
CREATE POLICY "admin_update_categories" ON public.categories
  FOR UPDATE USING (public.is_admin());

-- Admin can select all orders
CREATE POLICY "admin_select_all_orders" ON public.orders
  FOR SELECT USING (public.is_admin());

-- Admin can update all orders
CREATE POLICY "admin_update_all_orders" ON public.orders
  FOR UPDATE USING (public.is_admin());

-- Function to decrement stock atomically
CREATE OR REPLACE FUNCTION public.decrement_stock(product_id UUID, qty INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE public.products
  SET stock = stock - qty
  WHERE id = product_id AND stock >= qty;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient stock for product %', product_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
