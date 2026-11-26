import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';
import FormErrors from '../components/FormErrors.jsx';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from ?? '/';

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function update(field) {
    return (event) => setForm({ ...form, [field]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await register(form);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err);
      setSubmitting(false);
    }
  }

  return (
    <section className="narrow card auth-card">
      <h1>Crear cuenta</h1>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Nombre
          <input autoComplete="name" required minLength={2} value={form.name} onChange={update('name')} />
        </label>
        <label>
          Correo
          <input type="email" autoComplete="email" required value={form.email} onChange={update('email')} />
        </label>
        <label>
          Contraseña <small>(mínimo 8 caracteres)</small>
          <input
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={form.password}
            onChange={update('password')}
          />
        </label>
        <FormErrors error={error} />
        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>
      </form>
      <p className="auth-switch">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" state={location.state}>
          Inicia sesión
        </Link>
      </p>
    </section>
  );
}
