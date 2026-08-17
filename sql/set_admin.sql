-- =============================================================================
-- PIZZA FEST MAGANGUÉ · Otorgar/actualizar permisos de administrador
-- Corre esto en tu proyecto de Supabase > SQL Editor DESPUÉS de haberte
-- registrado en la app con tu correo de administrador (regístrate normal en
-- /login, como cualquier usuario — este script solo le da permiso de LECTURA
-- TOTAL a ese correo).
--
-- Reemplaza 'TU-CORREO-ADMIN-AQUI@ejemplo.com' por tu correo real y ejecútalo.
-- =============================================================================

drop policy if exists "admin ve todos los votos" on public.votes;

create policy "admin ve todos los votos"
  on public.votes
  for select
  to authenticated
  using (auth.jwt() ->> 'email' = 'admin@festmagangue.com');

-- Para más de un administrador, usa esta versión en su lugar:
-- using (auth.jwt() ->> 'email' in ('admin1@correo.com', 'admin2@correo.com'));
