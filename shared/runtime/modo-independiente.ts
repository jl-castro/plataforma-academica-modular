/** Puertos de `ng serve` por MF (desarrollo local). El shell usa 4200. */
const PUERTOS_MF_DEV = new Set(['4201', '4202', '4203', '4204']);

/**
 * true cuando la app corre en su propio dev-server, no embebida en el shell (4200).
 * @param puertoEsperado — opcional, restringe a un MF concreto (ej. '4202').
 */
export function esModoIndependiente(puertoEsperado?: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  const port = window.location.port;
  if (port === '4200') {
    return false;
  }
  if (puertoEsperado) {
    return port === puertoEsperado;
  }
  return PUERTOS_MF_DEV.has(port);
}
