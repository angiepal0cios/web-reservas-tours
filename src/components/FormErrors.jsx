// Muestra el mensaje de error de la API y, si los hay, los errores por campo que devuelve la validación con Zod.
export default function FormErrors({ error }) {
  if (!error) return null;
  return (
    <div className="alert alert-error" role="alert">
      <p>{error.message}</p>
      {error.details?.length > 0 && (
        <ul>
          {error.details.map((detail) => (
            <li key={`${detail.campo}-${detail.mensaje}`}>
              <strong>{detail.campo}:</strong> {detail.mensaje}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
