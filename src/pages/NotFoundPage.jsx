import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <section className="narrow empty">
      <h1>Página no encontrada</h1>
      <p>La página que buscas no existe.</p>
      <Link to="/" className="btn btn-primary">
        Ir a los tours
      </Link>
    </section>
  );
}
