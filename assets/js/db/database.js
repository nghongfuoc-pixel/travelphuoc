import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../supabase-config.js';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function unwrap({ data, error }) {
  if (error) throw error;
  return data;
}

async function countRows(builder) {
  const { count, error } = await builder;
  if (error) throw error;
  return count || 0;
}

function flattenAirline(row) {
  if (!row) return row;
  const { airline, ...rest } = row;
  return { ...rest, airline_name: airline?.name, airline_logo: airline?.logo_url };
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

// ---------- Catalog (public read) ----------

export async function getFeaturedTours() {
  return unwrap(await supabase.from('tours').select('*').eq('featured', true).order('id').limit(8));
}

export async function getAirlines() {
  return unwrap(await supabase.from('airlines').select('*').order('name'));
}

export async function getCountries() {
  return unwrap(await supabase.from('countries').select('*').order('name'));
}

export async function getFlightRoutePoints() {
  const rows = unwrap(await supabase.from('flights').select('origin, destination'));
  const origins = [...new Set(rows.map(r => r.origin))].sort();
  const destinations = [...new Set(rows.map(r => r.destination))].sort();
  return { origins, destinations };
}

export async function getFlightsWithAirline() {
  const rows = unwrap(await supabase
    .from('flights')
    .select('*, airline:airlines(name, logo_url)')
    .order('departure_date')
    .order('departure_time'));
  return rows.map(flattenAirline);
}

export async function getFlightById(id) {
  const { data, error } = await supabase
    .from('flights')
    .select('*, airline:airlines(name, logo_url)')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return flattenAirline(data);
}

export async function getToursWithAirline() {
  const rows = unwrap(await supabase
    .from('tours')
    .select('*, airline:airlines(name, logo_url)')
    .order('departure_date'));
  return rows.map(flattenAirline);
}

export async function getTourById(id) {
  const { data, error } = await supabase
    .from('tours')
    .select('*, airline:airlines(name, logo_url)')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return flattenAirline(data);
}

export async function getTourItinerary(tourId) {
  return unwrap(await supabase.from('tour_itinerary').select('*').eq('tour_id', tourId).order('day_number'));
}

// ---------- Cart ----------

export async function getCartItemsBySession(sessionId) {
  return unwrap(await supabase.from('cart_items').select('*').eq('session_id', sessionId).order('added_at', { ascending: false }));
}

export async function addCartItem({ sessionId, itemType, itemId, fareClass, price }) {
  unwrap(await supabase.from('cart_items').insert({
    session_id: sessionId, item_type: itemType, item_id: itemId, fare_class: fareClass, price
  }));
}

export async function removeCartItem(id) {
  const { error } = await supabase.from('cart_items').delete().eq('id', id);
  if (error) throw error;
}

export async function clearCartBySession(sessionId) {
  const { error } = await supabase.from('cart_items').delete().eq('session_id', sessionId);
  if (error) throw error;
}

export async function cartCountBySession(sessionId) {
  return countRows(supabase.from('cart_items').select('*', { count: 'exact', head: true }).eq('session_id', sessionId));
}

// ---------- Orders ----------

export async function createOrder({ userId, name, email, phone, total }) {
  const { data, error } = await supabase
    .from('orders')
    .insert({ user_id: userId, customer_name: name, email, phone, total_price: total, status: 'confirmed' })
    .select('id')
    .single();
  if (error) throw error;
  return data.id;
}

export async function createOrderItems(orderId, items) {
  const rows = items.map(it => ({
    order_id: orderId, item_type: it.item_type, item_id: it.item_id, fare_class: it.fare_class, price: it.price
  }));
  const { error } = await supabase.from('order_items').insert(rows);
  if (error) throw error;
}

// ---------- Admin: tours/flights CRUD ----------

export async function getAdminTours() {
  return unwrap(await supabase.from('tours').select('*').order('id'));
}

export async function getAdminFlightsWithAirline() {
  const rows = unwrap(await supabase.from('flights').select('*, airline:airlines(name, logo_url)').order('id'));
  return rows.map(flattenAirline);
}

export async function deleteFlight(id) {
  const { error } = await supabase.from('flights').delete().eq('id', id);
  if (error) throw error;
}

export async function deleteTour(id) {
  const { error } = await supabase.from('tours').delete().eq('id', id);
  if (error) throw error;
}

export async function insertFlight(data) {
  const { error } = await supabase.from('flights').insert(data);
  if (error) throw error;
}

export async function updateFlight(id, data) {
  const { error } = await supabase.from('flights').update(data).eq('id', id);
  if (error) throw error;
}

export async function insertTour(data) {
  const { data: row, error } = await supabase.from('tours').insert(data).select('id').single();
  if (error) throw error;
  return row.id;
}

export async function updateTour(id, data) {
  const { error } = await supabase.from('tours').update(data).eq('id', id);
  if (error) throw error;
}

export async function deleteTourItinerary(tourId) {
  const { error } = await supabase.from('tour_itinerary').delete().eq('tour_id', tourId);
  if (error) throw error;
}

export async function insertTourItinerary(tourId, items) {
  const rows = items.map(it => ({ tour_id: tourId, day_number: it.day, title: it.title, description: it.description }));
  const { error } = await supabase.from('tour_itinerary').insert(rows);
  if (error) throw error;
}

// ---------- Admin: dashboard aggregates ----------

export async function getDashboardStats() {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const nextFirst = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString().slice(0, 10);

  const [toursThisMonth, flightsTotal, tourBookings, flightBookings] = await Promise.all([
    countRows(supabase.from('tours').select('*', { count: 'exact', head: true }).gte('departure_date', first).lt('departure_date', nextFirst)),
    countRows(supabase.from('flights').select('*', { count: 'exact', head: true })),
    countRows(supabase.from('order_items').select('*', { count: 'exact', head: true }).eq('item_type', 'tour')),
    countRows(supabase.from('order_items').select('*', { count: 'exact', head: true }).eq('item_type', 'flight'))
  ]);

  return { toursThisMonth, flightsTotal, tourBookings, flightBookings };
}

export async function getAirlineBookingStats() {
  const items = unwrap(await supabase.from('order_items').select('item_id').eq('item_type', 'flight'));
  if (!items.length) return [];
  const ids = [...new Set(items.map(i => i.item_id))];
  const flights = unwrap(await supabase.from('flights').select('id, airlines(name)').in('id', ids));
  const nameById = Object.fromEntries(flights.map(f => [f.id, f.airlines?.name]));

  const counts = {};
  items.forEach(i => {
    const name = nameById[i.item_id];
    if (name) counts[name] = (counts[name] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([airline, bookings]) => ({ airline, bookings }))
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, 10);
}

export async function getCountryBookingStats() {
  const items = unwrap(await supabase.from('order_items').select('item_id').eq('item_type', 'tour'));
  if (!items.length) return [];
  const ids = [...new Set(items.map(i => i.item_id))];
  const tours = unwrap(await supabase.from('tours').select('id, countries(name)').in('id', ids));
  const countryById = Object.fromEntries(tours.map(t => [t.id, t.countries?.name]));

  const bookingCounts = {};
  const tourSets = {};
  items.forEach(i => {
    const country = countryById[i.item_id];
    if (!country) return;
    bookingCounts[country] = (bookingCounts[country] || 0) + 1;
    (tourSets[country] ||= new Set()).add(i.item_id);
  });
  return Object.entries(bookingCounts)
    .map(([country, booking_count]) => ({ country, booking_count, tour_count: tourSets[country].size }))
    .sort((a, b) => b.booking_count - a.booking_count);
}

// ---------- Profiles ----------

export async function getProfile(userId) {
  return unwrap(await supabase.from('profiles').select('*').eq('id', userId).maybeSingle());
}

export async function updateProfile(userId, { fullName, phone }) {
  const { error } = await supabase.from('profiles').update({ full_name: fullName, phone }).eq('id', userId);
  if (error) throw error;
}
