export const DAYS_OF_WEEK: Record<number, string> = {
  0: 'Domingo',
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
};

export function getDayOfWeekName(dayOfWeek: number): string {
  return DAYS_OF_WEEK[dayOfWeek] || 'Desconocido';
}
