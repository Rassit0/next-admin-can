export const SHEET_CLOSE_DISTANCE_PX = 96;
export const SHEET_CLOSE_FLICK_MIN_DISTANCE_PX = 36;
export const SHEET_CLOSE_VELOCITY_PX_PER_MS = 0.45;
export const SHEET_AXIS_LOCK_THRESHOLD_PX = 8;
export const SHEET_HORIZONTAL_CANCEL_RATIO = 1.15;

export type SheetGestureLock = "pending" | "drag-down" | "cancel";

/**
 * Determina si un desplazamiento inicial con puntero corresponde a un cierre
 * vertical hacia abajo del sheet o debe cancelarse (movimiento horizontal / hacia arriba).
 */
export function classifySheetDragDirection(
  deltaX: number,
  deltaY: number,
): SheetGestureLock {
  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);

  if (Math.max(absX, absY) < SHEET_AXIS_LOCK_THRESHOLD_PX) {
    return "pending";
  }

  if (deltaY <= 0) {
    return "cancel";
  }

  if (absX > deltaY * SHEET_HORIZONTAL_CANCEL_RATIO) {
    return "cancel";
  }

  return "drag-down";
}

export function clampSheetDragOffset(deltaY: number): number {
  return deltaY > 0 ? deltaY : 0;
}

export interface SheetReleaseMetrics {
  offsetY: number;
  elapsedMs: number;
}

/**
 * Evalúa al soltar el puntero si el sheet debe cerrarse por distancia o velocidad.
 */
export function shouldCloseSheetOnRelease({
  offsetY,
  elapsedMs,
}: SheetReleaseMetrics): boolean {
  if (offsetY <= 0) return false;
  if (offsetY >= SHEET_CLOSE_DISTANCE_PX) return true;

  const safeElapsedMs = Math.max(elapsedMs, 16);
  const velocityPxPerMs = offsetY / safeElapsedMs;

  return (
    offsetY >= SHEET_CLOSE_FLICK_MIN_DISTANCE_PX &&
    velocityPxPerMs >= SHEET_CLOSE_VELOCITY_PX_PER_MS
  );
}

