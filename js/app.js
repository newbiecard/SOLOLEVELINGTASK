// js/app.js
import { initAuth, showDashboard, showAuth } from './auth.js';
import { loadTasks, loadPunishments } from './task.js';
import { loadFinance, addTransaction } from './finance.js';
import { updateExpUI } from './exp.js';
import { updateAbilityUI } from './ability.js';
import { showToast, playSound } from './utils.js';
import { initNotifications, scheduleNotification } from './notification.js';

let currentUser = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
  initNotifications();
  setupEventListeners();
  
  // Auth state observer
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      currentUser = user;
      showDashboard();
      await loadUserData(user.uid);
      await loadTasks(user.uid);
      await loadFinance(user.uid);
      await loadPunishments(user.uid);
    } else {
      showAuth();
      currentUser = null;
    }
  });
});

function setupEventListeners() {
  // Add Task Modal
  const addTaskBtn = document.getElementById('add-task-btn');
  const taskModal = document.getElementById('task-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const saveTaskBtn = document.getElementById('save-task-btn');
  
  addTaskBtn?.addEventListener('click', () => {
    taskModal.classList.remove('hidden');
  });
  
  closeModalBtn?.addEventListener('click', () => {
    taskModal.classList.add('hidden');
  });
  
  saveTaskBtn?.addEventListener('click', async () => {
    await saveTask();
    taskModal.classList.add('hidden');
  });
  
  // Transaction Modal
  const addTransBtn = document.getElementById('add-transaction-btn');
  const transModal = document.getElementById('transaction-modal');
  const closeTransBtn = document.getElementById('close-transaction-modal-btn');
  const saveTransBtn = document.getElementById('save-transaction-btn');
  
  addTransBtn?.addEventListener('click', () => {
    transModal.classList.remove('hidden');
  });
  
  closeTransBtn?.addEventListener('click', () => {
    transModal.classList.add('hidden');
  });
  
  saveTransBtn?.addEventListener('click', async () => {
    await saveTransaction();
    transModal.classList.add('hidden');
  });
  
  // Reset Button
  const resetBtn = document.getElementById('reset-btn');
  resetBtn?.addEventListener('click', async () => {
    const confirm = window.confirm('💀 WARNING! This will reset ALL your progress (Level, EXP, Abilities, Tasks). Are you sure? 💀');
    if (confirm && currentUser) {
      await resetCharacter(currentUser.uid);
    }
  });
}

async function loadUserData(userId) {
  const userDoc = await db.collection('users').doc(userId).get();
  const data = userDoc.data();
  
  if (data) {
    updateExpUI(data.exp || 0, data.level || 1);
    updateAbilityUI('knowledge', data.knowledge || 0);
    updateAbilityUI('strength', data.strength || 0);
    updateAbilityUI('wealth', data.wealth || 0);
  }
}

async function saveTask() {
  if (!currentUser) return;
  
  const title = document.getElementById('task-title').value;
  const desc = document.getElementById('task-desc').value;
  const date = document.getElementById('task-date').value;
  const time = document.getElementById('task-time').value;
  const category = document.getElementById('task-category').value;
  const exp = parseInt(document.getElementById('task-exp').value);
  const punishment = document.getElementById('task-punishment').value;
  
  if (!title || !date || !time || !exp) {
    showToast('⚠️ Isi semua field yang diperlukan!');
    return;
  }
  
  if (exp < 10 || exp > 100) {
    showToast('⚠️ EXP harus antara 10-100!');
    return;
  }
  
  const taskData = {
    title,
    desc: desc || '',
    date,
    time,
    category,
    exp,
    punishment: punishment || 'No punishment',
    status: 'pending',
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };
  
  await db.collection('users').doc(currentUser.uid).collection('tasks').add(taskData);
  
  // Schedule notification
  scheduleNotification(taskData);
  
  showToast('✅ Quest added successfully!');
  loadTasks(currentUser.uid);
  
  // Clear form
  document.getElementById('task-title').value = '';
  document.getElementById('task-desc').value = '';
  document.getElementById('task-date').value = '';
  document.getElementById('task-time').value = '';
  document.getElementById('task-exp').value = '';
  document.getElementById('task-punishment').value = '';
}

async function saveTransaction() {
  if (!currentUser) return;
  
  const type = document.getElementById('transaction-type').value;
  const amount = parseInt(document.getElementById('transaction-amount').value);
  const desc = document.getElementById('transaction-desc').value;
  
  if (!amount || !desc) {
    showToast('⚠️ Isi amount dan description!');
    return;
  }
  
  await addTransaction(currentUser.uid, type, amount, desc);
  
  // Clear form
  document.getElementById('transaction-amount').value = '';
  document.getElementById('transaction-desc').value = '';
}

async function resetCharacter(userId) {
  const userRef = db.collection('users').doc(userId);
  
  // Reset user stats
  await userRef.update({
    level: 1,
    exp: 0,
    knowledge: 0,
    strength: 0,
    wealth: 0,
    balance: 0
  });
  
  // Delete all tasks
  const tasksRef = db.collection('users').doc(userId).collection('tasks');
  const tasksSnapshot = await tasksRef.get();
  tasksSnapshot.forEach(doc => doc.ref.delete());
  
  // Delete all punishments
  const punishmentsRef = db.collection('users').doc(userId).collection('punishments');
  const punishmentsSnapshot = await punishmentsRef.get();
  punishmentsSnapshot.forEach(doc => doc.ref.delete());
  
  // Delete all transactions
  const transactionsRef = db.collection('users').doc(userId).collection('transactions');
  const transactionsSnapshot = await transactionsRef.get();
  transactionsSnapshot.forEach(doc => doc.ref.delete());
  
  showToast('💀 Character reset complete! Start your journey anew! 💀');
  loadUserData(userId);
  loadTasks(userId);
  loadFinance(userId);
  loadPunishments(userId);
}