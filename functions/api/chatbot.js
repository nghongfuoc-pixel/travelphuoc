import { json, errorJson, readJson } from '../lib/http.js';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'nvidia/nemotron-3.5-lightning:free';
const REQUEST_TIMEOUT_MS = 25000;
const MAX_HISTORY = 20;

const SYSTEM_PROMPT = `Bạn là trợ lý ảo của TravelViet (Du Lịch Việt) — website demo đặt vé máy bay và tour du lịch.
Trả lời bằng tiếng Việt, ngắn gọn, thân thiện, đúng trọng tâm.
Đây là website demo: không xử lý thanh toán thật, không có dữ liệu chuyến bay/tour theo thời gian thực ngoài những gì hiển thị trên site.
Nếu khách muốn đặt vé/tour, hướng dẫn họ vào trang Chuyến bay hoặc Tour, chọn mục muốn đặt và bấm nút "Chọn"/"Chọn tour" — không tự nhận là đã đặt giúp khách.
Nếu không chắc thông tin cụ thể (giá, giờ bay...), nói rõ khách nên xem trực tiếp trên trang thay vì đoán số liệu.`;

function sanitizeMessages(input) {
  if (!Array.isArray(input)) return [];
  return input
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .slice(-MAX_HISTORY)
    .map(m => ({ role: m.role, content: m.content.trim() }));
}

async function fetchWithTimeout(url, options) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function onRequestPost({ request, env }) {
  const apiKey = env.OPENROUTER_API_KEY;
  if (!apiKey) return errorJson('Server chưa cấu hình API key', 500);

  const body = await readJson(request);
  const messages = sanitizeMessages(body.messages);
  if (!messages.length) return errorJson('Thiếu nội dung tin nhắn', 400);

  let res;
  try {
    res = await fetchWithTimeout(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'TravelViet/1.0 (+https://travelphuoc-pages.pages.dev)'
      },
      body: JSON.stringify({
        model: MODEL,
        stream: false,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages]
      })
    });
  } catch (err) {
    if (err.name === 'AbortError') return errorJson('Chatbot phản hồi quá chậm, vui lòng thử lại.', 504);
    return errorJson('Không thể kết nối tới chatbot.', 502);
  }

  if (res.status === 429) {
    return errorJson('Chatbot đang quá tải (hết lượt miễn phí trong ngày), vui lòng thử lại sau.', 429);
  }
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    console.error('OpenRouter error', res.status, errText.slice(0, 300));
    return errorJson('Chatbot hiện không phản hồi được, vui lòng thử lại sau.', 502);
  }

  const data = await res.json().catch(() => null);
  const reply = data?.choices?.[0]?.message?.content;
  if (!reply) return errorJson('Không nhận được phản hồi từ chatbot.', 502);

  return json({ reply });
}
