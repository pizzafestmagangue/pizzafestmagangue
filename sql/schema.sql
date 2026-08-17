-- =============================================================================
-- PIZZA FEST MAGANGUÉ · Script SQL para Supabase
-- Pega TODO este archivo en tu proyecto de Supabase (nuevo) > SQL Editor >
-- New query > Run.
--
-- ⚠️ IMPORTANTE: reemplaza 'admin@pizzafestmagangue.com' (más abajo, en el
-- bloque 4) por el correo REAL que vas a usar como administrador antes de
-- correr este script. Si ya lo corriste sin cambiarlo, no pasa nada: vuelve a
-- correr solo el bloque "create policy admin ve todos los votos" con el
-- correo correcto (o usa directamente sql/set_admin.sql).
-- =============================================================================

-- 1) Única tabla del proyecto: registra un voto por usuario por local.
create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  local_id text not null,
  local_name text not null,
  pizza_name text not null,
  stars smallint not null check (stars >= 1 and stars <= 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint votes_user_local_unique unique (user_id, local_id)
);

comment on table public.votes is 'Un voto (1-5 estrellas) de un usuario a un local/propuesta de Pizza Fest Magangué. Máx. 7 filas por user_id, forzado por trigger.';

-- 2) Trigger: nadie puede tener más de 7 votos (filas) aunque haya 8 locales.
create or replace function public.check_max_seven_votes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  votos_actuales integer;
begin
  select count(*) into votos_actuales
  from public.votes
  where user_id = new.user_id;

  if votos_actuales >= 7 then
    raise exception 'Ya alcanzaste el máximo de 7 votos por cuenta.';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_check_max_seven_votes on public.votes;
create trigger trg_check_max_seven_votes
  before insert on public.votes
  for each row
  execute function public.check_max_seven_votes();

-- 3) Trigger: mantener updated_at al día cuando alguien cambia su calificación.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_votes_updated_at on public.votes;
create trigger trg_votes_updated_at
  before update on public.votes
  for each row
  execute function public.set_updated_at();

-- 4) Seguridad a nivel de fila (RLS): el corazón de "los usuarios normales no
--    pueden ver el conteo, solo el admin".
alter table public.votes enable row level security;

-- Un usuario autenticado puede insertar SOLO su propio voto.
drop policy if exists "usuarios insertan su propio voto" on public.votes;
create policy "usuarios insertan su propio voto"
  on public.votes
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Un usuario autenticado puede actualizar SOLO su propio voto (cambiar estrellas).
drop policy if exists "usuarios actualizan su propio voto" on public.votes;
create policy "usuarios actualizan su propio voto"
  on public.votes
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Un usuario autenticado puede ver SOLO sus propios votos (para saber qué ya calificó).
drop policy if exists "usuarios ven su propio voto" on public.votes;
create policy "usuarios ven su propio voto"
  on public.votes
  for select
  to authenticated
  using (auth.uid() = user_id);

-- El/los administrador(es) pueden ver TODOS los votos (conteo y ganador).
-- Reemplaza el correo por el/los tuyo(s). Para varios admins, usa:
-- auth.jwt() ->> 'email' in ('admin1@correo.com','admin2@correo.com')
drop policy if exists "admin ve todos los votos" on public.votes;
create policy "admin ve todos los votos"
  on public.votes
  for select
  to authenticated
  using (auth.jwt() ->> 'email' = 'admin@festmagangue.com');

-- 5) Realtime: para que el panel de admin se actualice solo, sin recargar.
alter publication supabase_realtime add table public.votes;

-- =============================================================================
-- Notas:
-- * NO se necesita confirmar el correo para poder votar: eso se configura en
--   Supabase Dashboard > Authentication > Sign In / Providers > Email >
--   desactiva "Confirm email". No es algo que se haga por SQL.
-- * Los nombres, ingredientes, fotos y locales de las pizzas NO están en la
--   base de datos a propósito (para mantener 1 sola tabla, tal como pediste).
--   Se editan directamente en el archivo lib/pizzas.js del proyecto.
-- =============================================================================
