(() => {
  "use strict";

  const STORAGE = {
    weights: "rutinafit.weights",
    completions: "rutinafit.completions",
  };

  const $ = (id) => document.getElementById(id);

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }
  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* almacenamiento no disponible (modo privado, etc.) */
    }
  }
  function todayKey(date = new Date()) {
    return date.toISOString().slice(0, 10);
  }
  function fmtTime(totalSeconds) {
    const s = Math.max(0, Math.round(totalSeconds));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
  }

  // ===================== Navegación por pestañas =====================
  const screens = document.querySelectorAll(".screen[data-screen]");
  const tabButtons = document.querySelectorAll(".tab-btn");

  function showScreen(name) {
    screens.forEach((s) => (s.hidden = s.dataset.screen !== name));
    tabButtons.forEach((b) => b.classList.toggle("active", b.dataset.target === name));
    if (name === "weight") renderWeightScreen();
    if (name === "week") renderWeekScreen();
  }
  tabButtons.forEach((btn) => btn.addEventListener("click", () => showScreen(btn.dataset.target)));

  // ===================== Pantalla "Hoy" =====================
  function renderTodayScreen() {
    const now = new Date();
    const dow = now.getDay();
    const routine = ROUTINE[dow];

    $("today-date").textContent = now.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    $("today-heading").textContent = "Rutina Fit";
    $("today-focus").textContent = routine.focus;
    $("today-title").textContent = routine.title;

    const summary = $("today-phase-summary");
    const detailList = $("today-detail-list");
    const startBtn = $("start-session-btn");
    const restBtn = $("start-rest-btn");

    if (routine.rest) {
      summary.innerHTML = `<div class="phase-chip">🧘 Día de descanso activo</div>`;
      detailList.innerHTML = `<div class="detail-row"><span class="detail-icon">🚶</span><div class="detail-text">${routine.description}</div></div>`;
      startBtn.hidden = true;
      restBtn.hidden = false;
    } else {
      summary.innerHTML = `
        <div class="phase-chip">🔥 Calentamiento · 3 min</div>
        <div class="phase-chip">⚡ Circuito · 15 min</div>
        <div class="phase-chip">🧊 Enfriamiento · 2 min</div>
      `;
      detailList.innerHTML = [
        `<div class="detail-row"><span class="detail-icon">🔥</span><div class="detail-text"><b>Calentamiento</b>${routine.warmup}</div></div>`,
        ...routine.stations.map(
          (s, i) =>
            `<div class="detail-row"><span class="detail-icon">${i + 1}️⃣</span><div class="detail-text"><b>Estación ${i + 1}</b>${s}</div></div>`
        ),
        `<div class="detail-row"><span class="detail-icon">🧊</span><div class="detail-text"><b>Enfriamiento</b>${routine.cooldown}</div></div>`,
      ].join("");
      startBtn.hidden = false;
      restBtn.hidden = true;
    }

    const completions = readJSON(STORAGE.completions, {});
    const key = todayKey(now);
    $("done-checkbox").checked = Boolean(completions[key]);

    renderStreak(completions);
  }

  $("done-checkbox").addEventListener("change", (e) => {
    const completions = readJSON(STORAGE.completions, {});
    const key = todayKey();
    if (e.target.checked) completions[key] = true;
    else delete completions[key];
    writeJSON(STORAGE.completions, completions);
    renderStreak(completions);
  });

  function renderStreak(completions) {
    let streak = 0;
    const cursor = new Date();
    // Si hoy aún no está marcado, la racha cuenta desde ayer hacia atrás.
    if (!completions[todayKey(cursor)]) cursor.setDate(cursor.getDate() - 1);
    while (completions[todayKey(cursor)]) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    const badge = $("streak-badge");
    if (streak > 0) {
      badge.hidden = false;
      $("streak-count").textContent = streak;
    } else {
      badge.hidden = true;
    }
  }

  // ===================== Pantalla "Semana" =====================
  function renderWeekScreen() {
    const order = [1, 2, 3, 4, 5, 6, 0]; // lunes -> domingo
    const today = new Date().getDay();
    const completions = readJSON(STORAGE.completions, {});
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));

    const rows = order.map((dow, idx) => {
      const r = ROUTINE[dow];
      const cellDate = new Date(monday);
      cellDate.setDate(monday.getDate() + idx);
      const done = Boolean(completions[todayKey(cellDate)]);
      const isToday = dow === today;
      return `
        <div class="week-row ${isToday ? "is-today" : ""}">
          <div class="week-day-badge">${r.day.slice(0, 3).toUpperCase()}</div>
          <div>
            <div class="week-row-title">${r.title}</div>
            <div class="week-row-sub">${r.rest ? "Descanso activo" : r.focus}</div>
          </div>
          <div class="week-check">${done ? "✅" : ""}</div>
        </div>`;
    });
    $("week-list").innerHTML = rows.join("");
  }

  // ===================== Pantalla "Peso" =====================
  function renderWeightScreen() {
    const entries = readJSON(STORAGE.weights, []).sort((a, b) => a.date.localeCompare(b.date));
    const current = entries.length ? entries[entries.length - 1].weight : GOAL.startWeight;
    const lost = Math.max(0, GOAL.startWeight - current);
    const pct = Math.min(100, Math.max(0, (lost / GOAL.targetLoss) * 100));

    $("stat-current").textContent = current.toFixed(1);
    $("stat-lost").textContent = lost.toFixed(1);
    $("stat-target").textContent = GOAL.targetWeight.toFixed(1);
    $("weight-progress-fill").style.width = `${pct}%`;
    $("weight-progress-caption").textContent = entries.length
      ? `${pct.toFixed(0)}% del camino hacia la meta de ${GOAL.targetWeight} kg`
      : `Registra tu primer peso para ver tu progreso hacia ${GOAL.targetWeight} kg`;

    const historyEl = $("weight-history");
    if (!entries.length) {
      historyEl.innerHTML = `<p class="empty-state">Todavía no hay registros.</p>`;
    } else {
      const reversed = [...entries].reverse();
      historyEl.innerHTML = reversed
        .map((e, i) => {
          const prev = reversed[i + 1];
          let deltaHtml = "";
          if (prev) {
            const d = e.weight - prev.weight;
            const cls = d <= 0 ? "delta-down" : "delta-up";
            const sign = d > 0 ? "+" : "";
            deltaHtml = `<span class="weight-history-delta ${cls}">${sign}${d.toFixed(1)} kg</span>`;
          }
          const dateLabel = new Date(e.date + "T00:00:00").toLocaleDateString("es-ES", {
            day: "numeric",
            month: "short",
          });
          return `<div class="weight-history-row"><span>${dateLabel}</span><span>${e.weight.toFixed(1)} kg</span>${deltaHtml}</div>`;
        })
        .join("");
    }

    drawWeightChart(entries);
  }

  $("weight-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = $("weight-input");
    const value = parseFloat(input.value);
    if (!Number.isFinite(value)) return;
    const entries = readJSON(STORAGE.weights, []);
    const key = todayKey();
    const existingIdx = entries.findIndex((en) => en.date === key);
    if (existingIdx >= 0) entries[existingIdx].weight = value;
    else entries.push({ date: key, weight: value });
    writeJSON(STORAGE.weights, entries);
    input.value = "";
    renderWeightScreen();
  });

  function drawWeightChart(entries) {
    const canvas = $("weight-chart");
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    if (entries.length < 2) {
      ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--text-secondary");
      ctx.font = "13px -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Registra al menos 2 pesos para ver la gráfica", W / 2, H / 2);
      return;
    }

    const pad = 24;
    const weights = entries.map((e) => e.weight);
    const min = Math.min(...weights, GOAL.targetWeight) - 1;
    const max = Math.max(...weights, GOAL.startWeight) + 1;
    const xStep = (W - pad * 2) / (entries.length - 1);
    const yFor = (w) => H - pad - ((w - min) / (max - min)) * (H - pad * 2);

    // línea de meta
    ctx.strokeStyle = "rgba(52, 199, 89, 0.6)";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(pad, yFor(GOAL.targetWeight));
    ctx.lineTo(W - pad, yFor(GOAL.targetWeight));
    ctx.stroke();
    ctx.setLineDash([]);

    // línea de progreso
    const accent = getComputedStyle(document.body).getPropertyValue("--accent") || "#ff5a36";
    ctx.strokeStyle = accent.trim();
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    ctx.beginPath();
    entries.forEach((e, i) => {
      const x = pad + i * xStep;
      const y = yFor(e.weight);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    ctx.fillStyle = accent.trim();
    entries.forEach((e, i) => {
      const x = pad + i * xStep;
      const y = yFor(e.weight);
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // ===================== Sesión guiada (timer) =====================
  let audioCtx = null;
  let muted = false;

  function beep(freq = 880, duration = 0.12) {
    if (muted) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {
      /* audio no disponible */
    }
  }

  const session = {
    phases: [],
    index: 0,
    remaining: 0,
    timerId: null,
    paused: false,
    routine: null,
  };

  function startSession(routine) {
    session.phases = buildSessionPhases(routine);
    session.index = 0;
    session.remaining = session.phases[0].duration;
    session.paused = false;
    session.routine = routine;

    $("session-day-label").textContent = routine.day;
    $("screen-session").hidden = false;
    $("session-controls").hidden = false;
    document.querySelector(".tabbar").hidden = true;
    renderSessionPhase();
    tick(true);
    session.timerId = setInterval(() => tick(false), 1000);
  }

  function totalSessionDuration() {
    return session.phases.reduce((sum, p) => sum + p.duration, 0);
  }
  function elapsedBeforeIndex(idx) {
    return session.phases.slice(0, idx).reduce((sum, p) => sum + p.duration, 0);
  }

  function renderSessionPhase() {
    const phase = session.phases[session.index];
    $("session-phase-label").textContent = phase.label;
    $("session-detail").textContent = phase.detail;
    $("session-timer").textContent = fmtTime(session.remaining);
    const next = session.phases[session.index + 1];
    $("session-next").textContent = next ? `Siguiente: ${next.detail}` : "Última fase";
  }

  function tick(skipCountdownCheck) {
    if (session.paused) return;
    const phase = session.phases[session.index];

    if (!skipCountdownCheck) {
      session.remaining -= 1;
    }

    if (session.remaining <= 3 && session.remaining >= 1) beep(660, 0.08);

    if (session.remaining <= 0) {
      session.index += 1;
      if (session.index >= session.phases.length) {
        finishSession();
        return;
      }
      beep(1046, 0.18);
      session.remaining = session.phases[session.index].duration;
    }

    $("session-timer").textContent = fmtTime(session.remaining);
    renderSessionPhase();

    const elapsed = elapsedBeforeIndex(session.index) + (session.phases[session.index].duration - session.remaining);
    const pct = (elapsed / totalSessionDuration()) * 100;
    $("session-progress-fill").style.width = `${pct}%`;
  }

  function finishSession() {
    clearInterval(session.timerId);
    session.timerId = null;
    beep(1318, 0.3);

    $("screen-session").hidden = true;
    document.querySelector(".tabbar").hidden = false;

    const completions = readJSON(STORAGE.completions, {});
    completions[todayKey()] = true;
    writeJSON(STORAGE.completions, completions);

    $("done-message").textContent = `Completaste: ${session.routine.title}.`;
    $("screen-done").hidden = false;
  }

  $("session-pause-btn").addEventListener("click", () => {
    session.paused = !session.paused;
    $("session-pause-btn").textContent = session.paused ? "Reanudar" : "Pausar";
  });

  $("session-skip-btn").addEventListener("click", () => {
    session.remaining = 0;
    tick(true);
  });

  $("session-exit-btn").addEventListener("click", () => {
    if (session.timerId) clearInterval(session.timerId);
    session.timerId = null;
    $("screen-session").hidden = true;
    document.querySelector(".tabbar").hidden = false;
  });

  $("session-mute-btn").addEventListener("click", (e) => {
    muted = !muted;
    e.target.textContent = muted ? "🔇" : "🔊";
  });

  $("done-close-btn").addEventListener("click", () => {
    $("screen-done").hidden = true;
    renderTodayScreen();
  });

  $("start-session-btn").addEventListener("click", () => {
    const routine = ROUTINE[new Date().getDay()];
    startSession(routine);
  });

  // Descanso activo (domingo): cronómetro simple ascendente, sin fases.
  let restTimerId = null;
  let restSeconds = 0;
  $("start-rest-btn").addEventListener("click", () => {
    const routine = ROUTINE[new Date().getDay()];
    $("session-day-label").textContent = routine.day;
    $("screen-session").hidden = false;
    $("session-controls").hidden = true;
    document.querySelector(".tabbar").hidden = true;
    $("session-phase-label").textContent = "Caminata libre";
    $("session-detail").textContent = routine.description;
    $("session-next").textContent = "Meta sugerida: 15–20 minutos";
    $("session-progress-fill").style.width = "0%";
    restSeconds = 0;
    $("session-timer").textContent = fmtTime(restSeconds);
    restTimerId = setInterval(() => {
      restSeconds += 1;
      $("session-timer").textContent = fmtTime(restSeconds);
      $("session-progress-fill").style.width = `${Math.min(100, (restSeconds / (20 * 60)) * 100)}%`;
    }, 1000);
  });

  $("session-exit-btn").addEventListener("click", () => {
    if (restTimerId) {
      clearInterval(restTimerId);
      restTimerId = null;
    }
  });

  // ===================== Service worker =====================
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    });
  }

  // ===================== Init =====================
  renderTodayScreen();
  showScreen("today");
})();
