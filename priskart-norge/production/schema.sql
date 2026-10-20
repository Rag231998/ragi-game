-- PrisKart Norge – offentlig brukerinnmeldte prisobservasjoner.
-- Tidsstempel lages på serveren, aldri av nettleseren.
CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  station_id TEXT NOT NULL,
  station_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('fuel','charge')),
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('petrol95','petrol98','diesel','electric')),
  price_cents INTEGER NOT NULL CHECK (price_cents > 0 AND price_cents < 10000),
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  flagged INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS reports_location ON reports(latitude, longitude, created_at DESC);
CREATE INDEX IF NOT EXISTS reports_station_type ON reports(station_id, fuel_type, created_at DESC);
CREATE TABLE IF NOT EXISTS rate_limits (
  bucket TEXT PRIMARY KEY,
  cnt INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS rate_limits_expiry ON rate_limits(created_at);
-- In production schedule a daily cleanup with wrangler cron or Worker alarm:
-- DELETE FROM rate_limits WHERE created_at < unixepoch()-86400;
-- DELETE FROM reports WHERE created_at < datetime('now','-180 days') AND flagged=1;
