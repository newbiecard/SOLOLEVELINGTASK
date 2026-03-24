// js/notification.js
export function initNotifications() {
  if ('Notification' in window && 'serviceWorker' in navigator) {
    Notification.requestPermission();
  }
}

export async function scheduleNotification(task) {
  const taskTime = new Date(`${task.date}T${task.time}`);
  const now = new Date();
  const timeUntil = taskTime - now;
  
  if (timeUntil > 0 && timeUntil <= 3600000) { // Only schedule if within 1 hour
    setTimeout(() => {
      if (Notification.permission === 'granted') {
        new Notification('⚔️ Quest Reminder!', {
          body: `Time to complete: ${task.title}`,
          icon: '/assets/icon-192.png'
        });
      }
    }, timeUntil);
  }
}