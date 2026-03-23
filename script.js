// ======================== ULTIMATE LEVELING OS+ ========================
// User Management
let currentUser = null;
let users = {};

// Core Player Data
let player = {
    exp: 0,
    gold: 300,
    level: 1,
    streak: 0,
    lastLoginDate: null,
    lastCompleteDate: null,
    totalQuestsCompleted: 0,
    stats: {
        life: 50,
        physical: 45,
        spiritual: 40,
        work: 35,
        education: 50,
        relationship: 55
    }
};

// Quest System
let quests = [];

// Schedule System (Jadwal dengan Alarm)
let schedules = [];

// Shop & Rewards
let shopItems = [
    { id: "s1", name: "❤️ Life Crystal", cost: 80, type: "stat", stat: "life", value: 5, owned: false },
    { id: "s2", name: "💪 Power Elixir", cost: 80, type: "stat", stat: "physical", value: 5, owned: false },
    { id: "s3", name: "🧘 Meditation Guide", cost: 80, type: "stat", stat: "spiritual", value: 5, owned: false },
    { id: "s4", name: "💼 Work Mastery", cost: 80, type: "stat", stat: "work", value: 5, owned: false },
    { id: "s5", name: "📚 Knowledge Tome", cost: 80, type: "stat", stat: "education", value: 5, owned: false },
    { id: "s6", name: "👥 Social Bond", cost: 80, type: "stat", stat: "relationship", value: 5, owned: false },
    { id: "s7", name: "✨ EXP Boost", cost: 150, type: "exp", value: 50, owned: false },
    { id: "s8", name: "💰 Gold Pouch", cost: 100, type: "gold", value: 100, owned: false }
];

// Punishment System
let punishments = [];

// Finance Data
let transactions = [];

// Inventory
let inventoryItems = [];

// Knowledge Vault (Notes)
let notes = [];

// Content Plans
let contentPlans = [];

// Password Manager
let passwords = [];

// Alarm System (jadwal alarm mandiri)
let alarms = [];

// Reminder Times
let reminderTimes = ["08:00", "20:00"];
let notificationPermission = false;
let alarmInterval = null;
let scheduleCheckerInterval = null;
let currentPage = "dashboard";

// ======================== INITIALIZATION ========================
function init() {
    loadUsers();
    setupLogin();
    setupEventListeners();
    
    // Simulate loading
    let progress = 0;
    const progressBar = document.getElementById("loading-progress-bar");
    const interval = setInterval(() => {
        progress += 10;
        if (progressBar) progressBar.style.width = progress + "%";
        if (progress >= 100) {
            clearInterval(interval);
            document.getElementById("loading-screen").style.display = "none";
        }
    }, 80);
}

function loadUsers() {
    const savedUsers = localStorage.getItem("ulo_users");
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    } else {
        // Default user
        users = {
            "abbas": {
                password: btoa("123"),
                data: null
            }
        };
        localStorage.setItem("ulo_users", JSON.stringify(users));
    }
}

function saveUsers() {
    localStorage.setItem("ulo_users", JSON.stringify(users));
}

function setupLogin() {
    const loginScreen = document.getElementById("login-screen");
    const appContainer = document.getElementById("app-container");
    
    // Check if user already logged in
    const savedSession = localStorage.getItem("ulo_current_session");
    if (savedSession) {
        const session = JSON.parse(savedSession);
        if (session.username && users[session.username]) {
            currentUser = session.username;
            loadUserData();
            loginScreen.style.display = "none";
            appContainer.style.display = "block";
            startApp();
            return;
        }
    }
    
    loginScreen.style.display = "flex";
    
    document.getElementById("login-btn").onclick = () => {
        const username = document.getElementById("login-username").value.trim();
        const password = document.getElementById("login-password").value;
        
        if (!username) {
            showToast("Masukkan username!", "#ef4444");
            return;
        }
        
        if (users[username]) {
            // Login existing user
            if (atob(users[username].password) === password) {
                currentUser = username;
                loadUserData();
                localStorage.setItem("ulo_current_session", JSON.stringify({ username: username }));
                loginScreen.style.display = "none";
                appContainer.style.display = "block";
                startApp();
                showToast(`Welcome back, ${username}!`, "#22c55e");
            } else {
                showToast("Password salah!", "#ef4444");
            }
        } else {
            // Register new user
            if (password.length < 3) {
                showToast("Password minimal 3 karakter!", "#ef4444");
                return;
            }
            users[username] = {
                password: btoa(password),
                data: null
            };
            saveUsers();
            currentUser = username;
            initUserData();
            localStorage.setItem("ulo_current_session", JSON.stringify({ username: username }));
            loginScreen.style.display = "none";
            appContainer.style.display = "block";
            startApp();
            showToast(`Selamat datang, ${username}!`, "#22c55e");
        }
    };
    
    document.getElementById("guest-btn").onclick = () => {
        currentUser = "guest_" + Date.now();
        initUserData();
        loginScreen.style.display = "none";
        appContainer.style.display = "block";
        startApp();
        showToast("Guest Mode - Data tidak akan tersimpan permanen", "#fbbf24");
    };
}

function initUserData() {
    const today = new Date().toDateString();
    
    player = {
        exp: 0,
        gold: 300,
        level: 1,
        streak: 0,
        lastLoginDate: today,
        lastCompleteDate: null,
        totalQuestsCompleted: 0,
        stats: {
            life: 50,
            physical: 45,
            spiritual: 40,
            work: 35,
            education: 50,
            relationship: 55
        }
    };
    
    quests = [
        { id: Date.now() + 1, name: "Olahraga 30 Menit", type: "Daily", expReward: 25, goldReward: 15, completed: false, date: today, scheduleTime: null },
        { id: Date.now() + 2, name: "Membaca 20 Halaman", type: "Daily", expReward: 30, goldReward: 10, completed: false, date: today, scheduleTime: null },
        { id: Date.now() + 3, name: "Meditasi 10 Menit", type: "Daily", expReward: 20, goldReward: 8, completed: false, date: today, scheduleTime: null },
        { id: Date.now() + 4, name: "Weekly Planning", type: "Weekly", expReward: 100, goldReward: 50, completed: false, date: null, scheduleTime: null },
        { id: Date.now() + 5, name: "Monthly Goal Review", type: "Monthly", expReward: 200, goldReward: 100, completed: false, date: null, scheduleTime: null },
        { id: Date.now() + 6, name: "Main Quest: Level Up Life", type: "Main", expReward: 500, goldReward: 250, completed: false, date: null, scheduleTime: null }
    ];
    
    schedules = [];
    punishments = [];
    transactions = [];
    inventoryItems = [];
    notes = [];
    contentPlans = [];
    passwords = [];
    alarms = [];
    
    saveUserData();
}

function loadUserData() {
    const savedData = localStorage.getItem(`ulo_user_${currentUser}`);
    if (savedData) {
        const data = JSON.parse(savedData);
        player = data.player || player;
        quests = data.quests || [];
        schedules = data.schedules || [];
        shopItems = data.shopItems || shopItems;
        punishments = data.punishments || [];
        transactions = data.transactions || [];
        inventoryItems = data.inventoryItems || [];
        notes = data.notes || [];
        contentPlans = data.contentPlans || [];
        passwords = data.passwords || [];
        alarms = data.alarms || [];
    } else {
        initUserData();
    }
    updateLevel();
}

function saveUserData() {
    if (!currentUser || currentUser.startsWith("guest_")) return;
    
    const data = {
        player: player,
        quests: quests,
        schedules: schedules,
        shopItems: shopItems,
        punishments: punishments,
        transactions: transactions,
        inventoryItems: inventoryItems,
        notes: notes,
        contentPlans: contentPlans,
        passwords: passwords,
        alarms: alarms
    };
    localStorage.setItem(`ulo_user_${currentUser}`, JSON.stringify(data));
}

function logout() {
    localStorage.removeItem("ulo_current_session");
    currentUser = null;
    location.reload();
}

function startApp() {
    updateHeaderDisplay();
    requestNotificationPermission();
    startReminderSystem();
    startAlarmChecker();
    startScheduleChecker();
    checkDailyReset();
    setInterval(checkDailyReset, 60000);
    checkStreak();
    setupNavigation();
    renderCurrentPage();
    
    // Request notification permission on app start
    setTimeout(() => {
        showToast("System Ready! Level up your life!", "#a855f7");
        sendNotification("Ultimate Leveling OS+", "Selamat datang! Selesaikan quest dan jadwal harianmu!");
    }, 500);
}

// ======================== SCHEDULE SYSTEM WITH ALARM ========================
function addSchedule() {
    showModal(`
        <h3>📅 Tambah Jadwal</h3>
        <input type="text" id="scheduleTitle" placeholder="Nama Jadwal" autocomplete="off">
        <input type="date" id="scheduleDate" placeholder="Tanggal">
        <input type="time" id="scheduleTime" placeholder="Waktu">
        <select id="scheduleRepeat">
            <option value="none">Sekali</option>
            <option value="daily">Setiap Hari</option>
            <option value="weekly">Setiap Minggu</option>
            <option value="monthly">Setiap Bulan</option>
        </select>
        <select id="scheduleType">
            <option value="quest">Quest</option>
            <option value="reminder">Reminder</option>
            <option value="alarm">Alarm Biasa</option>
        </select>
        <input type="text" id="scheduleNote" placeholder="Catatan (opsional)">
        <div style="margin-top: 1rem;">
            <label>
                <input type="checkbox" id="scheduleAlarm" checked> Aktifkan Alarm
            </label>
        </div>
        <div style="display: flex; gap: 0.75rem; margin-top: 1rem;">
            <button onclick="confirmAddSchedule()" class="btn btn-primary">Tambah</button>
            <button onclick="closeModal()" class="btn">Batal</button>
        </div>
    `);
}

function confirmAddSchedule() {
    const title = document.getElementById("scheduleTitle")?.value;
    const date = document.getElementById("scheduleDate")?.value;
    const time = document.getElementById("scheduleTime")?.value;
    const repeat = document.getElementById("scheduleRepeat")?.value;
    const type = document.getElementById("scheduleType")?.value;
    const note = document.getElementById("scheduleNote")?.value || "";
    const hasAlarm = document.getElementById("scheduleAlarm")?.checked || false;
    
    if (!title) {
        showToast("Nama jadwal harus diisi!", "#ef4444");
        return;
    }
    
    if (!time) {
        showToast("Waktu harus diisi!", "#ef4444");
        return;
    }
    
    const schedule = {
        id: Date.now(),
        title: title,
        date: date || null,
        time: time,
        repeat: repeat,
        type: type,
        note: note,
        hasAlarm: hasAlarm,
        completed: false,
        completedDate: null,
        lastTriggered: null,
        createdAt: new Date().toISOString()
    };
    
    schedules.push(schedule);
    saveUserData();
    closeModal();
    renderCurrentPage();
    showToast(`📅 Jadwal "${title}" ditambahkan!`, "#22c55e");
    
    // Create alarm for this schedule if needed
    if (hasAlarm) {
        createAlarmFromSchedule(schedule);
    }
}

function createAlarmFromSchedule(schedule) {
    const alarm = {
        id: schedule.id,
        label: schedule.title,
        type: schedule.repeat === "none" ? "once" : schedule.repeat,
        time: schedule.time,
        date: schedule.date,
        active: true,
        lastTriggered: null,
        scheduleId: schedule.id
    };
    
    // Check if alarm already exists
    const existing = alarms.find(a => a.scheduleId === schedule.id);
    if (!existing) {
        alarms.push(alarm);
        saveUserData();
    }
}

function editSchedule(scheduleId) {
    const schedule = schedules.find(s => s.id === scheduleId);
    if (!schedule) return;
    
    showModal(`
        <h3>✏️ Edit Jadwal</h3>
        <input type="text" id="editScheduleTitle" value="${schedule.title}">
        <input type="date" id="editScheduleDate" value="${schedule.date || ''}">
        <input type="time" id="editScheduleTime" value="${schedule.time}">
        <select id="editScheduleRepeat">
            <option value="none" ${schedule.repeat === "none" ? "selected" : ""}>Sekali</option>
            <option value="daily" ${schedule.repeat === "daily" ? "selected" : ""}>Setiap Hari</option>
            <option value="weekly" ${schedule.repeat === "weekly" ? "selected" : ""}>Setiap Minggu</option>
            <option value="monthly" ${schedule.repeat === "monthly" ? "selected" : ""}>Setiap Bulan</option>
        </select>
        <textarea id="editScheduleNote" rows="2" placeholder="Catatan">${schedule.note || ''}</textarea>
        <div style="display: flex; gap: 0.75rem; margin-top: 1rem;">
            <button onclick="confirmEditSchedule(${scheduleId})" class="btn btn-primary">Simpan</button>
            <button onclick="closeModal()" class="btn">Batal</button>
        </div>
    `);
}

function confirmEditSchedule(scheduleId) {
    const schedule = schedules.find(s => s.id === scheduleId);
    if (schedule) {
        schedule.title = document.getElementById("editScheduleTitle")?.value || schedule.title;
        schedule.date = document.getElementById("editScheduleDate")?.value || null;
        schedule.time = document.getElementById("editScheduleTime")?.value || schedule.time;
        schedule.repeat = document.getElementById("editScheduleRepeat")?.value;
        schedule.note = document.getElementById("editScheduleNote")?.value || "";
        
        saveUserData();
        closeModal();
        renderCurrentPage();
        showToast(`📅 Jadwal diperbarui!`, "#00d4ff");
    }
}

function completeSchedule(scheduleId) {
    const schedule = schedules.find(s => s.id === scheduleId);
    if (!schedule || schedule.completed) return;
    
    schedule.completed = true;
    schedule.completedDate = new Date().toISOString();
    
    // If this schedule is linked to a quest, complete that quest too
    if (schedule.type === "quest") {
        const relatedQuest = quests.find(q => q.name === schedule.title && !q.completed);
        if (relatedQuest) {
            completeQuest(relatedQuest.id);
        }
    }
    
    showToast(`✅ Jadwal "${schedule.title}" selesai!`, "#22c55e");
    playSound("complete");
    saveUserData();
    renderCurrentPage();
    
    // Check streak after completing schedule
    checkStreak();
}

function deleteSchedule(scheduleId) {
    if (confirm("Hapus jadwal ini?")) {
        schedules = schedules.filter(s => s.id !== scheduleId);
        // Also remove related alarm
        alarms = alarms.filter(a => a.scheduleId !== scheduleId);
        saveUserData();
        renderCurrentPage();
        showToast(`🗑️ Jadwal dihapus!`, "#ef4444");
    }
}

function startScheduleChecker() {
    scheduleCheckerInterval = setInterval(() => {
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        const currentDate = now.toISOString().split('T')[0];
        const currentDay = now.getDate();
        const currentWeekday = now.getDay();
        
        schedules.forEach(schedule => {
            if (schedule.completed) return;
            if (!schedule.hasAlarm) return;
            
            let shouldTrigger = false;
            
            // Check if schedule should trigger today
            if (schedule.date) {
                // Once schedule
                if (schedule.date === currentDate && schedule.time === currentTime) {
                    shouldTrigger = true;
                }
            } else if (schedule.repeat === "daily") {
                if (schedule.time === currentTime) {
                    shouldTrigger = true;
                }
            } else if (schedule.repeat === "weekly") {
                // Check day of week matches schedule creation day
                const scheduleDate = new Date(schedule.createdAt);
                if (schedule.time === currentTime && scheduleDate.getDay() === currentWeekday) {
                    shouldTrigger = true;
                }
            } else if (schedule.repeat === "monthly") {
                const scheduleDate = new Date(schedule.createdAt);
                if (schedule.time === currentTime && scheduleDate.getDate() === currentDay) {
                    shouldTrigger = true;
                }
            }
            
            if (shouldTrigger && schedule.lastTriggered !== currentDate) {
                schedule.lastTriggered = currentDate;
                saveUserData();
                
                showToast(`⏰ JADWAL: ${schedule.title} - Waktunya!`, "#fbbf24");
                sendNotification("Jadwal!", schedule.title);
                playAlarmSound();
            }
        });
    }, 10000);
}

// ======================== LEVEL & EXP ========================
function updateLevel() {
    const newLevel = Math.floor(player.exp / 100) + 1;
    if (newLevel !== player.level) {
        player.level = newLevel;
        levelUpEffect();
        showToast(`✨ LEVEL UP! Sekarang Level ${player.level}! ✨`, "#fbbf24");
        sendNotification("Level Up!", `Selamat! Kamu naik ke Level ${player.level}!`);
        playSound("levelup");
    }
    saveUserData();
}

function addExp(amount) {
    player.exp += amount;
    updateLevel();
    updateHeaderDisplay();
    renderCurrentPage();
}

function addGold(amount) {
    player.gold += amount;
    updateHeaderDisplay();
    renderCurrentPage();
}

function updateHeaderDisplay() {
    const goldEl = document.getElementById("header-gold");
    const streakEl = document.getElementById("header-streak");
    const levelEl = document.getElementById("header-level");
    if (goldEl) goldEl.textContent = player.gold;
    if (streakEl) streakEl.textContent = player.streak;
    if (levelEl) levelEl.textContent = player.level;
}

// ======================== QUEST SYSTEM ========================
function addQuest() {
    showModal(`
        <h3 style="margin-bottom: 1rem;">📜 Tambah Quest Baru</h3>
        <input type="text" id="questName" placeholder="Nama Quest" autocomplete="off">
        <select id="questType">
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Main">Main Quest</option>
        </select>
        <input type="number" id="questExp" placeholder="EXP Reward" value="20">
        <input type="number" id="questGold" placeholder="Gold Reward" value="10">
        <input type="time" id="questTime" placeholder="Waktu (opsional)">
        <div style="display: flex; gap: 0.75rem; margin-top: 1rem;">
            <button onclick="confirmAddQuest()" class="btn btn-primary">Tambah</button>
            <button onclick="closeModal()" class="btn">Batal</button>
        </div>
    `);
}

function confirmAddQuest() {
    const name = document.getElementById("questName")?.value;
    const type = document.getElementById("questType")?.value;
    const expReward = parseInt(document.getElementById("questExp")?.value) || 20;
    const goldReward = parseInt(document.getElementById("questGold")?.value) || 10;
    const questTime = document.getElementById("questTime")?.value || null;
    
    if (name) {
        const newQuest = {
            id: Date.now(),
            name: name,
            type: type,
            expReward: expReward,
            goldReward: goldReward,
            completed: false,
            date: ["Daily", "Weekly", "Monthly"].includes(type) && type !== "Main" ? new Date().toDateString() : null,
            scheduleTime: questTime
        };
        
        quests.push(newQuest);
        
        // Auto-create schedule if time is set
        if (questTime) {
            const schedule = {
                id: Date.now(),
                title: name,
                date: null,
                time: questTime,
                repeat: type === "Daily" ? "daily" : type === "Weekly" ? "weekly" : type === "Monthly" ? "monthly" : "none",
                type: "quest",
                note: `Quest: +${expReward} EXP, +${goldReward} Gold`,
                hasAlarm: true,
                completed: false,
                completedDate: null,
                lastTriggered: null,
                createdAt: new Date().toISOString()
            };
            schedules.push(schedule);
            createAlarmFromSchedule(schedule);
        }
        
        saveUserData();
        closeModal();
        renderCurrentPage();
        showToast(`✅ Quest "${name}" ditambahkan!`, "#22c55e");
        playSound("click");
    }
}

function completeQuest(questId) {
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.completed) return;
    
    quest.completed = true;
    if (["Daily", "Weekly", "Monthly"].includes(quest.type)) {
        quest.date = new Date().toDateString();
    }
    
    addExp(quest.expReward);
    addGold(quest.goldReward);
    player.totalQuestsCompleted++;
    
    // Mark related schedule as completed
    const relatedSchedule = schedules.find(s => s.title === quest.name && !s.completed);
    if (relatedSchedule) {
        relatedSchedule.completed = true;
        relatedSchedule.completedDate = new Date().toISOString();
    }
    
    showToast(`✅ ${quest.name} selesai! +${quest.expReward} EXP, +${quest.goldReward} Gold`, "#22c55e");
    sendNotification("Quest Selesai!", `${quest.name} selesai! +${quest.expReward} EXP, +${quest.goldReward} Gold`);
    playSound("complete");
    
    checkStreak();
    saveUserData();
    renderCurrentPage();
}

function editQuest(questId) {
    const quest = quests.find(q => q.id === questId);
    if (!quest) return;
    
    showModal(`
        <h3>✏️ Edit Quest</h3>
        <input type="text" id="editQuestName" value="${quest.name}">
        <select id="editQuestType">
            <option value="Daily" ${quest.type === "Daily" ? "selected" : ""}>Daily</option>
            <option value="Weekly" ${quest.type === "Weekly" ? "selected" : ""}>Weekly</option>
            <option value="Monthly" ${quest.type === "Monthly" ? "selected" : ""}>Monthly</option>
            <option value="Main" ${quest.type === "Main" ? "selected" : ""}>Main Quest</option>
        </select>
        <input type="number" id="editQuestExp" value="${quest.expReward}">
        <input type="number" id="editQuestGold" value="${quest.goldReward}">
        <div style="display: flex; gap: 0.75rem; margin-top: 1rem;">
            <button onclick="confirmEditQuest(${questId})" class="btn btn-primary">Simpan</button>
            <button onclick="closeModal()" class="btn">Batal</button>
        </div>
    `);
}

function confirmEditQuest(questId) {
    const quest = quests.find(q => q.id === questId);
    if (quest) {
        quest.name = document.getElementById("editQuestName")?.value || quest.name;
        quest.type = document.getElementById("editQuestType")?.value;
        quest.expReward = parseInt(document.getElementById("editQuestExp")?.value) || quest.expReward;
        quest.goldReward = parseInt(document.getElementById("editQuestGold")?.value) || quest.goldReward;
        saveUserData();
        closeModal();
        renderCurrentPage();
        showToast(`📝 Quest diperbarui!`, "#00d4ff");
    }
}

function deleteQuest(questId) {
    if (confirm("Yakin ingin menghapus quest ini?")) {
        quests = quests.filter(q => q.id !== questId);
        saveUserData();
        renderCurrentPage();
        showToast(`🗑️ Quest dihapus!`, "#ef4444");
    }
}

// ======================== STREAK & DISCIPLINE ========================
function checkStreak() {
    const today = new Date().toDateString();
    const dailyQuests = quests.filter(q => q.type === "Daily" && q.date === today);
    const allDailyCompleted = dailyQuests.length > 0 && dailyQuests.every(q => q.completed);
    
    if (dailyQuests.length > 0 && allDailyCompleted) {
        if (player.lastCompleteDate !== today) {
            if (player.lastCompleteDate && 
                (new Date(player.lastCompleteDate).getTime() + 86400000) === new Date(today).getTime()) {
                player.streak++;
                if (player.streak % 5 === 0) {
                    const bonusExp = 50;
                    addExp(bonusExp);
                    showToast(`🔥 STREAK ${player.streak} HARI! Bonus EXP +${bonusExp} 🔥`, "#fbbf24");
                    sendNotification("Streak Bonus!", `Streak ${player.streak} hari! +${bonusExp} EXP!`);
                }
            } else {
                player.streak = 1;
            }
            player.lastCompleteDate = today;
        }
    } else if (dailyQuests.length > 0 && !allDailyCompleted && player.lastCompleteDate !== today && player.streak > 0) {
        player.streak = 0;
        showToast(`💔 Streak putus! Mulai lagi besok!`, "#ef4444");
    }
    
    updateHeaderDisplay();
    saveUserData();
}

function applyPunishment() {
    const today = new Date().toDateString();
    const incompleteDailies = quests.filter(q => q.type === "Daily" && !q.completed && q.date === today);
    
    if (incompleteDailies.length > 0) {
        incompleteDailies.forEach(q => {
            punishments.unshift({
                id: Date.now(),
                questName: q.name,
                date: today,
                completed: false
            });
        });
        
        const expPenalty = 10;
        const goldPenalty = 15;
        player.exp = Math.max(0, player.exp - expPenalty);
        player.gold = Math.max(0, player.gold - goldPenalty);
        
        showToast(`⚠️ PUNISHMENT! ${incompleteDailies.length} quest gagal! EXP -${expPenalty}, Gold -${goldPenalty}`, "#ef4444");
        sendNotification("Punishment!", `Kamu gagal menyelesaikan ${incompleteDailies.length} quest!`);
        playSound("punishment");
        
        updateLevel();
        updateHeaderDisplay();
        saveUserData();
        renderCurrentPage();
    }
}

function completePunishment(punishmentId) {
    const punishment = punishments.find(p => p.id === punishmentId);
    if (punishment) {
        punishment.completed = true;
        saveUserData();
        renderCurrentPage();
        showToast(`✅ Punishment selesai!`, "#22c55e");
        playSound("complete");
    }
}

function addManualPunishment() {
    showModal(`
        <h3>⚠️ Tambah Punishment Manual</h3>
        <input type="text" id="punishmentName" placeholder="Nama Punishment">
        <div style="display: flex; gap: 0.75rem; margin-top: 1rem;">
            <button onclick="confirmAddPunishment()" class="btn btn-primary">Tambah</button>
            <button onclick="closeModal()" class="btn">Batal</button>
        </div>
    `);
}

function confirmAddPunishment() {
    const name = document.getElementById("punishmentName")?.value;
    if (name) {
        punishments.unshift({
            id: Date.now(),
            questName: name,
            date: new Date().toDateString(),
            completed: false,
            manual: true
        });
        saveUserData();
        closeModal();
        renderCurrentPage();
        showToast(`⚠️ Punishment "${name}" ditambahkan!`, "#ef4444");
    }
}

// ======================== SHOP ========================
function buyItem(itemId) {
    const item = shopItems.find(i => i.id === itemId);
    if (!item || item.owned) return;
    
    if (player.gold >= item.cost) {
        player.gold -= item.cost;
        item.owned = true;
        
        switch (item.type) {
            case "stat":
                player.stats[item.stat] = Math.min(100, player.stats[item.stat] + item.value);
                showToast(`✅ ${item.name}! ${item.stat.toUpperCase()} +${item.value}`, "#22c55e");
                break;
            case "exp":
                addExp(item.value);
                showToast(`✨ ${item.name}! +${item.value} EXP`, "#fbbf24");
                break;
            case "gold":
                addGold(item.value);
                showToast(`💰 ${item.name}! +${item.value} Gold`, "#fbbf24");
                break;
        }
        
        sendNotification("Pembelian Berhasil!", `Kamu membeli ${item.name}!`);
        playSound("buy");
        updateHeaderDisplay();
        saveUserData();
        renderCurrentPage();
    } else {
        showToast(`💰 Gold tidak cukup! Butuh ${item.cost} Gold`, "#ef4444");
    }
}

// ======================== FINANCE MANAGER ========================
function addTransaction() {
    showModal(`
        <h3>💰 Tambah Transaksi</h3>
        <select id="transType">
            <option value="income">💚 Pemasukan</option>
            <option value="expense">🔴 Pengeluaran</option>
        </select>
        <input type="number" id="transAmount" placeholder="Jumlah">
        <input type="text" id="transCategory" placeholder="Kategori (Makan, Transport, dll)">
        <input type="text" id="transNote" placeholder="Catatan">
        <div style="display: flex; gap: 0.75rem; margin-top: 1rem;">
            <button onclick="confirmAddTransaction()" class="btn btn-primary">Tambah</button>
            <button onclick="closeModal()" class="btn">Batal</button>
        </div>
    `);
}

function confirmAddTransaction() {
    const type = document.getElementById("transType")?.value;
    const amount = parseInt(document.getElementById("transAmount")?.value);
    const category = document.getElementById("transCategory")?.value || "General";
    const note = document.getElementById("transNote")?.value || "";
    
    if (amount && amount > 0) {
        transactions.unshift({
            id: Date.now(),
            type: type,
            amount: amount,
            category: category,
            date: new Date().toISOString(),
            note: note
        });
        saveUserData();
        closeModal();
        renderCurrentPage();
        showToast(`✅ Transaksi ditambahkan!`, "#22c55e");
    }
}

function deleteTransaction(transId) {
    if (confirm("Hapus transaksi?")) {
        transactions = transactions.filter(t => t.id !== transId);
        saveUserData();
        renderCurrentPage();
        showToast(`🗑️ Transaksi dihapus!`, "#ef4444");
    }
}

function getBalance() {
    const income = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
    return income - expense;
}

// ======================== INVENTORY ========================
function addInventoryItem() {
    showModal(`
        <h3>🎒 Tambah Item</h3>
        <input type="text" id="invName" placeholder="Nama Item">
        <input type="text" id="invCategory" placeholder="Kategori">
        <input type="text" id="invStatus" placeholder="Status (Baru/Bagus/Rusak)">
        <input type="number" id="invQuantity" placeholder="Jumlah" value="1">
        <input type="text" id="invNote" placeholder="Catatan">
        <div style="display: flex; gap: 0.75rem; margin-top: 1rem;">
            <button onclick="confirmAddInventory()" class="btn btn-primary">Tambah</button>
            <button onclick="closeModal()" class="btn">Batal</button>
        </div>
    `);
}

function confirmAddInventory() {
    const name = document.getElementById("invName")?.value;
    if (name) {
        inventoryItems.push({
            id: Date.now(),
            name: name,
            category: document.getElementById("invCategory")?.value || "General",
            status: document.getElementById("invStatus")?.value || "Good",
            quantity: parseInt(document.getElementById("invQuantity")?.value) || 1,
            note: document.getElementById("invNote")?.value || ""
        });
        saveUserData();
        closeModal();
        renderCurrentPage();
        showToast(`✅ Item "${name}" ditambahkan!`, "#22c55e");
    }
}

function deleteInventoryItem(itemId) {
    if (confirm("Hapus item?")) {
        inventoryItems = inventoryItems.filter(i => i.id !== itemId);
        saveUserData();
        renderCurrentPage();
    }
}

// ======================== KNOWLEDGE VAULT ========================
function addNote() {
    showModal(`
        <h3>🧠 Tambah Catatan</h3>
        <input type="text" id="noteTitle" placeholder="Judul">
        <textarea id="noteContent" rows="4" placeholder="Isi catatan..."></textarea>
        <input type="text" id="noteTags" placeholder="Tag (pisahkan koma)">
        <div style="display: flex; gap: 0.75rem; margin-top: 1rem;">
            <button onclick="confirmAddNote()" class="btn btn-primary">Simpan</button>
            <button onclick="closeModal()" class="btn">Batal</button>
        </div>
    `);
}

function confirmAddNote() {
    const title = document.getElementById("noteTitle")?.value;
    if (title) {
        notes.unshift({
            id: Date.now(),
            title: title,
            content: document.getElementById("noteContent")?.value || "",
            tags: (document.getElementById("noteTags")?.value || "").split(",").map(t => t.trim()),
            createdAt: new Date().toISOString()
        });
        saveUserData();
        closeModal();
        renderCurrentPage();
        showToast(`📝 Catatan "${title}" ditambahkan!`, "#22c55e");
    }
}

function deleteNote(noteId) {
    if (confirm("Hapus catatan?")) {
        notes = notes.filter(n => n.id !== noteId);
        saveUserData();
        renderCurrentPage();
    }
}

function addContentPlan() {
    showModal(`
        <h3>📝 Tambah Rencana Konten</h3>
        <input type="text" id="contentTitle" placeholder="Judul Konten">
        <select id="contentStatus">
            <option value="planning">Planning</option>
            <option value="progress">Progress</option>
            <option value="done">Done</option>
        </select>
        <input type="text" id="contentCategory" placeholder="Kategori">
        <input type="text" id="contentDeadline" placeholder="Deadline (opsional)">
        <textarea id="contentNotes" rows="3" placeholder="Catatan..."></textarea>
        <div style="display: flex; gap: 0.75rem; margin-top: 1rem;">
            <button onclick="confirmAddContent()" class="btn btn-primary">Simpan</button>
            <button onclick="closeModal()" class="btn">Batal</button>
        </div>
    `);
}

function confirmAddContent() {
    const title = document.getElementById("contentTitle")?.value;
    if (title) {
        contentPlans.unshift({
            id: Date.now(),
            title: title,
            status: document.getElementById("contentStatus")?.value || "planning",
            category: document.getElementById("contentCategory")?.value || "General",
            deadline: document.getElementById("contentDeadline")?.value || null,
            notes: document.getElementById("contentNotes")?.value || ""
        });
        saveUserData();
        closeModal();
        renderCurrentPage();
        showToast(`📋 Rencana konten "${title}" ditambahkan!`, "#22c55e");
    }
}

function updateContentStatus(contentId, newStatus) {
    const content = contentPlans.find(c => c.id === contentId);
    if (content) {
        content.status = newStatus;
        saveUserData();
        renderCurrentPage();
        showToast(`📋 Status diperbarui: ${newStatus}`, "#00d4ff");
    }
}

function deleteContentPlan(contentId) {
    if (confirm("Hapus rencana konten?")) {
        contentPlans = contentPlans.filter(c => c.id !== contentId);
        saveUserData();
        renderCurrentPage();
    }
}

// ======================== PASSWORD MANAGER ========================
function addPassword() {
    showModal(`
        <h3>🔐 Tambah Password</h3>
        <input type="text" id="passPlatform" placeholder="Platform / Website">
        <input type="text" id="passUsername" placeholder="Username / Email">
        <input type="password" id="passPassword" placeholder="Password">
        <input type="text" id="passNotes" placeholder="Catatan (opsional)">
        <div style="display: flex; gap: 0.75rem; margin-top: 1rem;">
            <button onclick="confirmAddPassword()" class="btn btn-primary">Simpan</button>
            <button onclick="closeModal()" class="btn">Batal</button>
        </div>
    `);
}

function confirmAddPassword() {
    const platform = document.getElementById("passPlatform")?.value;
    if (platform) {
        passwords.push({
            id: Date.now(),
            platform: platform,
            username: document.getElementById("passUsername")?.value || "",
            password: btoa(document.getElementById("passPassword")?.value || ""),
            notes: document.getElementById("passNotes")?.value || ""
        });
        saveUserData();
        closeModal();
        renderCurrentPage();
        showToast(`🔐 Password untuk "${platform}" ditambahkan!`, "#22c55e");
    }
}

function revealPassword(passId) {
    const pass = passwords.find(p => p.id === passId);
    if (pass) {
        alert(`Platform: ${pass.platform}\nUsername: ${pass.username}\nPassword: ${atob(pass.password)}`);
    }
}

function deletePassword(passId) {
    if (confirm("Hapus data password?")) {
        passwords = passwords.filter(p => p.id !== passId);
        saveUserData();
        renderCurrentPage();
    }
}

// ======================== ALARM SYSTEM ========================
function addAlarm() {
    showModal(`
        <h3>⏰ Tambah Alarm</h3>
        <input type="text" id="alarmLabel" placeholder="Label Alarm">
        <select id="alarmType">
            <option value="daily">Daily (setiap hari)</option>
            <option value="once">Sekali (tanggal tertentu)</option>
            <option value="weekly">Weekly (hari tertentu)</option>
            <option value="monthly">Monthly (setiap tanggal)</option>
        </select>
        <input type="time" id="alarmTime" placeholder="Waktu (HH:MM)">
        <div id="alarmDateField" style="display: none;">
            <input type="date" id="alarmDate" placeholder="Tanggal">
        </div>
        <div id="alarmDayField" style="display: none;">
            <input type="number" id="alarmDay" placeholder="Tanggal (1-31)" min="1" max="31">
        </div>
        <div id="alarmWeekdayField" style="display: none;">
            <select id="alarmWeekday">
                <option value="0">Minggu</option>
                <option value="1">Senin</option>
                <option value="2">Selasa</option>
                <option value="3">Rabu</option>
                <option value="4">Kamis</option>
                <option value="5">Jumat</option>
                <option value="6">Sabtu</option>
            </select>
        </div>
        <div style="display: flex; gap: 0.75rem; margin-top: 1rem;">
            <button onclick="confirmAddAlarm()" class="btn btn-primary">Tambah</button>
            <button onclick="closeModal()" class="btn">Batal</button>
        </div>
    `);
    
    const typeSelect = document.getElementById("alarmType");
    const dateField = document.getElementById("alarmDateField");
    const dayField = document.getElementById("alarmDayField");
    const weekdayField = document.getElementById("alarmWeekdayField");
    
    typeSelect?.addEventListener("change", () => {
        dateField.style.display = typeSelect.value === "once" ? "block" : "none";
        dayField.style.display = typeSelect.value === "monthly" ? "block" : "none";
        weekdayField.style.display = typeSelect.value === "weekly" ? "block" : "none";
    });
}

function confirmAddAlarm() {
    const type = document.getElementById("alarmType")?.value;
    const time = document.getElementById("alarmTime")?.value;
    const label = document.getElementById("alarmLabel")?.value || "Alarm";
    
    if (!time) {
        showToast("Waktu alarm harus diisi!", "#ef4444");
        return;
    }
    
    const alarm = {
        id: Date.now(),
        type: type,
        time: time,
        label: label,
        active: true,
        lastTriggered: null,
        scheduleId: null
    };
    
    if (type === "once") {
        alarm.date = document.getElementById("alarmDate")?.value;
        if (!alarm.date) {
            showToast("Tanggal harus diisi!", "#ef4444");
            return;
        }
    }
    
    if (type === "monthly") {
        alarm.day = parseInt(document.getElementById("alarmDay")?.value);
        if (!alarm.day || alarm.day < 1 || alarm.day > 31) {
            showToast("Tanggal bulan (1-31) harus diisi!", "#ef4444");
            return;
        }
    }
    
    if (type === "weekly") {
        alarm.weekday = parseInt(document.getElementById("alarmWeekday")?.value);
    }
    
    alarms.push(alarm);
    saveUserData();
    closeModal();
    renderCurrentPage();
    showToast(`⏰ Alarm "${label}" ditambahkan!`, "#22c55e");
}

function toggleAlarm(alarmId) {
    const alarm = alarms.find(a => a.id === alarmId);
    if (alarm) {
        alarm.active = !alarm.active;
        saveUserData();
        renderCurrentPage();
        showToast(`Alarm ${alarm.active ? "diaktifkan" : "dinonaktifkan"}`, "#00d4ff");
    }
}

function deleteAlarm(alarmId) {
    if (confirm("Hapus alarm?")) {
        alarms = alarms.filter(a => a.id !== alarmId);
        saveUserData();
        renderCurrentPage();
    }
}

function startAlarmChecker() {
    alarmInterval = setInterval(() => {
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        const currentDate = now.toISOString().split('T')[0];
        const currentDay = now.getDate();
        const currentWeekday = now.getDay();
        
        alarms.forEach(alarm => {
            if (!alarm.active) return;
            
            let shouldTrigger = false;
            
            if (alarm.type === "daily") {
                shouldTrigger = alarm.time === currentTime;
            } else if (alarm.type === "once") {
                shouldTrigger = alarm.time === currentTime && alarm.date === currentDate;
            } else if (alarm.type === "monthly") {
                shouldTrigger = alarm.time === currentTime && alarm.day === currentDay;
            } else if (alarm.type === "weekly") {
                shouldTrigger = alarm.time === currentTime && alarm.weekday === currentWeekday;
            }
            
            if (shouldTrigger && alarm.lastTriggered !== currentDate) {
                alarm.lastTriggered = currentDate;
                saveUserData();
                
                showToast(`⏰ ALARM: ${alarm.label}`, "#fbbf24");
                sendNotification("Alarm!", alarm.label);
                playAlarmSound();
            }
        });
    }, 10000);
}

function playAlarmSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.frequency.value = 880;
        oscillator.type = "sine";
        gainNode.gain.value = 0.2;
        
        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 1);
        oscillator.stop(audioCtx.currentTime + 1);
    } catch (e) {
        console.log("Audio not supported");
    }
}

// ======================== AI SIMULATION ========================
function getAISuggestion() {
    const today = new Date().toDateString();
    const incompleteQuests = quests.filter(q => q.type === "Daily" && !q.completed && q.date === today).length;
    const completedQuests = quests.filter(q => q.type === "Daily" && q.completed && q.date === today).length;
    const totalDaily = quests.filter(q => q.type === "Daily" && q.date === today).length;
    const pendingSchedules = schedules.filter(s => !s.completed && s.date === today).length;
    
    if (player.streak >= 7) {
        return "🔥 Luar biasa! Streak 7+ hari! Kamu sangat konsisten. Pertahankan momentum ini!";
    } else if (player.streak >= 3) {
        return `⚡ Bagus! Streak ${player.streak} hari. Teruskan, kamu sudah di jalur yang tepat!`;
    } else if (incompleteQuests > 0 && totalDaily > 0) {
        return `⚠️ Kamu punya ${incompleteQuests} quest yang belum selesai hari ini. Ayo selesaikan sebelum malam!`;
    } else if (pendingSchedules > 0) {
        return `📅 Kamu memiliki ${pendingSchedules} jadwal yang menunggu. Jangan lupa alarm sudah diatur!`;
    } else if (completedQuests === totalDaily && totalDaily > 0) {
        return "🎉 Semua quest selesai! Streak akan bertambah besok. Bagus sekali!";
    } else if (player.level < 5) {
        return "🌟 Mulai dari level kecil dulu. Fokus pada quest daily untuk naik level cepat!";
    } else {
        return "💪 Terus konsisten! Setiap quest yang selesai membawamu lebih dekat ke versi terbaik dirimu.";
    }
}

// ======================== DAILY RESET ========================
function checkDailyReset() {
    const lastReset = localStorage.getItem(`ulo_last_reset_${currentUser}`);
    const today = new Date().toDateString();
    
    if (lastReset !== today) {
        applyPunishment();
        
        quests.forEach(q => {
            if (q.type === "Daily") {
                q.completed = false;
                q.date = today;
            }
        });
        
        // Reset daily schedules completion (but keep schedule)
        schedules.forEach(s => {
            if (s.repeat !== "none" && s.type !== "once") {
                s.completed = false;
                s.completedDate = null;
            }
        });
        
        localStorage.setItem(`ulo_last_reset_${currentUser}`, today);
        saveUserData();
        renderCurrentPage();
        
        sendNotification("Daily Reset", "Quest daily telah direset! Selesaikan quest barumu!");
    }
}

// ======================== NOTIFICATION ========================
function requestNotificationPermission() {
    if ("Notification" in window) {
        Notification.requestPermission().then(perm => {
            notificationPermission = perm === "granted";
        });
    }
}

function sendNotification(title, body) {
    if (notificationPermission) {
        new Notification(title, { body: body });
    }
    showToast(`🔔 ${title}: ${body}`, "#a855f7");
}

function startReminderSystem() {
    setInterval(() => {
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        if (reminderTimes.includes(currentTime)) {
            const pendingQuests = quests.filter(q => q.type === "Daily" && !q.completed && q.date === new Date().toDateString());
            if (pendingQuests.length > 0) {
                sendNotification("Reminder Quest!", `Kamu punya ${pendingQuests.length} quest daily yang belum diselesaikan!`);
            } else {
                sendNotification("Daily Check", "Semua quest daily sudah selesai! Great job!");
            }
        }
    }, 60000);
}

// ======================== RENDER FUNCTIONS ========================
function renderDashboard() {
    const expPercent = (player.exp % 100);
    const todayIncomplete = quests.filter(q => q.type === "Daily" && !q.completed && q.date === new Date().toDateString()).length;
    const activePunishments = punishments.filter(p => !p.completed).length;
    const todaySchedules = schedules.filter(s => s.date === new Date().toISOString().split('T')[0] && !s.completed).length;
    const aiSuggestion = getAISuggestion();
    
    return `
        <div class="grid-2cols">
            <div class="card">
                <div class="card-title">👤 Player Status</div>
                <div class="level-display">
                    <div class="level-number">Level ${player.level}</div>
                    <div style="font-size: 0.75rem;">Next: ${100 - (player.exp % 100)} EXP</div>
                </div>
                <div>EXP Progress</div>
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${expPercent}%"></div>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 0.75rem;">
                    <span>💰 ${player.gold}</span>
                    <span>🔥 ${player.streak} hari</span>
                    <span>📜 ${player.totalQuestsCompleted}</span>
                </div>
            </div>
            
            <div class="card ai-card">
                <div class="card-title">🤖 AI Advisor</div>
                <p style="font-size: 0.9rem; line-height: 1.5;">${aiSuggestion}</p>
            </div>
        </div>
        
        <div class="grid-2cols">
            <div class="card">
                <div class="card-title">⚔️ Today's Quests</div>
                ${todayIncomplete > 0 ? `<div class="warning-banner">⚠️ ${todayIncomplete} quest belum selesai!</div>` : '<div style="color: #22c55e;">✅ Semua quest selesai!</div>'}
                ${quests.filter(q => q.type === "Daily" && q.date === new Date().toDateString()).map(q => `
                    <div class="quest-item ${q.completed ? 'completed' : ''}">
                        <div class="quest-info">
                            <div class="quest-name">${q.name}</div>
                            <div class="quest-rewards">+${q.expReward} EXP • +${q.goldReward} Gold</div>
                            ${q.scheduleTime ? `<div class="schedule-time">⏰ ${q.scheduleTime}</div>` : ''}
                        </div>
                        ${!q.completed ? `<button class="btn btn-success" onclick="completeQuest(${q.id})">✔️</button>` : '<span>✅</span>'}
                    </div>
                `).join('') || '<div>Tidak ada quest daily</div>'}
                <button class="btn btn-primary" style="width: 100%; margin-top: 0.75rem;" onclick="switchPage('quests')">+ Tambah Quest</button>
            </div>
            
            <div class="card">
                <div class="card-title">📅 Today's Schedule</div>
                ${todaySchedules > 0 ? `<div class="warning-banner">⏰ ${todaySchedules} jadwal menunggu!</div>` : '<div style="color: #22c55e;">✅ Semua jadwal selesai!</div>'}
                ${schedules.filter(s => s.date === new Date().toISOString().split('T')[0] && !s.completed).slice(0, 3).map(s => `
                    <div class="schedule-item">
                        <div class="schedule-info">
                            <div class="schedule-title">${s.title}</div>
                            <div class="schedule-time">⏰ ${s.time} • ${s.repeat !== "none" ? s.repeat : 'Sekali'}</div>
                        </div>
                        <button class="btn btn-success" onclick="completeSchedule(${s.id})">✔️</button>
                    </div>
                `).join('') || '<div>Belum ada jadwal hari ini</div>'}
                <button class="btn btn-primary" style="width: 100%; margin-top: 0.75rem;" onclick="switchPage('schedule')">+ Tambah Jadwal</button>
            </div>
        </div>
        
        ${activePunishments > 0 ? `
        <div class="card">
            <div class="card-title">⚠️ Active Punishments</div>
            ${punishments.filter(p => !p.completed).slice(0, 3).map(p => `
                <div class="punishment-item" style="background: rgba(239,68,68,0.1); border-left: 3px solid #ef4444; padding: 0.75rem; margin-bottom: 0.5rem; display: flex; justify-content: space-between;">
                    <span>⚠️ ${p.questName}</span>
                    <button class="btn btn-success" onclick="completePunishment(${p.id})">Selesai</button>
                </div>
            `).join('')}
        </div>
        ` : ''}
    `;
}

function renderQuests() {
    const daily = quests.filter(q => q.type === "Daily");
    const weekly = quests.filter(q => q.type === "Weekly");
    const monthly = quests.filter(q => q.type === "Monthly");
    const main = quests.filter(q => q.type === "Main");
    
    return `
        <div class="card">
            <div class="card-title">📜 Quest Management</div>
            <button class="btn btn-primary" onclick="addQuest()" style="margin-bottom: 1rem;">+ Tambah Quest</button>
            
            <h3>🌞 Daily</h3>
            ${renderQuestList(daily)}
            <h3>📅 Weekly</h3>
            ${renderQuestList(weekly)}
            <h3>📆 Monthly</h3>
            ${renderQuestList(monthly)}
            <h3>⚔️ Main Quest</h3>
            ${renderQuestList(main)}
        </div>
    `;
}

function renderQuestList(list) {
    if (list.length === 0) return "<div style='color: #64748b;'>Tidak ada quest</div>";
    return list.map(q => `
        <div class="quest-item ${q.completed ? 'completed' : ''}">
            <div class="quest-info">
                <div class="quest-name">${q.name}</div>
                <div class="quest-rewards">+${q.expReward} EXP • +${q.goldReward} Gold</div>
                ${q.scheduleTime ? `<div class="schedule-time">⏰ Jadwal: ${q.scheduleTime}</div>` : ''}
            </div>
            <div style="display: flex; gap: 0.5rem;">
                ${!q.completed ? `<button class="btn btn-success" onclick="completeQuest(${q.id})">✔️</button>` : '<span>✅</span>'}
                <button class="btn" onclick="editQuest(${q.id})">✏️</button>
                <button class="btn btn-danger" onclick="deleteQuest(${q.id})">🗑️</button>
            </div>
        </div>
    `).join('');
}

function renderSchedule() {
    const today = new Date().toISOString().split('T')[0];
    const upcomingSchedules = schedules.filter(s => !s.completed && (s.date >= today || s.repeat !== "none"));
    const completedSchedules = schedules.filter(s => s.completed);
    
    return `
        <div class="card">
            <div class="card-title">📅 Schedule & Alarm Manager</div>
            <button class="btn btn-primary" onclick="addSchedule()" style="margin-bottom: 1rem;">+ Tambah Jadwal</button>
            
            <h3>⏰ Upcoming Schedules</h3>
            ${upcomingSchedules.slice(0, 10).map(s => `
                <div class="schedule-item ${s.completed ? 'completed' : ''} ${s.date && s.date < today && !s.completed ? 'overdue' : ''}">
                    <div class="schedule-info">
                        <div class="schedule-title">${s.title}</div>
                        <div class="schedule-time">
                            ⏰ ${s.time} • ${s.date ? new Date(s.date).toLocaleDateString() : 'Setiap'} 
                            ${s.repeat !== "none" ? `• ${s.repeat}` : ''}
                            ${s.hasAlarm ? '🔔' : ''}
                        </div>
                        ${s.note ? `<div style="font-size: 0.7rem; color: #94a3b8;">${s.note}</div>` : ''}
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        ${!s.completed ? `<button class="btn btn-success" onclick="completeSchedule(${s.id})">✔️</button>` : '<span>✅</span>'}
                        <button class="btn" onclick="editSchedule(${s.id})">✏️</button>
                        <button class="btn btn-danger" onclick="deleteSchedule(${s.id})">🗑️</button>
                    </div>
                </div>
            `).join('') || '<div>Belum ada jadwal</div>'}
            
            <h3 style="margin-top: 1rem;">✅ Completed Schedules</h3>
            ${completedSchedules.slice(0, 5).map(s => `
                <div class="schedule-item completed">
                    <div>
                        <div class="schedule-title">${s.title}</div>
                        <div style="font-size: 0.7rem;">Selesai: ${new Date(s.completedDate).toLocaleDateString()}</div>
                    </div>
                    <span>✅</span>
                </div>
            `).join('') || '<div>Belum ada jadwal selesai</div>'}
        </div>
        
        <div class="card">
            <div class="card-title">⏰ Active Alarms</div>
            ${alarms.filter(a => a.active).map(alarm => `
                <div class="alarm-item alarm-active">
                    <div>
                        <strong>${alarm.label}</strong>
                        <div style="font-size: 0.75rem;">
                            ${alarm.type === 'daily' ? 'Setiap hari' : 
                              alarm.type === 'once' ? `Sekali: ${alarm.date}` : 
                              alarm.type === 'weekly' ? `Setiap ${['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'][alarm.weekday]}` :
                              `Setiap tanggal ${alarm.day}`} • ${alarm.time}
                        </div>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-warning" onclick="toggleAlarm(${alarm.id})">⏸️</button>
                        <button class="btn btn-danger" onclick="deleteAlarm(${alarm.id})">🗑️</button>
                    </div>
                </div>
            `).join('') || '<div>Tidak ada alarm aktif</div>'}
            
            <h3 style="margin-top: 1rem;">⏸️ Inactive Alarms</h3>
            ${alarms.filter(a => !a.active).map(alarm => `
                <div class="alarm-item">
                    <div>
                        <strong>${alarm.label}</strong>
                        <div style="font-size: 0.75rem;">${alarm.type} • ${alarm.time}</div>
                    </div>
                    <button class="btn btn-primary" onclick="toggleAlarm(${alarm.id})">▶️ Aktifkan</button>
                </div>
            `).join('') || '<div>Tidak ada alarm nonaktif</div>'}
        </div>
    `;
}

function renderShop() {
    return `
        <div class="card">
            <div class="card-title">🛒 Reward Shop</div>
            <div style="margin-bottom: 1rem;">💰 Gold: ${player.gold}</div>
            <div class="grid-2cols">
                ${shopItems.map(item => `
                    <div class="shop-item ${item.owned ? 'owned' : ''}">
                        <div>
                            <strong>${item.name}</strong>
                            <div style="font-size: 0.75rem;">💰 ${item.cost} Gold</div>
                            ${item.owned ? '<span style="color: #22c55e;">✓ Owned</span>' : ''}
                        </div>
                        ${!item.owned ? `<button class="btn btn-primary" onclick="buyItem('${item.id}')">Beli</button>` : '<span>✅</span>'}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderStats() {
    return `
        <div class="card">
            <div class="card-title">📊 Player Statistics</div>
            ${Object.entries(player.stats).map(([stat, value]) => `
                <div class="stat-item">
                    <div class="stat-header">
                        <span>${getStatIcon(stat)} ${stat.toUpperCase()}</span>
                        <span>${value}/100</span>
                    </div>
                    <div class="stat-bar">
                        <div class="stat-fill ${stat}" style="width: ${value}%"></div>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="card">
            <div class="card-title">📈 Achievement</div>
            <div>Total Quest: ${player.totalQuestsCompleted}</div>
            <div>Highest Streak: ${player.streak}</div>
            <div>Level: ${player.level}</div>
            <div>Total EXP: ${player.exp}</div>
            <div>Total Schedules: ${schedules.length}</div>
            <div>Active Alarms: ${alarms.filter(a => a.active).length}</div>
        </div>
    `;
}

function renderFinance() {
    const balance = getBalance();
    const incomes = transactions.filter(t => t.type === "income");
    const expenses = transactions.filter(t => t.type === "expense");
    
    return `
        <div class="card">
            <div class="card-title">💰 Finance Manager</div>
            <div style="text-align: center; padding: 1rem; background: rgba(0,0,0,0.3); border-radius: 1rem; margin-bottom: 1rem;">
                <div style="font-size: 2rem; font-weight: 700;">${balance.toLocaleString()}</div>
                <div>Total Balance</div>
            </div>
            <button class="btn btn-primary" onclick="addTransaction()" style="margin-bottom: 1rem;">+ Tambah Transaksi</button>
            
            <h3>📋 Riwayat Transaksi</h3>
            ${transactions.slice(0, 10).map(t => `
                <div class="transaction-item" style="border-left-color: ${t.type === 'income' ? '#22c55e' : '#ef4444'}">
                    <div>
                        <strong>${t.type === 'income' ? '💚' : '🔴'} ${t.category}</strong>
                        <div style="font-size: 0.75rem;">${new Date(t.date).toLocaleDateString()} - ${t.note || '-'}</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <span style="color: ${t.type === 'income' ? '#22c55e' : '#ef4444'}; font-weight: 600;">${t.type === 'income' ? '+' : '-'}${t.amount}</span>
                        <button class="btn btn-danger" onclick="deleteTransaction(${t.id})" style="padding: 0.25rem 0.75rem;">🗑️</button>
                    </div>
                </div>
            `).join('') || '<div>Belum ada transaksi</div>'}
        </div>
    `;
}

function renderInventory() {
    return `
        <div class="card">
            <div class="card-title">🎒 Inventory</div>
            <button class="btn btn-primary" onclick="addInventoryItem()" style="margin-bottom: 1rem;">+ Tambah Item</button>
            ${inventoryItems.map(item => `
                <div class="inventory-item">
                    <div>
                        <div class="item-name">${item.name}</div>
                        <div style="font-size: 0.7rem;">${item.category} • ${item.status} • x${item.quantity}</div>
                        ${item.note ? `<div style="font-size: 0.7rem; color: #94a3b8;">${item.note}</div>` : ''}
                    </div>
                    <button class="btn btn-danger" onclick="deleteInventoryItem(${item.id})">🗑️</button>
                </div>
            `).join('') || '<div>Belum ada item</div>'}
        </div>
    `;
}

function renderNotes() {
    const knowledgeNotes = notes;
    const contentList = contentPlans;
    
    return `
        <div class="grid-2cols">
            <div class="card">
                <div class="card-title">🧠 Knowledge Vault</div>
                <button class="btn btn-primary" onclick="addNote()" style="margin-bottom: 1rem;">+ Tambah Catatan</button>
                ${knowledgeNotes.map(note => `
                    <div class="note-item">
                        <div class="note-info">
                            <div class="note-title">${note.title}</div>
                            <div style="font-size: 0.7rem;">${note.tags?.join(', ') || 'no tags'}</div>
                            <div style="font-size: 0.75rem; margin-top: 0.25rem;">${note.content.substring(0, 80)}${note.content.length > 80 ? '...' : ''}</div>
                        </div>
                        <button class="btn btn-danger" onclick="deleteNote(${note.id})">🗑️</button>
                    </div>
                `).join('') || '<div>Belum ada catatan</div>'}
            </div>
            
            <div class="card">
                <div class="card-title">📝 Content Manager</div>
                <button class="btn btn-primary" onclick="addContentPlan()" style="margin-bottom: 1rem;">+ Rencana Konten</button>
                ${contentList.map(content => `
                    <div class="note-item">
                        <div>
                            <div class="note-title">${content.title}</div>
                            <div style="font-size: 0.7rem;">${content.category} • Status: ${content.status}</div>
                            <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                                <button class="btn btn-success" onclick="updateContentStatus(${content.id}, 'planning')" style="padding: 0.2rem 0.6rem;">Planning</button>
                                <button class="btn btn-primary" onclick="updateContentStatus(${content.id}, 'progress')" style="padding: 0.2rem 0.6rem;">Progress</button>
                                <button class="btn" onclick="updateContentStatus(${content.id}, 'done')" style="padding: 0.2rem 0.6rem;">Done</button>
                                <button class="btn btn-danger" onclick="deleteContentPlan(${content.id})" style="padding: 0.2rem 0.6rem;">🗑️</button>
                            </div>
                        </div>
                    </div>
                `).join('') || '<div>Belum ada rencana konten</div>'}
            </div>
        </div>
        
        <div class="card">
            <div class="card-title">🔐 Password Manager</div>
            <button class="btn btn-primary" onclick="addPassword()" style="margin-bottom: 1rem;">+ Tambah Password</button>
            ${passwords.map(pass => `
                <div class="inventory-item">
                    <div>
                        <div class="item-name">${pass.platform}</div>
                        <div style="font-size: 0.7rem;">Username: ${pass.username}</div>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn" onclick="revealPassword(${pass.id})">👁️</button>
                        <button class="btn btn-danger" onclick="deletePassword(${pass.id})">🗑️</button>
                    </div>
                </div>
            `).join('') || '<div>Belum ada password tersimpan</div>'}
        </div>
    `;
}

function getStatIcon(stat) {
    const icons = { life: "❤️", physical: "💪", spiritual: "🧘", work: "💼", education: "📚", relationship: "👥" };
    return icons[stat] || "⭐";
}

// ======================== UTILITIES ========================
function setupNavigation() {
    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const page = btn.dataset.page;
            switchPage(page);
        });
    });
    
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            if (confirm("Logout?")) {
                logout();
            }
        };
    }
}

function switchPage(page) {
    currentPage = page;
    renderCurrentPage();
    document.querySelectorAll(".nav-btn").forEach(btn => {
        if (btn.dataset.page === page) btn.classList.add("active");
        else btn.classList.remove("active");
    });
}

function renderCurrentPage() {
    const main = document.getElementById("app-content");
    if (!main) return;
    
    switch (currentPage) {
        case "dashboard": main.innerHTML = renderDashboard(); break;
        case "quests": main.innerHTML = renderQuests(); break;
        case "schedule": main.innerHTML = renderSchedule(); break;
        case "shop": main.innerHTML = renderShop(); break;
        case "stats": main.innerHTML = renderStats(); break;
        case "finance": main.innerHTML = renderFinance(); break;
        case "inventory": main.innerHTML = renderInventory(); break;
        case "notes": main.innerHTML = renderNotes(); break;
        case "alarm": main.innerHTML = renderSchedule(); break;
        default: main.innerHTML = renderDashboard();
    }
}

function showToast(message, color = "#a855f7") {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.style.borderLeftColor = color;
    toast.innerHTML = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

let modalOverlay = null;
function showModal(content) {
    closeModal();
    modalOverlay = document.createElement("div");
    modalOverlay.className = "modal-overlay";
    modalOverlay.innerHTML = `<div class="modal">${content}</div>`;
    document.body.appendChild(modalOverlay);
    modalOverlay.addEventListener("click", (e) => { if (e.target === modalOverlay) closeModal(); });
}

function closeModal() {
    if (modalOverlay) { modalOverlay.remove(); modalOverlay = null; }
}

function levelUpEffect() {
    const levelEl = document.querySelector(".level-number");
    if (levelEl) {
        levelEl.classList.add("level-up-animation");
        setTimeout(() => levelEl.classList.remove("level-up-animation"), 500);
    }
}

function playSound(type) {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        let freq = 440, dur = 0.2;
        if (type === "complete") { freq = 880; dur = 0.3; }
        else if (type === "levelup") { freq = 1046.5; dur = 0.5; }
        else if (type === "buy") { freq = 660; dur = 0.2; }
        else if (type === "punishment") { freq = 220; dur = 0.4; }
        osc.frequency.value = freq;
        osc.type = "sine";
        gain.gain.value = 0.1;
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + dur);
        osc.stop(audioCtx.currentTime + dur);
    } catch(e) {}
}

function setupEventListeners() {
    // Add any global event listeners here
}

// Global Exports
window.addQuest = addQuest;
window.completeQuest = completeQuest;
window.editQuest = editQuest;
window.deleteQuest = deleteQuest;
window.buyItem = buyItem;
window.addTransaction = addTransaction;
window.deleteTransaction = deleteTransaction;
window.addInventoryItem = addInventoryItem;
window.deleteInventoryItem = deleteInventoryItem;
window.addNote = addNote;
window.deleteNote = deleteNote;
window.addContentPlan = addContentPlan;
window.updateContentStatus = updateContentStatus;
window.deleteContentPlan = deleteContentPlan;
window.addPassword = addPassword;
window.revealPassword = revealPassword;
window.deletePassword = deletePassword;
window.addAlarm = addAlarm;
window.toggleAlarm = toggleAlarm;
window.deleteAlarm = deleteAlarm;
window.completePunishment = completePunishment;
window.addManualPunishment = addManualPunishment;
window.addSchedule = addSchedule;
window.editSchedule = editSchedule;
window.completeSchedule = completeSchedule;
window.deleteSchedule = deleteSchedule;
window.switchPage = switchPage;
window.closeModal = closeModal;
window.confirmAddQuest = confirmAddQuest;
window.confirmEditQuest = confirmEditQuest;
window.confirmAddTransaction = confirmAddTransaction;
window.confirmAddInventory = confirmAddInventory;
window.confirmAddNote = confirmAddNote;
window.confirmAddContent = confirmAddContent;
window.confirmAddPassword = confirmAddPassword;
window.confirmAddAlarm = confirmAddAlarm;
window.confirmAddPunishment = confirmAddPunishment;
window.confirmAddSchedule = confirmAddSchedule;
window.confirmEditSchedule = confirmEditSchedule;

document.addEventListener("DOMContentLoaded", init);