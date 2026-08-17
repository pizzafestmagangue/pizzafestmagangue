# PIZZA FEST MAGANGUÉ

App de votación para el evento **Pizza Fest Magangué** ({N} propuestas de pizza).
Cada usuario se registra con correo y contraseña, y puede votar de 1 a 5 estrellas
por hasta **7 locales distintos**. Solo el/los administrador(es) ven el conteo y
el ganador en tiempo real.

Construido con **Next.js (App Router) + Supabase + Tailwind**, listo para desplegar
en **Vercel**.

Este proyecto es una copia de PIZZAFESTINGG con otro nombre/marca y con el
contador de "Día X de 7" eliminado (todavía no hay fecha del evento). Usa un
proyecto de Supabase **nuevo y separado** — no comparte base de datos con
PIZZAFESTINGG.

---

## 1. Estructura del proyecto

```
pizza-fest-magangue/
├── app/
│   ├── page.jsx           → landing del evento
│   ├── login/page.jsx     → registro / inicio de sesión (correo + contraseña)
│   ├── votar/page.jsx     → pantalla de votación (protegida)
│   └── admin/page.jsx     → panel admin en tiempo real (protegida)
├── components/            → StarRating, PizzaCard, Navbar
├── lib/
│   ├── supabaseClient.js  → cliente Supabase + helper de admins
│   └── pizzas.js          → ⭐ EDITA AQUÍ tus 7-8 locales/propuestas
└── sql/
    ├── schema.sql          → ⭐ EJECUTA ESTO PRIMERO en Supabase
    └── set_admin.sql       → ⭐ luego esto, con tu correo de admin
```

## 2. Configurar Supabase (proyecto nuevo, aún sin conectar)

A diferencia de PIZZAFESTINGG, este sitio necesita un proyecto de Supabase
**propio**. Pasos:

1. Crea el proyecto en [supabase.com](https://supabase.com/dashboard) (o dime
   la URL y la `anon key` cuando lo tengas y te dejo el `.env.local` listo).
2. Abre `.env.local` en la raíz del proyecto y completa:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO-NUEVO.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY_AQUI
   ```
   (Están en Supabase → **Project Settings → API**.)
3. En Supabase → **SQL Editor** → pega **todo** el contenido de
   `sql/schema.sql` → **Run**. Esto crea la tabla `votes`, el límite de 7
   votos, y las reglas de seguridad.
4. Ve a **Authentication → Sign In / Providers → Email** y **desactiva
   "Confirm email"**. Esto permite que un usuario vote apenas se registra,
   sin revisar su correo.

## 3. Correr el proyecto localmente

```bash
npm install
npm run dev
```

Abre http://localhost:3000. Si `.env.local` está vacío todavía, la app carga
igual (con estilos y layout completos) pero el registro/login fallará hasta
que pongas las llaves reales de Supabase.

## 4. Crear tu cuenta de administrador

1. **Regístrate normal** en `/login` con el correo que quieras usar como
   administrador (por ejemplo `admin@pizzafestmagangue.com`, o el tuyo propio).
2. Abre `sql/set_admin.sql`, reemplaza `TU-CORREO-ADMIN-AQUI@ejemplo.com`
   por ese mismo correo, y corre el archivo completo en Supabase → SQL
   Editor.
3. Abre `.env.local` (y luego las variables de entorno en Vercel) y pon ese
   correo en `NEXT_PUBLIC_ADMIN_EMAILS`.

Después entra a `/admin` — ahí verás el conteo y el ganador en tiempo real.
Los usuarios normales **nunca** ven esta pantalla ni estos datos: está
bloqueada tanto en el frontend como por Row Level Security en Supabase
(doble seguridad, aunque alguien intente saltarse la app).

## 5. Editar los locales / propuestas de pizza

Abre `lib/pizzas.js`. Cada objeto es una tarjeta:

```js
{
  id: "local-01",              // único, no lo cambies después de tener votos
  numero: "01",
  localName: "Horno de Tano",
  pizzaName: "Napolitana Clásica",
  ingredients: "Tomate, mozzarella, albahaca...",
  image: "https://...",        // reemplaza por la foto real del local
}
```

Ahora mismo el archivo trae las mismas 8 propuestas de ejemplo (con fotos de
Unsplash) que traía PIZZAFESTINGG — edítalas con los locales reales de
Magangué antes de lanzar el evento. Deja 7 u 8 objetos (el límite de **7
votos por cuenta** se aplica siempre, incluso si hay 8 locales — está
forzado por un trigger en la base de datos, no solo en la pantalla).

**Recomendación importante sobre las fotos:** sube las fotos reales a
Supabase Storage (o a un hosting propio) en vez de depender de Unsplash.
Algunas redes/operadores bloquean o limitan dominios externos de imágenes,
y eso puede hacer que a algunos visitantes las fotos no les carguen aunque
el resto del sitio sí. Si usas un dominio distinto a Unsplash/Supabase,
agrégalo en `next.config.js` dentro de `images.remotePatterns`.

## 6. Publicar en Vercel

1. Sube esta carpeta a un repositorio de GitHub (a tu nombre, es tu proyecto).
2. En [vercel.com](https://vercel.com) → **Add New Project** → importa el repo.
3. En **Environment Variables** agrega las tres mismas variables de tu
   `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_ADMIN_EMAILS`
4. Deploy. Vercel te da la URL pública (puedes conectar tu propio dominio
   después desde Project Settings → Domains).

## 7. Por qué no se ve "desnuda" (sin estilos) en ningún dispositivo/navegador

Este es un punto que pediste asegurar explícitamente, así que quedó resuelto
así:

- **Tailwind está compilado en el build**, no cargado por CDN en el
  navegador. Los estilos viajan dentro del propio HTML/CSS que genera
  Vercel — no dependen de que el navegador del visitante descargue un script
  externo a tiempo, así que no hay "flash sin estilos" por red lenta.
- **Las fuentes (`next/font/google`) se auto-hospedan** en el build de
  Next.js: no se piden a Google en cada visita, se sirven desde el mismo
  dominio de Vercel. Esto evita que la tipografía "salte" o falle si el
  visitante tiene bloqueadores de rastreo activos.
- **`globals.css` se importa una sola vez en `app/layout.jsx`**, así que
  todas las páginas (landing, login, votar, admin) heredan el mismo fondo,
  colores y tipografía sin excepción — no hay ninguna ruta que pueda quedar
  "pelada".
- El fondo, colores y tarjetas están definidos con clases de Tailwind
  (`bg-oven`, `bg-char`, etc.), no con imágenes de fondo pesadas, así que el
  layout no depende de que una imagen cargue para verse completo.
- Lo único que sí depende de una red externa son las **fotos de las pizzas**
  (por defecto, Unsplash) — por eso el punto 5 recomienda moverlas a
  Supabase Storage cuanto antes: es la única pieza que un visitante con una
  red muy restrictiva podría no ver, y no afecta el resto del sitio (colores,
  botones, formularios siguen funcionando igual).

## 8. Por qué no se "cae"

- **Sin límite de usuarios**: Supabase Auth y Postgres escalan solos; no hay
  ningún límite puesto en el código.
- **Una sola tabla** (`votes`), simple e indexada por la llave única
  `(user_id, local_id)` — evita datos duplicados o inconsistentes.
- **El límite de 7 votos se valida en el servidor** (trigger SQL), no solo
  en el navegador, así que no depende de que el frontend "no falle".
- **Row Level Security** en Supabase: cada usuario solo puede tocar sus
  propias filas; el conteo global solo lo puede leer el/los admin.
- **Tiempo real nativo de Supabase** (Realtime) en el panel admin: no hay
  que refrescar la página ni hacer polling manual.
- Next.js + Vercel: build optimizado, sin servidor propio que mantener.

## 9. Ajustar quién gana

Por defecto, el panel admin ordena por **suma total de estrellas
acumuladas** (con el promedio como criterio de desempate). Si prefieres que
el ganador se decida solo por **promedio**, es un cambio de una línea en
`app/admin/page.jsx`, dentro de `resumen.sort(...)`.
