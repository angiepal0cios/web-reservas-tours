# Versiones de dependencias

Revisado el 2026-11-26 contra el registro oficial de npm. Instalado con `--save-exact --ignore-scripts`.
Se eligió la versión estable más reciente con al menos 2 semanas de publicada.

| Componente | Versión | Publicada | Última disponible | Licencia | Integridad (package-lock, SHA-512) |
|---|---|---|---|---|---|
| react | 19.3.1 | 2026-10-14 | 19.3.1 | MIT | `sha512-QNhWdt7nrgVWWQG58QuGsAR3jv3Hbe4mb4vz7w2csnHavciZJgda1CPNaldF6eVxv90ud3jUXpKlHL69gO38yw==` |
| react-dom | 19.3.1 | 2026-10-14 | 19.3.1 | MIT | `sha512-Y0bARz53lhEC1NMCASs0/j+faB/zqt3R8hpvg1e8+61ZVJ4UL0UdC4cBbXfZMcIuhrfgeILTLe+ZeBCavQPtKQ==` |
| react-router | 8.5.1 | 2026-10-27 | 8.5.3 (del 2026-11-24, muy reciente) | MIT | `sha512-5u1eQ46QjuXjNfEnLwzrnou1Bm5dquO3xjVYkkMYCudtkicD2AQHtx+fvXzPATtPJx8TW6DR1x1TDRqsfHyZBw==` |
| vite (dev) | 8.3.8 | 2026-11-11 | 8.4.0 (del 2026-11-26, muy reciente) | MIT | `sha512-LzOn3h9rG/0vhLdXrV4yJ4QFA9eEoqCl+Yx+kGJd7aB9w6nfNgVHKSYwLPZUHrz4ZGa+t+kXjV9itvcHDLQouA==` |
| @vitejs/plugin-react (dev) | 6.3.0 | 2026-11-09 | 6.3.0 | MIT | `sha512-H9E955aVvD2F4zNHCw4eIZbIfF6xKldlh7MNu+hSU7xwQzh65lI/N+CJWqmfhi0PEjDXIt/H7T7J/4wU63KJiw==` |

**`npm audit` (2026-11-26):** 0 vulnerabilidades.

## Dependencias que no se agregaron
- Peticiones HTTP: `fetch` nativo del navegador en lugar de axios.
- Estado global: Context de React en lugar de Redux o Zustand (la app es pequeña).
- Estilos: CSS propio en lugar de Tailwind o una librería de componentes.

## Revisión periódica
- Ejecuta `.\revisar-dependencias.ps1` una vez al mes.
- En GitHub, Dependabot (`.github/dependabot.yml`) abrirá PRs con las actualizaciones.
