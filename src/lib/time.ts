// src/lib/time.ts
import { toZonedTime } from "date-fns-tz";

const APP_TZ = "Europe/Madrid"; // o "Europe/Lisbon" si prefieres

export async function getEffectiveToday() {
  const now = new Date("2025-10-31");
  const zoned = toZonedTime(now, APP_TZ);
  return zoned.toISOString().slice(0, 10); // YYYY-MM-DD
}
