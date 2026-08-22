export function formatVND(amount) {
  return amount.toLocaleString('vi-VN') + ' đ';
}

export function formatDuration(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h${m}m` : `${h}h`;
}

export function timeBucket(hhmm) {
  const hour = parseInt(hhmm.split(':')[0], 10);
  if (hour < 6) return 'night';
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

export const TIME_BUCKET_LABELS = {
  night: '00:00 - 06:00',
  morning: '06:00 - 12:00',
  afternoon: '12:00 - 18:00',
  evening: '18:00 - 24:00'
};
