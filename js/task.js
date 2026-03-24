// js/task.js
import { addExp } from './exp.js';
import { addAbility } from './ability.js';
import { showToast } from './utils.js';

export async function loadTasks(userId) {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  
  const tasksRef = db.collection('users').doc(userId).collection('tasks');
  const snapshot = await tasksRef.where('date', '==', todayStr).get();
  
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = '';
  
  snapshot.forEach(doc => {
    const task = { id: doc.id, ...doc.data() };
    renderTask(task);
    checkMissedTask(task);
  });
}

export function renderTask(task) {
  const taskList = document.getElementById('task-list');
  const taskDiv = document.createElement('div');
  taskDiv.className = `task-card ${task.status}`;
  taskDiv.innerHTML = `
    <div class="task-header">
      <span class="task-title">${task.title}</span>
      <span class="task-exp">+${task.exp} EXP</span>
    </div>
    <div class="task-desc">${task.desc || ''}</div>
    <div class="task-meta">
      <span>⏰ ${task.time}</span>
      <span>📁 ${task.category}</span>
      <span>⚡ ${task.exp} EXP</span>
    </div>
    <div class="task-actions">
      ${task.status !== 'completed' && task.status !== 'missed' ? 
        `<button class="complete-btn" data-id="${task.id}">✓ Complete Quest</button>` : ''}
    </div>
  `;
  
  const completeBtn = taskDiv.querySelector('.complete-btn');
  if (completeBtn) {
    completeBtn.addEventListener('click', () => completeTask(task.id, task));
  }
  
  taskList.appendChild(taskDiv);
}

export async function completeTask(taskId, task) {
  const user = auth.currentUser;
  if (!user) return;
  
  const taskRef = db.collection('users').doc(user.uid).collection('tasks').doc(taskId);
  await taskRef.update({
    status: 'completed',
    completedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  
  // Add EXP and Ability
  await addExp(user.uid, task.exp, task.category);
  await addAbility(user.uid, task.category, task.exp);
  
  showToast(`✅ Quest completed! +${task.exp} EXP`);
  loadTasks(user.uid);
}

export function checkMissedTask(task) {
  const taskTime = new Date(`${task.date}T${task.time}`);
  const now = new Date();
  
  if (task.status === 'pending' && now > taskTime) {
    markAsMissed(task.id, task);
  }
}

export async function markAsMissed(taskId, task) {
  const user = auth.currentUser;
  if (!user) return;
  
  const taskRef = db.collection('users').doc(user.uid).collection('tasks').doc(taskId);
  await taskRef.update({ status: 'missed' });
  
  // Save punishment
  const punishmentRef = db.collection('users').doc(user.uid).collection('punishments');
  await punishmentRef.add({
    taskTitle: task.title,
    punishment: task.punishment || 'No specific punishment',
    date: firebase.firestore.FieldValue.serverTimestamp()
  });
  
  showToast(`⚠️ QUEST FAILED! ${task.punishment || 'You have been punished!'}`);
  loadPunishments(user.uid);
}

export async function loadPunishments(userId) {
  const punishmentsRef = db.collection('users').doc(userId).collection('punishments');
  const snapshot = await punishmentsRef.orderBy('date', 'desc').limit(10).get();
  
  const punishmentList = document.getElementById('punishment-list');
  punishmentList.innerHTML = '';
  
  snapshot.forEach(doc => {
    const data = doc.data();
    const div = document.createElement('div');
    div.className = 'punishment-item';
    div.innerHTML = `
      <strong>${data.taskTitle}</strong><br>
      <small>⚠️ ${data.punishment}</small><br>
      <small>${data.date ? new Date(data.date.toDate()).toLocaleDateString() : 'Today'}</small>
    `;
    punishmentList.appendChild(div);
  });
}