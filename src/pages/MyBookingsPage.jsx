import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { bookingsApi } from '../api/client.js';
import { formatDate, formatPrice, todayInLima } from '../utils/format.js';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState(null);
  const [error, setError] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    let active = true;
    bookingsApi
      .mine()
      .then((data) => active && setBookings(data))
      .catch((err) => active && setError(err));
    return () => {
      active = false;
    };
  }, []);

  async function cancel(id) {
    setCancellingId(id);
    setError(null);
    try {
      const updated = await bookingsApi.cancel(id);
      // Se reemplaza solo la reserva cancelada, sin volver a pedir toda la lista.
      setBookings((list) => list.map((booking) => (booking.id === id ? updated : booking)));
    } catch (err) {
      setError(err);
    } finally {
      setCancellingId(null);
      setConfirmingId(null);
    }
  }

  const today = todayInLima();

  return (
    <section>
      <div className="page-header">
        <h1>Mis reservas</h1>
      </div>

      {error && <div className="alert alert-error">{error.message}</div>}
      {!bookings && !error && <p className="status">Cargando reservas…</p>}

      {bookings?.length === 0 && (
        <div className="empty card">
          <p>Todavía no tienes reservas.</p>
          <Link to="/" className="btn btn-primary">
            Ver tours
          </Link>
        </div>
      )}

      {bookings?.length > 0 && (
        <ul className="booking-list">
          {bookings.map((booking) => {
            const canCancel = booking.status === 'confirmed' && booking.tourDate >= today;
            return (
              <li key={booking.id} className="card booking-item">
                <div>
                  <h2>
                    <Link to={`/tours/${booking.tourId}`}>{booking.tourTitle}</Link>
                  </h2>
                  <p className="tour-meta">
                    {formatDate(booking.tourDate)} · {booking.people} {booking.people === 1 ? 'persona' : 'personas'} ·{' '}
                    {formatPrice(booking.totalPrice)}
                  </p>
                </div>
                <div className="booking-actions">
                  <span className={`badge badge-${booking.status}`}>
                    {booking.status === 'confirmed' ? 'Confirmada' : 'Cancelada'}
                  </span>
                  {canCancel &&
                    (confirmingId === booking.id ? (
                      <>
                        <button
                          type="button"
                          className="btn btn-danger btn-small"
                          disabled={cancellingId === booking.id}
                          onClick={() => cancel(booking.id)}
                        >
                          {cancellingId === booking.id ? 'Cancelando…' : 'Sí, cancelar'}
                        </button>
                        <button type="button" className="btn btn-ghost btn-small" onClick={() => setConfirmingId(null)}>
                          No
                        </button>
                      </>
                    ) : (
                      <button type="button" className="btn btn-ghost btn-small" onClick={() => setConfirmingId(booking.id)}>
                        Cancelar reserva
                      </button>
                    ))}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
