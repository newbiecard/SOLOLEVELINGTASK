// js/finance.js
import { showToast } from './utils.js';

export async function loadFinance(userId) {
  const userRef = db.collection('users').doc(userId);
  const userDoc = await userRef.get();
  const balance = userDoc.data().balance || 0;
  
  document.getElementById('balance').innerText = `${balance} GP`;
  
  // Load transactions
  const transactionsRef = db.collection('users').doc(userId).collection('transactions');
  const snapshot = await transactionsRef.orderBy('date', 'desc').limit(20).get();
  
  const transactionList = document.getElementById('transaction-list');
  transactionList.innerHTML = '';
  
  snapshot.forEach(doc => {
    const trans = doc.data();
    const div = document.createElement('div');
    div.className = 'transaction-item';
    div.innerHTML = `
      <span>${trans.desc}</span>
      <span class="${trans.type === 'income' ? 'transaction-income' : 'transaction-expense'}">
        ${trans.type === 'income' ? '+' : '-'} ${trans.amount} GP
      </span>
    `;
    transactionList.appendChild(div);
  });
}

export async function addTransaction(userId, type, amount, desc) {
  const userRef = db.collection('users').doc(userId);
  
  await db.runTransaction(async (transaction) => {
    const userDoc = await transaction.get(userRef);
    const currentBalance = userDoc.data().balance || 0;
    const newBalance = type === 'income' ? currentBalance + amount : currentBalance - amount;
    
    transaction.update(userRef, { balance: newBalance });
    
    const transRef = db.collection('users').doc(userId).collection('transactions');
    transaction.set(transRef.doc(), {
      type,
      amount,
      desc,
      date: firebase.firestore.FieldValue.serverTimestamp()
    });
  });
  
  showToast(`${type === 'income' ? '💰 +' : '💸 -'}${amount} GP`);
  loadFinance(userId);
}