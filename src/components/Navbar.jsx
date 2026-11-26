import { Link, NavLink, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          Reservas<span>Tours</span>
        </Link>
        <nav className="nav-links">
          <NavLink to="/" end>
            Tours
          </NavLink>
          {user ? (
            <>
              <NavLink to="/mis-reservas">Mis reservas</NavLink>
              <span className="nav-user">Hola, {user.name.split(' ')[0]}</span>
              <button type="button" className="btn btn-ghost" onClick={handleLogout}>
                Salir
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Iniciar sesión</NavLink>
              <Link to="/registro" className="btn btn-primary btn-small">
                Registrarse
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
