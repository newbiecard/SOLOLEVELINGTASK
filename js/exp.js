// js/exp.js
import { showToast, playSound } from './utils.js';

export async function addExp(userId, expGain, category) {
  const userRef = db.collection('users').doc(userId);
  
  await db.runTransaction(async (transaction) => {
    const userDoc = await transaction.get(userRef);
    const currentExp = userDoc.data().exp || 0;
    const currentLevel = userDoc.data().level || 1;
    
    let newExp = currentExp + expGain;
    let newLevel = currentLevel;
    let leveledUp = false;
    
    while (newExp >= 100) {
      newExp -= 100;
      newLevel++;
      leveledUp = true;
    }
    
    transaction.update(userRef, {
      exp: newExp,
      level: newLevel
    });
    
    if (leveledUp) {
      showToast(`⚡ LEVEL UP! Kamu sekarang level ${newLevel}! ⚡`);
      playSound('sounds/levelup.mp3');
      
      // Animate level display
      const levelElement = document.getElementById('level');
      levelElement.classList.add('level-up-animation');
      setTimeout(() => levelElement.classList.remove('level-up-animation'), 500);
    }
    
    // Update UI
    updateExpUI(newExp, newLevel);
  });
}

export function updateExpUI(exp, level) {
  document.getElementById('level').innerText = level;
  document.getElementById('exp-text').innerText = `${exp}/100 EXP`;
  const percent = (exp / 100) * 100;
  document.getElementById('exp-bar').style.width = `${percent}%`;
}