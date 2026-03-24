// js/utils.js
export function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.remove('hidden');
  setTimeout(() => {
    toast.classList.add('hidden');
  }, duration);
}

export function playSound(soundUrl) {
  const audio = new Audio(soundUrl);
  audio.play().catch(e => console.log('Sound play failed:', e));
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('id-ID');
}

export function formatTime(time) {
  return time;
}