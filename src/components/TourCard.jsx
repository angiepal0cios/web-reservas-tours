import { Link } from 'react-router';
import { formatDuration, formatPrice } from '../utils/format.js';

export default function TourCard({ tour }) {
  return (
    <article className="card tour-card">
      <div className="tour-card-banner" aria-hidden="true">
        {tour.imageUrl ? <img src={tour.imageUrl} alt="" loading="lazy" /> : <span>{tour.location}</span>}
      </div>
      <div className="tour-card-body">
        <p className="tour-location">{tour.location}</p>
        <h2 className="tour-title">
          <Link to={`/tours/${tour.id}`}>{tour.title}</Link>
        </h2>
        <p className="tour-meta">
          {formatDuration(tour.durationHours)} · hasta {tour.capacity} personas
        </p>
        <p className="tour-price">
          {formatPrice(tour.price)} <small>por persona</small>
        </p>
      </div>
    </article>
  );
}
