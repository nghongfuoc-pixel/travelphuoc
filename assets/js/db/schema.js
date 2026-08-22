export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS airlines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  logo_url TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS countries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS flights (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  airline_id INTEGER NOT NULL REFERENCES airlines(id),
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  departure_date TEXT NOT NULL,
  departure_time TEXT NOT NULL,
  arrival_time TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  trip_type TEXT NOT NULL,
  stop_type TEXT NOT NULL,
  aircraft_type TEXT NOT NULL,
  price_economy INTEGER NOT NULL,
  price_business INTEGER NOT NULL,
  services TEXT,
  thumbnail_url TEXT
);

CREATE TABLE IF NOT EXISTS tours (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  operator TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  days INTEGER NOT NULL,
  nights INTEGER NOT NULL,
  price INTEGER NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  departure_date TEXT NOT NULL,
  departure_time TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  airline_id INTEGER NOT NULL REFERENCES airlines(id),
  aircraft_type TEXT NOT NULL,
  country_id INTEGER NOT NULL REFERENCES countries(id),
  services TEXT,
  featured INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS tour_itinerary (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tour_id INTEGER NOT NULL REFERENCES tours(id),
  day_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS cart_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  item_type TEXT NOT NULL,
  item_id INTEGER NOT NULL,
  fare_class TEXT,
  price INTEGER NOT NULL,
  added_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  total_price INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  item_type TEXT NOT NULL,
  item_id INTEGER NOT NULL,
  fare_class TEXT,
  price INTEGER NOT NULL
);
`;
