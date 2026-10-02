export function generateStudentCode(fullName: string): string {
  if (!fullName || !fullName.trim()) return '';
  const parts = fullName.trim().split(/\s+/);
  const first = parts[0];
  const last = parts.length > 1 ? parts[parts.length - 1] : parts[0];

  const cleanLast = last
    .replace(/ä/gi, 'ae')
    .replace(/ö/gi, 'oe')
    .replace(/ü/gi, 'ue')
    .replace(/ß/gi, 'ss')
    .replace(/[^a-zA-Z0-9]/g, '');

  const cleanFirst = first
    .replace(/ä/gi, 'ae')
    .replace(/ö/gi, 'oe')
    .replace(/ü/gi, 'ue')
    .replace(/ß/gi, 'ss')
    .replace(/[^a-zA-Z0-9]/g, '');

  if (parts.length === 1) {
    return cleanFirst.slice(0, 4).toUpperCase();
  }

  // 1. Buchstabe Vorname + erste 3 Buchstaben Nachname
  const code = (cleanFirst.slice(0, 1) + cleanLast.slice(0, 3)).toUpperCase();
  return code || 'SCHUELER';
}
