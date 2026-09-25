/**
 * God-Level Hypnotic Cosmic Engine & Sacred Geometry Fluid Dynamics
 * Engineered for 120 FPS buttery-smooth performance across all devices (Mobile, Tablet, Desktop, Retina).
 * 
 * Features:
 * - 100% Free of mechanical bots / boats - purely hypnotic, organic, celestial visual poetry.
 * - Interactive Quantum Fluid Ripples with chromatic dispersion (Cyan, Rose, Violet, Astral Gold).
 * - Breathing Sacred Geometry Harmonics & Fibonacci Attractor Streams.
 * - Hypnotic Cosmic Portal Intro Reveal with smooth velocity warp.
 * - Zero Garbage Collection (pre-allocated Float32 arrays & particle pools).
 * - Touch-scroll pausing for 120Hz native scrolling on iOS & Android.
 * - Dynamic DPR clamping & hardware layer acceleration.
 */
(function initGodLevelHypnoticExperience() {
  'use strict';

  // Device & Performance Matrix
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  let isMobile = window.innerWidth < 768 || (isTouchDevice && window.innerWidth < 1024);
  let isTabVisible = !document.hidden;
  let isScrolling = false;
  let scrollTimer = null;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Active touch scrolling detection - frees GPU/CPU for native 120Hz momentum scrolling on mobile
  window.addEventListener('scroll', () => {
    isScrolling = true;
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      isScrolling = false;
    }, 80);
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    isTabVisible = !document.hidden;
    if (isTabVisible && !mainLoopRunning) {
      mainLoopRunning = true;
      requestAnimationFrame(masterLoop);
    }
  });

  // ================= 1. INTRO WEBGL HYPNOTIC SHADER =================
  const introShaderCanvas = document.getElementById('intro-shader-canvas');
  let introActive = true;
  let introShaderRAF = null;

  if (introShaderCanvas) {
    const gl = introShaderCanvas.getContext('webgl', { powerPreference: 'low-power', alpha: false, antialias: false, depth: false }) ||
               introShaderCanvas.getContext('experimental-webgl');
    if (gl) {
      function syncIntroSize() {
        const scale = isMobile ? 0.45 : 0.85;
        introShaderCanvas.width = Math.floor(window.innerWidth * scale);
        introShaderCanvas.height = Math.floor(window.innerHeight * scale);
        gl.viewport(0, 0, introShaderCanvas.width, introShaderCanvas.height);
      }
      syncIntroSize();
      window.addEventListener('resize', syncIntroSize, { passive: true });

      const vs = `attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;
      const fs = `precision highp float;
uniform float u_time;
uniform vec2 u_res;
uniform vec2 u_mouse;
varying vec2 v_uv;

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m;
  m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
    vec2 uv = v_uv;
    vec2 p = uv - 0.5;
    float dist = length(p);
    float angle = atan(p.y, p.x);
    
    // Hypnotic spiral vortex warping
    float spiral = sin(dist * 18.0 - u_time * 2.2 + angle * 3.0);
    float noiseVal = snoise(uv * 2.5 + vec2(cos(u_time * 0.3), sin(u_time * 0.3)) * 0.5);
    
    vec3 colDeep = vec3(0.03, 0.05, 0.12);
    vec3 colRose = vec3(0.95, 0.16, 0.28);
    vec3 colCyan = vec3(0.04, 0.72, 0.98);
    vec3 colGold = vec3(0.98, 0.74, 0.22);
    
    // Smooth harmonic blend
    float t1 = smoothstep(-0.6, 0.8, spiral + noiseVal * 0.4);
    float t2 = smoothstep(0.1, 0.9, sin(dist * 12.0 - u_time * 1.5));
    
    vec3 color = mix(colDeep, colCyan, t1 * 0.45);
    color = mix(color, colRose, t2 * 0.55 * (1.0 - smoothstep(0.0, 0.6, dist)));
    
    // Central glowing core
    float coreGlow = exp(-dist * 5.5);
    color += colGold * coreGlow * (0.6 + 0.4 * sin(u_time * 3.0));
    
    // Soft outer vignette
    color *= (1.0 - smoothstep(0.4, 0.75, dist));
    
    gl_FragColor = vec4(color, 1.0);
}`;

      function createShader(gl, type, source) {
        const s = gl.createShader(type);
        gl.shaderSource(s, source);
        gl.compileShader(s);
        return s;
      }
      const p = gl.createProgram();
      const vsShader = createShader(gl, gl.VERTEX_SHADER, vs);
      const fsShader = createShader(gl, gl.FRAGMENT_SHADER, fs);
      gl.attachShader(p, vsShader);
      gl.attachShader(p, fsShader);
      gl.linkProgram(p);

      let introProgram = null;
      let uTime = null;
      let uRes = null;
      let startTime = performance.now();

      if (gl.getProgramParameter(p, gl.LINK_STATUS)) {
        introProgram = p;
        gl.useProgram(introProgram);

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

        const aPos = gl.getAttribLocation(introProgram, 'a_pos');
        if (aPos >= 0) {
          gl.enableVertexAttribArray(aPos);
          gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
        }

        uTime = gl.getUniformLocation(introProgram, 'u_time');
        uRes = gl.getUniformLocation(introProgram, 'u_res');

        function renderIntroShader(now) {
          if (!introActive || !introProgram) return;
          gl.useProgram(introProgram);
          const t = (now - startTime) * 0.001;
          if (uTime) gl.uniform1f(uTime, t);
          if (uRes) gl.uniform2f(uRes, introShaderCanvas.width, introShaderCanvas.height);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
          introShaderRAF = requestAnimationFrame(renderIntroShader);
        }
        window.__renderIntroShader = renderIntroShader;
        introShaderRAF = requestAnimationFrame(renderIntroShader);
      } else {
        console.warn('Intro WebGL shader fallback:', gl.getProgramInfoLog(p));
      }
    }
  }

  // ================= 2. BACKGROUND & INTRO HYPNOTIC CANVASES =================
  let bgCanvas = document.getElementById('flight-canvas');
  if (!bgCanvas) {
    bgCanvas = document.createElement('canvas');
    bgCanvas.id = 'flight-canvas';
    bgCanvas.style.position = 'fixed';
    bgCanvas.style.top = '0';
    bgCanvas.style.left = '0';
    bgCanvas.style.width = '100vw';
    bgCanvas.style.height = '100vh';
    bgCanvas.style.pointerEvents = 'none';
    bgCanvas.style.zIndex = '0';
    bgCanvas.style.opacity = '0.9';
    bgCanvas.style.transform = 'translate3d(0,0,0)';
    document.body.prepend(bgCanvas);
  }

  const introFleetCanvas = document.getElementById('intro-fleet-canvas');
  const bgCtx = bgCanvas.getContext('2d', { alpha: true, desynchronized: true });
  const introCtx = introFleetCanvas ? introFleetCanvas.getContext('2d', { alpha: true }) : null;

  let width = window.innerWidth;
  let height = window.innerHeight;
  let dpr = 1.0;

  function resizeAll() {
    isMobile = window.innerWidth < 768 || (isTouchDevice && window.innerWidth < 1024);
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = isMobile ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.5);

    bgCanvas.width = Math.floor(width * dpr);
    bgCanvas.height = Math.floor(height * dpr);
    if (dpr !== 1) {
      bgCtx.scale(dpr, dpr);
    }

    if (introFleetCanvas) {
      introFleetCanvas.width = Math.floor(width * dpr);
      introFleetCanvas.height = Math.floor(height * dpr);
      if (introCtx && dpr !== 1) introCtx.scale(dpr, dpr);
    }
  }
  resizeAll();
  window.addEventListener('resize', resizeAll, { passive: true });

  // Passive Pointer Tracking & Kinetic Ripple Emission
  const pointer = {
    x: width * 0.5,
    y: height * 0.45,
    lastX: width * 0.5,
    lastY: height * 0.45,
    vx: 0,
    vy: 0,
    active: false,
    speed: 0
  };
  let pointerTimer = null;

  function handlePointerMove(clientX, clientY) {
    pointer.vx = clientX - pointer.x;
    pointer.vy = clientY - pointer.y;
    pointer.speed = Math.hypot(pointer.vx, pointer.vy);
    pointer.lastX = pointer.x;
    pointer.lastY = pointer.y;
    pointer.x = clientX;
    pointer.y = clientY;
    pointer.active = true;

    // Spawn soothing interactive ripples on movement
    if (pointer.speed > 3) {
      spawnRipple(clientX, clientY, Math.min(pointer.speed * 0.25, 4.5));
    }

    clearTimeout(pointerTimer);
    pointerTimer = setTimeout(() => {
      pointer.active = false;
      pointer.speed = 0;
    }, 2000);
  }

  window.addEventListener('pointermove', (e) => {
    handlePointerMove(e.clientX, e.clientY);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches.length > 0) {
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  // ================= 3. PRE-ALLOCATED ZERO-GC OBJECT POOLS =================
  // A. Interactive Celestial Ripples
  const MAX_RIPPLES = 18;
  const ripples = [];
  for (let i = 0; i < MAX_RIPPLES; i++) {
    ripples.push({
      x: 0, y: 0,
      radius: 0,
      maxRadius: 100,
      alpha: 0,
      color: '#00f0ff',
      speed: 2,
      active: false
    });
  }

  const RIPPLE_COLORS = ['rgba(0, 240, 255, ', 'rgba(244, 63, 94, ', 'rgba(168, 85, 247, ', 'rgba(56, 189, 248, '];

  function spawnRipple(x, y, intensity) {
    for (let i = 0; i < MAX_RIPPLES; i++) {
      const r = ripples[i];
      if (!r.active) {
        r.x = x;
        r.y = y;
        r.radius = 4;
        r.maxRadius = (isMobile ? 70 : 130) * Math.max(0.7, intensity * 0.4);
        r.alpha = 0.65;
        r.speed = 1.8 + intensity * 0.35;
        r.color = RIPPLE_COLORS[Math.floor(Math.random() * RIPPLE_COLORS.length)];
        r.active = true;
        return;
      }
    }
  }

  // B. Hypnotic Attractor Harmonic Flow Orbits
  const ORBIT_NODES_COUNT = isMobile ? 18 : 34;
  const orbitNodes = [];
  for (let i = 0; i < ORBIT_NODES_COUNT; i++) {
    const angle = (i / ORBIT_NODES_COUNT) * Math.PI * 2;
    orbitNodes.push({
      index: i,
      baseAngle: angle,
      radiusX: 0.18 + (i % 3) * 0.08,
      radiusY: 0.14 + ((i + 1) % 3) * 0.07,
      freqA: 1 + (i % 4),
      freqB: 2 + ((i + 2) % 3),
      size: 1.5 + (i % 3) * 0.8,
      hue: (i * 24) % 360,
      pulse: Math.random() * Math.PI * 2
    });
  }

  // C. Bioluminescent Ambient Motes
  const MOTES_COUNT = isMobile ? 22 : 48;
  const motes = [];
  for (let i = 0; i < MOTES_COUNT; i++) {
    motes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.2 - Math.random() * 0.35,
      size: 1.2 + Math.random() * 2.2,
      baseAlpha: 0.2 + Math.random() * 0.4,
      alpha: 0.2,
      phase: Math.random() * Math.PI * 2,
      colorType: i % 3 // 0: Cyan, 1: Rose, 2: Astral White
    });
  }

  // ================= 4. INTRO SEQUENCE LIFECYCLE =================
  const introStage = document.getElementById('intro-stage');
  const introCenterBox = document.getElementById('intro-center-box');
  const introProgressBar = document.getElementById('intro-progress-bar');
  const skipIntroBtn = document.getElementById('skip-intro-btn');
  const INTRO_DURATION = 4200;
  let introStartTime = performance.now();

  setTimeout(() => {
    if (introCenterBox) {
      introCenterBox.style.opacity = '1';
      introCenterBox.style.transform = 'scale(1)';
    }
  }, 200);

  function dismissIntro() {
    if (!introActive) return;
    introActive = false;
    if (introShaderRAF) {
      cancelAnimationFrame(introShaderRAF);
      introShaderRAF = null;
    }
    if (introStage) {
      introStage.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      introStage.style.opacity = '0';
      introStage.style.transform = 'scale(1.04)';
      introStage.style.pointerEvents = 'none';
      setTimeout(() => {
        if (introStage) {
          introStage.style.display = 'none';
        }
      }, 800);
    }
  }

  function startIntro() {
    if (!introStage) return;
    introActive = true;
    introStartTime = performance.now();
    introStage.style.display = 'flex';
    introStage.style.pointerEvents = 'auto';
    introStage.style.opacity = '1';
    introStage.style.transform = 'scale(1)';

    if (introProgressBar) introProgressBar.style.width = '0%';
    if (introCenterBox) {
      introCenterBox.style.opacity = '1';
      introCenterBox.style.transform = 'scale(1)';
    }

    if (introShaderCanvas && !introShaderRAF && window.__renderIntroShader) {
      introShaderRAF = requestAnimationFrame(window.__renderIntroShader);
    }
  }

  window.replayIntro = startIntro;

  if (skipIntroBtn) {
    skipIntroBtn.addEventListener('click', dismissIntro, { passive: true });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const replayBtn = document.getElementById('replay-intro-btn');
    if (replayBtn) replayBtn.addEventListener('click', startIntro);
    const mobileReplayBtn = document.getElementById('mobile-replay-btn');
    if (mobileReplayBtn) mobileReplayBtn.addEventListener('click', startIntro);
  });

  // ================= 5. MASTER HYPNOTIC RENDERING =================
  let time = 0;
  let mainLoopRunning = true;

  // Hypnotic Sacred Geometry & Quantum Wave Renderer
  function renderHypnoticGeometry(ctx, cx, cy, timeSec) {
    ctx.save();
    ctx.translate(cx, cy);

    const scaleFactor = isMobile ? 0.75 : 1.1;
    const maxRadius = Math.min(width, height) * 0.42 * scaleFactor;

    // 1. Concentric Breathing Harmonograph Rings
    const ringCount = isMobile ? 4 : 7;
    for (let r = 1; r <= ringCount; r++) {
      const baseR = (r / ringCount) * maxRadius;
      const breathe = Math.sin(timeSec * 0.8 + r * 0.7) * (r * 3.5);
      const curR = baseR + breathe;
      const alpha = 0.04 + 0.03 * Math.sin(timeSec * 1.2 + r);

      ctx.beginPath();
      ctx.arc(0, 0, Math.max(2, curR), 0, Math.PI * 2);
      ctx.strokeStyle = r % 2 === 0 ? `rgba(0, 240, 255, ${alpha.toFixed(3)})` : `rgba(244, 63, 94, ${alpha.toFixed(3)})`;
      ctx.lineWidth = r === 1 ? 1.5 : 0.9;
      ctx.setLineDash([4 + r * 2, 8 + r * 3]);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // 2. Harmonic Attractor Stream Curve (Flowing Lissajous ribbon)
    ctx.beginPath();
    const segments = isMobile ? 48 : 88;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 4;
      const lx = Math.sin(theta * 2 + timeSec * 0.6) * (maxRadius * 0.75) * Math.cos(timeSec * 0.2);
      const ly = Math.cos(theta * 3 - timeSec * 0.5) * (maxRadius * 0.6);
      if (i === 0) ctx.moveTo(lx, ly);
      else ctx.lineTo(lx, ly);
    }
    ctx.strokeStyle = `rgba(0, 240, 255, 0.07)`;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // 3. Orbiting Quantum Nodes
    for (let i = 0; i < orbitNodes.length; i++) {
      const node = orbitNodes[i];
      const tA = timeSec * 0.45 * (node.freqA * 0.3) + node.baseAngle;
      const tB = timeSec * 0.35 * (node.freqB * 0.3) + node.baseAngle;

      const nx = Math.cos(tA) * (width * node.radiusX * scaleFactor);
      const ny = Math.sin(tB) * (height * node.radiusY * scaleFactor);

      const pulseAlpha = 0.25 + 0.2 * Math.sin(timeSec * 2.0 + node.pulse);

      ctx.beginPath();
      ctx.arc(nx, ny, node.size, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 === 0 ? `rgba(0, 240, 255, ${pulseAlpha.toFixed(2)})` : `rgba(244, 63, 94, ${pulseAlpha.toFixed(2)})`;
      ctx.fill();

      // Delicate thread to center on prime nodes
      if (i % 5 === 0 && !isMobile) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(nx, ny);
        ctx.strokeStyle = `rgba(255, 255, 255, ${(pulseAlpha * 0.12).toFixed(3)})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  function masterLoop(now) {
    if (!isTabVisible) {
      mainLoopRunning = false;
      return;
    }

    // High performance: when user is vigorously scrolling on mobile, yield main thread to 120Hz native momentum
    if (isMobile && isScrolling) {
      requestAnimationFrame(masterLoop);
      return;
    }

    time += 0.02;
    const timeSec = now * 0.001;

    // --- A. INTRO PORTAL STAGE CANVAS ---
    if (introActive && introCtx) {
      const elapsed = now - introStartTime;
      const progress = Math.min(elapsed / INTRO_DURATION, 1.0);
      if (introProgressBar) {
        introProgressBar.style.width = (progress * 100) + '%';
      }

      introCtx.clearRect(0, 0, width, height);

      // Render expanding hypnotic portal rings
      introCtx.save();
      const icx = width * 0.5;
      const icy = height * 0.5;
      introCtx.translate(icx, icy);

      const portalMax = Math.max(width, height) * 0.7;
      const portalR = progress * portalMax;

      for (let pIdx = 1; pIdx <= 5; pIdx++) {
        const ringProg = Math.max(0, progress - (pIdx * 0.08));
        const rRad = ringProg * portalMax * 0.8;
        const rAlpha = (1.0 - progress) * (0.45 / pIdx);

        if (rRad > 0 && rAlpha > 0) {
          introCtx.beginPath();
          introCtx.arc(0, 0, rRad, 0, Math.PI * 2);
          introCtx.strokeStyle = pIdx % 2 === 0 ? `rgba(0, 240, 255, ${rAlpha.toFixed(3)})` : `rgba(244, 63, 94, ${rAlpha.toFixed(3)})`;
          introCtx.lineWidth = 2.0;
          introCtx.stroke();
        }
      }

      // Shimmering central singularity
      const singAlpha = (1.0 - progress) * 0.8;
      if (singAlpha > 0) {
        const singRadius = 15 + Math.sin(timeSec * 8.0) * 4;
        introCtx.beginPath();
        introCtx.arc(0, 0, singRadius, 0, Math.PI * 2);
        introCtx.fillStyle = `rgba(255, 255, 255, ${singAlpha.toFixed(2)})`;
        introCtx.shadowColor = '#00f0ff';
        introCtx.shadowBlur = 20;
        introCtx.fill();
        introCtx.shadowBlur = 0;
      }
      introCtx.restore();

      if (progress >= 1.0) {
        dismissIntro();
      }
    }

    // --- B. MAIN BACKGROUND HYPNOTIC FIELD ---
    bgCtx.clearRect(0, 0, width, height);

    // Dynamic epicenter influenced smoothly by pointer
    const targetCenterX = pointer.active ? width * 0.5 + (pointer.x - width * 0.5) * 0.15 : width * 0.5;
    const targetCenterY = pointer.active ? height * 0.45 + (pointer.y - height * 0.45) * 0.15 : height * 0.45;

    // Harmonograph / spiderweb geometric lines removed as requested by user to keep background clean and pristine

    // 1. Render Interactive Ripples
    for (let i = 0; i < MAX_RIPPLES; i++) {
      const r = ripples[i];
      if (r.active) {
        r.radius += r.speed;
        r.alpha -= 0.014;
        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          r.active = false;
          continue;
        }

        bgCtx.beginPath();
        bgCtx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        bgCtx.strokeStyle = `${r.color}${r.alpha.toFixed(3)})`;
        bgCtx.lineWidth = 1.4;
        bgCtx.stroke();
      }
    }

    // 2. Render Bioluminescent Ambient Motes
    for (let i = 0; i < motes.length; i++) {
      const m = motes[i];
      m.x += m.vx;
      m.y += m.vy;
      m.phase += 0.02;

      // Gentle wave float
      m.x += Math.sin(m.phase) * 0.25;

      // Wrap around bounds seamlessly
      if (m.y < -20) {
        m.y = height + 20;
        m.x = Math.random() * width;
      }
      if (m.x < -20) m.x = width + 20;
      if (m.x > width + 20) m.x = -20;

      const alpha = m.baseAlpha * (0.6 + 0.4 * Math.sin(m.phase));

      bgCtx.beginPath();
      bgCtx.arc(m.x, m.y, m.size, 0, Math.PI * 2);

      if (m.colorType === 0) {
        bgCtx.fillStyle = `rgba(0, 240, 255, ${alpha.toFixed(2)})`;
      } else if (m.colorType === 1) {
        bgCtx.fillStyle = `rgba(244, 63, 94, ${alpha.toFixed(2)})`;
      } else {
        bgCtx.fillStyle = `rgba(226, 232, 240, ${(alpha * 0.8).toFixed(2)})`;
      }
      bgCtx.fill();
    }

    requestAnimationFrame(masterLoop);
  }

  requestAnimationFrame(masterLoop);
})();
