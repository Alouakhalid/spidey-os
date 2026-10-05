/**
 * SPIDEY-OS // ENGINE & APPLICATION STATE
 * Comprehensive Notion-style Life OS with Spider-Man & AI aesthetic
 */

// ==========================================
// 1. DEFAULT DATA STATE
// ==========================================
const DEFAULT_STATE = {
  profile: {
    name: "User",
    title: "SPIDEY // NEURAL LIFE OS v2.0",
    quote: "With great power comes great productivity. Focus, code, conquer.",
    soundEnabled: true,
    particlesEnabled: true
  },
  lastActiveDate: new Date().toISOString().split('T')[0],
  tasks: [],
  prayers: {
    fajr: { name: "Fajr", nameAr: "الفجر", completed: false, time: "05:15 AM", jamaah: true },
    dhuhr: { name: "Dhuhr", nameAr: "الظهر", completed: false, time: "12:45 PM", jamaah: true },
    asr: { name: "Asr", nameAr: "العصر", completed: false, time: "04:10 PM", jamaah: false },
    maghrib: { name: "Maghrib", nameAr: "المغرب", completed: false, time: "06:40 PM", jamaah: false },
    isha: { name: "Isha", nameAr: "العشاء", completed: false, time: "08:00 PM", jamaah: false }
  },
  spiritual: {
    quranPage: 1,
    quranTotal: 604,
    currentSurah: "Al-Fatihah (الفَاتِحَة)",
    dailyTargetPages: 4,
    pagesReadToday: 0,
    qiyamCompleted: false,
    qiyamRakaat: 0,
    qiyamNotes: "",
    dhikrCount: 0,
    prayerStreak: 0
  },
  contentVideos: [],
  study: {
    todayHoursTarget: 4.0,
    todayHoursLogged: 0.0,
    streakDays: 0,
    subjects: [],
    notes: ""
  },
  projects: [],
  weeklyHistory: [
    { day: "Mon", tasks: 0, prayers: 0, quran: 0, studyHrs: 0, score: 0 },
    { day: "Tue", tasks: 0, prayers: 0, quran: 0, studyHrs: 0, score: 0 },
    { day: "Wed", tasks: 0, prayers: 0, quran: 0, studyHrs: 0, score: 0 },
    { day: "Thu", tasks: 0, prayers: 0, quran: 0, studyHrs: 0, score: 0 },
    { day: "Fri", tasks: 0, prayers: 0, quran: 0, studyHrs: 0, score: 0 },
    { day: "Sat", tasks: 0, prayers: 0, quran: 0, studyHrs: 0, score: 0 },
    { day: "Sun", tasks: 0, prayers: 0, quran: 0, studyHrs: 0, score: 0 }
  ]
};

// ==========================================
// 2. STATE MANAGER & LOCAL STORAGE
// ==========================================
class StateManager {
  constructor() {
    this.storageKey = "SPIDEY_OS_DATA_REAL_V2"; localStorage.removeItem("SPIDEY_OS_DATA_V1");
    this.data = this.loadState();
    this.checkDailyReset();
  }

  loadState() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return { ...DEFAULT_STATE, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn("Could not load from localStorage, using default state", e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (e) {
      console.error("Failed to save state to localStorage", e);
    }
    renderApp();
  }

  checkDailyReset() {
    const today = new Date().toISOString().split('T')[0];
    if (this.data.lastActiveDate !== today) {
      this.performMidnightReset(today);
    }
  }

  performMidnightReset(newDateStr) {
    console.log("🕷️ [SPIDEY-OS] 12:00 AM Midnight Rollover Initiated:", newDateStr);

    // 1. Reset 5 Daily Prayers for the new day
    if (this.data.prayers) {
      Object.keys(this.data.prayers).forEach(k => {
        this.data.prayers[k].completed = false;
      });
    }

    // 2. Reset Spiritual daily goals (Qiyam al-layl and pages read today)
    if (this.data.spiritual) {
      this.data.spiritual.qiyamCompleted = false;
      this.data.spiritual.pagesReadToday = 0;
    }

    // 3. Reset Deep Work & Study hours for today
    if (this.data.study) {
      this.data.study.todayHoursLogged = 0.0;
      if (Array.isArray(this.data.study.subjects)) {
        this.data.study.subjects.forEach(s => {
          s.loggedHours = 0.0;
          s.progress = 0;
        });
      }
    }

    // 4. Reset Daily & Deen recurring tasks
    if (Array.isArray(this.data.tasks)) {
      this.data.tasks.forEach(t => {
        const tag = (t.tag || "").toLowerCase();
        if (tag.includes("daily") || tag.includes("deen") || t.date === "Today") {
          t.completed = false;
        }
      });
    }

    // 5. Update last active date & save
    this.data.lastActiveDate = newDateStr;
    this.save();

    // 6. UI & Sound notification
    if (typeof showToast === "function") {
      showToast(
        "🌙 12:00 AM MIDNIGHT PROTOCOL",
        "New day started! The 5 prayers, daily habits, and study counters have reset automatically for a fresh start."
      );
    }
    if (typeof AudioFX !== "undefined") {
      AudioFX.playBell();
    }
  }
}

const AppState = new StateManager();

// ==========================================
// 3. SCI-FI SOUND FX ENGINE (Web Audio API)
// ==========================================
class SoundFX {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playThwip() {
    if (!AppState.data.profile.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.18);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch (e) {}
  }

  playClick() {
    if (!AppState.data.profile.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }

  playBell() {
    if (!AppState.data.profile.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.12, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.4);
      });
    } catch (e) {}
  }
}

const AudioFX = new SoundFX();

// ==========================================
// 4. INTERACTIVE SPIDER-WEB CANVAS PARTICLES
// ==========================================
class SpiderWebCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.numParticles = 50;
    this.mouse = { x: null, y: null, radius: 130 };

    this.resize();
    window.addEventListener("resize", () => this.resize());
    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    window.addEventListener("mouseout", () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    this.initParticles();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.numParticles; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2 + 1,
        color: Math.random() > 0.4 ? "#ff1e56" : "#00f2fe"
      });
    }
  }

  animate() {
    if (!AppState.data.profile.particlesEnabled) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      requestAnimationFrame(() => this.animate());
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.particles.length; i++) {
      let p = this.particles[i];

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

      // Draw particle dot
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = p.color;
      this.ctx.fill();

      // Connect to nearby particles (Spider-Web effect)
      for (let j = i + 1; j < this.particles.length; j++) {
        let p2 = this.particles[j];
        let dx = p.x - p2.x;
        let dy = p.y - p2.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(255, 30, 86, ${0.18 * (1 - dist / 110)})`;
          this.ctx.lineWidth = 0.75;
          this.ctx.stroke();
        }
      }

      // Connect to mouse cursor
      if (this.mouse.x !== null) {
        let mdx = p.x - this.mouse.x;
        let mdy = p.y - this.mouse.y;
        let mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < this.mouse.radius) {
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(this.mouse.x, this.mouse.y);
          this.ctx.strokeStyle = `rgba(0, 242, 254, ${0.35 * (1 - mdist / this.mouse.radius)})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

// ==========================================
// 5. CYBER POMODORO ENGINE
// ==========================================
class PomodoroEngine {
  constructor() {
    this.workMinutes = 25;
    this.shortBreakMinutes = 5;
    this.longBreakMinutes = 15;
    this.mode = "work"; // 'work', 'shortBreak', 'longBreak'
    this.totalSeconds = this.workMinutes * 60;
    this.remainingSeconds = this.totalSeconds;
    this.isRunning = false;
    this.timerId = null;
    this.completedSessions = 0;
  }

  setMode(mode) {
    this.pause();
    this.mode = mode;
    if (mode === "work") this.totalSeconds = this.workMinutes * 60;
    if (mode === "shortBreak") this.totalSeconds = this.shortBreakMinutes * 60;
    if (mode === "longBreak") this.totalSeconds = this.longBreakMinutes * 60;
    this.remainingSeconds = this.totalSeconds;
    this.updateDisplay();
  }

  start() {
    if (this.isRunning) return;
    AudioFX.playClick();
    this.isRunning = true;
    this.timerId = setInterval(() => {
      this.remainingSeconds--;
      this.updateDisplay();

      if (this.remainingSeconds <= 0) {
        this.onFinish();
      }
    }, 1000);
    this.updateControls();
  }

  pause() {
    if (!this.isRunning) return;
    AudioFX.playClick();
    this.isRunning = false;
    clearInterval(this.timerId);
    this.timerId = null;
    this.updateControls();
  }

  reset() {
    AudioFX.playClick();
    this.pause();
    this.setMode(this.mode);
  }

  onFinish() {
    this.pause();
    AudioFX.playBell();
    if (this.mode === "work") {
      this.completedSessions++;
      AppState.data.study.todayHoursLogged += 0.42; // ~25 mins
      AppState.save();
      alert("🕷️ Focus session complete! Take a well-deserved break, hero.");
      this.setMode("shortBreak");
    } else {
      alert("⚡ Break is over! Time to swing back into deep work.");
      this.setMode("work");
    }
  }

  updateDisplay() {
    const mins = Math.floor(this.remainingSeconds / 60);
    const secs = this.remainingSeconds % 60;
    const formatted = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    
    const displayEl = document.getElementById("pomoDisplay");
    if (displayEl) displayEl.textContent = formatted;

    const quickTimer = document.getElementById("quickPomoTime");
    if (quickTimer) quickTimer.textContent = formatted;
  }

  updateControls() {
    const startBtn = document.getElementById("pomoStartBtn");
    if (startBtn) {
      startBtn.textContent = this.isRunning ? "Pause" : "Start Focus";
      startBtn.className = this.isRunning ? "btn btn-secondary" : "btn btn-primary";
    }
  }
}

const Pomodoro = new PomodoroEngine();

// ==========================================
// 6. RENDER LOGIC & VIEW UPDATES
// ==========================================
function renderApp() {
  const d = AppState.data;

  // 1. Navigation Badges
  const activeTasksCount = d.tasks.filter(t => !t.completed).length;
  const tasksBadge = document.getElementById("navTasksBadge");
  if (tasksBadge) tasksBadge.textContent = activeTasksCount;

  const prayersDoneCount = Object.values(d.prayers).filter(p => p.completed).length;
  const prayerBadge = document.getElementById("navPrayerBadge");
  if (prayerBadge) prayerBadge.textContent = `${prayersDoneCount}/5`;

  const projectsCount = d.projects.length;
  const projectBadge = document.getElementById("navProjectsBadge");
  if (projectBadge) projectBadge.textContent = projectsCount;

  // 2. Daily HQ Overview
  renderDailyHQ();

  // 3. Spiritual HQ
  renderSpiritualHQ();

  // 4. Content Studio
  renderContentStudio();

  // 5. Study & Deep Work Hub
  renderStudyHub();

  // 6. Projects Matrix
  renderProjectsMatrix();

  // 7. Neural Analytics
  renderAnalytics();

  // 8. Toggles state
  const audioToggle = document.getElementById("soundToggleBtn");
  if (audioToggle) {
    audioToggle.innerHTML = d.profile.soundEnabled ? "🔊 Sound ON" : "🔇 Sound OFF";
    audioToggle.style.color = d.profile.soundEnabled ? "var(--spider-cyan)" : "var(--text-dim)";
  }
}

function renderDailyHQ() {
  const d = AppState.data;
  
  // Calculate completion percentage
  const totalTasks = d.tasks.length;
  const completedTasks = d.tasks.filter(t => t.completed).length;
  const taskPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const prayerDone = Object.values(d.prayers).filter(p => p.completed).length;
  const prayerPercent = Math.round((prayerDone / 5) * 100);

  const overallDaily = Math.round((taskPercent * 0.5) + (prayerPercent * 0.3) + ((d.study.todayHoursLogged / d.study.todayHoursTarget) * 20));
  const boundedDaily = Math.min(100, overallDaily);

  // HUD Stats
  const statDailyScore = document.getElementById("statDailyScore");
  if (statDailyScore) statDailyScore.textContent = `${boundedDaily}%`;
  
  const statDailyScoreFill = document.getElementById("statDailyScoreFill");
  if (statDailyScoreFill) statDailyScoreFill.style.width = `${boundedDaily}%`;

  const statPrayers = document.getElementById("statPrayers");
  if (statPrayers) statPrayers.textContent = `${prayerDone}/5`;

  const statStudyHours = document.getElementById("statStudyHours");
  if (statStudyHours) statStudyHours.textContent = `${d.study.todayHoursLogged.toFixed(1)} / ${d.study.todayHoursTarget}h`;

  // Render Daily Tasks list
  const container = document.getElementById("dailyTasksList");
  if (!container) return;

  container.innerHTML = "";
  if (d.tasks.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding: 2rem; color: var(--text-dim);">No tasks yet. Click "+ New Task" to summon one!</div>`;
    return;
  }

  d.tasks.forEach(task => {
    const pBadgeClass = task.priority === "P0" ? "badge-p0" : task.priority === "P1" ? "badge-p1" : "badge-p2";
    const div = document.createElement("div");
    div.className = `task-item ${task.completed ? "completed" : ""}`;
    div.innerHTML = `
      <div class="task-left">
        <div class="custom-checkbox" onclick="toggleTask('${task.id}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <div>
          <div class="task-title">${escapeHtml(task.title)}</div>
        </div>
      </div>
      <div class="task-badges">
        <span class="badge ${pBadgeClass}">${task.priority}</span>
        <span class="badge badge-tag">#${escapeHtml(task.tag)}</span>
        <button class="task-del-btn" onclick="deleteTask('${task.id}')" title="Delete Task">✕</button>
      </div>
    `;
    container.appendChild(div);
  });

  // Render Projects Pulse
  const projPulse = document.getElementById("activeProjectsPulse");
  if (projPulse) {
    projPulse.innerHTML = "";
    if (d.projects.length === 0) {
      projPulse.innerHTML = `
        <div style="text-align:center; padding: 1.5rem; color: var(--text-dim); font-size:0.8rem;">
          <div style="font-size:1.5rem; margin-bottom:0.3rem;">🕸️</div>
          No active projects yet.<br>
          <button class="btn btn-sm btn-secondary" style="margin-top:0.6rem;" onclick="openModal('modalNewProject')">+ Initialize Project</button>
        </div>
      `;
    } else {
      d.projects.slice(0, 2).forEach(p => {
        const pClass = p.priority === "P0" ? "badge-p0" : p.priority === "P1" ? "badge-p1" : "badge-p2";
        const fill = p.priority === "P0" ? "progress-fill-red" : "progress-fill-cyan";
        const div = document.createElement("div");
        div.style.cssText = "background:rgba(255,255,255,0.02); padding:0.75rem; border-radius:8px; border:1px solid var(--border-subtle);";
        div.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.25rem;">
            <span style="font-weight:700; font-size:0.88rem; color:#fff;">${escapeHtml(p.title)}</span>
            <span class="badge ${pClass}">${p.priority}</span>
          </div>
          <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:0.4rem;">${escapeHtml(p.description || "Active venture")}</div>
          <div class="progress-container"><div class="progress-bar-fill ${fill}" style="width: ${p.progress}%;"></div></div>
        `;
        projPulse.appendChild(div);
      });
    }
  }

  // Render Creator Studio Pulse
  const creatorPulse = document.getElementById("creatorStudioPulse");
  if (creatorPulse) {
    creatorPulse.innerHTML = "";
    if (d.contentVideos.length === 0) {
      creatorPulse.innerHTML = `
        <div style="text-align:center; padding: 1.5rem; color: var(--text-dim); font-size:0.8rem;">
          <div style="font-size:1.5rem; margin-bottom:0.3rem;">🎬</div>
          No content in pipeline yet.<br>
          <button class="btn btn-sm btn-secondary" style="margin-top:0.6rem;" onclick="openModal('modalNewVideo')">+ New Video Idea</button>
        </div>
      `;
    } else {
      d.contentVideos.slice(0, 2).forEach(v => {
        const isYT = v.platform === "YouTube";
        const div = document.createElement("div");
        div.style.cssText = "background:rgba(255,255,255,0.02); padding:0.75rem; border-radius:8px; border:1px solid var(--border-subtle);";
        div.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.25rem;">
            <span style="font-weight:600; font-size:0.85rem; color:#fff;">${escapeHtml(v.title)}</span>
            <span class="badge" style="background:${isYT ? '#ff000022':'#00f2fe22'}; color:${isYT ? '#ff4d4d':'#00f2fe'}; border:1px solid ${isYT ? '#ff000044':'#00f2fe44'};">${v.platform}</span>
          </div>
          <div style="font-size:0.72rem; color:var(--spider-cyan); font-family:var(--font-mono); text-transform:uppercase;">Stage: ${v.stage}</div>
        `;
        creatorPulse.appendChild(div);
      });
    }
  }
}

function renderSpiritualHQ() {
  const d = AppState.data;
  const prayersContainer = document.getElementById("prayersList");
  if (prayersContainer) {
    prayersContainer.innerHTML = "";
    Object.entries(d.prayers).forEach(([key, p]) => {
      const div = document.createElement("div");
      div.className = `prayer-card ${p.completed ? "completed" : ""}`;
      div.innerHTML = `
        <div class="prayer-header" style="width:100%; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div class="prayer-name">${p.name}</div>
            <div class="prayer-name-ar">${p.nameAr}</div>
          </div>
          <button class="prayer-check-btn" onclick="togglePrayer('${key}')" title="Toggle prayer">
            ${p.completed ? "✓" : ""}
          </button>
        </div>
        <div style="font-size:0.75rem; color:var(--text-dim); font-family:var(--font-mono); width:100%; text-align:left;">
          Time: ${p.time}
        </div>
        <div style="font-size:0.7rem; color:${p.jamaah ? 'var(--spider-cyan)' : 'var(--text-dim)'}; font-family:var(--font-mono); width:100%; text-align:left;">
          ${p.jamaah ? "★ Jama'ah In Mosque" : "• Individual"}
        </div>
      `;
      prayersContainer.appendChild(div);
    });
  }

  // Quran values
  const quranProgress = Math.round((d.spiritual.quranPage / d.spiritual.quranTotal) * 100);
  const quranPct = document.getElementById("quranPercent");
  if (quranPct) quranPct.textContent = `${quranProgress}%`;

  const quranFill = document.getElementById("quranProgressFill");
  if (quranFill) quranFill.style.width = `${quranProgress}%`;

  const quranPageDisplay = document.getElementById("quranCurrentPage");
  if (quranPageDisplay) quranPageDisplay.textContent = `${d.spiritual.quranPage} / ${d.spiritual.quranTotal}`;

  const quranSurah = document.getElementById("quranSurahName");
  if (quranSurah) quranSurah.textContent = d.spiritual.currentSurah;

  // Qiyam values
  const qiyamCheck = document.getElementById("qiyamCheckbox");
  if (qiyamCheck) {
    if (d.spiritual.qiyamCompleted) {
      qiyamCheck.classList.add("completed");
    } else {
      qiyamCheck.classList.remove("completed");
    }
  }

  const qiyamRakaatDisplay = document.getElementById("qiyamRakaatDisplay");
  if (qiyamRakaatDisplay) qiyamRakaatDisplay.textContent = `${d.spiritual.qiyamRakaat} Raka'at`;

  const qiyamNotes = document.getElementById("qiyamNotesDisplay");
  if (qiyamNotes) qiyamNotes.textContent = d.spiritual.qiyamNotes;
}

function renderContentStudio() {
  const d = AppState.data;
  const stages = ["scripting", "recording", "editing", "published"];

  stages.forEach(stage => {
    const col = document.getElementById(`kanbanCol_${stage}`);
    if (!col) return;
    col.innerHTML = "";

    const videos = d.contentVideos.filter(v => v.stage === stage);
    if (videos.length === 0) {
      col.innerHTML = `<div style="text-align:center; padding: 2rem 0.5rem; color: var(--text-dim); font-size:0.75rem;">No cards</div>`;
      return;
    }

    videos.forEach(v => {
      const card = document.createElement("div");
      card.className = "kanban-card";
      const platformColor = v.platform === "YouTube" ? "#ff0000" : "#00f2fe";
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:0.68rem; font-weight:700; color:${platformColor}; font-family:var(--font-mono);">
            ${v.platform === "YouTube" ? "▶ YouTube" : "⚡ TikTok"}
          </span>
          <span style="font-size:0.68rem; color:var(--text-dim); font-family:var(--font-mono);">${v.duration}</span>
        </div>
        <div class="kanban-card-title">${escapeHtml(v.title)}</div>
        <div style="font-size:0.75rem; color:var(--text-muted); font-style:italic;">
          "${escapeHtml(v.hook)}"
        </div>
        <div class="kanban-card-footer">
          <div style="display:flex; gap:0.25rem;">
            ${v.tags.map(t => `<span class="badge badge-tag" style="font-size:0.62rem;">#${escapeHtml(t)}</span>`).join("")}
          </div>
          <div style="display:flex; gap:0.4rem;">
            <button class="btn-sm btn-secondary" onclick="moveVideoStage('${v.id}')" title="Move to next stage">➔</button>
            <button class="task-del-btn" onclick="deleteVideo('${v.id}')" title="Delete">✕</button>
          </div>
        </div>
      `;
      col.appendChild(card);
    });
  });
}

function renderStudyHub() {
  const d = AppState.data;
  
  const subjectsContainer = document.getElementById("studySubjectsList");
  if (subjectsContainer) {
    subjectsContainer.innerHTML = "";
    if (!d.study.subjects || d.study.subjects.length === 0) {
      subjectsContainer.innerHTML = `
        <div style="text-align:center; padding: 2rem 1rem; background:rgba(255,255,255,0.02); border:1px dashed var(--border-subtle); border-radius:12px;">
          <div style="font-size:2rem; margin-bottom:0.4rem;">📚</div>
          <div style="font-weight:700; color:#fff; font-size:0.95rem; margin-bottom:0.25rem;">No Study Subjects Yet</div>
          <div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:1rem;">Add subjects you want to study with targets and syllabus tracking.</div>
          <button class="btn btn-sm btn-cyan" onclick="openModal('modalNewSubject')">+ Add Study Subject</button>
        </div>
      `;
    } else {
    d.study.subjects.forEach(sub => {
      const div = document.createElement("div");
      div.className = "hud-card";
      div.style.marginBottom = "0.75rem";
      div.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
          <span style="font-weight:700; font-size:0.9rem; color:#fff;">${escapeHtml(sub.name)}</span>
          <span style="font-size:0.78rem; font-family:var(--font-mono); color:var(--spider-cyan);">${sub.loggedHours}h / ${sub.targetHours}h</span>
        </div>
        <div class="progress-container" style="height:6px; margin-bottom:0.6rem;">
          <div class="progress-bar-fill progress-fill-cyan" style="width: ${sub.progress}%;"></div>
        </div>
        <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
          <button class="btn btn-sm btn-secondary" onclick="addStudyHour('${sub.id}', 0.5)">+30 min</button>
          <button class="btn btn-sm btn-cyan" onclick="addStudyHour('${sub.id}', 1.0)">+1 hour</button>
        </div>
      `;
      subjectsContainer.appendChild(div);
    });
    }
  }

  const studyNotes = document.getElementById("studyNotesDisplay");
  if (studyNotes) {
    studyNotes.textContent = d.study.notes;
  }
}

function renderProjectsMatrix() {
  const d = AppState.data;
  const container = document.getElementById("projectsList");
  if (!container) return;

  container.innerHTML = "";
  if (!d.projects || d.projects.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align:center; padding: 3.5rem 1.5rem; background:rgba(255,255,255,0.02); border:1px dashed var(--border-subtle); border-radius:14px;">
        <div style="font-size:2.5rem; margin-bottom:0.5rem;">🕸️</div>
        <div style="font-weight:700; color:#fff; font-size:1.1rem; margin-bottom:0.35rem;">Projects Matrix Ready</div>
        <div style="font-size:0.82rem; color:var(--text-muted); margin-bottom:1.25rem;">No active projects recorded. Click below to add your first project.</div>
        <button class="btn btn-primary" onclick="openModal('modalNewProject')">+ Initialize First Project</button>
      </div>
    `;
    return;
  }
  d.projects.forEach(proj => {
    const pClass = proj.priority === "P0" ? "badge-p0" : proj.priority === "P1" ? "badge-p1" : "badge-p2";
    const fillClass = proj.priority === "P0" ? "progress-fill-red" : "progress-fill-cyan";

    const card = document.createElement("div");
    card.className = "project-card";
    card.innerHTML = `
      <div>
        <div class="project-card-header">
          <span class="badge ${pClass}">${proj.priority} Priority</span>
          <span style="font-size:0.72rem; font-family:var(--font-mono); color:var(--spider-gold);">${proj.status}</span>
        </div>
        <div class="project-title">${escapeHtml(proj.title)}</div>
        <div class="project-desc">${escapeHtml(proj.description)}</div>
        <div class="project-tech-tags">
          ${proj.techStack.map(t => `<span class="tech-tag">${escapeHtml(t)}</span>`).join("")}
        </div>
      </div>
      <div>
        <div style="display:flex; justify-content:space-between; font-size:0.75rem; font-family:var(--font-mono); margin-bottom:0.35rem;">
          <span style="color:var(--text-dim);">Due: ${proj.deadline}</span>
          <span style="color:#fff; font-weight:700;">${proj.progress}%</span>
        </div>
        <div class="progress-container">
          <div class="progress-bar-fill ${fillClass}" style="width: ${proj.progress}%;"></div>
        </div>
        <div style="display:flex; justify-content:space-between; margin-top:0.85rem; align-items:center;">
          <button class="btn btn-sm btn-secondary" onclick="updateProjectProgress('${proj.id}', -10)">-10%</button>
          <button class="btn btn-sm btn-primary" onclick="updateProjectProgress('${proj.id}', 10)">+10%</button>
          <button class="task-del-btn" onclick="deleteProject('${proj.id}')" title="Delete project">✕</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderAnalytics() {
  const d = AppState.data;
  const heatmapContainer = document.getElementById("analyticsHeatmap");
  if (heatmapContainer) {
    heatmapContainer.innerHTML = "";
    d.weeklyHistory.forEach(h => {
      let levelClass = "level-1";
      if (h.score >= 90) levelClass = "level-3";
      else if (h.score >= 75) levelClass = "level-2";

      const cell = document.createElement("div");
      cell.className = `heatmap-day-cell ${levelClass}`;
      cell.innerHTML = `
        <span>${h.day}</span>
        <span style="font-weight:700;">${h.score}%</span>
      `;
      heatmapContainer.appendChild(cell);
    });
  }
}

// ==========================================
// 7. USER ACTIONS & MODALS
// ==========================================
function switchView(viewId, element) {
  AudioFX.playClick();
  document.querySelectorAll(".view-section").forEach(v => v.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));

  const targetView = document.getElementById(viewId);
  if (targetView) targetView.classList.add("active");
  if (element) element.classList.add("active");

  const breadcrumb = document.getElementById("currentBreadcrumb");
  if (breadcrumb) {
    const titles = {
      "daily-hq": "Daily HQ // Command Center",
      "deen-hq": "Spiritual Sanctuary // Prayers & Quran",
      "content-studio": "Creator Studio // YouTube & TikTok",
      "study-hub": "Deep Work & Study // Focus Hub",
      "projects-matrix": "Projects Matrix // Spider-Hub",
      "analytics-view": "Neural Analytics // Metrics & Streaks"
    };
    breadcrumb.textContent = titles[viewId] || "Dashboard";
  }
}

function toggleSidebar() {
  AudioFX.playClick();
  const sidebar = document.getElementById("appSidebar");
  if (sidebar) sidebar.classList.toggle("collapsed");
}

function toggleSound() {
  AppState.data.profile.soundEnabled = !AppState.data.profile.soundEnabled;
  AppState.save();
  if (AppState.data.profile.soundEnabled) AudioFX.playThwip();
}

function toggleParticles() {
  AudioFX.playClick();
  AppState.data.profile.particlesEnabled = !AppState.data.profile.particlesEnabled;
  AppState.save();
}

function toggleTask(taskId) {
  const task = AppState.data.tasks.find(t => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    if (task.completed) {
      AudioFX.playThwip();
    } else {
      AudioFX.playClick();
    }
    AppState.save();
  }
}

function deleteTask(taskId) {
  AudioFX.playClick();
  AppState.data.tasks = AppState.data.tasks.filter(t => t.id !== taskId);
  AppState.save();
}

function togglePrayer(prayerKey) {
  const p = AppState.data.prayers[prayerKey];
  if (p) {
    p.completed = !p.completed;
    if (p.completed) {
      AudioFX.playThwip();
    } else {
      AudioFX.playClick();
    }
    AppState.save();
  }
}

function incrementQuran(delta) {
  AudioFX.playClick();
  AppState.data.spiritual.quranPage = Math.min(604, Math.max(1, AppState.data.spiritual.quranPage + delta));
  AppState.data.spiritual.pagesReadToday = Math.max(0, AppState.data.spiritual.pagesReadToday + delta);
  AppState.save();
}

function toggleQiyam() {
  AudioFX.playThwip();
  AppState.data.spiritual.qiyamCompleted = !AppState.data.spiritual.qiyamCompleted;
  AppState.save();
}

function moveVideoStage(videoId) {
  AudioFX.playClick();
  const stages = ["scripting", "recording", "editing", "published"];
  const v = AppState.data.contentVideos.find(x => x.id === videoId);
  if (v) {
    const idx = stages.indexOf(v.stage);
    if (idx < stages.length - 1) {
      v.stage = stages[idx + 1];
    } else {
      v.stage = stages[0];
    }
    AppState.save();
  }
}

function deleteVideo(videoId) {
  AudioFX.playClick();
  AppState.data.contentVideos = AppState.data.contentVideos.filter(v => v.id !== videoId);
  AppState.save();
}

function addStudyHour(subId, delta) {
  AudioFX.playClick();
  const sub = AppState.data.study.subjects.find(s => s.id === subId);
  if (sub) {
    sub.loggedHours = Math.round((sub.loggedHours + delta) * 10) / 10;
    sub.progress = Math.min(100, Math.round((sub.loggedHours / sub.targetHours) * 100));
    AppState.data.study.todayHoursLogged = Math.round((AppState.data.study.todayHoursLogged + delta) * 10) / 10;
    AppState.save();
  }
}

function updateProjectProgress(projId, delta) {
  AudioFX.playClick();
  const proj = AppState.data.projects.find(p => p.id === projId);
  if (proj) {
    proj.progress = Math.min(100, Math.max(0, proj.progress + delta));
    if (proj.progress === 100) proj.status = "Completed";
    else if (proj.progress > 0) proj.status = "In Progress";
    AppState.save();
  }
}

function deleteProject(projId) {
  AudioFX.playClick();
  AppState.data.projects = AppState.data.projects.filter(p => p.id !== projId);
  AppState.save();
}


function promptSetQuranPage() {
  const current = AppState.data.spiritual.quranPage;
  const input = prompt("📖 Enter your current Quran page number (1 to 604):", current);
  if (input !== null) {
    const p = parseInt(input, 10);
    if (!isNaN(p) && p >= 1 && p <= 604) {
      AppState.data.spiritual.quranPage = p;
      AudioFX.playThwip();
      AppState.save();
    } else {
      alert("Please enter a valid page number between 1 and 604.");
    }
  }
}

function promptSetSurahName() {
  const current = AppState.data.spiritual.currentSurah || "Al-Fatihah";
  const name = prompt("📖 Enter current Surah name:", current);
  if (name && name.trim()) {
    AppState.data.spiritual.currentSurah = name.trim();
    AudioFX.playClick();
    AppState.save();
  }
}

function updateStudyNotes(notesText) {
  AppState.data.study.notes = notesText;
  try {
    localStorage.setItem(AppState.storageKey, JSON.stringify(AppState.data));
  } catch (e) {}
}

function submitNewSubject(e) {
  e.preventDefault();
  const name = document.getElementById("subInputName").value.trim();
  const target = parseFloat(document.getElementById("subInputTarget").value) || 2.0;

  if (!name) return;

  if (!AppState.data.study.subjects) AppState.data.study.subjects = [];
  AppState.data.study.subjects.push({
    id: "s_" + Date.now(),
    name,
    targetHours: target,
    loggedHours: 0.0,
    progress: 0
  });

  document.getElementById("subInputName").value = "";
  closeModal("modalNewSubject");
  AudioFX.playThwip();
  AppState.save();
}

function resetAllDataPrompt() {
  if (confirm("⚠️ Are you sure you want to reset all data?\n\nThis will clear all tasks, projects, subjects, and reset prayers to start 100% fresh.")) {
    AppState.data = JSON.parse(JSON.stringify(DEFAULT_STATE));
    AppState.save();
    AudioFX.playBell();
    alert("🧹 All data cleared! Workspace is completely fresh for your real data.");
  }
}

// ==========================================
// 8. MODAL FORMS
// ==========================================
function openModal(modalId) {
  AudioFX.playClick();
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add("active");
}

function closeModal(modalId) {
  AudioFX.playClick();
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove("active");
}

function submitNewTask(e) {
  e.preventDefault();
  const title = document.getElementById("taskInputTitle").value.trim();
  const priority = document.getElementById("taskInputPriority").value;
  const tag = document.getElementById("taskInputTag").value.trim() || "General";

  if (!title) return;

  AppState.data.tasks.unshift({
    id: "t_" + Date.now(),
    title,
    priority,
    tag,
    completed: false,
    date: "Today"
  });

  document.getElementById("taskInputTitle").value = "";
  closeModal("modalNewTask");
  AudioFX.playThwip();
  AppState.save();
}

function submitNewProject(e) {
  e.preventDefault();
  const title = document.getElementById("projInputTitle").value.trim();
  const priority = document.getElementById("projInputPriority").value;
  const desc = document.getElementById("projInputDesc").value.trim();
  const tech = document.getElementById("projInputTech").value.split(",").map(t => t.trim()).filter(Boolean);
  const deadline = document.getElementById("projInputDeadline").value || "2026-11-01";

  if (!title) return;

  AppState.data.projects.unshift({
    id: "p_" + Date.now(),
    title,
    priority,
    status: "Planning",
    progress: 10,
    description: desc,
    techStack: tech.length > 0 ? tech : ["AI", "Code"],
    deadline
  });

  document.getElementById("projInputTitle").value = "";
  document.getElementById("projInputDesc").value = "";
  closeModal("modalNewProject");
  AudioFX.playThwip();
  AppState.save();
}

function submitNewVideo(e) {
  e.preventDefault();
  const title = document.getElementById("vidInputTitle").value.trim();
  const platform = document.getElementById("vidInputPlatform").value;
  const hook = document.getElementById("vidInputHook").value.trim();
  const duration = document.getElementById("vidInputDuration").value.trim() || "60s";
  const tags = document.getElementById("vidInputTags").value.split(",").map(t => t.trim()).filter(Boolean);

  if (!title) return;

  AppState.data.contentVideos.unshift({
    id: "v_" + Date.now(),
    title,
    platform,
    stage: "scripting",
    hook,
    duration,
    tags: tags.length > 0 ? tags : ["Tech", "Coding"],
    notes: ""
  });

  document.getElementById("vidInputTitle").value = "";
  document.getElementById("vidInputHook").value = "";
  closeModal("modalNewVideo");
  AudioFX.playThwip();
  AppState.save();
}

// ==========================================
// 9. NOTION EXPORT GENERATOR
// ==========================================
function exportToNotionMarkdown() {
  AudioFX.playBell();
  const d = AppState.data;
  let md = `# 🕷️ SPIDEY // NEURAL LIFE OS v2.0\n\n`;
  md += `> *"With great power comes great productivity. Focus, code, conquer."*\n\n`;
  md += `--- \n\n`;

  md += `## ⚡ Today's Daily Command HQ\n\n`;
  d.tasks.forEach(t => {
    md += `- [${t.completed ? "x" : " "}] **[${t.priority}]** ${t.title} \`#${t.tag}\`\n`;
  });

  md += `\n## 🕌 Spiritual HQ & Habits\n\n`;
  Object.values(d.prayers).forEach(p => {
    md += `- [${p.completed ? "x" : " "}] **${p.name}** (${p.nameAr}) - ${p.time} (${p.jamaah ? "Jama'ah" : "Individual"})\n`;
  });
  md += `- [x] **Quran Khatma**: Page ${d.spiritual.quranPage} / ${d.spiritual.quranTotal} (${d.spiritual.currentSurah})\n`;
  md += `- [${d.spiritual.qiyamCompleted ? "x" : " "}] **Qiyam al-Layl**: ${d.spiritual.qiyamRakaat} Raka'at (${d.spiritual.qiyamNotes})\n`;

  md += `\n## 🎬 Creator Studio Pipeline\n\n`;
  md += `| Platform | Title | Stage | Hook | Duration |\n`;
  md += `|---|---|---|---|---|\n`;
  d.contentVideos.forEach(v => {
    md += `| ${v.platform} | ${v.title} | ${v.stage} | ${v.hook} | ${v.duration} |\n`;
  });

  md += `\n## 🧠 Deep Work & Study Matrix\n\n`;
  d.study.subjects.forEach(s => {
    md += `- **${s.name}**: ${s.loggedHours}h / ${s.targetHours}h (${s.progress}% complete)\n`;
  });

  md += `\n## 🕸️ Projects Matrix\n\n`;
  d.projects.forEach(p => {
    md += `### [${p.priority}] ${p.title} (${p.status} - ${p.progress}%)\n`;
    md += `${p.description}\n`;
    md += `**Tech**: ${p.techStack.join(", ")} | **Due**: ${p.deadline}\n\n`;
  });

  // Download as markdown file
  const blob = new Blob([md], { type: "text/markdown;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Spidey_Notion_OS_${new Date().toISOString().split("T")[0]}.md`;
  a.click();
  URL.revokeObjectURL(url);
  alert("🕷️ Notion Markdown Export generated and downloaded successfully! You can paste or import it directly into your Notion workspace.");
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function(m) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[m];
  });
}

// ==========================================
// 10. INITIALIZATION
// ==========================================

function exportJSONBackup() {
  AudioFX.playBell();
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(AppState.data, null, 2));
  const dlAnchorElem = document.createElement('a');
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", `spidey_os_backup_${new Date().toISOString().split('T')[0]}.json`);
  dlAnchorElem.click();
  alert("🕷️ Full data backup exported successfully as JSON!");
}

function importJSONBackup(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (imported && (imported.tasks || imported.prayers)) {
        AppState.data = { ...DEFAULT_STATE, ...imported };
        AppState.save();
        AudioFX.playThwip();
        alert("🕷️ Backup restored successfully! All tasks and records loaded.");
      } else {
        alert("⚠️ Invalid backup file format.");
      }
    } catch (err) {
      alert("⚠️ Error parsing JSON file.");
    }
  };
  reader.readAsText(file);
}


// ==========================================
// 11. LIVE HUD CLOCK & 12:00 AM MIDNIGHT MONITOR
// ==========================================
function updateLiveClock() {
  const now = new Date();

  // Format 12-hour Time (HH:MM:SS AM/PM)
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12
  const formattedTime = `${String(hours).padStart(2, "0")}:${minutes}:${seconds} ${ampm}`;

  // Format Date (e.g. MON, OCT 05)
  const options = { weekday: "short", month: "short", day: "2-digit" };
  const formattedDate = now.toLocaleDateString("en-US", options).toUpperCase();

  const timeEl = document.getElementById("hudLiveTime");
  if (timeEl) timeEl.textContent = formattedTime;

  const dateEl = document.getElementById("hudLiveDate");
  if (dateEl) dateEl.textContent = formattedDate;

  // Check if 12:00 AM (midnight) has passed
  const todayDateStr = now.toISOString().split("T")[0];
  if (AppState.data.lastActiveDate !== todayDateStr) {
    AppState.performMidnightReset(todayDateStr);
  }
}

function showToast(title, message) {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "midnight-toast";
  toast.innerHTML = `
    <div style="font-size:1.8rem; line-height:1;">🕷️</div>
    <div style="flex:1;">
      <div style="font-size:0.88rem; font-weight:700; color:var(--spider-cyan); margin-bottom:0.2rem;">${title}</div>
      <div style="font-size:0.78rem; color:var(--text-main); line-height:1.4;">${message}</div>
    </div>
    <button style="background:transparent; border:none; color:var(--text-dim); font-size:1.1rem; cursor:pointer;" onclick="this.parentElement.remove()">✕</button>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    if (toast.parentElement) toast.remove();
  }, 7000);
}

function testMidnightResetPrompt() {
  if (confirm("🕷️ Test 12:00 AM Midnight Rollover?\n\nThis simulates midnight passing: it automatically unchecks the 5 prayers, resets study hours for the new day, and resets daily tasks.")) {
    const today = new Date().toISOString().split("T")[0];
    AppState.performMidnightReset(today);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  new SpiderWebCanvas("webCanvas");
  Pomodoro.updateDisplay();
  // Start Live Clock & 12:00 AM Midnight Engine
  updateLiveClock();
  setInterval(updateLiveClock, 1000);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) updateLiveClock();
  });

  renderApp();

  // Keyboard shortcut Cmd+K or Ctrl+K for quick task
  window.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      openModal("modalNewTask");
    }
  });
});
