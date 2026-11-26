import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { toursApi } from '../api/client.js';
import TourCard from '../components/TourCard.jsx';

const PAGE_SIZE = 6;

export default function ToursPage() {
  // El filtro y la página viven en la URL (?location=ica&page=2): se pueden compartir y el botón "atrás" funciona.
  const [searchParams, setSearchParams] = useSearchParams();
  const location = searchParams.get('location') ?? '';
  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  const [search, setSearch] = useState(location);
  const [result, setResult] = useState({ status: 'loading', data: null, error: null });

  useEffect(() => {
    setSearch(location);
  }, [location]);

  useEffect(() => {
    // "active" evita guardar una respuesta vieja si el usuario cambió de página antes de que llegara.
    let active = true;
    setResult((previous) => ({ ...previous, status: 'loading' }));
    toursApi
      .list({ page, limit: PAGE_SIZE, ...(location && { location }) })
      .then((data) => active && setResult({ status: 'success', data, error: null }))
      .catch((error) => active && setResult({ status: 'error', data: null, error }));
    return () => {
      active = false;
    };
  }, [location, page]);

  function handleSearch(event) {
    event.preventDefault();
    const value = search.trim();
    setSearchParams(value ? { location: value } : {});
  }

  function goToPage(newPage) {
    setSearchParams({ ...(location && { location }), page: String(newPage) });
  }

  const { status, data, error } = result;
  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  return (
    <section>
      <div className="page-header">
        <h1>Descubre el Perú</h1>
        <p>Elige tu próxima aventura y reserva en minutos.</p>
      </div>

      <form className="search-bar" onSubmit={handleSearch} role="search">
        <label htmlFor="search" className="visually-hidden">
          Buscar por ciudad
        </label>
        <input
          id="search"
          type="search"
          placeholder="Buscar por ciudad: Cusco, Ica, Lima…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Buscar
        </button>
      </form>

      {status === 'error' && <div className="alert alert-error">{error.message}</div>}

      {data && (
        <>
          <p className="results-count" aria-live="polite">
            {data.total === 0
              ? `No encontramos tours${location ? ` en "${location}"` : ''}.`
              : `${data.total} ${data.total === 1 ? 'tour encontrado' : 'tours encontrados'}`}
          </p>
          <div className={`tour-grid ${status === 'loading' ? 'is-loading' : ''}`}>
            {data.data.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
          {totalPages > 1 && (
            <nav className="pagination" aria-label="Paginación">
              <button type="button" className="btn btn-ghost" disabled={page <= 1} onClick={() => goToPage(page - 1)}>
                ← Anterior
              </button>
              <span>
                Página {page} de {totalPages}
              </span>
              <button
                type="button"
                className="btn btn-ghost"
                disabled={page >= totalPages}
                onClick={() => goToPage(page + 1)}
              >
                Siguiente →
              </button>
            </nav>
          )}
        </>
      )}

      {status === 'loading' && !data && <p className="status">Cargando tours…</p>}
    </section>
  );
}
