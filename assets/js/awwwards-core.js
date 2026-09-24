/**
 * Awwwards-Tier Core Interactive Engine (God-Level Smooth + Hypnotic Relaxation Edition)
 * - Hypnotic Bioluminescent Bubbles & Calming Snow Flurry Canvas Engine
 * - Interactive Atmosphere Switcher (Aurora, Bubbles, Snow, Minimalist Off)
 * - Lenis Inertial 120 FPS Momentum Scrolling
 * - Dual-Tier High-Precision Magnetic Cursor (Dot + Spring Ring)
 * - Interactive Magnetic Button Physics
 * - Zero-Stutter 3D Perspective Tilt
 * - Global Command Palette (Cmd+K / Ctrl+K)
 * - Integrated Executive Resume Modal (Zero 404s)
 * - Tactile Web Audio Micro-Haptics
 */

(function () {
  "use strict";

  // ==========================================
  // 1. Hypnotic Relaxation Canvas Engine (Bubbles & Snow)
  // ==========================================
  const ATMOSPHERE_MODES = ["aurora", "bubbles", "snow", "vortex", "off"];
  let currentAtmoMode = localStorage.getItem("portfolio_atmosphere") || "aurora";
  let atmoCanvas = null;
  let atmoCtx = null;
  let atmoWidth = window.innerWidth;
  let atmoHeight = window.innerHeight;
  let atmoRAF = null;
  let mousePos = { x: -1000, y: -1000 };

  const MAX_SNOW = 65;
  const MAX_BUBBLES = 38;
  const snowFlakes = [];
  const bubbles = [];

  function initAtmosphereParticles() {
    snowFlakes.length = 0;
    bubbles.length = 0;

    // 1. Generate Zen Crystalline Snow Particles with Depth Layers
    for (let i = 0; i < MAX_SNOW; i++) {
      const layer = (i % 3); // 0: Far, 1: Mid, 2: Near
      snowFlakes.push({
        x: Math.random() * atmoWidth,
        y: Math.random() * atmoHeight,
        radius: layer === 2 ? Math.random() * 2.6 + 1.8 : layer === 1 ? Math.random() * 1.6 + 1.0 : Math.random() * 0.9 + 0.5,
        vy: layer === 2 ? Math.random() * 0.7 + 0.45 : layer === 1 ? Math.random() * 0.45 + 0.25 : Math.random() * 0.25 + 0.15,
        swingSpeed: Math.random() * 0.02 + 0.008,
        swingAmp: (layer + 1) * 0.8 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03,
        alpha: layer === 2 ? 0.75 : layer === 1 ? 0.5 : 0.3,
        layer: layer,
        twinkleSpeed: Math.random() * 0.025 + 0.015,
      });
    }

    // 2. Generate Hypnotic Bioluminescent Bubbles with Iridescent Halos
    const hues = [
      { r: 56, g: 189, b: 248 },   // Astral Cyan
      { r: 244, g: 63, b: 94 },    // Crimson Rose
      { r: 168, g: 85, b: 247 },   // Amethyst Violet
      { r: 52, g: 211, b: 153 },   // Quantum Emerald
      { r: 251, g: 191, b: 36 }    // Starlight Gold
    ];

    for (let i = 0; i < MAX_BUBBLES; i++) {
      const color = hues[i % hues.length];
      const baseR = Math.random() * 24 + 9;
      bubbles.push({
        x: Math.random() * atmoWidth,
        y: Math.random() * atmoHeight,
        baseRadius: baseR,
        radius: baseR,
        vy: -(Math.random() * 0.6 + 0.2), // Buoyant upward float
        swaySpeed: Math.random() * 0.018 + 0.008,
        swayAmp: Math.random() * 1.8 + 0.5,
        swayPhase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.025 + 0.015,
        pulsePhase: Math.random() * Math.PI * 2,
        color: color,
        alpha: Math.random() * 0.35 + 0.25,
        targetVx: 0,
        targetVy: 0,
        vx: 0
      });
    }
  }

  function renderAtmosphere(now) {
    if (!atmoCtx) return;
    atmoCtx.clearRect(0, 0, atmoWidth, atmoHeight);

    const time = now * 0.001;

    // --- DRAW HYPNOTIC VORTEX & SACRED HARMONIC WAVES (if active) ---
    if (currentAtmoMode === "vortex" || currentAtmoMode === "aurora") {
      const vAlpha = currentAtmoMode === "vortex" ? 1.0 : 0.35;
      const vCx = atmoWidth * 0.5;
      const vCy = atmoHeight * 0.45;
      const baseDim = Math.min(atmoWidth, atmoHeight);

      atmoCtx.save();
      atmoCtx.translate(vCx, vCy);

      // Concentric breathing Fibonacci vortex rings
      const rings = currentAtmoMode === "vortex" ? 8 : 4;
      for (let r = 1; r <= rings; r++) {
        const radius = (r / rings) * (baseDim * 0.42);
        const breath = Math.sin(time * 0.75 + r * 0.8) * 12;
        const curR = Math.max(4, radius + breath);
        const spin = time * 0.15 * (r % 2 === 0 ? 1 : -1) + (r * 0.4);

        atmoCtx.beginPath();
        const petals = 6 + (r % 3) * 2;
        for (let p = 0; p <= petals * 4; p++) {
          const theta = (p / (petals * 4)) * Math.PI * 2;
          const rWobble = curR + Math.sin(theta * petals + spin) * (curR * 0.06);
          const px = Math.cos(theta) * rWobble;
          const py = Math.sin(theta) * rWobble;
          if (p === 0) atmoCtx.moveTo(px, py);
          else atmoCtx.lineTo(px, py);
        }
        atmoCtx.closePath();

        const strokeAlpha = (0.045 + 0.035 * Math.sin(time + r)) * vAlpha;
        atmoCtx.strokeStyle = r % 2 === 0 ? `rgba(0, 240, 255, ${strokeAlpha.toFixed(3)})` : `rgba(244, 63, 94, ${strokeAlpha.toFixed(3)})`;
        atmoCtx.lineWidth = 1.0;
        atmoCtx.stroke();
      }
      atmoCtx.restore();
    }

    // --- DRAW ZEN CRYSTALLINE SNOW PARTICLES (if active) ---
    if (currentAtmoMode === "aurora" || currentAtmoMode === "snow") {
      for (let i = 0; i < snowFlakes.length; i++) {
        const s = snowFlakes[i];
        s.y += s.vy;
        s.x += Math.sin(time * s.swingSpeed + s.phase) * s.swingAmp;
        s.rotation += s.rotSpeed;

        if (s.y > atmoHeight + 10) {
          s.y = -10;
          s.x = Math.random() * atmoWidth;
        }
        if (s.x > atmoWidth + 10) s.x = -10;
        if (s.x < -10) s.x = atmoWidth + 10;

        const currentAlpha = s.alpha * (0.8 + Math.sin(time * s.twinkleSpeed) * 0.2);

        atmoCtx.save();
        atmoCtx.translate(s.x, s.y);
        atmoCtx.rotate(s.rotation);

        if (s.layer === 2) {
          // Foreground delicate 6-point crystal starlet
          atmoCtx.beginPath();
          for (let arm = 0; arm < 3; arm++) {
            atmoCtx.moveTo(-s.radius, 0);
            atmoCtx.lineTo(s.radius, 0);
            atmoCtx.rotate(Math.PI / 3);
          }
          atmoCtx.strokeStyle = `rgba(255, 255, 255, ${currentAlpha.toFixed(2)})`;
          atmoCtx.lineWidth = 1.0;
          atmoCtx.stroke();
        } else {
          // Mid & far soft circular crystal
          atmoCtx.beginPath();
          atmoCtx.arc(0, 0, s.radius, 0, Math.PI * 2);
          atmoCtx.fillStyle = `rgba(226, 232, 240, ${currentAlpha.toFixed(2)})`;
          atmoCtx.fill();
        }

        atmoCtx.restore();
      }
    }

    // --- DRAW BIOLUMINESCENT BUBBLES (if active) ---
    if (currentAtmoMode === "aurora" || currentAtmoMode === "bubbles" || currentAtmoMode === "vortex") {
      const bLimit = currentAtmoMode === "vortex" ? Math.floor(bubbles.length * 0.5) : bubbles.length;
      for (let i = 0; i < bLimit; i++) {
        const b = bubbles[i];

        // Buoyant upward motion with gentle harmonic sway
        b.y += b.vy;
        b.x += Math.cos(time * b.swaySpeed + b.swayPhase) * b.swayAmp + b.vx;
        b.vx *= 0.94; // Dissipate external repulsion velocity

        // Organic gentle pulse
        b.radius = b.baseRadius + Math.sin(time * b.pulseSpeed + b.pulsePhase) * (b.baseRadius * 0.12);

        // Tactile interactive mouse & touch repulsion physics
        const dx = b.x - mousePos.x;
        const dy = b.y - mousePos.y;
        const dist = Math.hypot(dx, dy);
        const repelRadius = 120;

        if (dist < repelRadius && dist > 1) {
          const force = (repelRadius - dist) / repelRadius;
          const angle = Math.atan2(dy, dx);
          b.vx += Math.cos(angle) * force * 2.2;
          b.y += Math.sin(angle) * force * 2.2;
        }

        // Wrap around screen boundaries seamlessly
        if (b.y < -b.baseRadius * 2) {
          b.y = atmoHeight + b.baseRadius * 2;
          b.x = Math.random() * atmoWidth;
        }
        if (b.x < -b.baseRadius * 2) b.x = atmoWidth + b.baseRadius * 2;
        if (b.x > atmoWidth + b.baseRadius * 2) b.x = -b.baseRadius * 2;

        // Render multi-layered glowing bubble
        atmoCtx.save();
        atmoCtx.beginPath();
        atmoCtx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);

        // Iridescent Translucent Center Fill
        const grad = atmoCtx.createRadialGradient(
          b.x - b.radius * 0.3,
          b.y - b.radius * 0.3,
          b.radius * 0.1,
          b.x,
          b.y,
          b.radius
        );
        grad.addColorStop(0, `rgba(255, 255, 255, ${(b.alpha * 0.8).toFixed(2)})`);
        grad.addColorStop(0.5, `rgba(${b.color.r}, ${b.color.g}, ${b.color.b}, ${(b.alpha * 0.28).toFixed(2)})`);
        grad.addColorStop(1, `rgba(${b.color.r}, ${b.color.g}, ${b.color.b}, ${(b.alpha * 0.68).toFixed(2)})`);

        atmoCtx.fillStyle = grad;
        atmoCtx.fill();

        // Glowing outer boundary rim
        atmoCtx.lineWidth = 1.3;
        atmoCtx.strokeStyle = `rgba(${b.color.r}, ${b.color.g}, ${b.color.b}, ${(b.alpha * 0.95).toFixed(2)})`;
        atmoCtx.stroke();

        // High-gloss specular reflection dot
        atmoCtx.beginPath();
        atmoCtx.arc(b.x - b.radius * 0.38, b.y - b.radius * 0.38, Math.max(b.radius * 0.18, 1.5), 0, Math.PI * 2);
        atmoCtx.fillStyle = "rgba(255, 255, 255, 0.9)";
        atmoCtx.fill();

        atmoCtx.restore();
      }
    }

    atmoRAF = requestAnimationFrame(renderAtmosphere);
  }

  function initAtmosphereEngine() {
    atmoCanvas = document.getElementById("relaxation-atmosphere-canvas");
    if (!atmoCanvas) {
      atmoCanvas = document.createElement("canvas");
      atmoCanvas.id = "relaxation-atmosphere-canvas";
      atmoCanvas.style.position = "fixed";
      atmoCanvas.style.top = "0";
      atmoCanvas.style.left = "0";
      atmoCanvas.style.width = "100vw";
      atmoCanvas.style.height = "100vh";
      atmoCanvas.style.pointerEvents = "none";
      atmoCanvas.style.zIndex = "3";
      document.body.appendChild(atmoCanvas);
    }

    atmoCtx = atmoCanvas.getContext("2d");

    function resizeAtmo() {
      atmoWidth = window.innerWidth;
      atmoHeight = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      atmoCanvas.width = atmoWidth * dpr;
      atmoCanvas.height = atmoHeight * dpr;
      atmoCtx.scale(dpr, dpr);
      initAtmosphereParticles();
    }

    resizeAtmo();
    window.addEventListener("resize", resizeAtmo, { passive: true });

    // Touch & pointer support across desktop, tablet, and mobile
    window.addEventListener("mousemove", (e) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    }, { passive: true });

    window.addEventListener("touchmove", (e) => {
      if (e.touches && e.touches.length > 0) {
        mousePos.x = e.touches[0].clientX;
        mousePos.y = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener("touchstart", (e) => {
      if (e.touches && e.touches.length > 0) {
        mousePos.x = e.touches[0].clientX;
        mousePos.y = e.touches[0].clientY;
      }
    }, { passive: true });

    if (currentAtmoMode !== "off") {
      atmoRAF = requestAnimationFrame(renderAtmosphere);
    }

    // Pause when tab not visible to save CPU/GPU
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        if (atmoRAF) cancelAnimationFrame(atmoRAF);
      } else if (currentAtmoMode !== "off") {
        atmoRAF = requestAnimationFrame(renderAtmosphere);
      }
    });

    initAtmosphereSwitcherUI();
  }

  function setAtmosphereMode(newMode) {
    if (!ATMOSPHERE_MODES.includes(newMode)) return;
    currentAtmoMode = newMode;
    localStorage.setItem("portfolio_atmosphere", newMode);

    if (newMode === "off") {
      if (atmoRAF) {
        cancelAnimationFrame(atmoRAF);
        atmoRAF = null;
      }
      if (atmoCtx) atmoCtx.clearRect(0, 0, atmoWidth, atmoHeight);
    } else {
      if (!atmoRAF) {
        atmoRAF = requestAnimationFrame(renderAtmosphere);
      }
    }

    updateAtmosphereButtonLabels();
    showToastNotification(`Relaxation Atmosphere: ${getModeLabel(newMode)}`);
    playMicroHaptic("click");
  }

  function getModeLabel(mode) {
    switch (mode) {
      case "aurora": return "🌌 Aurora (Bubbles & Snow)";
      case "bubbles": return "🫧 Bioluminescent Bubbles";
      case "snow": return "❄️ Zen Crystalline Snow";
      case "vortex": return "🌀 Hypnotic Vortex & Sacred Waves";
      case "off": return "🌙 Atmospheric Cleared";
      default: return mode;
    }
  }

  function updateAtmosphereButtonLabels() {
    const btns = document.querySelectorAll(".atmosphere-toggle-btn, #atmosphere-toggle-btn");
    btns.forEach((btn) => {
      const labelSpan = btn.querySelector(".atmo-mode-text");
      if (labelSpan) {
        switch (currentAtmoMode) {
          case "aurora": labelSpan.textContent = "Aurora"; break;
          case "bubbles": labelSpan.textContent = "Bubbles"; break;
          case "snow": labelSpan.textContent = "Snow"; break;
          case "vortex": labelSpan.textContent = "Vortex"; break;
          case "off": labelSpan.textContent = "Zen Off"; break;
        }
      }
      if (currentAtmoMode !== "off") {
        btn.classList.add("text-cyan-400", "border-cyan-500/40");
      } else {
        btn.classList.remove("text-cyan-400", "border-cyan-500/40");
      }
    });
  }

  function initAtmosphereSwitcherUI() {
    // Wire existing buttons in DOM
    document.querySelectorAll(".atmosphere-toggle-btn, #atmosphere-toggle-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const nextIdx = (ATMOSPHERE_MODES.indexOf(currentAtmoMode) + 1) % ATMOSPHERE_MODES.length;
        setAtmosphereMode(ATMOSPHERE_MODES[nextIdx]);
      });
    });

    updateAtmosphereButtonLabels();
  }

  // ==========================================
  // 2. Lenis Smooth Momentum Scrolling (120 FPS)
  // ==========================================
  function initSmoothScroll() {
    function startLenis() {
      if (typeof window.Lenis === "undefined") return;

      const lenis = new window.Lenis({
        duration: 1.25,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.4,
        infinite: false,
      });

      window.__lenis = lenis;

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
          const targetId = this.getAttribute("href");
          if (targetId && targetId !== "#") {
            const target = document.querySelector(targetId);
            if (target) {
              e.preventDefault();
              lenis.scrollTo(target, { offset: -60, duration: 1.4 });
            }
          }
        });
      });
    }

    if (typeof window.Lenis === "undefined") {
      const script = document.createElement("script");
      script.src = "assets/js/lenis.min.js";
      script.async = true;
      script.onload = startLenis;
      document.head.appendChild(script);
    } else {
      startLenis();
    }
  }

  // ==========================================
  // 3. Dual-Tier Luxury Magnetic Cursor (Desktop)
  // ==========================================
  function initUnifiedCursor() {
    if (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 1024) return;

    let dot = document.getElementById("custom-cursor-dot");
    let ring = document.getElementById("custom-cursor-ring");

    if (!dot) {
      dot = document.createElement("div");
      dot.id = "custom-cursor-dot";
      document.body.appendChild(dot);
    }
    if (!ring) {
      ring = document.createElement("div");
      ring.id = "custom-cursor-ring";
      document.body.appendChild(ring);
    }

    dot.style.position = "fixed";
    dot.style.top = "0";
    dot.style.left = "0";
    dot.style.width = "7px";
    dot.style.height = "7px";
    dot.style.backgroundColor = "#f43f5e";
    dot.style.borderRadius = "50%";
    dot.style.pointerEvents = "none";
    dot.style.zIndex = "100000";
    dot.style.transform = "translate3d(-100px, -100px, 0)";
    dot.style.boxShadow = "0 0 10px #f43f5e, 0 0 20px rgba(244, 63, 94, 0.6)";

    ring.style.position = "fixed";
    ring.style.top = "0";
    ring.style.left = "0";
    ring.style.width = "36px";
    ring.style.height = "36px";
    ring.style.border = "1.5px solid rgba(244, 63, 94, 0.45)";
    ring.style.borderRadius = "50%";
    ring.style.pointerEvents = "none";
    ring.style.zIndex = "99999";
    ring.style.transform = "translate3d(-100px, -100px, 0)";
    ring.style.transition = "width 0.25s cubic-bezier(0.16, 1, 0.3, 1), height 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s, background-color 0.2s";

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    }, { passive: true });

    function renderRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX.toFixed(1)}px, ${ringY.toFixed(1)}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(renderRing);
    }
    requestAnimationFrame(renderRing);

    function bindHoverTargets() {
      const targets = document.querySelectorAll("a, button, input, textarea, select, .glass-pill, .btn-action, .project-card, .spotlight-card, [role='button'], [data-magnetic]");
      targets.forEach((el) => {
        el.addEventListener("mouseenter", () => {
          ring.style.width = "54px";
          ring.style.height = "54px";
          ring.style.borderColor = "rgba(244, 63, 94, 0.85)";
          ring.style.backgroundColor = "rgba(244, 63, 94, 0.06)";
          dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(1.6)`;
        });
        el.addEventListener("mouseleave", () => {
          ring.style.width = "36px";
          ring.style.height = "36px";
          ring.style.borderColor = "rgba(244, 63, 94, 0.45)";
          ring.style.backgroundColor = "transparent";
          dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(1)`;
        });
      });
    }
    bindHoverTargets();

    document.addEventListener("mouseleave", () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    });
    document.addEventListener("mouseenter", () => {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    });
  }

  // ==========================================
  // 4. Magnetic Hover Physics on Interactive Elements
  // ==========================================
  function initMagneticButtons() {
    if (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 1024) return;

    const magneticElements = document.querySelectorAll(".glass-pill, .btn-action, [data-magnetic]");
    magneticElements.forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate3d(${x * 0.24}px, ${y * 0.24}px, 0)`;
        el.style.transition = "transform 0.08s ease-out";
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "translate3d(0, 0, 0)";
        el.style.transition = "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
      });
    });
  }

  // ==========================================
  // 5. Subtle 3D Perspective Tilt on Cards
  // ==========================================
  function init3DTilt() {
    const tiltElements = document.querySelectorAll(".tilt-card, .spotlight-card");
    tiltElements.forEach((el) => {
      let reqId = null;
      let rotX = 0, rotY = 0;

      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        el.style.setProperty("--mouse-x", `${x}px`);
        el.style.setProperty("--mouse-y", `${y}px`);

        const midX = rect.width / 2;
        const midY = rect.height / 2;
        rotX = ((y - midY) / midY) * -5.0;
        rotY = ((x - midX) / midX) * 5.0;

        if (!reqId) {
          reqId = requestAnimationFrame(() => {
            el.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`;
            reqId = null;
          });
        }
      });

      el.addEventListener("mouseleave", () => {
        if (reqId) cancelAnimationFrame(reqId);
        el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
        el.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
      });

      el.addEventListener("mouseenter", () => {
        el.style.transition = "none";
      });
    });
  }

  // ==========================================
  // 6. Tactile Web Audio Micro-Haptics
  // ==========================================
  let hapticAudioCtx = null;
  function playMicroHaptic(type) {
    try {
      if (!hapticAudioCtx) {
        hapticAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (hapticAudioCtx.state === "suspended") {
        hapticAudioCtx.resume();
      }

      const osc = hapticAudioCtx.createOscillator();
      const gain = hapticAudioCtx.createGain();

      if (type === "click") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, hapticAudioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(140, hapticAudioCtx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.04, hapticAudioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, hapticAudioCtx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(hapticAudioCtx.destination);
        osc.start();
        osc.stop(hapticAudioCtx.currentTime + 0.04);
      } else if (type === "hover") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(780, hapticAudioCtx.currentTime);
        gain.gain.setValueAtTime(0.015, hapticAudioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, hapticAudioCtx.currentTime + 0.03);
        osc.connect(gain);
        gain.connect(hapticAudioCtx.destination);
        osc.start();
        osc.stop(hapticAudioCtx.currentTime + 0.03);
      }
    } catch (e) {
      // Audio not permitted yet
    }
  }

  // ==========================================
  // 7. Interactive Executive Resume Modal (Eliminates 404)
  // ==========================================
  function initResumeModal() {
    let modal = document.getElementById("executive-resume-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "executive-resume-modal";
      modal.className = "fixed inset-0 z-[10005] bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 transition-all duration-300 opacity-0 pointer-events-none";
      modal.innerHTML = `
        <div class="relative w-full max-w-2xl bg-[#0b0f19] border border-white/15 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_35px_rgba(244,63,94,0.2)] overflow-hidden transform scale-95 transition-all duration-300">
          <div class="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-white font-syne text-lg font-bold">Aditya Soni &mdash; Official Resume</h3>
                <p class="text-xs font-mono text-slate-400">Systems Builder &bull; Full-Stack Developer (2026)</p>
              </div>
            </div>
            <button id="close-resume-modal-btn" class="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer" aria-label="Close Modal">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div class="p-6 space-y-5 text-xs text-slate-300">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                <span class="font-mono text-[10px] text-rose-400 uppercase tracking-wider block mb-1">Education</span>
                <span class="font-semibold text-white block">B.Tech CSE Core (2026–2030)</span>
                <span class="text-slate-400 text-[11px]">Rungta International Skills University</span>
              </div>
              <div class="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                <span class="font-mono text-[10px] text-cyan-400 uppercase tracking-wider block mb-1">Secondary School</span>
                <span class="font-semibold text-white block">Class 10th (CBSE Excellence)</span>
                <span class="text-slate-400 text-[11px]">Score: 92.0% (2024)</span>
              </div>
            </div>

            <div class="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
              <span class="font-mono text-[10px] text-emerald-400 uppercase tracking-wider block">Core Competencies</span>
              <p class="leading-relaxed">
                TypeScript, Go (Golang), Rust, React 19, Next.js 15, WebSockets, WebGL 2.0 / GLSL Shaders, Three.js, Redis Pub/Sub, Docker, PostgreSQL.
              </p>
            </div>

            <div class="flex items-center gap-2 text-slate-400 text-[11px] font-mono">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Direct Download Ready: Official Verified Vector PDF Available</span>
            </div>
          </div>

          <div class="p-6 bg-white/[0.02] border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <a href="resume.html" target="_blank" class="px-4 py-2.5 rounded-xl border border-white/20 text-white font-mono text-xs hover:bg-white/10 transition-all flex items-center gap-2">
              <svg class="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
              <span>View Interactive Web Version</span>
            </a>

            <div class="flex items-center gap-2">
              <a href="assets/resume.pdf" download="Aditya_Soni_Resume.pdf" class="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-mono text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(244,63,94,0.4)] flex items-center gap-2 font-semibold">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                <span>Download PDF (4.1 KB)</span>
              </a>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    function openResumeModal(e) {
      if (e) e.preventDefault();
      modal.classList.remove("opacity-0", "pointer-events-none");
      modal.classList.add("opacity-100", "pointer-events-auto");
      const box = modal.querySelector(".bg-\\[\\#0b0f19\\]");
      if (box) {
        box.classList.remove("scale-95");
        box.classList.add("scale-100");
      }
      playMicroHaptic("click");
    }

    function closeResumeModal() {
      modal.classList.remove("opacity-100", "pointer-events-auto");
      modal.classList.add("opacity-0", "pointer-events-none");
      const box = modal.querySelector(".bg-\\[\\#0b0f19\\]");
      if (box) {
        box.classList.remove("scale-100");
        box.classList.add("scale-95");
      }
    }

    document.querySelectorAll('a[href*="resume.pdf"], [data-open-resume]').forEach((link) => {
      link.addEventListener("click", openResumeModal);
    });

    const closeBtn = document.getElementById("close-resume-modal-btn");
    if (closeBtn) closeBtn.addEventListener("click", closeResumeModal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeResumeModal();
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.classList.contains("pointer-events-none")) {
        closeResumeModal();
      }
    });

    window.openResumeModal = openResumeModal;
  }

  // ==========================================
  // 8. Global Command Palette (Cmd+K / Ctrl+K)
  // ==========================================
  function initCommandPalette() {
    let paletteBackdrop = document.getElementById("cmd-palette-backdrop");
    if (!paletteBackdrop) {
      paletteBackdrop = document.createElement("div");
      paletteBackdrop.id = "cmd-palette-backdrop";
      paletteBackdrop.className = "cmd-palette-backdrop";
      paletteBackdrop.innerHTML = `
        <div class="cmd-palette-box" role="dialog" aria-modal="true">
          <div class="flex items-center px-4 border-b border-white/10">
            <svg class="w-5 h-5 text-rose-500 mr-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input type="text" id="cmd-input" class="cmd-input" placeholder="Search pages, modes, or commands... (Esc to close)" autocomplete="off">
            <span class="text-xs font-mono text-slate-400 bg-white/5 border border-white/10 px-2 py-1 rounded">ESC</span>
          </div>
          <div class="cmd-results" id="cmd-results">
            <a href="index.html" class="cmd-item">
              <span class="flex items-center gap-3">
                <span class="text-rose-400 font-mono text-xs">01</span>
                <span>Home &amp; Hero Showcase</span>
              </span>
              <span class="text-xs font-mono text-slate-500">Jump ↵</span>
            </a>
            <a href="about.html" class="cmd-item">
              <span class="flex items-center gap-3">
                <span class="text-rose-400 font-mono text-xs">02</span>
                <span>About &bull; Philosophy &amp; Rig</span>
              </span>
              <span class="text-xs font-mono text-slate-500">Jump ↵</span>
            </a>
            <a href="projects.html" class="cmd-item">
              <span class="flex items-center gap-3">
                <span class="text-rose-400 font-mono text-xs">03</span>
                <span>Curated Projects &amp; Architecture</span>
              </span>
              <span class="text-xs font-mono text-slate-500">Jump ↵</span>
            </a>
            <a href="skills.html" class="cmd-item">
              <span class="flex items-center gap-3">
                <span class="text-rose-400 font-mono text-xs">04</span>
                <span>Systems &amp; Skill Matrix (3D)</span>
              </span>
              <span class="text-xs font-mono text-slate-500">Jump ↵</span>
            </a>
            <a href="journey.html" class="cmd-item">
              <span class="flex items-center gap-3">
                <span class="text-rose-400 font-mono text-xs">05</span>
                <span>Interactive Journey &amp; Milestones</span>
              </span>
              <span class="text-xs font-mono text-slate-500">Jump ↵</span>
            </a>
            <a href="achievements.html" class="cmd-item">
              <span class="flex items-center gap-3">
                <span class="text-rose-400 font-mono text-xs">06</span>
                <span>Achievements &amp; Honors</span>
              </span>
              <span class="text-xs font-mono text-slate-500">Jump ↵</span>
            </a>
            <a href="signature.html" class="cmd-item">
              <span class="flex items-center gap-3">
                <span class="text-rose-400 font-mono text-xs">07</span>
                <span>Vector Signature Studio</span>
              </span>
              <span class="text-xs font-mono text-slate-500">Jump ↵</span>
            </a>
            <a href="contact.html" class="cmd-item">
              <span class="flex items-center gap-3">
                <span class="text-rose-400 font-mono text-xs">08</span>
                <span>Contact Terminal &amp; Direct Connect</span>
              </span>
              <span class="text-xs font-mono text-slate-500">Jump ↵</span>
            </a>
            <a href="intro.html" class="cmd-item">
              <span class="flex items-center gap-3">
                <span class="text-rose-400 font-mono text-xs">09</span>
                <span>Cinematic WebGL Intro Splash</span>
              </span>
              <span class="text-xs font-mono text-slate-500">Play ↵</span>
            </a>
            <div class="cmd-item" id="cmd-toggle-atmosphere">
              <span class="flex items-center gap-3">
                <span class="text-cyan-400 font-mono text-xs">✨</span>
                <span>Switch Relaxation Atmosphere (Bubbles / Snow)</span>
              </span>
              <span class="text-xs font-mono text-slate-500">Cycle ↵</span>
            </div>
            <div class="cmd-item" id="cmd-open-resume">
              <span class="flex items-center gap-3">
                <span class="text-rose-400 font-mono text-xs">📄</span>
                <span>View / Download Executive Resume</span>
              </span>
              <span class="text-xs font-mono text-slate-500">Action ↵</span>
            </div>
            <div class="cmd-item" id="cmd-copy-link">
              <span class="flex items-center gap-3">
                <span class="text-cyan-400 font-mono text-xs">🔗</span>
                <span>Copy Portfolio URL to Clipboard</span>
              </span>
              <span class="text-xs font-mono text-slate-500">Action ↵</span>
            </div>
          </div>
          <div class="px-4 py-3 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Navigation: ↑ ↓ Enter</span>
            <span>Aditya Soni Architecture Suite</span>
          </div>
        </div>
      `;
      document.body.appendChild(paletteBackdrop);
    }

    const input = document.getElementById("cmd-input");
    const results = document.getElementById("cmd-results");

    function openPalette() {
      paletteBackdrop.classList.add("active");
      if (input) {
        input.value = "";
        input.focus();
        filterCommands("");
      }
      playMicroHaptic("click");
    }

    function closePalette() {
      paletteBackdrop.classList.remove("active");
    }

    function filterCommands(q) {
      const items = results.querySelectorAll(".cmd-item");
      const filter = q.toLowerCase();
      items.forEach((item) => {
        const text = item.textContent.toLowerCase();
        if (text.includes(filter)) {
          item.style.display = "flex";
        } else {
          item.style.display = "none";
        }
      });
    }

    if (input) {
      input.addEventListener("input", (e) => filterCommands(e.target.value));
    }

    window.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (paletteBackdrop.classList.contains("active")) {
          closePalette();
        } else {
          openPalette();
        }
      }
      if (e.key === "Escape" && paletteBackdrop.classList.contains("active")) {
        closePalette();
      }
    });

    paletteBackdrop.addEventListener("click", (e) => {
      if (e.target === paletteBackdrop) closePalette();
    });

    // Wire cmd-toggle-atmosphere
    const cmdAtmo = document.getElementById("cmd-toggle-atmosphere");
    if (cmdAtmo) {
      cmdAtmo.addEventListener("click", () => {
        closePalette();
        const nextIdx = (ATMOSPHERE_MODES.indexOf(currentAtmoMode) + 1) % ATMOSPHERE_MODES.length;
        setAtmosphereMode(ATMOSPHERE_MODES[nextIdx]);
      });
    }

    // Wire cmd-open-resume
    const cmdResume = document.getElementById("cmd-open-resume");
    if (cmdResume) {
      cmdResume.addEventListener("click", () => {
        closePalette();
        if (window.openResumeModal) {
          window.openResumeModal();
        } else {
          window.location.href = "resume.html";
        }
      });
    }

    // Wire cmd-copy-link
    const copyLinkBtn = document.getElementById("cmd-copy-link");
    if (copyLinkBtn) {
      copyLinkBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(window.location.origin || window.location.href);
        const label = copyLinkBtn.querySelector("span:last-child");
        if (label) {
          label.textContent = "Copied!";
          setTimeout(() => {
            label.textContent = "Action ↵";
            closePalette();
          }, 1000);
        }
      });
    }

    document.querySelectorAll("[data-open-cmd]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        openPalette();
      });
    });
  }

  // ==========================================
  // 9. Toast Notification System
  // ==========================================
  function showToastNotification(msg) {
    let toast = document.getElementById("hud-toast-notification");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "hud-toast-notification";
      toast.className = "fixed bottom-8 left-1/2 -translate-x-1/2 z-[10002] px-5 py-3 rounded-full bg-slate-900/95 border border-cyan-500/40 backdrop-blur-2xl text-white font-mono text-xs flex items-center gap-3 shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(56,189,248,0.3)] transition-all duration-300 opacity-0 pointer-events-none translate-y-4";
      toast.innerHTML = `
        <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        <span id="hud-toast-text">${msg}</span>
      `;
      document.body.appendChild(toast);
    } else {
      const text = toast.querySelector("#hud-toast-text");
      if (text) text.textContent = msg;
    }

    toast.classList.remove("opacity-0", "translate-y-4", "pointer-events-none");
    toast.classList.add("opacity-100", "translate-y-0");

    clearTimeout(toast.__timer);
    toast.__timer = setTimeout(() => {
      toast.classList.remove("opacity-100", "translate-y-0");
      toast.classList.add("opacity-0", "translate-y-4", "pointer-events-none");
    }, 2400);
  }

  // ==========================================
  // 10. Safe Lucide Icon Creation
  // ==========================================
  function initLucideIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  // ==========================================
  // Master Initializer
  // ==========================================
  function initAwwwards() {
    initAtmosphereEngine();
    initSmoothScroll();
    initUnifiedCursor();
    initMagneticButtons();
    init3DTilt();
    initResumeModal();
    initCommandPalette();
    initLucideIcons();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAwwwards);
  } else {
    initAwwwards();
  }

  window.initLucideIcons = initLucideIcons;
  window.playMicroHaptic = playMicroHaptic;
  window.setAtmosphereMode = setAtmosphereMode;
  window.showToastNotification = showToastNotification;
})();
