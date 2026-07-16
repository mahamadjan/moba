-- 1. Create categories table
create table public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  icon text, -- lucide icon name
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create products table
create table public.products (
  id uuid default gen_random_uuid() primary key,
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  description text,
  price numeric not null,
  old_price numeric,
  image_url text not null,
  is_hit boolean default false,
  is_new boolean default false,
  is_discount boolean default false,
  stock_quantity integer default 10,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create orders table (for dashboard stats)
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  total_amount numeric not null,
  status text default 'pending', -- pending, paid, delivered, cancelled
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Set up Storage Bucket for Product Images
insert into storage.buckets (id, name, public) values ('products', 'products', true);

-- Enable RLS (Row Level Security)
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;

-- Policies for Categories (Anyone can read, only authenticated can write - for simplicity in this demo)
create policy "Categories are viewable by everyone" on public.categories for select using (true);
create policy "Categories are insertable by authenticated" on public.categories for insert with check (auth.role() = 'authenticated');
create policy "Categories are updatable by authenticated" on public.categories for update using (auth.role() = 'authenticated');
create policy "Categories are deletable by authenticated" on public.categories for delete using (auth.role() = 'authenticated');

-- Policies for Products (Anyone can read, only authenticated can write)
create policy "Products are viewable by everyone" on public.products for select using (true);
create policy "Products are insertable by authenticated" on public.products for insert with check (auth.role() = 'authenticated');
create policy "Products are updatable by authenticated" on public.products for update using (auth.role() = 'authenticated');
create policy "Products are deletable by authenticated" on public.products for delete using (auth.role() = 'authenticated');

-- Policies for Orders
create policy "Users can view their own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Admins can view all orders" on public.orders for select using (auth.role() = 'authenticated'); -- simplified for demo
create policy "Users can create orders" on public.orders for insert with check (auth.uid() = user_id);

-- Storage Policies
create policy "Product images are publicly accessible" on storage.objects for select using (bucket_id = 'products');
create policy "Authenticated users can upload product images" on storage.objects for insert with check (bucket_id = 'products' and auth.role() = 'authenticated');
create policy "Authenticated users can update product images" on storage.objects for update using (bucket_id = 'products' and auth.role() = 'authenticated');
create policy "Authenticated users can delete product images" on storage.objects for delete using (bucket_id = 'products' and auth.role() = 'authenticated');
