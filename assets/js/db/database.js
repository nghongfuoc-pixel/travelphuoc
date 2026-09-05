const API_BASE = '/api';

async function apiGet(path) {
  const res = await fetch(API_BASE + path);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Lỗi tải dữ liệu');
  }
  return res.json();
}

async function apiSend(method, path, body) {
  const res = await fetch(API_BASE + path, {
    method,
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Đã có lỗi xảy ra');
  }
  return res.json();
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
  return apiGet('/tours?featured=1&limit=8');
}

export async function getAirlines() {
  return apiGet('/airlines');
}

export async function getCountries() {
  return apiGet('/countries');
}

export async function getFlightRoutePoints() {
  return apiGet('/flights?routePoints=1');
}

export async function getFlightsWithAirline() {
  return apiGet('/flights');
}

export async function getFlightById(id) {
  return apiGet(`/flights/${id}`);
}

export async function getToursWithAirline() {
  return apiGet('/tours');
}

export async function getTourById(id) {
  return apiGet(`/tours/${id}`);
}

export async function getTourItinerary(tourId) {
  return apiGet(`/tours/${tourId}/itinerary`);
}

// ---------- Cart ----------

export async function getCartItemsBySession(sessionId) {
  return apiGet(`/cart?session_id=${encodeURIComponent(sessionId)}`);
}

export async function addCartItem({ sessionId, itemType, itemId, fareClass, price }) {
  await apiSend('POST', '/cart', { sessionId, itemType, itemId, fareClass, price });
}

export async function removeCartItem(id) {
  await apiSend('DELETE', `/cart/${id}`);
}

export async function clearCartBySession(sessionId) {
  await apiSend('DELETE', `/cart?session_id=${encodeURIComponent(sessionId)}`);
}

export async function cartCountBySession(sessionId) {
  const { count } = await apiGet(`/cart/count?session_id=${encodeURIComponent(sessionId)}`);
  return count;
}

// ---------- Orders ----------

export async function createOrder({ name, email, phone, total }) {
  const { id } = await apiSend('POST', '/orders', { name, email, phone, total });
  return id;
}

export async function createOrderItems(orderId, items) {
  await apiSend('POST', `/orders/${orderId}/items`, { items });
}

// ---------- Admin: tours/flights CRUD ----------

export async function getAdminTours() {
  return apiGet('/tours?admin=1');
}

export async function getAdminFlightsWithAirline() {
  return apiGet('/flights?admin=1');
}

export async function deleteFlight(id) {
  await apiSend('DELETE', `/flights/${id}`);
}

export async function deleteTour(id) {
  await apiSend('DELETE', `/tours/${id}`);
}

export async function insertFlight(data) {
  await apiSend('POST', '/flights', data);
}

export async function updateFlight(id, data) {
  await apiSend('PUT', `/flights/${id}`, data);
}

export async function insertTour(data) {
  const { id } = await apiSend('POST', '/tours', data);
  return id;
}

export async function updateTour(id, data) {
  await apiSend('PUT', `/tours/${id}`, data);
}

export async function deleteTourItinerary(tourId) {
  await apiSend('DELETE', `/tours/${tourId}/itinerary`);
}

export async function insertTourItinerary(tourId, items) {
  await apiSend('POST', `/tours/${tourId}/itinerary`, { items });
}

// ---------- Admin: dashboard aggregates ----------

export async function getDashboardStats() {
  return apiGet('/admin/stats');
}

export async function getAirlineBookingStats() {
  return apiGet('/admin/booking-by-airline');
}

export async function getCountryBookingStats() {
  return apiGet('/admin/booking-by-country');
}

// ---------- Profiles ----------

export async function getProfile(userId) {
  return apiGet(`/profile?userId=${userId}`);
}

export async function updateProfile(userId, { fullName, phone }) {
  await apiSend('PUT', '/profile', { userId, fullName, phone });
}
