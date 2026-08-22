import { SCHEMA_SQL } from './schema.js';
import { AIRLINES, COUNTRIES, TOURS, FLIGHTS, USERS, ORDER_CUSTOMERS } from './seed-data.js';
import { sha256Hex } from '../crypto.js';

const SQL_JS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/';
const STORAGE_KEY = 'travelviet_db_v5';

let dbPromise = null;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function persist(db) {
  const data = db.export();
  let binary = '';
  for (let i = 0; i < data.length; i++) binary += String.fromCharCode(data[i]);
  localStorage.setItem(STORAGE_KEY, btoa(binary));
}

function lastId(db) {
  return db.exec('SELECT last_insert_rowid() AS id')[0].values[0][0];
}

export function genItinerary(destination, days) {
  const items = [];
  items.push({
    day: 1,
    title: `Khởi hành - ${destination}`,
    description: `Bay đến ${destination}, nhận phòng khách sạn, tham quan trung tâm, ăn tối tự do và nghỉ ngơi.`
  });
  for (let d = 2; d < days; d++) {
    items.push({
      day: d,
      title: `Khám phá ${destination} - Ngày ${d}`,
      description: `Tham quan các điểm nổi bật tại ${destination}, trải nghiệm văn hoá và ẩm thực địa phương cùng hướng dẫn viên.`
    });
  }
  if (days > 1) {
    items.push({
      day: days,
      title: `${destination} - Về lại điểm khởi hành`,
      description: `Tự do mua sắm quà lưu niệm, làm thủ tục ra sân bay, kết thúc hành trình và bay về lại điểm khởi hành.`
    });
  }
  return items;
}

function daysAgoIso(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(9, 0, 0, 0);
  return d.toISOString();
}

function seedOrders(db, tourRecords, flightRecords) {
  let customerIndex = 0;
  let dayOffset = 2;

  function nextCustomer() {
    const c = ORDER_CUSTOMERS[customerIndex % ORDER_CUSTOMERS.length];
    customerIndex++;
    return c;
  }

  function createOrder(items) {
    const customer = nextCustomer();
    const createdAt = daysAgoIso(dayOffset);
    dayOffset += 3;
    const total = items.reduce((sum, it) => sum + it.price, 0);
    db.run(
      "INSERT INTO orders (customer_name, email, phone, total_price, status, created_at) VALUES (?, ?, ?, ?, 'confirmed', ?)",
      [customer.name, customer.email, customer.phone, total, createdAt]
    );
    const orderId = lastId(db);
    items.forEach(it => {
      db.run(
        'INSERT INTO order_items (order_id, item_type, item_id, fare_class, price) VALUES (?, ?, ?, ?, ?)',
        [orderId, it.type, it.id, it.fareClass || null, it.price]
      );
    });
  }

  flightRecords.forEach(f => {
    createOrder([{ type: 'flight', id: f.id, fareClass: 'economy', price: f.priceEconomy }]);
  });

  tourRecords.forEach(t => {
    createOrder([{ type: 'tour', id: t.id, price: t.price }]);
  });
}

async function seedDatabase(db) {
  db.run('BEGIN TRANSACTION');

  for (const u of USERS) {
    const hash = await sha256Hex(u.password);
    db.run(
      'INSERT INTO users (username, email, password_hash, full_name, phone, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [u.username, u.email, hash, u.fullName, u.phone, u.role, new Date().toISOString()]
    );
  }

  const airlineIds = {};
  AIRLINES.forEach(a => {
    db.run('INSERT INTO airlines (name, code, logo_url) VALUES (?, ?, ?)', [a.name, a.code, a.logoUrl]);
    airlineIds[a.name] = lastId(db);
  });

  const countryIds = {};
  COUNTRIES.forEach(name => {
    db.run('INSERT INTO countries (name) VALUES (?)', [name]);
    countryIds[name] = lastId(db);
  });

  const tourRecords = [];
  TOURS.forEach(t => {
    db.run(
      `INSERT INTO tours (name, operator, thumbnail_url, days, nights, price, origin, destination, departure_date, departure_time, duration_minutes, airline_id, aircraft_type, country_id, services, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        t.name, t.operator, t.thumbnailUrl, t.days, t.nights, t.price, t.origin, t.destination,
        t.departureDate, t.departureTime, t.durationMinutes, airlineIds[t.airline], t.aircraft,
        countryIds[t.country], t.services, t.featured
      ]
    );
    const tourId = lastId(db);
    tourRecords.push({ id: tourId, price: t.price });
    genItinerary(t.destination, t.days).forEach(it => {
      db.run(
        'INSERT INTO tour_itinerary (tour_id, day_number, title, description) VALUES (?, ?, ?, ?)',
        [tourId, it.day, it.title, it.description]
      );
    });
  });

  const flightRecords = [];
  FLIGHTS.forEach(f => {
    db.run(
      `INSERT INTO flights (airline_id, origin, destination, departure_date, departure_time, arrival_time, duration_minutes, trip_type, stop_type, aircraft_type, price_economy, price_business, services, thumbnail_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)`,
      [
        airlineIds[f.airline], f.origin, f.destination, f.departureDate, f.departureTime, f.arrivalTime,
        f.durationMinutes, f.tripType, f.stopType, f.aircraft, f.priceEconomy, f.priceBusiness, f.services
      ]
    );
    flightRecords.push({ id: lastId(db), priceEconomy: f.priceEconomy });
  });

  seedOrders(db, tourRecords, flightRecords);

  db.run('COMMIT');
}

async function getDb() {
  if (dbPromise) return dbPromise;

  dbPromise = (async () => {
    if (!window.initSqlJs) {
      await loadScript(SQL_JS_CDN + 'sql-wasm.js');
    }
    const SQL = await window.initSqlJs({ locateFile: f => SQL_JS_CDN + f });

    const saved = localStorage.getItem(STORAGE_KEY);
    let db;
    if (saved) {
      const binary = Uint8Array.from(atob(saved), c => c.charCodeAt(0));
      db = new SQL.Database(binary);
    } else {
      db = new SQL.Database();
      db.run(SCHEMA_SQL);
      await seedDatabase(db);
      persist(db);
    }
    return db;
  })();

  return dbPromise;
}

export async function q(sql, params = []) {
  const db = await getDb();
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

export async function exec(sql, params = []) {
  const db = await getDb();
  db.run(sql, params);
  persist(db);
}
