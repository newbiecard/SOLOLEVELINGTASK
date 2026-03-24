// js/ability.js
export async function addAbility(userId, category, expGain) {
  const userRef = db.collection('users').doc(userId);
  const abilityMap = {
    'study': 'knowledge',
    'exercise': 'strength',
    'work': 'wealth'
  };
  
  const abilityKey = abilityMap[category] || 'knowledge';
  
  await db.runTransaction(async (transaction) => {
    const userDoc = await transaction.get(userRef);
    const currentAbility = userDoc.data()[abilityKey] || 0;
    let newAbility = Math.min(currentAbility + expGain, 100);
    
    transaction.update(userRef, {
      [abilityKey]: newAbility
    });
    
    updateAbilityUI(abilityKey, newAbility);
  });
}

export function updateAbilityUI(ability, value) {
  const barId = `${ability}-bar`;
  const valueId = `${ability}-value`;
  
  const bar = document.getElementById(barId);
  const valueSpan = document.getElementById(valueId);
  
  if (bar && valueSpan) {
    bar.style.width = `${value}%`;
    valueSpan.innerText = `${value}%`;
  }
}