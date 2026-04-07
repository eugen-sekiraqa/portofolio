import { useState, useEffect, useRef, useCallback } from "react";
import * as Tone from "tone";

// ─── THEMES ────────────────────────────────────────────────────────────────────
const THEMES = {
  Midnight: {
    name: "Midnight",
    bg: "#050d1a",
    bgGrad: "radial-gradient(ellipse at 60% 30%, #0a1f3a 0%, #050d1a 70%)",
    surface: "rgba(10,25,55,0.82)",
    surfaceAlt: "rgba(6,18,40,0.92)",
    border: "rgba(0,224,160,0.18)",
    text: "#e2f0ff",
    textMuted: "#7a9bbf",
    textDim: "#3a5a7a",
    accent: "#00e0a0",
    accentGlow: "rgba(0,224,160,0.35)",
    accent2: "#00b8ff",
    accent3: "#7c3aed",
    red: "#ff4d6a",
    yellow: "#ffd166",
    green: "#06d6a0",
    orange: "#ff8c42",
    pink: "#ff6eb4",
    gridColor: "rgba(0,224,160,0.04)",
    glowColor: "rgba(0,224,160,0.12)",
    barBg: "rgba(0,224,160,0.08)",
    windowBg: "rgba(8,20,48,0.88)",
    dockBg: "rgba(5,13,30,0.80)",
    particle: "rgba(0,224,160,0.45)",
  },
  Aurora: {
    name: "Aurora",
    bg: "#0a0514",
    bgGrad: "radial-gradient(ellipse at 40% 20%, #1a0a3a 0%, #0a0514 70%)",
    surface: "rgba(20,10,50,0.82)",
    surfaceAlt: "rgba(14,7,36,0.92)",
    border: "rgba(192,132,252,0.18)",
    text: "#f0e6ff",
    textMuted: "#9a7abf",
    textDim: "#4a2a7a",
    accent: "#c084fc",
    accentGlow: "rgba(192,132,252,0.35)",
    accent2: "#818cf8",
    accent3: "#38bdf8",
    red: "#f472b6",
    yellow: "#fbbf24",
    green: "#34d399",
    orange: "#fb923c",
    pink: "#e879f9",
    gridColor: "rgba(192,132,252,0.04)",
    glowColor: "rgba(192,132,252,0.12)",
    barBg: "rgba(192,132,252,0.08)",
    windowBg: "rgba(14,7,38,0.88)",
    dockBg: "rgba(8,4,22,0.80)",
    particle: "rgba(192,132,252,0.45)",
  },
  Ember: {
    name: "Ember",
    bg: "#0f0800",
    bgGrad: "radial-gradient(ellipse at 50% 40%, #2a1200 0%, #0f0800 70%)",
    surface: "rgba(35,15,5,0.82)",
    surfaceAlt: "rgba(22,10,3,0.92)",
    border: "rgba(255,140,66,0.18)",
    text: "#fff0e0",
    textMuted: "#bf9a6a",
    textDim: "#7a4a2a",
    accent: "#ff8c42",
    accentGlow: "rgba(255,140,66,0.35)",
    accent2: "#ffd166",
    accent3: "#ff4d6a",
    red: "#ff4d6a",
    yellow: "#ffd166",
    green: "#06d6a0",
    orange: "#ff8c42",
    pink: "#ff6eb4",
    gridColor: "rgba(255,140,66,0.04)",
    glowColor: "rgba(255,140,66,0.12)",
    barBg: "rgba(255,140,66,0.08)",
    windowBg: "rgba(22,10,3,0.88)",
    dockBg: "rgba(12,5,0,0.80)",
    particle: "rgba(255,140,66,0.45)",
  },
};

// ─── ICONS ─────────────────────────────────────────────────────────────────────
const I = {
  profile: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  ),
  work: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
      <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  ),
  skills: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
      <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
    </svg>
  ),
  projects: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
      <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />
    </svg>
  ),
  education: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  ),
  terminal: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
      <rect x="2" y="3" width="20" height="18" rx="2" /><path d="M8 9l3 3-3 3M13 15h3" />
    </svg>
  ),
  contact: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  theme: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
      <circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ),
  game: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
      <rect x="2" y="6" width="20" height="12" rx="2" /><path d="M6 12h4M8 10v4M15 11h.01M17 13h.01" />
    </svg>
  ),
  music: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
      <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
    </svg>
  ),
};

// ─── PARTICLES ─────────────────────────────────────────────────────────────────
function Particles({ color }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -999, y: -999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const particles = Array.from({ length: 90 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 1.8 + 0.5,
      a: Math.random() * 0.6 + 0.2,
    }));

    const onMouse = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMouse);

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let p of particles) {
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          p.vx += (dx / dist) * 0.3;
          p.vy += (dy / dist) * 0.3;
        }
        p.vx *= 0.99;
        p.vy *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = p.a;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = color;
            ctx.globalAlpha = (1 - dist / 110) * 0.25;
            ctx.lineWidth = 0.6;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
    };
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}
    />
  );
}

// ─── BOOT SCREEN ───────────────────────────────────────────────────────────────
function BootScreen({ onDone, theme }) {
  const T = THEMES[theme];
  const lines = [
    { text: "EugenOS v1.0.0 — BIOS initializing...", delay: 0, color: T.textMuted },
    { text: "[  OK  ] Loaded firmware: UEFI v2.7", delay: 140, color: T.green },
    { text: "[  OK  ] CPU: Intel Core i7 — 8 cores detected", delay: 280, color: T.green },
    { text: "[  OK  ] RAM: 32GB DDR5 — OK", delay: 420, color: T.green },
    { text: "[  OK  ] Storage: NVMe SSD — /dev/nvme0n1", delay: 560, color: T.green },
    { text: "[  OK  ] Network: eth0 — Prishtina, Kosovo", delay: 720, color: T.green },
    { text: "[  OK  ] Loading kernel: EugenOS v1.0.0...", delay: 900, color: T.accent },
    { text: "[  OK  ] Mounting filesystem — /dev/root", delay: 1080, color: T.green },
    { text: "[  OK  ] Starting systemd services...", delay: 1260, color: T.green },
    { text: "[  OK  ] dotnet.service — ASP.NET Runtime", delay: 1440, color: T.accent2 },
    { text: "[  OK  ] blazor.service — Blazor WebAssembly", delay: 1620, color: T.accent2 },
    { text: "[  OK  ] sqlserver.service — SQL Server 2022", delay: 1800, color: T.accent2 },
    { text: "[  OK  ] git.service — Version Control", delay: 1980, color: T.green },
    { text: `[  OK  ] Starting ${T.name} theme engine...`, delay: 2160, color: T.accent },
    { text: "[ INFO ] Welcome, Eugen Sekiraqa", delay: 2400, color: T.text },
    { text: "[ BOOT ] EugenOS is ready.", delay: 2700, color: T.accent },
  ];

  const [visible, setVisible] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    lines.forEach((l, i) => {
      setTimeout(() => {
        setVisible((v) => [...v, i]);
        setProgress(Math.round(((i + 1) / lines.length) * 100));
      }, l.delay);
    });
    const total = lines[lines.length - 1].delay + 500;
    const t = setTimeout(onDone, total);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: T.bg, zIndex: 9999,
        display: "flex", flexDirection: "column", justifyContent: "center",
        alignItems: "center", padding: "60px 80px",
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      <div style={{ width: "100%", maxWidth: 700 }}>
      <div style={{ marginBottom: 32, color: T.accent, fontSize: 22, fontWeight: 700, letterSpacing: 2 }}>
        EugenOS <span style={{ color: T.textMuted, fontSize: 14 }}>v1.0.0</span>
      </div>
      <div style={{ overflow: "hidden", width: "100%", maxWidth: 700 }}>
        {lines.map((l, i) => (
          <div
            key={i}
            style={{
              fontSize: 13, marginBottom: 4, color: visible.includes(i) ? l.color : "transparent",
              transition: "color 0.2s",
            }}
          >
            {l.text}
          </div>
        ))}
      </div>
      <div style={{ width: "100%", maxWidth: 700, marginTop: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, color: T.textMuted, fontSize: 11 }}>
          <span>Loading EugenOS...</span><span>{progress}%</span>
        </div>
        <div style={{ background: T.barBg, borderRadius: 4, height: 6, overflow: "hidden", border: `1px solid ${T.border}` }}>
          <div
            style={{
              height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${T.accent2}, ${T.accent})`,
              transition: "width 0.15s", borderRadius: 4, boxShadow: `0 0 8px ${T.accentGlow}`,
            }}
          />
        </div>
      </div>
      </div>
    </div>
  );
}

// ─── NOTIFICATION ──────────────────────────────────────────────────────────────
function Notif({ text, theme, onDone }) {
  const T = THEMES[theme];
  const [out, setOut] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setOut(true), 3000);
    const t2 = setTimeout(onDone, 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div
      style={{
        position: "fixed", top: 52, right: 18, zIndex: 8000,
        background: T.surface, border: `1px solid ${T.border}`,
        borderLeft: `3px solid ${T.accent}`,
        backdropFilter: "blur(16px)", borderRadius: 10, padding: "12px 18px",
        color: T.text, fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
        maxWidth: 320, boxShadow: `0 4px 24px ${T.accentGlow}`,
        animation: out ? "slideOutN 0.5s forwards" : "slideInN 0.4s forwards",
      }}
    >
      <span style={{ color: T.accent, marginRight: 8 }}>◆</span>{text}
    </div>
  );
}

// ─── WINDOW ────────────────────────────────────────────────────────────────────
function Win({ id, title, icon, children, theme, pos, size, zIdx, onFocus, onClose, initMin = false }) {
  const T = THEMES[theme];
  const [position, setPosition] = useState(pos);
  const [sz, setSz] = useState(size);
  const [minimized, setMinimized] = useState(initMin);
  const [maximized, setMaximized] = useState(false);
  const [prevState, setPrevState] = useState(null);
  const drag = useRef(null);
  const resizing = useRef(null);
  const winRef = useRef(null);

  const onMouseDownTitle = (e) => {
    if (maximized) return;
    e.preventDefault();
    drag.current = { ox: e.clientX - position.x, oy: e.clientY - position.y };
    const onMove = (ev) => {
      if (!drag.current) return;
      setPosition({ x: ev.clientX - drag.current.ox, y: ev.clientY - drag.current.oy });
    };
    const onUp = () => { drag.current = null; window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const onTouchTitle = (e) => {
    if (maximized) return;
    const t = e.touches[0];
    drag.current = { ox: t.clientX - position.x, oy: t.clientY - position.y };
    const onMove = (ev) => {
      if (!drag.current) return;
      const tt = ev.touches[0];
      setPosition({ x: tt.clientX - drag.current.ox, y: tt.clientY - drag.current.oy });
    };
    const onEnd = () => { drag.current = null; window.removeEventListener("touchmove", onMove); window.removeEventListener("touchend", onEnd); };
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onEnd);
  };

  const onMouseDownResize = (e) => {
    e.preventDefault(); e.stopPropagation();
    resizing.current = { ox: e.clientX, oy: e.clientY, sw: sz.w, sh: sz.h };
    const onMove = (ev) => {
      if (!resizing.current) return;
      setSz({
        w: Math.max(300, resizing.current.sw + ev.clientX - resizing.current.ox),
        h: Math.max(200, resizing.current.sh + ev.clientY - resizing.current.oy),
      });
    };
    const onUp = () => { resizing.current = null; window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const toggleMax = () => {
    if (maximized) {
      setPosition(prevState.pos);
      setSz(prevState.sz);
      setMaximized(false);
    } else {
      setPrevState({ pos: position, sz });
      setMaximized(true);
    }
  };

  const winStyle = maximized
    ? { position: "fixed", left: 0, top: 34, width: "100vw", height: "calc(100vh - 90px)", zIndex: zIdx }
    : { position: "fixed", left: position.x, top: position.y, width: sz.w, height: minimized ? 40 : sz.h, zIndex: zIdx };

  return (
    <div
      ref={winRef}
      onMouseDown={onFocus}
      style={{
        ...winStyle,
        background: T.windowBg,
        border: `1px solid ${T.border}`,
        borderRadius: maximized ? 0 : 12,
        backdropFilter: "blur(20px)",
        boxShadow: `0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px ${T.border}, 0 0 30px ${T.glowColor}`,
        display: "flex", flexDirection: "column",
        overflow: "hidden", transition: "box-shadow 0.2s",
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      {/* Title bar */}
      <div
        onMouseDown={onMouseDownTitle}
        onTouchStart={onTouchTitle}
        style={{
          height: 40, minHeight: 40, display: "flex", alignItems: "center",
          padding: "0 12px", cursor: maximized ? "default" : "move",
          background: T.surfaceAlt, borderBottom: `1px solid ${T.border}`,
          userSelect: "none", flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
          <button onClick={onClose} style={{ width: 13, height: 13, borderRadius: "50%", background: THEMES.Midnight.red, border: "none", cursor: "pointer", padding: 0 }} />
          <button onClick={() => setMinimized((m) => !m)} style={{ width: 13, height: 13, borderRadius: "50%", background: THEMES.Midnight.yellow, border: "none", cursor: "pointer", padding: 0 }} />
          <button onClick={toggleMax} style={{ width: 13, height: 13, borderRadius: "50%", background: THEMES.Midnight.green, border: "none", cursor: "pointer", padding: 0 }} />
        </div>
        <div style={{ flex: 1, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, color: T.textMuted, fontSize: 13, fontWeight: 500 }}>
          <span style={{ color: T.accent }}>{icon}</span>
          <span>{title}</span>
        </div>
      </div>

      {/* Content */}
      {!minimized && (
        <>
          <div style={{ flex: 1, overflow: "auto", position: "relative" }}>
            {children}
          </div>
          {/* Resize handle — outside scroll container so it never scrolls away */}
          {!maximized && (
            <div
              onMouseDown={onMouseDownResize}
              style={{
                position: "absolute", bottom: 2, right: 2, width: 18, height: 18,
                cursor: "nwse-resize", zIndex: 10,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" style={{ opacity: 0.35 }}>
                <line x1="14" y1="2" x2="2" y2="14" stroke={T.textMuted} strokeWidth="1.5" />
                <line x1="14" y1="7" x2="7" y2="14" stroke={T.textMuted} strokeWidth="1.5" />
                <line x1="14" y1="12" x2="12" y2="14" stroke={T.textMuted} strokeWidth="1.5" />
              </svg>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── SKILL RADAR ───────────────────────────────────────────────────────────────
function SkillRadar({ skills, theme }) {
  const T = THEMES[theme];
  const cx = 150, cy = 150, R = 105;
  const n = skills.length;
  const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pt = (i, r) => ({
    x: cx + r * Math.cos(angle(i)),
    y: cy + r * Math.sin(angle(i)),
  });

  const levels = [0.25, 0.5, 0.75, 1];
  const polyPoints = (r) => skills.map((_, i) => `${pt(i, r).x},${pt(i, r).y}`).join(" ");
  const dataPoints = skills.map((s, i) => pt(i, R * (s.level / 100)));

  return (
    <svg viewBox="0 0 300 300" width="100%" height="100%" style={{ maxWidth: 280, display: "block", margin: "0 auto" }}>
      {levels.map((l, li) => (
        <polygon key={li} points={polyPoints(R * l)} fill="none" stroke={T.border} strokeWidth="1" />
      ))}
      {skills.map((_, i) => {
        const p = pt(i, R);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={T.border} strokeWidth="1" />;
      })}
      <polygon
        points={dataPoints.map((p) => `${p.x},${p.y}`).join(" ")}
        fill={T.accent} fillOpacity="0.22" stroke={T.accent} strokeWidth="2"
      />
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill={T.accent} />
      ))}
      {skills.map((s, i) => {
        const p = pt(i, R + 18);
        return (
          <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
            fill={T.textMuted} fontSize="8" fontFamily="'JetBrains Mono', monospace">
            {s.name}
          </text>
        );
      })}
    </svg>
  );
}

// ─── SNAKE GAME ────────────────────────────────────────────────────────────────
function SnakeGame({ theme }) {
  const T = THEMES[theme];
  const COLS = 18, ROWS = 14, CELL = 16;
  const W = COLS * CELL, H = ROWS * CELL;

  // All game state lives in refs — no React re-renders during gameplay
  const canvasRef = useRef(null);
  const gameRef = useRef({
    state: "idle", snake: [], dir: { x: 1, y: 0 }, food: { x: 14, y: 7 },
    score: 0, hi: 0,
  });
  const intervalRef = useRef(null);
  // UI state for scoreboard and overlays only
  const [uiState, setUiState] = useState("idle");
  const [score, setScore] = useState(0);
  const [hi, setHi] = useState(0);

  const randFood = (s) => {
    let f;
    do { f = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }; }
    while (s.some((p) => p.x === f.x && p.y === f.y));
    return f;
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const g = gameRef.current;
    ctx.clearRect(0, 0, W, H);

    // Background grid
    ctx.fillStyle = T.barBg;
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = T.gridColor;
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) { ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, H); ctx.stroke(); }
    for (let y = 0; y <= ROWS; y++) { ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(W, y * CELL); ctx.stroke(); }

    // Food
    ctx.fillStyle = "#ff4d6a";
    ctx.shadowColor = "rgba(255,77,106,0.8)";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(g.food.x * CELL + CELL / 2, g.food.y * CELL + CELL / 2, (CELL - 2) / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Snake
    g.snake.forEach((p, i) => {
      ctx.fillStyle = i === 0 ? T.accent : T.accent2;
      ctx.shadowColor = i === 0 ? T.accentGlow : "transparent";
      ctx.shadowBlur = i === 0 ? 10 : 0;
      const r = i === 0 ? 5 : 3;
      const x = p.x * CELL + 1, y = p.y * CELL + 1, s = CELL - 2;
      ctx.beginPath();
      ctx.roundRect(x, y, s, s, r);
      ctx.fill();
    });
    ctx.shadowBlur = 0;
  }, [T, W, H, COLS, ROWS, CELL]);

  const tick = useCallback(() => {
    const g = gameRef.current;
    if (g.state !== "playing") return;
    const head = { x: g.snake[0].x + g.dir.x, y: g.snake[0].y + g.dir.y };
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS || g.snake.some((p) => p.x === head.x && p.y === head.y)) {
      g.state = "over";
      g.hi = Math.max(g.hi, g.score);
      setHi(g.hi);
      setUiState("over");
      clearInterval(intervalRef.current);
      draw();
      return;
    }
    const ate = head.x === g.food.x && head.y === g.food.y;
    if (ate) {
      g.snake = [head, ...g.snake];
      g.score += 10;
      g.food = randFood(g.snake);
      setScore(g.score);
    } else {
      g.snake = [head, ...g.snake.slice(0, -1)];
    }
    draw();
  }, [draw, COLS, ROWS]);

  const start = useCallback(() => {
    const g = gameRef.current;
    g.state = "playing";
    g.snake = [{ x: 9, y: 7 }];
    g.dir = { x: 1, y: 0 };
    g.food = randFood(g.snake);
    g.score = 0;
    setScore(0);
    setUiState("playing");
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(tick, 110);
    draw();
  }, [tick, draw]);

  useEffect(() => {
    draw();
    const onKey = (e) => {
      const map = {
        ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
        w: { x: 0, y: -1 }, s: { x: 0, y: 1 }, a: { x: -1, y: 0 }, d: { x: 1, y: 0 },
      };
      if (map[e.key] && gameRef.current.state === "playing") {
        e.preventDefault();
        const nd = map[e.key];
        const d = gameRef.current.dir;
        if (nd.x !== -d.x || nd.y !== -d.y) gameRef.current.dir = nd;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); clearInterval(intervalRef.current); };
  }, [draw]);

  const mobileDir = (dx, dy) => {
    if (gameRef.current.state !== "playing") return;
    const d = gameRef.current.dir;
    const nd = { x: dx, y: dy };
    if (nd.x !== -d.x || nd.y !== -d.y) gameRef.current.dir = nd;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 10, padding: 16, fontFamily: "'JetBrains Mono', monospace" }}>
      {uiState === "idle" && (
        <div style={{ textAlign: "center", color: T.text }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🐍</div>
          <div style={{ fontSize: 15, marginBottom: 6, color: T.accent }}>Snake Game</div>
          <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 16 }}>Arrow keys / WASD to move</div>
          <button onClick={start} style={{ background: T.accent, color: T.bg, border: "none", borderRadius: 8, padding: "8px 24px", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700 }}>Start Game</button>
        </div>
      )}
      {uiState !== "idle" && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", width: W, color: T.textMuted, fontSize: 12 }}>
            <span>Score: <span style={{ color: T.accent }}>{score}</span></span>
            <span>Best: <span style={{ color: T.accent2 }}>{hi}</span></span>
          </div>
          <div style={{ position: "relative" }}>
            <canvas ref={canvasRef} width={W} height={H} style={{ display: "block", borderRadius: 6, border: `1px solid ${T.border}` }} />
            {uiState === "over" && (
              <div style={{
                position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                borderRadius: 6, gap: 10,
              }}>
                <div style={{ color: "#ff4d6a", fontSize: 15, fontWeight: 700 }}>Game Over</div>
                <div style={{ color: T.textMuted, fontSize: 12 }}>Score: {score}</div>
                <button onClick={start} style={{ background: T.accent, color: T.bg, border: "none", borderRadius: 6, padding: "6px 18px", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700 }}>Play Again</button>
              </div>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <button onClick={() => mobileDir(0, -1)} style={mobileBtn(T)}>▲</button>
            <div style={{ display: "flex", gap: 4 }}>
              <button onClick={() => mobileDir(-1, 0)} style={mobileBtn(T)}>◀</button>
              <button onClick={() => mobileDir(0, 1)} style={mobileBtn(T)}>▼</button>
              <button onClick={() => mobileDir(1, 0)} style={mobileBtn(T)}>▶</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
const mobileBtn = (T) => ({
  width: 36, height: 36, background: T.surface, border: `1px solid ${T.border}`,
  color: T.text, borderRadius: 6, cursor: "pointer", fontSize: 14,
});

// ─── MUSIC PLAYER ──────────────────────────────────────────────────────────────
function MusicViz({ theme }) {
  const T = THEMES[theme];
  const [playing, setPlaying] = useState(false);
  const [trackIdx, setTrackIdx] = useState(0);
  const [volume, setVolume] = useState(-12);
  const vizCanvasRef = useRef(null);
  const synthRef = useRef(null);
  const kickRef = useRef(null);
  const hihatRef = useRef(null);
  const seqRef = useRef([]);
  const reverbRef = useRef(null);
  const volRef = useRef(null);
  const rafRef = useRef(null);
  const tRef = useRef(0);

  const TRACKS = [
    { name: "Ambient Drift", bpm: 75, wave: "sine", notes: ["C4","E4","G4","B4","D5","G4","E4","C4"], desc: "Slow · Atmospheric" },
    { name: "Coding Groove", bpm: 90, wave: "triangle", notes: ["C4","G4","A4","F4","C5","A4","G4","E4"], desc: "Mid · Focused" },
    { name: "Night Drive", bpm: 110, wave: "sawtooth", notes: ["E4","G4","B4","D5","E5","D5","B4","G4"], desc: "Fast · Energetic" },
  ];

  const cleanup = () => {
    seqRef.current.forEach((s) => { try { s.stop(); s.dispose(); } catch {} });
    seqRef.current = [];
    if (synthRef.current) { try { synthRef.current.dispose(); } catch {} synthRef.current = null; }
    if (kickRef.current) { try { kickRef.current.dispose(); } catch {} kickRef.current = null; }
    if (hihatRef.current) { try { hihatRef.current.dispose(); } catch {} hihatRef.current = null; }
    if (reverbRef.current) { try { reverbRef.current.dispose(); } catch {} reverbRef.current = null; }
    if (volRef.current) { try { volRef.current.dispose(); } catch {} volRef.current = null; }
    cancelAnimationFrame(rafRef.current);
  };

  const startMusic = async (idx) => {
    cleanup();
    await Tone.start();
    Tone.getTransport().stop();
    Tone.getTransport().cancel();

    const track = TRACKS[idx];
    Tone.getTransport().bpm.value = track.bpm;

    volRef.current = new Tone.Volume(volume).toDestination();
    reverbRef.current = new Tone.Reverb({ decay: 3, wet: 0.4 }).connect(volRef.current);
    await reverbRef.current.ready;

    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: track.wave },
      envelope: { attack: track.wave === "sine" ? 0.8 : 0.05, decay: 0.3, sustain: 0.6, release: track.wave === "sine" ? 2 : 0.5 },
    }).connect(reverbRef.current);

    kickRef.current = new Tone.MembraneSynth({ pitchDecay: 0.06, octaves: 6 }).connect(volRef.current);
    hihatRef.current = new Tone.NoiseSynth({ noise: { type: "white" }, envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.01 } }).connect(volRef.current);

    const melodySeq = new Tone.Sequence(
      (time, note) => synthRef.current?.triggerAttackRelease(note, "8n", time),
      track.notes, "4n"
    ).start(0);

    const kickPat = [1, 0, 0, 0, 1, 0, 0, 0];
    const kickSeq = new Tone.Sequence(
      (time, hit) => hit && kickRef.current?.triggerAttackRelease("C1", "8n", time),
      kickPat, "8n"
    ).start(0);

    const hatPat = [0, 1, 0, 1, 0, 1, 0, 1];
    const hatSeq = new Tone.Sequence(
      (time, hit) => hit && hihatRef.current?.triggerAttackRelease("8n", time),
      hatPat, "8n"
    ).start(0);

    seqRef.current = [melodySeq, kickSeq, hatSeq];
    Tone.getTransport().start();

    const BAR_COUNT = 24;
    const animate = () => {
      tRef.current += 0.04;
      const t = tRef.current;
      const canvas = vizCanvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);
        const barW = Math.floor(W / BAR_COUNT) - 2;
        for (let i = 0; i < BAR_COUNT; i++) {
          const h = Math.max(4, Math.min(H - 4,
            (H / 2) * (0.15 + 0.55 * Math.abs(Math.sin(t * 1.8 + i * 0.45)) + 0.3 * Math.abs(Math.sin(t * 0.9 + i * 0.9)) + 0.15 * Math.random())
          ));
          const x = i * (barW + 2);
          const grad = ctx.createLinearGradient(0, H - h, 0, H);
          grad.addColorStop(0, T.accent2);
          grad.addColorStop(1, T.accent);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.roundRect(x, H - h, barW, h, 2);
          ctx.fill();
        }
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    animate();
    setPlaying(true);
  };

  const stopMusic = () => {
    cleanup();
    Tone.getTransport().stop();
    tRef.current = 0;
    const canvas = vizCanvasRef.current;
    if (canvas) canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    setPlaying(false);
  };

  useEffect(() => {
    if (volRef.current) volRef.current.volume.value = volume;
  }, [volume]);

  useEffect(() => { return cleanup; }, []);

  const selectTrack = (i) => {
    setTrackIdx(i);
    if (playing) startMusic(i);
  };

  return (
    <div style={{ padding: 20, fontFamily: "'JetBrains Mono', monospace", color: T.text, height: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ textAlign: "center", color: T.accent, fontSize: 13, letterSpacing: 2 }}>MUSIC PLAYER</div>
      {/* Visualizer */}
      <div style={{ position: "relative", height: 56, borderRadius: 8, overflow: "hidden", background: T.barBg, border: `1px solid ${T.border}` }}>
        <canvas ref={vizCanvasRef} width={360} height={56} style={{ width: "100%", height: "100%", display: "block", opacity: playing ? 1 : 0.2 }} />
        {!playing && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: T.textDim, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 2 }}>
            PAUSED
          </div>
        )}
      </div>
      {/* Track info */}
      <div style={{ textAlign: "center" }}>
        <div style={{ color: T.text, fontSize: 15, fontWeight: 700 }}>{TRACKS[trackIdx].name}</div>
        <div style={{ color: T.textMuted, fontSize: 11 }}>{TRACKS[trackIdx].desc}</div>
      </div>
      {/* Controls */}
      <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
        <button onClick={() => selectTrack((trackIdx - 1 + 3) % 3)} style={ctrlBtn(T)}>⏮</button>
        <button onClick={() => playing ? stopMusic() : startMusic(trackIdx)} style={{ ...ctrlBtn(T), background: T.accent, color: T.bg, width: 44, fontSize: 18 }}>
          {playing ? "⏸" : "▶"}
        </button>
        <button onClick={() => selectTrack((trackIdx + 1) % 3)} style={ctrlBtn(T)}>⏭</button>
      </div>
      {/* Volume */}
      <div style={{ display: "flex", align: "center", gap: 8, alignItems: "center" }}>
        <span style={{ color: T.textMuted, fontSize: 11 }}>VOL</span>
        <input type="range" min="-30" max="0" value={volume} onChange={(e) => setVolume(+e.target.value)}
          style={{ flex: 1, accentColor: T.accent }} />
        <span style={{ color: T.textMuted, fontSize: 11, minWidth: 30 }}>{volume}dB</span>
      </div>
      {/* Track list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {TRACKS.map((tr, i) => (
          <div key={i} onClick={() => selectTrack(i)} style={{
            padding: "8px 12px", borderRadius: 8, cursor: "pointer",
            background: trackIdx === i ? T.barBg : "transparent",
            border: `1px solid ${trackIdx === i ? T.accent : T.border}`,
            display: "flex", justifyContent: "space-between", alignItems: "center",
            color: trackIdx === i ? T.accent : T.textMuted, fontSize: 12,
            transition: "all 0.2s",
          }}>
            <span>{trackIdx === i && playing ? "▶ " : "  "}{tr.name}</span>
            <span style={{ fontSize: 10 }}>{tr.bpm} BPM</span>
          </div>
        ))}
      </div>
    </div>
  );
}
const ctrlBtn = (T) => ({
  width: 38, height: 38, background: T.surface, border: `1px solid ${T.border}`,
  color: T.text, borderRadius: 8, cursor: "pointer", fontSize: 16,
  display: "flex", alignItems: "center", justifyContent: "center",
});

// ─── TERMINAL ──────────────────────────────────────────────────────────────────
function TerminalWin({ theme }) {
  const T = THEMES[theme];
  const [lines, setLines] = useState([
    { t: "system", v: "EugenOS v1.0.0 — Terminal Emulator" },
    { t: "system", v: "Type 'help' for available commands." },
    { t: "system", v: "" },
  ]);
  const [input, setInput] = useState("");
  const [hist, setHist] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [lines]);

  const bar = (pct) => {
    const filled = Math.round(pct / 5);
    return "█".repeat(filled) + "░".repeat(20 - filled) + ` ${pct}%`;
  };

  const CMDS = {
    help: () => [
      { t: "accent", v: "Available commands:" },
      { t: "output", v: "  about       — Who is Eugen?" },
      { t: "output", v: "  skills      — ASCII bar chart of skills" },
      { t: "output", v: "  work        — Work history" },
      { t: "output", v: "  projects    — Projects list" },
      { t: "output", v: "  education   — Degrees & education" },
      { t: "output", v: "  contact     — Contact info" },
      { t: "output", v: "  neofetch    — System info" },
      { t: "output", v: "  whoami      — Current user" },
      { t: "output", v: "  uptime      — Years active" },
      { t: "output", v: "  ps          — Running processes" },
      { t: "output", v: "  ls          — List files" },
      { t: "output", v: "  git log     — Recent commits" },
      { t: "output", v: "  cat <file>  — Read a file" },
      { t: "output", v: "  ping        — Ping the internet" },
      { t: "output", v: "  weather     — Current weather" },
      { t: "output", v: "  joke        — Random dev joke" },
      { t: "output", v: "  fortune     — Fortune cookie" },
      { t: "output", v: "  coffee      — Brew coffee" },
      { t: "output", v: "  echo <msg>  — Echo a message" },
      { t: "output", v: "  cowsay      — cowsay <text>" },
      { t: "output", v: "  hostname    — System hostname" },
      { t: "output", v: "  pwd         — Current directory" },
      { t: "output", v: "  man         — Manual page" },
      { t: "output", v: "  history     — Command history" },
      { t: "output", v: "  sudo        — Try it 😏" },
      { t: "output", v: "  matrix      — Go deeper" },
      { t: "output", v: "  exit        — Try to leave" },
      { t: "output", v: "  clear       — Clear terminal" },
    ],
    about: () => [
      { t: "accent", v: "Eugen Sekiraqa — Software Developer" },
      { t: "output", v: "  Location    : Prishtina, Kosovo" },
      { t: "output", v: "  Experience  : 5+ years" },
      { t: "output", v: "  Primary     : C#, .NET, Blazor, ASP.NET" },
      { t: "output", v: "  Database    : SQL Server" },
      { t: "output", v: "  Frontend    : Blazor, JavaScript, HTML/CSS" },
      { t: "output", v: "  Email       : eugen.sekiraqa1@gmail.com" },
      { t: "output", v: "" },
      { t: "output", v: "  Full-stack developer with 5+ years building enterprise" },
      { t: "output", v: "  web applications in C#, ASP.NET, and Blazor. Focused" },
      { t: "output", v: "  on clean architecture, scalable systems, and" },
      { t: "output", v: "  maintainable code." },
    ],
    skills: () => [
      { t: "accent", v: "Skills — Proficiency Chart" },
      { t: "output", v: "" },
      { t: "output", v: "  C#             " + bar(93) },
      { t: "output", v: "  ASP.NET MVC    " + bar(90) },
      { t: "output", v: "  Blazor         " + bar(88) },
      { t: "output", v: "  .NET Core      " + bar(88) },
      { t: "output", v: "  SQL Server     " + bar(85) },
      { t: "output", v: "  OOP/Design     " + bar(85) },
      { t: "output", v: "  REST APIs      " + bar(80) },
      { t: "output", v: "  Git            " + bar(78) },
      { t: "output", v: "  JavaScript     " + bar(65) },
      { t: "output", v: "  HTML5/CSS3     " + bar(65) },
      { t: "output", v: "  Angular        " + bar(52) },
      { t: "output", v: "  React          " + bar(40) },
      { t: "output", v: "  Python         " + bar(45) },
      { t: "output", v: "  .NET MAUI      " + bar(35) },
    ],
    work: () => [
      { t: "accent", v: "Work History" },
      { t: "output", v: "" },
      { t: "green", v: "  ► Software Developer @ Komtel Project Engineering" },
      { t: "output", v: "    10/2021 – Present | Prishtina, Kosovo" },
      { t: "output", v: "    • Developed web apps with ASP.NET & Blazor" },
      { t: "output", v: "    • Implemented features, optimized performance" },
      { t: "output", v: "    • Integrated third-party APIs, code reviews" },
      { t: "output", v: "" },
      { t: "output", v: "  ► Junior Software Developer @ Appdec" },
      { t: "output", v: "    04/2021 – 06/2021 | Prishtina, Kosovo" },
      { t: "output", v: "    • Tested ASP.NET Core Web API & Angular apps" },
      { t: "output", v: "    • Identified security vulnerabilities" },
      { t: "output", v: "" },
      { t: "output", v: "  ► IT Intern @ Riinvest College" },
      { t: "output", v: "    08/2020 – 04/2021 | Prishtina, Kosovo" },
      { t: "output", v: "    • IT support, DB & network management" },
      { t: "output", v: "" },
      { t: "output", v: "  ► IT Intern @ Riinvest Institute" },
      { t: "output", v: "    10/2020 – 08/2021 | Prishtina, Kosovo" },
      { t: "output", v: "    • Network config, backups, IT infrastructure" },
    ],
    projects: () => [
      { t: "accent", v: "Projects" },
      { t: "output", v: "" },
      { t: "output", v: "  📁 e-Procurement (KEP) — 2021-2022" },
      { t: "output", v: "     ASP.NET MVC, SQL Server" },
      { t: "output", v: "  📁 EU-GFA / NREPB — 2021-2022" },
      { t: "output", v: "     ASP.NET MVC, SQL Server (EU-funded)" },
      { t: "output", v: "  📁 Legal Aid Information System — 2024-2025" },
      { t: "output", v: "     Blazor, SQL Server, ASP.NET" },
      { t: "output", v: "  📁 News Portal & Material Mgmt (SIMPA) — 2024-Present" },
      { t: "output", v: "     Blazor, SQL Server, CMS" },
      { t: "output", v: "  📁 Down Syndrome Kosovo — 2024-2025" },
      { t: "output", v: "     ASP.NET Core Web API, Angular" },
      { t: "output", v: "  📁 Accounts Payable – KOSTT — 2023-2025" },
      { t: "output", v: "     ASP.NET MVC, SQL Server, RBAC" },
    ],
    education: () => [
      { t: "accent", v: "Education" },
      { t: "output", v: "" },
      { t: "output", v: "  🎓 MSc Computer Science Engineering" },
      { t: "output", v: "     UBT | 10/2025 – Present" },
      { t: "output", v: "     [IN PROGRESS]" },
      { t: "output", v: "" },
      { t: "output", v: "  🎓 B.Sc Computer Science – Software Engineering" },
      { t: "output", v: "     Riinvest College | 10/2018 – 07/2022" },
    ],
    contact: () => [
      { t: "accent", v: "Contact" },
      { t: "output", v: "  Email    : eugen.sekiraqa1@gmail.com" },
      { t: "output", v: "  Phone    : +383 49 140560" },
      { t: "output", v: "  Location : Prishtina, Kosovo" },
      { t: "output", v: "  LinkedIn : linkedin.com/in/eugen-sekiraqa-76b597210" },
      { t: "output", v: "  GitHub   : github.com/eugen-sekiraqa" },
    ],
    whoami: () => {
      const intros = [
        "Eugen Sekiraqa — Software Developer from Prishtina, Kosovo",
        "A full-stack .NET developer who dreams in C# and wakes up to SQL queries",
        "The guy who turns coffee into Blazor components since 2021",
        "eugen@EugenOS — 5+ years of shipping code that actually works",
        "A developer who thinks 'it works on my machine' is not a deployment strategy",
        "MSc student by day, production bug fixer by night",
        "Someone who chose .NET over sleep — and would do it again",
      ];
      const facts = [
        "Currently building enterprise apps at Komtel Project Engineering",
        "Has mass of Blazor and ASP.NET projects under his belt",
        "Believes clean architecture is not optional, it's a lifestyle",
        "Once optimized a SQL query so hard it ran before you clicked the button",
        "Still waiting for that one day with zero compiler warnings",
        "Speaks fluent C#, conversational SQL, and broken JavaScript",
      ];
      return [
        { t: "accent", v: "  " + intros[Math.floor(Math.random() * intros.length)] },
        { t: "output", v: "  " + facts[Math.floor(Math.random() * facts.length)] },
      ];
    },
    uptime: () => {
      const start = new Date(2021, 3, 1);
      const now = new Date();
      const years = ((now - start) / (365.25 * 24 * 60 * 60 * 1000)).toFixed(1);
      const lines = [
        `  up ${years} years — still compiling, still shipping`,
        `  ${years} years in the game. No signs of stopping.`,
        `  Runtime: ${years}y. Bugs squashed: too many to count.`,
        `  ${years} years of uptime. 0 planned downtime. coffee.daemon keeps it running.`,
      ];
      return [
        { t: "accent", v: lines[Math.floor(Math.random() * lines.length)] },
      ];
    },
    date: () => {
      const d = new Date();
      const day = d.toLocaleDateString("en-US", { weekday: "long" });
      const time = d.toLocaleTimeString();
      const msgs = [
        `It's ${day} — perfect day to ship some code.`,
        `${day}, ${time}. Time flies when you're debugging.`,
        `${day}. The compiler doesn't care what day it is.`,
      ];
      return [
        { t: "output", v: "  " + d.toString() },
        { t: "output", v: "  " + msgs[Math.floor(Math.random() * msgs.length)] },
      ];
    },
    neofetch: () => [
      { t: "accent", v: "  ███████╗██╗   ██╗ ██████╗ ███████╗███╗   ██╗" },
      { t: "accent", v: "  ██╔════╝██║   ██║██╔════╝ ██╔════╝████╗  ██║" },
      { t: "accent", v: "  █████╗  ██║   ██║██║  ███╗█████╗  ██╔██╗ ██║" },
      { t: "accent", v: "  ██╔══╝  ██║   ██║██║   ██║██╔══╝  ██║╚██╗██║" },
      { t: "accent", v: "  ███████╗╚██████╔╝╚██████╔╝███████╗██║ ╚████║" },
      { t: "accent", v: "  ╚══════╝ ╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═══╝" },
      { t: "output", v: "" },
      { t: "output", v: "  OS       : EugenOS v1.0.0" },
      { t: "output", v: "  Host     : Prishtina, Kosovo" },
      { t: "output", v: "  Kernel   : v1.0.0" },
      { t: "output", v: "  Runtime  : .NET 8 / ASP.NET Core" },
      { t: "output", v: "  Shell    : Blazor WebAssembly" },
      { t: "output", v: "  DB       : SQL Server 2022" },
      { t: "output", v: "  Editor   : Visual Studio 2022" },
      { t: "output", v: "  Uptime   : 5+ years" },
    ],
    ps: () => [
      { t: "accent", v: "PID    NAME                  STATUS" },
      { t: "output", v: "  1001   dotnet.runtime        Running" },
      { t: "output", v: "  1002   aspnetcore.server     Running" },
      { t: "output", v: "  1003   blazor.wasm           Running" },
      { t: "output", v: "  1004   sqlserver.service     Running" },
      { t: "output", v: "  1005   git.daemon            Running" },
      { t: "output", v: "  1006   vscode.server         Running" },
      { t: "output", v: "  1007   coffee.daemon         Sleeping" },
    ],
    ls: () => [
      { t: "output", v: "  total 8" },
      { t: "accent", v: "  drwxr-xr-x  eugen  projects/" },
      { t: "accent", v: "  drwxr-xr-x  eugen  solutions/" },
      { t: "output", v: "  -rw-r--r--  eugen  resume.pdf" },
      { t: "output", v: "  -rw-r--r--  eugen  todo.txt" },
      { t: "output", v: "  -rw-r--r--  eugen  .dotnet_love" },
      { t: "output", v: "  -rwxr-xr-x  eugen  start_work.sh" },
    ],
    "git log": () => [
      { t: "accent", v: "  commit a3f7d2c — feat: add legal aid case management module" },
      { t: "output", v: "  Date: Mon Jan 15 09:42:00 2025" },
      { t: "output", v: "" },
      { t: "accent", v: "  commit b82e1f9 — fix: optimize SQL query in procurement report" },
      { t: "output", v: "  Date: Fri Dec 06 14:18:00 2024" },
      { t: "output", v: "" },
      { t: "accent", v: "  commit c91a0e4 — feat: implement Blazor dashboard for SIMPA CMS" },
      { t: "output", v: "  Date: Wed Nov 20 11:05:00 2024" },
      { t: "output", v: "" },
      { t: "accent", v: "  commit d5b3c77 — refactor: migrate NREPB API to .NET 7" },
      { t: "output", v: "  Date: Tue Mar 14 16:33:00 2023" },
      { t: "output", v: "" },
      { t: "accent", v: "  commit e0f2812 — init: scaffold e-Procurement KEP backend" },
      { t: "output", v: "  Date: Mon Oct 18 08:00:00 2021" },
    ],
    ping: () => {
      const t1 = Math.floor(Math.random() * 20) + 5;
      const t2 = Math.floor(Math.random() * 20) + 5;
      const t3 = Math.floor(Math.random() * 20) + 5;
      const avg = ((t1 + t2 + t3) / 3).toFixed(1);
      return [
        { t: "output", v: "  PING google.com (142.250.185.46): 56 bytes" },
        { t: "green", v: `  64 bytes from 142.250.185.46: time=${t1}ms` },
        { t: "green", v: `  64 bytes from 142.250.185.46: time=${t2}ms` },
        { t: "green", v: `  64 bytes from 142.250.185.46: time=${t3}ms` },
        { t: "output", v: `  3 packets transmitted, 3 received, 0% loss, avg=${avg}ms` },
      ];
    },
    weather: () => {
      const conditions = [
        { icon: "🌤", desc: "Partly Cloudy", temp: 18, hum: 52, wind: 14 },
        { icon: "☀️", desc: "Clear Sky", temp: 24, hum: 35, wind: 8 },
        { icon: "🌧", desc: "Light Rain", temp: 12, hum: 78, wind: 20 },
        { icon: "⛅", desc: "Mostly Cloudy", temp: 15, hum: 65, wind: 11 },
        { icon: "🌩", desc: "Thunderstorm", temp: 10, hum: 90, wind: 30 },
        { icon: "❄️", desc: "Snowy", temp: -2, hum: 80, wind: 25 },
      ];
      const w = conditions[Math.floor(Math.random() * conditions.length)];
      const comments = [
        "Perfect coding weather.",
        "Stay inside. Write code.",
        "The compiler doesn't care about weather.",
        "Great day to refactor something.",
        "Weather.exe has stopped responding.",
      ];
      return [
        { t: "accent", v: `  ${w.icon} Prishtina, Kosovo` },
        { t: "output", v: `  ${w.desc} · ${w.temp}°C / ${Math.round(w.temp * 9/5 + 32)}°F` },
        { t: "output", v: `  Humidity: ${w.hum}% · Wind: ${w.wind} km/h` },
        { t: "output", v: `  ${comments[Math.floor(Math.random() * comments.length)]}` },
      ];
    },
    joke: () => {
      const jokes = [
        "Why do programmers prefer dark mode? Because light attracts bugs.",
        "A SQL query walks into a bar, walks up to two tables and asks... 'Can I join you?'",
        "Why do C# developers wear glasses? Because they can't C++.",
        "!false — it's funny because it's true.",
        "A Blazor developer walks into a bar. The bartender says: 'Please wait, rehydrating...'",
        "There are only 10 types of people — those who understand binary and those who don't.",
        "My code doesn't have bugs. It has undocumented features.",
        "git commit -m 'fixed it' — narrator: he did not fix it.",
        "// TODO: write better code. Written 3 years ago.",
        "The best thing about a boolean is that even if you're wrong, you're only off by a bit.",
        "I told my wife she was drawing her eyebrows too high. She looked surprised.",
        "Debugging: being the detective in a crime movie where you're also the murderer.",
        "I'd tell you a UDP joke, but you might not get it.",
        "A QA engineer walks into a bar. Orders 1 beer. Orders 0 beers. Orders -1 beers. Orders 999999 beers. Orders a lizard. Orders NULL.",
        "Saying 'JavaScript is good' is like saying 'the fire is warm'. Technically true, but you're missing the bigger picture.",
        "In order to understand recursion, you must first understand recursion.",
        "It's not a bug — it's an undocumented feature approved by management.",
      ];
      return [{ t: "output", v: "  😂 " + jokes[Math.floor(Math.random() * jokes.length)] }];
    },
    coffee: () => {
      const brews = [
        { name: "Espresso", bonus: "Focus +80%", icon: "☕" },
        { name: "Macchiato", bonus: "Code quality +50%", icon: "☕" },
        { name: "Double Shot", bonus: "Typing speed +200%", icon: "☕☕" },
        { name: "Turkish Coffee", bonus: "Debugging intuition +90%", icon: "🫖" },
      ];
      const b = brews[Math.floor(Math.random() * brews.length)];
      return [
        { t: "accent", v: `  ${b.icon} Brewing ${b.name}...` },
        { t: "output", v: "  [████████████████████] 100%" },
        { t: "green", v: `  ${b.name} ready. ${b.bonus}.` },
      ];
    },
    sudo: () => {
      const responses = [
        [{ t: "red", v: "  eugen is not in the sudoers file." }, { t: "output", v: "  This incident will be reported." }],
        [{ t: "red", v: "  Nice try. Access denied." }, { t: "output", v: "  Your attempt has been logged and sent to /dev/null." }],
        [{ t: "red", v: "  Permission denied." }, { t: "output", v: "  With great power comes great responsibility. You're not ready." }],
        [{ t: "red", v: "  sudo: command not found in portfolio OS." }, { t: "output", v: "  This is a democracy, not a dictatorship." }],
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    },
    matrix: () => {
      const scenes = [
        [{ t: "green", v: "  Wake up, Neo..." }, { t: "green", v: "  The Matrix has you..." }, { t: "green", v: "  Follow the white rabbit. 🐇" }, { t: "output", v: "  (You're already in it — this is a portfolio OS)" }],
        [{ t: "green", v: "  There is no spoon." }, { t: "green", v: "  There is only C# and the occasional NullReferenceException." }],
        [{ t: "green", v: "  You take the blue pill — the story ends." }, { t: "green", v: "  You take the red pill — you learn Blazor." }, { t: "green", v: "  You took the red pill. Welcome. 🐇" }],
      ];
      return scenes[Math.floor(Math.random() * scenes.length)];
    },
    fortune: () => {
      const fortunes = [
        "Your next deploy will succeed on the first try.",
        "A great opportunity disguised as a merge conflict is heading your way.",
        "The bug you've been chasing will reveal itself after a coffee break.",
        "You will refactor something beautiful today.",
        "Beware of commits pushed on Fridays.",
        "An unexpected code review will teach you something new.",
        "Your test coverage will improve dramatically this week.",
        "A senior developer will praise your clean architecture.",
        "The CI/CD pipeline smiles upon you today.",
        "Today's lucky number: 200 OK.",
      ];
      return [
        { t: "accent", v: "  🔮 Fortune Cookie:" },
        { t: "output", v: "  " + fortunes[Math.floor(Math.random() * fortunes.length)] },
      ];
    },
    hostname: () => [{ t: "accent", v: "  EugenOS.local" }],
    "rm -rf /": () => [
      { t: "red", v: "  🚨 NICE TRY." },
      { t: "output", v: "  Portfolio OS has self-preservation instincts." },
      { t: "output", v: "  All your files are safe. For now." },
    ],
    exit: () => [
      { t: "output", v: "  logout" },
      { t: "accent", v: "  Thanks for visiting! But you can't escape this terminal that easily." },
    ],
    pwd: () => [{ t: "accent", v: "  /home/eugen/portfolio" }],
    man: () => [
      { t: "accent", v: "  EUGEN(1)               EugenOS Manual              EUGEN(1)" },
      { t: "output", v: "" },
      { t: "output", v: "  NAME" },
      { t: "output", v: "       eugen - a full-stack .NET developer" },
      { t: "output", v: "" },
      { t: "output", v: "  SYNOPSIS" },
      { t: "output", v: "       eugen [--coffee] [--code] [--ship]" },
      { t: "output", v: "" },
      { t: "output", v: "  DESCRIPTION" },
      { t: "output", v: "       Builds enterprise web apps. Runs on caffeine." },
      { t: "output", v: "       Returns clean code. Throws only when necessary." },
    ],
    clear: () => null,
  };

  const catFiles = {
    "resume.pdf": [
      { t: "accent", v: "  [PDF] Eugen Sekiraqa — Software Developer" },
      { t: "output", v: "  5+ years · C# · Blazor · SQL Server · Prishtina" },
    ],
    "todo.txt": [
      { t: "output", v: "  [x] Ship Legal Aid System v2.0" },
      { t: "output", v: "  [x] Optimize SIMPA video pipeline" },
      { t: "output", v: "  [ ] Learn Rust" },
      { t: "output", v: "  [ ] Finish MSc thesis" },
      { t: "output", v: "  [ ] Take a vacation (someday)" },
    ],
    ".dotnet_love": [
      { t: "accent", v: "  I ❤ .NET" },
      { t: "output", v: "  C# is not a language, it's a lifestyle." },
    ],
    "start_work.sh": [
      { t: "output", v: "  #!/bin/bash" },
      { t: "accent", v: "  echo 'Good morning, Eugen!'" },
      { t: "output", v: "  coffee --brew --size=large" },
      { t: "output", v: "  git pull origin main" },
      { t: "output", v: "  code ." },
    ],
  };

  const run = (raw) => {
    const trimmed = raw.trim().toLowerCase();
    const inputLine = { t: "input", v: `$ ${raw}` };

    if (trimmed === "clear") {
      setLines([{ t: "system", v: "Terminal cleared." }]);
      return;
    }
    if (trimmed.startsWith("cat ")) {
      const fname = trimmed.slice(4).trim();
      const content = catFiles[fname];
      setLines((l) => [...l, inputLine, ...(content || [{ t: "red", v: `  cat: ${fname}: No such file or directory` }])]);
      return;
    }
    if (trimmed === "history") {
      const recent = hist.slice(0, 10);
      setLines((l) => [...l, inputLine, ...recent.map((h, i) => ({ t: "output", v: `  ${recent.length - i}  ${h}` })), ...(recent.length === 0 ? [{ t: "output", v: "  (no history yet)" }] : [])]);
      return;
    }
    if (trimmed.startsWith("echo ")) {
      const msg = raw.slice(5);
      setLines((l) => [...l, inputLine, { t: "output", v: "  " + msg }]);
      return;
    }
    if (trimmed.startsWith("cowsay ")) {
      const msg = raw.slice(7).trim() || "Moo!";
      const line = " ".repeat(2) + msg;
      const border = "-".repeat(msg.length + 2);
      setLines((l) => [...l, inputLine,
        { t: "output", v: `  +${border}+` },
        { t: "output", v: `  | ${msg} |` },
        { t: "output", v: `  +${border}+` },
        { t: "output", v: "        \\   ^__^" },
        { t: "output", v: "         \\  (oo)\\_______" },
        { t: "output", v: "            (__)\\       )\\/\\" },
        { t: "output", v: "                ||----w |" },
        { t: "output", v: "                ||     ||" },
      ]);
      return;
    }
    const fn = CMDS[trimmed];
    if (fn) {
      const out = fn();
      if (out === null) { setLines([{ t: "system", v: "Terminal cleared." }]); return; }
      setLines((l) => [...l, inputLine, ...out]);
    } else if (trimmed === "") {
      setLines((l) => [...l, inputLine]);
    } else {
      setLines((l) => [...l, inputLine, { t: "red", v: `  bash: ${raw}: command not found` }]);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      run(input);
      setHist((h) => [input, ...h]);
      setHistIdx(-1);
      setInput("");
    } else if (e.key === "ArrowUp") {
      const ni = Math.min(histIdx + 1, hist.length - 1);
      setHistIdx(ni);
      setInput(hist[ni] || "");
    } else if (e.key === "ArrowDown") {
      const ni = Math.max(histIdx - 1, -1);
      setHistIdx(ni);
      setInput(ni === -1 ? "" : hist[ni]);
    }
  };

  const colorMap = { system: T.textDim, input: T.accent, error: T.red, output: T.text, accent: T.accent, green: T.green, red: T.red };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      style={{ height: "100%", background: "rgba(0,0,0,0.6)", padding: 14, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, display: "flex", flexDirection: "column", cursor: "text" }}
    >
      <div style={{ flex: 1, overflow: "auto" }}>
        {lines.map((l, i) => (
          <div key={i} style={{ color: colorMap[l.t] || T.text, lineHeight: 1.7, whiteSpace: "pre" }}>{l.v}</div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div style={{ display: "flex", alignItems: "center", marginTop: 8, borderTop: `1px solid ${T.border}`, paddingTop: 8 }}>
        <span style={{ color: T.accent, marginRight: 8 }}>eugen@EugenOS ~ $</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          autoFocus
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: T.text, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, caretColor: T.accent }}
        />
      </div>
    </div>
  );
}

// ─── PROFILE PANEL ─────────────────────────────────────────────────────────────
function ProfileC({ theme }) {
  const T = THEMES[theme];
  const strengths = ["C# & .NET", "Blazor", "ASP.NET", "SQL Server", "OOP", "Full-Stack"];
  const stats = [
    { label: "Years Exp.", value: "5+" },
    { label: "Projects", value: "6+" },
    { label: "Degrees", value: "2" },
  ];
  return (
    <div style={{ padding: 24, fontFamily: "'Outfit', sans-serif", color: T.text }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          background: `linear-gradient(135deg, ${T.accent}, ${T.accent2})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28, fontWeight: 800, color: "#fff",
          boxShadow: `0 0 24px ${T.accentGlow}`,
          fontFamily: "'JetBrains Mono', monospace",
        }}>ES</div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: T.text }}>Eugen Sekiraqa</div>
          <div style={{ fontSize: 12, color: T.accent, letterSpacing: 3, fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>SOFTWARE DEVELOPER</div>
          <div style={{ fontSize: 13, color: T.textMuted, marginTop: 6 }}>Prishtina, Kosovo</div>
        </div>
      </div>
      <div style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.7, marginBottom: 20, textAlign: "center", maxWidth: 400, margin: "0 auto 20px" }}>
        Full-stack developer with 5+ years building enterprise web applications in C#, ASP.NET, and Blazor. Focused on clean architecture, scalable systems, and maintainable code.
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 24 }}>
        {strengths.map((s) => (
          <span key={s} style={{ padding: "4px 12px", borderRadius: 20, background: T.barBg, border: `1px solid ${T.border}`, color: T.accent, fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>{s}</span>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        {stats.map((s) => (
          <div key={s.label} style={{ flex: 1, textAlign: "center", padding: "14px 8px", background: T.barBg, border: `1px solid ${T.border}`, borderRadius: 12 }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: T.accent, fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</div>
            <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── WORK PANEL ────────────────────────────────────────────────────────────────
function WorkC({ theme }) {
  const T = THEMES[theme];
  const jobs = [
    {
      role: "Software Developer", company: "Komtel Project Engineering",
      period: "10/2021 – Present", active: true,
      bullets: [
        "Developed and maintained web apps using ASP.NET and Blazor",
        "Implemented new features and optimized existing ones",
        "Collaborated with cross-functional teams to deliver solutions",
        "Conducted troubleshooting, bug fixing, and maintenance",
        "Integrated third-party APIs and participated in code reviews",
      ],
    },
    {
      role: "Junior Software Developer (Internship)", company: "Appdec",
      period: "04/2021 – 06/2021", active: false,
      bullets: [
        "Tested ASP.NET Core Web API and Angular apps",
        "Assisted in identifying security vulnerabilities",
        "Maintained and updated application code under senior guidance",
        "Used Git for version control and team collaboration",
      ],
    },
    {
      role: "IT Intern", company: "Riinvest College",
      period: "08/2020 – 04/2021", active: false,
      bullets: [
        "Resolved software and hardware issues, system configuration",
        "Assisted in database record management",
        "Monitored and maintained university web applications",
      ],
    },
    {
      role: "IT Intern", company: "Riinvest Institute",
      period: "10/2020 – 08/2021", active: false,
      bullets: [
        "Configured internal networks and managed backups",
        "Supported hardware installation and system updates",
        "Contributed to IT infrastructure uptime improvements",
      ],
    },
  ];

  return (
    <div style={{ padding: "20px 24px", fontFamily: "'Outfit', sans-serif" }}>
      <div style={{ position: "relative", paddingLeft: 24 }}>
        <div style={{ position: "absolute", left: 8, top: 0, bottom: 0, width: 2, background: `linear-gradient(to bottom, ${T.accent}, ${T.accent2}30)`, borderRadius: 2 }} />
        {jobs.map((j, i) => (
          <div key={i} style={{ marginBottom: 28, position: "relative" }}>
            <div style={{
              position: "absolute", left: -24, top: 6, width: 12, height: 12, borderRadius: "50%",
              background: j.active ? T.accent : T.textDim,
              boxShadow: j.active ? `0 0 12px ${T.accentGlow}` : "none",
              border: `2px solid ${j.active ? T.accent : T.textDim}`,
            }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 4 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: j.active ? T.accent : T.text }}>{j.role}</div>
                <div style={{ color: T.accent2, fontSize: 13, marginTop: 2 }}>{j.company}</div>
              </div>
              <div style={{ fontSize: 11, color: T.textMuted, fontFamily: "'JetBrains Mono', monospace", padding: "3px 8px", background: T.barBg, borderRadius: 6, border: `1px solid ${T.border}` }}>{j.period}</div>
            </div>
            <ul style={{ marginTop: 8, paddingLeft: 16, color: T.textMuted, fontSize: 13, lineHeight: 1.8 }}>
              {j.bullets.map((b, bi) => <li key={bi}>{b}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SKILLS PANEL ──────────────────────────────────────────────────────────────
function SkillsC({ theme }) {
  const T = THEMES[theme];
  const [view, setView] = useState("bars");

  const categories = [
    {
      name: "Backend & Full-Stack",
      skills: [
        { name: "C#", level: 93 }, { name: "ASP.NET MVC", level: 90 },
        { name: ".NET Core", level: 88 }, { name: "Blazor", level: 88 },
        { name: "OOP / Architecture", level: 85 }, { name: "Python", level: 45 },
        { name: ".NET MAUI", level: 35 },
      ],
    },
    {
      name: "Frontend & UI",
      skills: [
        { name: "JavaScript", level: 65 }, { name: "HTML5 / CSS3", level: 65 },
        { name: "Angular", level: 52 }, { name: "React", level: 40 },
      ],
    },
    {
      name: "Database",
      skills: [
        { name: "SQL Server", level: 85 }, { name: "Query Optimization", level: 78 },
        { name: "Relational Design", level: 80 },
      ],
    },
    {
      name: "Tools & Methods",
      skills: [
        { name: "REST APIs", level: 80 }, { name: "Git", level: 78 },
        { name: "Agile / Scrum", level: 75 }, { name: "MVC Architecture", level: 85 },
      ],
    },
  ];

  const radarSkills = [
    { name: "C#", level: 93 }, { name: "ASP.NET", level: 90 },
    { name: "Blazor", level: 88 }, { name: "SQL Server", level: 85 },
    { name: "REST APIs", level: 80 }, { name: "Git", level: 78 },
    { name: "JavaScript", level: 65 }, { name: "OOP", level: 85 },
  ];

  const barColor = (l) => l > 80 ? `linear-gradient(90deg, ${T.green}, ${T.accent})` : l > 50 ? `linear-gradient(90deg, ${T.accent2}, ${T.accent3})` : `linear-gradient(90deg, ${T.orange}, ${T.yellow})`;

  return (
    <div style={{ padding: 20, fontFamily: "'Outfit', sans-serif" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["bars", "radar"].map((v) => (
          <button key={v} onClick={() => setView(v)} style={{
            padding: "6px 18px", borderRadius: 8, border: `1px solid ${view === v ? T.accent : T.border}`,
            background: view === v ? T.barBg : "transparent", color: view === v ? T.accent : T.textMuted,
            cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
          }}>{v}</button>
        ))}
      </div>
      {view === "bars" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {categories.map((cat) => (
            <div key={cat.name}>
              <div style={{ fontSize: 11, color: T.accent, letterSpacing: 2, marginBottom: 10, fontFamily: "'JetBrains Mono', monospace" }}>{cat.name.toUpperCase()}</div>
              {cat.skills.map((s) => (
                <div key={s.name} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 13 }}>
                    <span style={{ color: T.text }}>{s.name}</span>
                    <span style={{ color: T.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{s.level}%</span>
                  </div>
                  <div style={{ height: 6, background: T.barBg, borderRadius: 4, overflow: "hidden", border: `1px solid ${T.border}` }}>
                    <div style={{ width: `${s.level}%`, height: "100%", background: barColor(s.level), borderRadius: 4, transition: "width 0.8s ease" }} />
                  </div>
                </div>
              ))}
            </div>
          ))}
          <div style={{ marginTop: 8, fontSize: 12, color: T.textMuted, borderTop: `1px solid ${T.border}`, paddingTop: 12 }}>
            🗣 Languages: <span style={{ color: T.accent }}>Albanian</span> (Native) · <span style={{ color: T.accent2 }}>English</span> (Professional)
          </div>
        </div>
      ) : (
        <div style={{ height: 300 }}><SkillRadar skills={radarSkills} theme={theme} /></div>
      )}
    </div>
  );
}

// ─── PROJECTS PANEL ────────────────────────────────────────────────────────────
function ProjectsC({ theme }) {
  const T = THEMES[theme];
  const projects = [
    {
      name: "e-Procurement (KEP)",
      period: "10/2021 – 2022",
      desc: "Backend solutions for a government e-Procurement system with secure and efficient procurement process management.",
      tags: ["ASP.NET MVC", "SQL Server", "REST API"],
      color: T.accent,
    },
    {
      name: "EU-GFA / NREPB",
      period: "2021 – 2022",
      desc: "National Registry of Energy Performance in Buildings — an EU-funded project for national energy data management.",
      tags: ["ASP.NET MVC", "SQL Server", ".NET"],
      color: T.accent2,
    },
    {
      name: "Legal Aid Info System",
      period: "2024 – 2025",
      desc: "Full-featured legal aid service management system with responsive Blazor UI and secure SQL Server database.",
      tags: ["Blazor", "SQL Server", "ASP.NET"],
      color: T.accent3,
    },
    {
      name: "News Portal & Material Mgmt (SIMPA)",
      period: "2024 – Present",
      desc: "Multimedia management system with CMS integration, video processing, and workflow optimization features.",
      tags: ["Blazor", "SQL Server", "CMS"],
      color: T.orange,
    },
    {
      name: "Down Syndrome Kosovo",
      period: "2024 – 2025",
      desc: "HR, Administration, Finance & Procurement modules for an NGO — ASP.NET Core API with Angular frontend.",
      tags: ["ASP.NET Core", "Angular", "SQL Server"],
      color: T.pink,
    },
    {
      name: "Accounts Payable – KOSTT",
      period: "2023 – 2025",
      desc: "Enterprise AP financial system for Kosovo's electricity transmission operator — invoice lifecycle, journal posting, payment orders, bank reconciliation, employee advances, and multi-currency support.",
      tags: ["ASP.NET MVC", "SQL Server", "RBAC"],
      color: T.yellow,
    },
  ];

  return (
    <div style={{ padding: 20, fontFamily: "'Outfit', sans-serif" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {projects.map((p) => (
          <div key={p.name} style={{
            padding: 16, borderRadius: 12,
            background: T.barBg, border: `1px solid ${T.border}`,
            transition: "transform 0.2s, box-shadow 0.2s",
            cursor: "default",
            borderLeft: `3px solid ${p.color}`,
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.3)`; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{ fontWeight: 700, fontSize: 13, color: p.color, marginBottom: 4 }}>{p.name}</div>
            <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 8, fontFamily: "'JetBrains Mono', monospace" }}>{p.period}</div>
            <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.6, marginBottom: 10 }}>{p.desc}</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {p.tags.map((tag) => (
                <span key={tag} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: `${p.color}18`, border: `1px solid ${p.color}40`, color: p.color }}>{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── EDUCATION PANEL ───────────────────────────────────────────────────────────
function EduC({ theme }) {
  const T = THEMES[theme];
  const edu = [
    {
      icon: "🎓",
      degree: "MSc Computer Science Engineering",
      school: "UBT",
      period: "10/2025 – Present",
      active: true,
    },
    {
      icon: "🎓",
      degree: "B.Sc Computer Science – Software Engineering",
      school: "Riinvest College",
      period: "10/2018 – 07/2022",
      active: false,
    },
  ];

  return (
    <div style={{ padding: 24, fontFamily: "'Outfit', sans-serif", display: "flex", flexDirection: "column", gap: 16 }}>
      {edu.map((e, i) => (
        <div key={i} style={{
          padding: 20, borderRadius: 14, background: T.barBg,
          border: `1px solid ${e.active ? T.accent : T.border}`,
          boxShadow: e.active ? `0 0 16px ${T.glowColor}` : "none",
          position: "relative",
        }}>
          {e.active && (
            <span style={{
              position: "absolute", top: 14, right: 14,
              fontSize: 10, padding: "2px 10px", borderRadius: 10,
              background: T.accentGlow, color: T.accent, fontFamily: "'JetBrains Mono', monospace",
              border: `1px solid ${T.accent}`,
            }}>IN PROGRESS</span>
          )}
          <div style={{ fontSize: 32, marginBottom: 10 }}>{e.icon}</div>
          <div style={{ fontWeight: 700, fontSize: 16, color: e.active ? T.accent : T.text, marginBottom: 4 }}>{e.degree}</div>
          <div style={{ color: T.accent2, fontSize: 14, marginBottom: 6 }}>{e.school}</div>
          <div style={{ color: T.textMuted, fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>{e.period}</div>
        </div>
      ))}
    </div>
  );
}

// ─── CONTACT PANEL ─────────────────────────────────────────────────────────────
function ContactC({ theme }) {
  const T = THEMES[theme];
  const items = [
    { icon: "✉", label: "Email", value: "eugen.sekiraqa1@gmail.com", href: "mailto:eugen.sekiraqa1@gmail.com" },
    { icon: "📱", label: "Phone", value: "+383 49 140560", href: "tel:+38349140560" },
    { icon: "📍", label: "Location", value: "Prishtina, Kosovo", href: null },
    { icon: "💼", label: "LinkedIn", value: "linkedin.com/in/eugen-sekiraqa-76b597210", href: "https://linkedin.com/in/eugen-sekiraqa-76b597210" },
    { icon: "🐙", label: "GitHub", value: "github.com/eugen-sekiraqa", href: "https://github.com/eugen-sekiraqa" },
  ];

  return (
    <div style={{ padding: 32, fontFamily: "'Outfit', sans-serif", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div style={{ width: 60, height: 60, borderRadius: "50%", background: `linear-gradient(135deg, ${T.accent}, ${T.accent2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 8, boxShadow: `0 0 20px ${T.accentGlow}` }}>ES</div>
      <div style={{ color: T.text, fontSize: 18, fontWeight: 700 }}>Get In Touch</div>
      <div style={{ color: T.textMuted, fontSize: 13, textAlign: "center", maxWidth: 320 }}>
        Open to new opportunities. Feel free to reach out about projects or collaboration.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 340 }}>
        {items.map((item) => (
          <a key={item.label} href={item.href || "#"} target={item.href ? "_blank" : undefined} rel="noopener noreferrer" style={{
            display: "flex", alignItems: "center", gap: 14, padding: "14px 18px",
            borderRadius: 12, background: T.barBg, border: `1px solid ${T.border}`,
            textDecoration: "none", color: T.text,
            transition: "border-color 0.2s, background 0.2s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.background = T.surface; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = T.barBg; }}
          >
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <div>
              <div style={{ fontSize: 11, color: T.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>{item.label}</div>
              <div style={{ fontSize: 14, color: T.accent }}>{item.value}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── THEME PICKER ──────────────────────────────────────────────────────────────
function ThemeC({ theme, setTheme }) {
  return (
    <div style={{ padding: 24, fontFamily: "'Outfit', sans-serif" }}>
      <div style={{ color: THEMES[theme].textMuted, fontSize: 13, marginBottom: 20 }}>Choose your color scheme:</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {Object.values(THEMES).map((T) => (
          <div
            key={T.name}
            onClick={() => setTheme(T.name)}
            style={{
              padding: "16px 20px", borderRadius: 12, cursor: "pointer",
              background: theme === T.name ? T.barBg : "transparent",
              border: `2px solid ${theme === T.name ? T.accent : T.border}`,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              transition: "all 0.2s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ display: "flex", gap: 6 }}>
                {[T.accent, T.accent2, T.accent3].map((c, i) => (
                  <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", background: c }} />
                ))}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: T.text }}>{T.name}</div>
                <div style={{ fontSize: 11, color: T.textMuted }}>{T.name === "Midnight" ? "Deep blue hacker aesthetic" : T.name === "Aurora" ? "Purple northern lights" : "Warm dark ember glow"}</div>
              </div>
            </div>
            {theme === T.name && <span style={{ color: T.accent, fontSize: 18 }}>✓</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CONTEXT MENU ──────────────────────────────────────────────────────────────
function ContextMenu({ x, y, theme, onAction, onClose }) {
  const T = THEMES[theme];
  const items = [
    { label: "Open Terminal", action: "terminal" },
    { label: "About Eugen", action: "profile" },
    { label: "View Projects", action: "projects" },
    null,
    { label: "Change Theme", action: "theme" },
    { label: "Play Snake 🐍", action: "game" },
  ];

  useEffect(() => {
    const close = () => onClose();
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  return (
    <div style={{
      position: "fixed", left: x, top: y, zIndex: 7000,
      background: T.surfaceAlt, border: `1px solid ${T.border}`,
      borderRadius: 10, padding: "6px 0", minWidth: 180,
      backdropFilter: "blur(20px)",
      boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${T.glowColor}`,
      fontFamily: "'Outfit', sans-serif",
    }}>
      {items.map((item, i) =>
        item === null ? (
          <div key={i} style={{ height: 1, background: T.border, margin: "4px 0" }} />
        ) : (
          <div
            key={i}
            onClick={(e) => { e.stopPropagation(); onAction(item.action); onClose(); }}
            style={{ padding: "8px 16px", fontSize: 13, color: T.text, cursor: "pointer", transition: "background 0.15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = T.barBg; e.currentTarget.style.color = T.accent; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.text; }}
          >
            {item.label}
          </div>
        )
      )}
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
const WIN_DEFS = {
  profile:   { title: "Profile", icon: I.profile,   pos: { x: 60, y: 60 },    size: { w: 440, h: 480 } },
  work:      { title: "Work",    icon: I.work,       pos: { x: 130, y: 80 },   size: { w: 520, h: 520 } },
  skills:    { title: "Skills",  icon: I.skills,     pos: { x: 200, y: 90 },   size: { w: 480, h: 560 } },
  projects:  { title: "Projects",icon: I.projects,   pos: { x: 160, y: 70 },   size: { w: 600, h: 520 } },
  education: { title: "Education",icon: I.education, pos: { x: 180, y: 100 },  size: { w: 440, h: 360 } },
  contact:   { title: "Contact", icon: I.contact,    pos: { x: 220, y: 120 },  size: { w: 400, h: 420 } },
  terminal:  { title: "Terminal",icon: I.terminal,   pos: { x: 100, y: 150 },  size: { w: 600, h: 420 } },
  theme:     { title: "Themes",  icon: I.theme,      pos: { x: 240, y: 140 },  size: { w: 380, h: 360 } },
  game:      { title: "Snake",   icon: I.game,       pos: { x: 300, y: 80 },   size: { w: 380, h: 520 } },
  music:     { title: "Music",   icon: I.music,      pos: { x: 260, y: 100 },  size: { w: 400, h: 500 } },
};

const DESKTOP_ICONS = ["profile", "work", "skills", "projects", "education", "contact", "terminal"];
const DOCK_ICONS = ["profile", "work", "skills", "projects", "education", "contact", "terminal", "theme", "game", "music"];

export default function EugenOS() {
  const [booted, setBooted] = useState(false);
  const [theme, setTheme] = useState("Midnight");
  const isMobile = useMobile();
  const [windows, setWindows] = useState({});
  const [zOrder, setZOrder] = useState([]);
  const [zCounter, setZCounter] = useState(100);
  const [clock, setClock] = useState("");
  const [ctx, setCtx] = useState(null);
  const [notif, setNotif] = useState(null);
  const [hovered, setHovered] = useState(null);

  const T = THEMES[theme];

  // Lock body scroll on desktop, allow it on mobile
  useEffect(() => {
    if (isMobile) {
      document.body.classList.remove("desktop-mode");
    } else {
      document.body.classList.add("desktop-mode");
    }
    return () => document.body.classList.remove("desktop-mode");
  }, [isMobile]);

  // Clock
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock(d.toLocaleTimeString("en-GB"));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // On boot complete
  const onBooted = () => {
    setBooted(true);
    openWin("profile");
    setTimeout(() => setNotif("Welcome to EugenOS v1.0.0 👋"), 500);
  };

  const openWin = (id) => {
    const def = WIN_DEFS[id];
    if (!def) return;
    setZCounter((z) => z + 1);
    setWindows((w) => ({
      ...w,
      [id]: { ...def, id, zIdx: zCounter + 1, open: true },
    }));
    setZOrder((o) => [...o.filter((x) => x !== id), id]);
  };

  const closeWin = (id) => {
    setWindows((w) => { const nw = { ...w }; delete nw[id]; return nw; });
    setZOrder((o) => o.filter((x) => x !== id));
  };

  const focusWin = (id) => {
    setZCounter((z) => {
      const nz = z + 1;
      setWindows((w) => ({ ...w, [id]: { ...w[id], zIdx: nz } }));
      return nz;
    });
    setZOrder((o) => [...o.filter((x) => x !== id), id]);
  };

  const handleCtxAction = (action) => {
    if (action === "theme") openWin("theme");
    else openWin(action);
  };

  const onContextMenu = (e) => {
    e.preventDefault();
    setCtx({ x: Math.min(e.clientX, window.innerWidth - 200), y: Math.min(e.clientY, window.innerHeight - 260) });
  };

  const renderContent = (id) => {
    switch (id) {
      case "profile": return <ProfileC theme={theme} />;
      case "work": return <WorkC theme={theme} />;
      case "skills": return <SkillsC theme={theme} />;
      case "projects": return <ProjectsC theme={theme} />;
      case "education": return <EduC theme={theme} />;
      case "contact": return <ContactC theme={theme} />;
      case "terminal": return <TerminalWin theme={theme} />;
      case "theme": return <ThemeC theme={theme} setTheme={setTheme} />;
      case "game": return <SnakeGame theme={theme} />;
      case "music": return <MusicViz theme={theme} />;
      default: return null;
    }
  };

  if (!booted) return <BootScreen onDone={onBooted} theme={theme} />;

  if (isMobile) return <MobileApp theme={theme} setTheme={setTheme} />;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Outfit:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: ${T.accent}; }
        input[type=range]::-webkit-slider-thumb { accent-color: ${T.accent}; }
        @keyframes slideInN { from { opacity:0; transform: translateX(60px); } to { opacity:1; transform: translateX(0); } }
        @keyframes slideOutN { from { opacity:1; transform: translateX(0); } to { opacity:0; transform: translateX(60px); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        @keyframes floatA { 0%,100% { transform: translate(0,0) scale(1); opacity:0.6; } 33% { transform: translate(40px,-30px) scale(1.1); opacity:0.8; } 66% { transform: translate(-20px,20px) scale(0.95); opacity:0.5; } }
        @keyframes floatB { 0%,100% { transform: translate(0,0) scale(1); opacity:0.5; } 40% { transform: translate(-50px,30px) scale(1.08); opacity:0.7; } 70% { transform: translate(30px,-20px) scale(0.9); opacity:0.4; } }
        @keyframes floatC { 0%,100% { transform: translate(0,0) scale(1); opacity:0.45; } 50% { transform: translate(60px,40px) scale(1.15); opacity:0.65; } }
      `}</style>

      {/* Background */}
      <div
        style={{ position: "fixed", inset: 0, background: T.bgGrad, zIndex: -3 }}
        onContextMenu={onContextMenu}
      />
      {/* Grid */}
      <div style={{
        position: "fixed", inset: 0, zIndex: -2, pointerEvents: "none",
        backgroundImage: `linear-gradient(${T.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${T.gridColor} 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />
      {/* Orbs */}
      {[
        { top: "10%", left: "15%", size: 500, color: T.accent, anim: "floatA 14s ease-in-out infinite" },
        { top: "50%", left: "70%", size: 400, color: T.accent2, anim: "floatB 18s ease-in-out infinite" },
        { top: "70%", left: "20%", size: 350, color: T.accent3, anim: "floatC 12s ease-in-out infinite" },
        { top: "20%", left: "80%", size: 300, color: T.orange, anim: "floatA 20s ease-in-out infinite reverse" },
        { top: "80%", left: "60%", size: 280, color: T.pink, anim: "floatB 16s ease-in-out infinite reverse" },
      ].map((orb, i) => (
        <div key={i} style={{
          position: "fixed", top: orb.top, left: orb.left, zIndex: -1, pointerEvents: "none",
          width: orb.size, height: orb.size, borderRadius: "50%",
          background: `radial-gradient(circle, ${orb.color}22 0%, transparent 70%)`,
          animation: orb.anim,
        }} />
      ))}
      <Particles color={T.particle} />

      {/* Top bar */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 34, zIndex: 6000,
        background: T.dockBg, backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${T.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 18px", fontFamily: "'JetBrains Mono', monospace",
      }}>
        <span style={{ color: T.accent, fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>
          EugenOS <span style={{ color: T.textMuted, fontWeight: 400, fontSize: 11 }}>v1.0</span>
        </span>
        <span style={{ color: T.textMuted, fontSize: 12 }}>
          📍 Prishtina, Kosovo &nbsp;&nbsp; <span style={{ color: T.accent }}>{clock}</span>
        </span>
      </div>

      {/* Desktop */}
      <div
        style={{ position: "fixed", inset: 0, paddingTop: 34, paddingBottom: 72, zIndex: 1 }}
        onContextMenu={onContextMenu}
      >
        {/* Desktop icons */}
        <div style={{ position: "absolute", top: 50, left: 18, display: "flex", flexDirection: "column", gap: 6 }}>
          {DESKTOP_ICONS.map((id) => {
            const def = WIN_DEFS[id];
            const isOpen = !!windows[id];
            return (
              <div
                key={id}
                onClick={() => isOpen ? focusWin(id) : openWin(id)}
                onMouseEnter={() => setHovered("di-" + id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                  cursor: "pointer", padding: "8px 10px", borderRadius: 10,
                  background: hovered === "di-" + id ? T.barBg : "transparent",
                  border: `1px solid ${hovered === "di-" + id ? T.border : "transparent"}`,
                  transition: "all 0.15s", width: 62,
                }}
              >
                <div style={{ color: isOpen ? T.accent : T.textMuted, transition: "color 0.15s" }}>
                  {def.icon}
                </div>
                <span style={{ fontSize: 10, color: isOpen ? T.accent : T.textMuted, textAlign: "center", fontFamily: "'JetBrains Mono', monospace" }}>
                  {def.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Windows */}
        {Object.values(windows).map((w) => (
          <Win
            key={w.id}
            id={w.id}
            title={w.title}
            icon={w.icon}
            theme={theme}
            pos={w.pos}
            size={w.size}
            zIdx={w.zIdx}
            onFocus={() => focusWin(w.id)}
            onClose={() => closeWin(w.id)}
          >
            {renderContent(w.id)}
          </Win>
        ))}
      </div>

      {/* Dock */}
      <div style={{
        position: "fixed", bottom: 10, left: "50%", transform: "translateX(-50%)",
        zIndex: 6000, display: "flex", alignItems: "flex-end", gap: 6,
        padding: "8px 14px", borderRadius: 18,
        background: T.dockBg, backdropFilter: "blur(24px)",
        border: `1px solid ${T.border}`,
        boxShadow: `0 4px 32px rgba(0,0,0,0.5), 0 0 20px ${T.glowColor}`,
      }}>
        {DOCK_ICONS.map((id, idx) => {
          const def = WIN_DEFS[id];
          const isOpen = !!windows[id];
          const isHov = hovered === "dock-" + id;
          if (id === "theme" && idx === DOCK_ICONS.indexOf("theme")) {
            return (
              <div key="sep" style={{ display: "contents" }}>
                <div style={{ width: 1, height: 32, background: T.border, margin: "0 4px" }} />
                <DockIcon id={id} def={def} isOpen={isOpen} isHov={isHov} T={T}
                  onEnter={() => setHovered("dock-" + id)} onLeave={() => setHovered(null)}
                  onClick={() => isOpen ? focusWin(id) : openWin(id)} />
              </div>
            );
          }
          return (
            <DockIcon key={id} id={id} def={def} isOpen={isOpen} isHov={isHov} T={T}
              onEnter={() => setHovered("dock-" + id)} onLeave={() => setHovered(null)}
              onClick={() => isOpen ? focusWin(id) : openWin(id)} />
          );
        })}
      </div>

      {/* Context menu */}
      {ctx && (
        <ContextMenu x={ctx.x} y={ctx.y} theme={theme} onAction={handleCtxAction} onClose={() => setCtx(null)} />
      )}

      {/* Notification */}
      {notif && <Notif text={notif} theme={theme} onDone={() => setNotif(null)} />}
    </>
  );
}

function DockIcon({ id, def, isOpen, isHov, T, onEnter, onLeave, onClick }) {
  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer",
        transform: isHov ? "translateY(-10px) scale(1.2)" : "scale(1)",
        transition: "transform 0.18s ease",
        position: "relative",
      }}
      title={def.title}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: isOpen ? T.barBg : T.surface,
        border: `1px solid ${isOpen ? T.accent : T.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: isOpen ? T.accent : T.textMuted,
        boxShadow: isOpen ? `0 0 12px ${T.accentGlow}` : "none",
        transition: "all 0.18s",
      }}>
        {def.icon}
      </div>
      {isOpen && (
        <div style={{ width: 4, height: 4, borderRadius: "50%", background: T.accent, marginTop: 2, animation: "pulse 1s infinite" }} />
      )}
      {isHov && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 10px)", left: "50%", transform: "translateX(-50%)",
          background: T.surfaceAlt, border: `1px solid ${T.border}`,
          borderRadius: 6, padding: "4px 10px", fontSize: 11,
          color: T.text, whiteSpace: "nowrap",
          fontFamily: "'JetBrains Mono', monospace",
          boxShadow: `0 4px 16px rgba(0,0,0,0.4)`,
          pointerEvents: "none",
        }}>
          {def.title}
        </div>
      )}
    </div>
  );
}

// ─── MOBILE APP ────────────────────────────────────────────────────────────────
function useMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return mobile;
}

const MOBILE_CARDS = [
  { id: "profile",   emoji: "👤", label: "Profile",   desc: "About me" },
  { id: "work",      emoji: "💼", label: "Work",       desc: "Experience" },
  { id: "skills",    emoji: "⚡", label: "Skills",     desc: "Tech stack" },
  { id: "projects",  emoji: "📁", label: "Projects",   desc: "What I built" },
  { id: "education", emoji: "🎓", label: "Education",  desc: "Degrees" },
  { id: "contact",   emoji: "✉",  label: "Contact",    desc: "Get in touch" },
  { id: "terminal",  emoji: "⌨",  label: "Terminal",   desc: "CLI mode" },
  { id: "theme",     emoji: "🎨", label: "Themes",     desc: "Change look" },
  { id: "music",     emoji: "🎵", label: "Music",      desc: "Vibes" },
  { id: "game",      emoji: "🐍", label: "Snake",      desc: "Play a game" },
];

function MobileApp({ theme, setTheme }) {
  const T = THEMES[theme];
  const [open, setOpen] = useState(null);
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString("en-GB"));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const renderContent = (id) => {
    switch (id) {
      case "profile":   return <ProfileC theme={theme} />;
      case "work":      return <WorkC theme={theme} />;
      case "skills":    return <SkillsC theme={theme} />;
      case "projects":  return <ProjectsC theme={theme} />;
      case "education": return <EduC theme={theme} />;
      case "contact":   return <ContactC theme={theme} />;
      case "terminal":  return <TerminalWin theme={theme} />;
      case "theme":     return <ThemeC theme={theme} setTheme={setTheme} />;
      case "game":      return <SnakeGame theme={theme} />;
      case "music":     return <MusicViz theme={theme} />;
      default:          return null;
    }
  };

  const openCard = MOBILE_CARDS.find((c) => c.id === open);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Outfit:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 10px; }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes floatA { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(20px,-15px) scale(1.05); } }
        @keyframes floatB { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-20px,15px) scale(0.97); } }
      `}</style>

      {/* Background */}
      <div style={{ position: "fixed", inset: 0, background: T.bgGrad, zIndex: -2 }} />
      <div style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none",
        backgroundImage: `linear-gradient(${T.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${T.gridColor} 1px, transparent 1px)`,
        backgroundSize: "40px 40px" }} />
      {[
        { top: "5%",  left: "10%", size: 280, color: T.accent,  anim: "floatA 12s ease-in-out infinite" },
        { top: "55%", left: "60%", size: 220, color: T.accent2, anim: "floatB 16s ease-in-out infinite" },
      ].map((orb, i) => (
        <div key={i} style={{ position: "fixed", top: orb.top, left: orb.left, zIndex: -1, pointerEvents: "none",
          width: orb.size, height: orb.size, borderRadius: "50%",
          background: `radial-gradient(circle, ${orb.color}22 0%, transparent 70%)`,
          animation: orb.anim }} />
      ))}

      {/* Status bar */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 44, zIndex: 6000,
        background: T.dockBg, backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${T.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 18px", fontFamily: "'JetBrains Mono', monospace",
      }}>
        <span style={{ color: T.accent, fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>
          EugenOS <span style={{ color: T.textMuted, fontWeight: 400, fontSize: 10 }}>v1.0</span>
        </span>
        <span style={{ color: T.accent, fontSize: 12 }}>{clock}</span>
      </div>

      {/* Scrollable launcher */}
      <div style={{
        paddingTop: 56, paddingBottom: 80, minHeight: "100dvh",
        fontFamily: "'Outfit', sans-serif",
      }}>
        {/* Hero */}
        <div style={{ textAlign: "center", padding: "28px 24px 20px" }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%", margin: "0 auto 14px",
            background: `linear-gradient(135deg, ${T.accent}, ${T.accent2})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 26, fontWeight: 800, color: T.bg,
            boxShadow: `0 0 28px ${T.accentGlow}`,
          }}>ES</div>
          <div style={{ color: T.text, fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Eugen Sekiraqa</div>
          <div style={{ color: T.accent, fontSize: 12, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 1 }}>
            Software Developer · Prishtina, Kosovo
          </div>
        </div>

        {/* Cards grid */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 12, padding: "0 16px",
        }}>
          {MOBILE_CARDS.map((card) => (
            <div
              key={card.id}
              onClick={() => setOpen(card.id)}
              style={{
                background: T.surface, border: `1px solid ${T.border}`,
                borderRadius: 16, padding: "18px 14px",
                cursor: "pointer", backdropFilter: "blur(12px)",
                transition: "border-color 0.2s, transform 0.15s",
                display: "flex", flexDirection: "column", gap: 6,
              }}
              onTouchStart={(e) => e.currentTarget.style.transform = "scale(0.97)"}
              onTouchEnd={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <span style={{ fontSize: 26 }}>{card.emoji}</span>
              <div style={{ color: T.text, fontWeight: 700, fontSize: 15 }}>{card.label}</div>
              <div style={{ color: T.textMuted, fontSize: 12 }}>{card.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen sheet */}
      {open && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9000,
          background: T.windowBg, backdropFilter: "blur(24px)",
          display: "flex", flexDirection: "column",
          animation: "slideUp 0.3s ease",
        }}>
          {/* Sheet header */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 18px", borderBottom: `1px solid ${T.border}`,
            background: T.dockBg, backdropFilter: "blur(20px)",
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>{openCard?.emoji}</span>
              <span style={{ color: T.text, fontWeight: 700, fontSize: 16, fontFamily: "'Outfit', sans-serif" }}>
                {openCard?.label}
              </span>
            </div>
            <button
              onClick={() => setOpen(null)}
              style={{
                background: T.barBg, border: `1px solid ${T.border}`,
                color: T.text, borderRadius: 8, padding: "6px 14px",
                fontSize: 13, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
              }}
            >✕ Close</button>
          </div>
          {/* Sheet content */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {renderContent(open)}
          </div>
        </div>
      )}
    </>
  );
}
