const GREETING = 'Xin chào! Mình là trợ lý TravelViet. Bạn cần tìm chuyến bay hay tour du lịch nào?';

const history = [];
let panel, messagesEl, form, input, sendBtn, isSending = false;

function injectStyles() {
  if (document.querySelector('link[href*="chatbot.css"]')) return;
  const prefix = window.location.pathname.includes('/admin/') ? '../' : '';
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `${prefix}assets/css/chatbot.css`;
  document.head.appendChild(link);
}

function buildWidget() {
  const toggle = document.createElement('button');
  toggle.className = 'chatbot-toggle';
  toggle.setAttribute('aria-label', 'Mở chat hỗ trợ');
  toggle.textContent = '💬';

  panel = document.createElement('div');
  panel.className = 'chatbot-panel';
  panel.hidden = true;
  panel.innerHTML = `
    <div class="chatbot-header">
      <strong>Trợ lý TravelViet</strong>
      <button type="button" class="chatbot-close" aria-label="Đóng chat">✕</button>
    </div>
    <div class="chatbot-messages"></div>
    <form class="chatbot-form">
      <input type="text" placeholder="Nhập câu hỏi..." autocomplete="off">
      <button type="submit">Gửi</button>
    </form>
  `;

  document.body.appendChild(toggle);
  document.body.appendChild(panel);

  messagesEl = panel.querySelector('.chatbot-messages');
  form = panel.querySelector('.chatbot-form');
  input = form.querySelector('input');
  sendBtn = form.querySelector('button');

  toggle.addEventListener('click', () => openPanel());
  panel.querySelector('.chatbot-close').addEventListener('click', () => { panel.hidden = true; });
  form.addEventListener('submit', onSubmit);
}

function openPanel() {
  panel.hidden = false;
  if (!messagesEl.children.length) {
    appendMessage('bot', GREETING);
  }
  input.focus();
}

function appendMessage(role, text) {
  const el = document.createElement('div');
  el.className = `chatbot-msg ${role}`;
  el.textContent = text;
  messagesEl.appendChild(el);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return el;
}

async function onSubmit(e) {
  e.preventDefault();
  const text = input.value.trim();
  if (!text || isSending) return;

  appendMessage('user', text);
  history.push({ role: 'user', content: text });
  input.value = '';
  setSending(true);

  const typingEl = appendMessage('typing', 'Đang trả lời...');

  try {
    const res = await fetch('/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history })
    });
    const data = await res.json().catch(() => ({}));
    typingEl.remove();

    if (!res.ok) {
      appendMessage('error', data.error || 'Đã có lỗi xảy ra, vui lòng thử lại.');
      return;
    }

    appendMessage('bot', data.reply);
    history.push({ role: 'assistant', content: data.reply });
  } catch {
    typingEl.remove();
    appendMessage('error', 'Không thể kết nối tới chatbot, vui lòng thử lại.');
  } finally {
    setSending(false);
  }
}

function setSending(value) {
  isSending = value;
  sendBtn.disabled = value;
}

injectStyles();
buildWidget();
