const currency = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' });

export function formatPrice(amount) {
  return currency.format(amount);
}

// Las fechas vienen como 'AAAA-MM-DD'. Se agrega el mediodía para que la zona horaria no cambie el día.
export function formatDate(isoDate) {
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatDuration(hours) {
  if (hours >= 24) {
    const days = Math.round((hours / 24) * 10) / 10;
    return `${days} ${days === 1 ? 'día' : 'días'}`;
  }
  return `${hours} h`;
}

// Hoy en hora de Lima, en formato AAAA-MM-DD (igual que valida la API).
export function todayInLima() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Lima' });
}
