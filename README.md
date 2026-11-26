# Reservas de Tours: frontend web

Aplicación web en **React** para buscar y reservar tours en Perú. Consume la API de [api-reservas-tours](https://github.com/angiepal0cios/api-reservas-tours).

**Stack:** React 19 · React Router 8 · Vite 8 · CSS propio (sin librerías de UI)

## Funcionalidades
- Catálogo de tours con **búsqueda por ciudad y paginación**, guardadas en la URL (`?location=ica&page=2`)
- Detalle del tour con **formulario de reserva** y cálculo del total en vivo
- **Registro e inicio de sesión** con JWT; después de entrar, vuelve a la página donde estaba
- **Rutas protegidas**: "Mis reservas" solo es accesible con sesión iniciada
- **Mis reservas**: listado y cancelación con confirmación en dos pasos
- Errores de la API mostrados en pantalla, incluidos los errores de validación por campo
- Diseño responsive (funciona en celular)

## Arquitectura

```
src/
├── main.jsx                 # Punto de entrada: Router + AuthProvider
├── App.jsx                  # Definición de rutas
├── api/client.js            # Cliente HTTP único (token, errores, endpoints)
├── context/AuthContext.jsx  # Estado global de la sesión
├── components/              # Navbar, ProtectedRoute, TourCard, FormErrors
├── pages/                   # Una página por ruta
└── utils/format.js          # Formato de precios (S/), fechas y duraciones
```

| Pieza | Para qué sirve | Equivalente en Angular |
|---|---|---|
| `api/client.js` | Centraliza las llamadas HTTP, agrega el token y convierte los errores | Servicio con `HttpClient` + `HttpInterceptor` |
| `AuthContext` | Guarda el usuario y el token y los comparte con toda la app | Servicio singleton con `BehaviorSubject` |
| `ProtectedRoute` | Redirige al login si no hay sesión | `CanActivate` Guard |
| `useSearchParams` | Filtros y página en la URL | `ActivatedRoute.queryParams` |

**Decisiones técnicas** (útiles para explicar en una entrevista):
- **Proxy de Vite:** en desarrollo, `/api` se reenvía a `http://localhost:3000`. El navegador ve un solo origen, así que no hace falta configurar CORS.
- **Token en `localStorage`:** es simple y la sesión sobrevive al recargar. La desventaja es que un ataque XSS podría leerlo; en producción conviene una cookie `httpOnly`.
- **Respuestas desactualizadas:** cada `useEffect` que llama a la API usa una bandera `active` para ignorar respuestas viejas si el usuario cambia de página antes de que lleguen.
- **Si el token vence** (la API responde 401), la sesión se cierra sola.

## Cómo ejecutarlo

Necesitas la API corriendo en el puerto 3000:

```bash
cd ../api-reservas-tours
npm install
npm run dev
```

En otra terminal:

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.

Para generar la versión de producción: `npm run build` (queda en `dist/`).

## Próximos pasos
- [ ] Panel de administrador para crear y editar tours
- [ ] Docker + docker compose para levantar API, base de datos y web juntos
- [ ] Publicar en AWS (S3 + CloudFront)
- [ ] Pruebas con Vitest y React Testing Library
