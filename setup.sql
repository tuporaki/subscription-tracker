-- 1. Crear tabla de suscripciones
create table subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  price numeric not null,
  periodicity text not null,
  category text not null,
  billing_date date not null,
  payment_method text,
  payment_details text,
  comments text,
  status text default 'Activo',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Activar Row Level Security (Seguridad a Nivel de Fila)
alter table subscriptions enable row level security;

-- 3. Crear Políticas de Seguridad
-- Política para Permitir Lectura solo de las propias suscripciones
create policy "Los usuarios pueden ver sus propias suscripciones"
  on subscriptions for select
  using ( auth.uid() = user_id );

-- Política para Permitir Inserción
create policy "Los usuarios pueden insertar sus propias suscripciones"
  on subscriptions for insert
  with check ( auth.uid() = user_id );

-- Política para Permitir Actualización
create policy "Los usuarios pueden actualizar sus propias suscripciones"
  on subscriptions for update
  using ( auth.uid() = user_id );

-- Política para Permitir Borrado
create policy "Los usuarios pueden borrar sus propias suscripciones"
  on subscriptions for delete
  using ( auth.uid() = user_id );
