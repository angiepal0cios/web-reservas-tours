import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router';
import { bookingsApi, toursApi } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import FormErrors from '../components/FormErrors.jsx';
import { formatDate, formatDuration, formatPrice, todayInLima } from '../utils/format.js';

export default function TourDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const location = useLocation();

  const [tour, setTour] = useState(null);
  const [loadError, setLoadError] = useState(null);

  const [form, setForm] = useState({ tourDate: '', people: 1 });
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    let active = true;
    setTour(null);
    setLoadError(null);
    toursApi
      .get(id)
      .then((data) => active && setTour(data))
      .catch((error) => active && setLoadError(error));
    return () => {
      active = false;
    };
  }, [id]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setBookingError(null);
    try {
      const created = await bookingsApi.create({
        tourId: tour.id,
        tourDate: form.tourDate,
        people: Number(form.people),
      });
      setBooking(created);
    } catch (error) {
      setBookingError(error);
    } finally {
      setSubmitting(false);
    }
  }

  if (loadError) {
    return (
      <section className="narrow">
        <div className="alert alert-error">{loadError.status === 404 ? 'Este tour no existe.' : loadError.message}</div>
        <Link to="/">← Volver a los tours</Link>
      </section>
    );
  }
  if (!tour) return <p className="status">Cargando tour…</p>;

  const total = tour.price * (Number(form.people) || 0);

  return (
    <section className="detail">
      <Link to="/" className="back-link">
        ← Volver a los tours
      </Link>

      <div className="detail-grid">
        <div>
          <p className="tour-location">{tour.location}</p>
          <h1>{tour.title}</h1>
          <p className="detail-description">{tour.description || 'Sin descripción.'}</p>
          <dl className="facts">
            <div>
              <dt>Duración</dt>
              <dd>{formatDuration(tour.durationHours)}</dd>
            </div>
            <div>
              <dt>Grupo máximo</dt>
              <dd>{tour.capacity} personas</dd>
            </div>
            <div>
              <dt>Precio</dt>
              <dd>{formatPrice(tour.price)} por persona</dd>
            </div>
          </dl>
        </div>

        <aside className="card booking-box">
          {booking ? (
            <div className="alert alert-success" role="status">
              <p>
                <strong>¡Reserva confirmada!</strong>
              </p>
              <p>
                {booking.people} {booking.people === 1 ? 'persona' : 'personas'} el {formatDate(booking.tourDate)} ·
                Total {formatPrice(booking.totalPrice)}
              </p>
              <Link to="/mis-reservas" className="btn btn-primary">
                Ver mis reservas
              </Link>
            </div>
          ) : user ? (
            <form onSubmit={handleSubmit} className="form">
              <h2>Reserva este tour</h2>
              <label>
                Fecha
                <input
                  type="date"
                  required
                  min={todayInLima()}
                  value={form.tourDate}
                  onChange={(event) => setForm({ ...form, tourDate: event.target.value })}
                />
              </label>
              <label>
                Personas
                <input
                  type="number"
                  required
                  min={1}
                  max={Math.min(20, tour.capacity)}
                  value={form.people}
                  onChange={(event) => setForm({ ...form, people: event.target.value })}
                />
              </label>
              <p className="booking-total">
                Total: <strong>{formatPrice(total)}</strong>
              </p>
              <FormErrors error={bookingError} />
              <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                {submitting ? 'Reservando…' : 'Reservar'}
              </button>
            </form>
          ) : (
            <div>
              <h2>Reserva este tour</h2>
              <p>Inicia sesión para elegir la fecha y reservar.</p>
              <Link to="/login" state={{ from: location.pathname }} className="btn btn-primary btn-block">
                Iniciar sesión
              </Link>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
