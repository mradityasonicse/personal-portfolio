/**
 * Cinematic Maritime Fleet & High-Speed Nautical Vessels Animation System
 * Replaces aircraft/helicopters with Speedboats, Stealth Cruisers, and Naval Yachts
 * Features hydrodynamic V-wakes, water spray foam, searchlights, and navigational LEDs.
 */
(function initCinematicMaritimeExperience() {
  
  // ================= 1. INTRO WEBGL SHADER (OCEANIC FLOW) =================
  const introShaderCanvas = document.getElementById('intro-shader-canvas');
  if (introShaderCanvas) {
    const gl = introShaderCanvas.getContext('webgl') || introShaderCanvas.getContext('experimental-webgl');
    if (gl) {
      function syncIntroSize() {
        introShaderCanvas.width = window.innerWidth;
        introShaderCanvas.height = window.innerHeight;
        gl.viewport(0, 0, introShaderCanvas.width, introShaderCanvas.height);
      }
      syncIntroSize();
      window.addEventListener('resize', syncIntroSize);

      const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;
      const fs = `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
varying vec2 v_texCoord;

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
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
    vec2 uv = v_texCoord;
    vec2 mouse = u_mouse / u_resolution;
    
    vec3 colorDeepOcean = vec3(0.02, 0.05, 0.12); 
    vec3 colorTrench = vec3(0.04, 0.08, 0.18); 
    vec3 colorBiolum = vec3(0.92, 0.16, 0.14); // crimson accent
    
    // Wave water noise
    float w1 = snoise(uv * 3.5 + vec2(u_time * 0.1, u_time * 0.05));
    float w2 = snoise(uv * 6.0 - vec2(u_time * 0.08, u_time * 0.08) + mouse * 0.2);
    
    float mask = smoothstep(-0.35, 0.65, w1 + w2 * 0.45);
    vec3 finalColor = mix(colorDeepOcean, colorTrench, mask);
    
    // Water surface caustics & shimmer
    float shimmer = sin(uv.y * 180.0 + uv.x * 90.0 + u_time * 1.5) * 0.018;
    finalColor += shimmer;
    
    float dist = length(uv - vec2(0.5, 0.5));
    finalColor += colorBiolum * exp(-3.8 * dist) * 0.14;

    gl_FragColor = vec4(finalColor, 1.0);
}`;

      function createShader(type, src) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return s;
      }
      const prog = gl.createProgram();
      gl.attachShader(prog, createShader(gl.VERTEX_SHADER, vs));
      gl.attachShader(prog, createShader(gl.FRAGMENT_SHADER, fs));
      gl.linkProgram(prog);
      gl.useProgram(prog);

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
      const pos = gl.getAttribLocation(prog, 'a_position');
      gl.enableVertexAttribArray(pos);
      gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

      const uTime = gl.getUniformLocation(prog, 'u_time');
      const uRes = gl.getUniformLocation(prog, 'u_resolution');
      const uMouse = gl.getUniformLocation(prog, 'u_mouse');

      let startTime = performance.now();
      function renderIntroShader(now) {
        if (!introShaderCanvas.isConnected) return;
        const t = (now - startTime) * 0.001;
        gl.viewport(0, 0, introShaderCanvas.width, introShaderCanvas.height);
        if (uTime) gl.uniform1f(uTime, t);
        if (uRes) gl.uniform2f(uRes, introShaderCanvas.width, introShaderCanvas.height);
        if (uMouse) gl.uniform2f(uMouse, introShaderCanvas.width * 0.5, introShaderCanvas.height * 0.5);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        requestAnimationFrame(renderIntroShader);
      }
      requestAnimationFrame(renderIntroShader);
    }
  }

  // ================= 2. BACKGROUND & INTRO FLEET CANVASES =================
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
    bgCanvas.style.zIndex = '1';
    bgCanvas.style.opacity = '0.9';
    document.body.prepend(bgCanvas);
  }

  const introFleetCanvas = document.getElementById('intro-fleet-canvas');
  const bgCtx = bgCanvas.getContext('2d');
  const introCtx = introFleetCanvas ? introFleetCanvas.getContext('2d') : null;

  let width = window.innerWidth;
  let height = window.innerHeight;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resizeAll() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    
    bgCanvas.width = width * dpr;
    bgCanvas.height = height * dpr;
    bgCtx.scale(dpr, dpr);

    if (introFleetCanvas) {
      introFleetCanvas.width = width * dpr;
      introFleetCanvas.height = height * dpr;
      if (introCtx) introCtx.scale(dpr, dpr);
    }
  }
  resizeAll();
  window.addEventListener('resize', resizeAll);

  // Mouse tracking
  const mouse = { x: width * 0.5, y: height * 0.35, active: false };
  let mouseTimer = null;
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
    clearTimeout(mouseTimer);
    mouseTimer = setTimeout(() => { mouse.active = false; }, 5000);
  });

  // Particle System for Water Wakes & Foam Spray
  const bgParticles = [];
  const introParticles = [];
  function addParticle(targetArr, x, y, vx, vy, color, size, decay, type) {
    if (targetArr.length > 400) targetArr.shift();
    targetArr.push({
      x, y, vx, vy, color, size, life: 1.0, decay: decay || 0.015, type: type || 'wake'
    });
  }

  // ================= MARITIME BOAT FLEET DATA =================
  // 1. High-Speed Interceptor Speedboats
  const speedboats = [
    { type: 'speedboat', role: 'flagship', x: -180, y: height * 0.28, angle: 0.12, speed: 5.8, scale: 1.0, color: '#ea2a23', wakeColor: 'rgba(255, 255, 255, ' },
    { type: 'speedboat', role: 'escort', offset: { x: -50, y: -38 }, x: -240, y: height * 0.24, angle: 0.12, speed: 5.8, scale: 0.85, color: '#38bdf8', wakeColor: 'rgba(230, 245, 255, ' },
    { type: 'speedboat', role: 'escort', offset: { x: -50, y: 38 }, x: -240, y: height * 0.32, angle: 0.12, speed: 5.8, scale: 0.85, color: '#38bdf8', wakeColor: 'rgba(230, 245, 255, ' },
    { type: 'speedboat', role: 'scout', x: width + 120, y: height * 0.18, angle: -2.9, speed: 6.5, scale: 0.8, color: '#fbbf24', wakeColor: 'rgba(255, 255, 255, ' },
    { type: 'speedboat', role: 'patrol', x: -120, y: height * 0.52, angle: 0.18, speed: 5.2, scale: 0.92, color: '#00f0ff', wakeColor: 'rgba(200, 240, 255, ' }
  ];

  // 2. Heavy Stealth Cruisers (Naval Ships with Searchlights)
  const cruisers = [
    { type: 'cruiser', id: 'c1', x: width + 200, y: height * 0.45, angle: -0.15, speed: 2.8, scale: 1.15, searchlight: true, lightSweep: 0.35, color: '#1e293b' },
    { type: 'cruiser', id: 'c2', x: -220, y: height * 0.68, angle: 0.08, speed: 2.4, scale: 1.0, searchlight: true, lightSweep: -0.4, color: '#0f172a' },
    { type: 'cruiser', id: 'c3', x: width + 280, y: height * 0.82, angle: -0.06, speed: 2.1, scale: 1.25, searchlight: false, color: '#334155' }
  ];

  // 3. Modern Luxury Mega Yachts
  const yachts = [
    { type: 'yacht', x: width + 350, y: height * 0.14, angle: Math.PI + 0.04, speed: 2.2, scale: 1.3 },
    { type: 'yacht', x: -450, y: height * 0.88, angle: 0.06, speed: 2.0, scale: 1.15 }
  ];

  // Intro fleet
  const introBoats = [
    { x: -140, y: height * 0.32, angle: 0.12, speed: 8.5, scale: 1.2, color: '#ea2a23' },
    { x: -220, y: height * 0.22, angle: 0.12, speed: 8.5, scale: 0.95, color: '#38bdf8' },
    { x: -220, y: height * 0.42, angle: 0.12, speed: 8.5, scale: 0.95, color: '#38bdf8' }
  ];
  const introCruiser = {
    x: width + 140, y: height * 0.62, angle: -0.1, speed: 3.5, scale: 1.2, searchlight: true, lightSweep: 0.45
  };

  // ================= 3. INTRO SEQUENCE LIFECYCLE =================
  const introStage = document.getElementById('intro-stage');
  const introCenterBox = document.getElementById('intro-center-box');
  const introProgressBar = document.getElementById('intro-progress-bar');
  const skipIntroBtn = document.getElementById('skip-intro-btn');

  let introActive = true;
  const INTRO_DURATION = 3800; // ms

  setTimeout(() => {
    if (introCenterBox) {
      introCenterBox.style.opacity = '1';
      introCenterBox.style.transform = 'scale(1)';
    }
  }, 400);

  function dismissIntro() {
    if (!introActive) return;
    introActive = false;
    if (introStage) {
      introStage.style.opacity = '0';
      introStage.style.pointerEvents = 'none';
      setTimeout(() => {
        if (introStage) introStage.style.display = 'none';
      }, 1000);
    }
  }

  if (skipIntroBtn) {
    skipIntroBtn.addEventListener('click', dismissIntro);
  }

  let introStartTime = performance.now();

  // ================= 4. WATER WAKE & SPRAY DRAWING =================
  function drawParticles(ctx, list) {
    for (let i = list.length - 1; i >= 0; i--) {
      const p = list[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      if (p.life <= 0) {
        list.splice(i, 1);
        continue;
      }
      ctx.beginPath();
      // Expanding water wake circles
      const currentRadius = p.size * (2.4 - p.life * 1.4);
      ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
      
      if (p.type === 'foam') {
        ctx.fillStyle = `rgba(255, 255, 255, ${p.life * 0.75})`;
        ctx.shadowColor = 'rgba(56, 189, 248, 0.4)';
        ctx.shadowBlur = 4;
      } else if (p.type === 'spray') {
        ctx.fillStyle = `rgba(56, 189, 248, ${p.life * 0.6})`;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 8;
      } else {
        // Soft fading water wake
        ctx.fillStyle = `rgba(210, 235, 255, ${p.life * 0.28})`;
        ctx.shadowBlur = 0;
      }
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  }

  // ================= 5. VESSEL RENDERING ENGINES =================

  // 1. High-Speed Sport Boat / Speedboat
  function drawSpeedboat(ctx, b, time) {
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(b.angle);
    ctx.scale(b.scale, b.scale);

    // Dynamic Hull Bobbing in waves
    const waveBob = Math.sin(time * 3 + b.x * 0.01) * 0.8;
    ctx.translate(0, waveBob);

    // Underwater Glow / LED Transom
    ctx.beginPath();
    ctx.arc(-26, 0, 10, 0, Math.PI * 2);
    ctx.fillStyle = b.color || '#ea2a23';
    ctx.shadowColor = b.color || '#ea2a23';
    ctx.shadowBlur = 14;
    ctx.fill();
    ctx.shadowBlur = 0;

    // V-Hull Profile
    ctx.beginPath();
    ctx.moveTo(34, 0);                 // Bow point
    ctx.quadraticCurveTo(18, -11, -22, -10); // Starboard chine
    ctx.lineTo(-26, -9);              // Transom starboard
    ctx.lineTo(-28, 0);               // Stern center
    ctx.lineTo(-26, 9);               // Transom port
    ctx.lineTo(-22, 10);              // Port chine
    ctx.quadraticCurveTo(18, 11, 34, 0);   // Bow point
    ctx.closePath();

    const hullGrad = ctx.createLinearGradient(-28, -11, 34, 11);
    hullGrad.addColorStop(0, '#0f172a');
    hullGrad.addColorStop(0.4, '#1e293b');
    hullGrad.addColorStop(1, '#334155');

    ctx.fillStyle = hullGrad;
    ctx.shadowColor = 'rgba(234, 42, 35, 0.35)';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1.3;
    ctx.stroke();

    // Deck Foredeck & Cockpit
    ctx.beginPath();
    ctx.moveTo(16, 0);
    ctx.lineTo(2, -6);
    ctx.lineTo(-14, -6);
    ctx.lineTo(-14, 6);
    ctx.lineTo(2, 6);
    ctx.closePath();
    ctx.fillStyle = '#090d16';
    ctx.fill();

    // Curved Tinted Windshield Glass
    ctx.beginPath();
    ctx.moveTo(6, -6);
    ctx.quadraticCurveTo(10, 0, 6, 6);
    ctx.lineTo(3, 5);
    ctx.quadraticCurveTo(7, 0, 3, -5);
    ctx.closePath();
    ctx.fillStyle = 'rgba(56, 189, 248, 0.95)';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Centerline Racing Stripe
    ctx.beginPath();
    ctx.moveTo(32, 0);
    ctx.lineTo(8, 0);
    ctx.strokeStyle = b.color || '#ea2a23';
    ctx.lineWidth = 2.0;
    ctx.stroke();

    // Navigation Lights (Red Port, Green Starboard)
    ctx.beginPath();
    ctx.arc(14, -10, 2.0, 0, Math.PI * 2);
    ctx.fillStyle = '#22c55e'; // Green starboard
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 6;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(14, 10, 2.0, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444'; // Red port
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Twin Hydro-Jet Outboards / Stern Thrusters
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-30, -7, 5, 4);
    ctx.fillRect(-30, 3, 5, 4);

    // Churning Water Jet Propulsions
    ctx.beginPath();
    ctx.arc(-31, -5, 3.0, 0, Math.PI * 2);
    ctx.arc(-31, 5, 3.0, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  // 2. Heavy Stealth Cruiser / Modern Naval Vessel
  function drawCruiser(ctx, c, time) {
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(c.angle);
    ctx.scale(c.scale, c.scale);

    // Nautical Searchlight Beam
    if (c.searchlight) {
      ctx.save();
      ctx.translate(18, 0);
      ctx.rotate(c.lightSweep);
      const beamGrad = ctx.createRadialGradient(0, 0, 10, 0, 320, 160);
      beamGrad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
      beamGrad.addColorStop(0.25, 'rgba(56, 189, 248, 0.25)');
      beamGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.beginPath();
      ctx.moveTo(0, -4);
      ctx.lineTo(320, -110);
      ctx.lineTo(320, 110);
      ctx.lineTo(0, 4);
      ctx.closePath();
      ctx.fillStyle = beamGrad;
      ctx.fill();
      ctx.restore();
    }

    // Stealth Faceted Warship Hull
    ctx.beginPath();
    ctx.moveTo(52, 0);                  // Sharp wave-piercing bow
    ctx.lineTo(24, -14);
    ctx.lineTo(-44, -13);               // Starboard flank
    ctx.lineTo(-52, -10);               // Transom corner
    ctx.lineTo(-54, 0);                 // Stern center
    ctx.lineTo(-52, 10);
    ctx.lineTo(-44, 13);                // Port flank
    ctx.lineTo(24, 14);
    ctx.closePath();

    ctx.fillStyle = c.color || '#1e293b';
    ctx.shadowColor = 'rgba(0, 240, 255, 0.25)';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1.3;
    ctx.stroke();

    // Superstructure / Command Bridge Island
    ctx.beginPath();
    ctx.moveTo(14, 0);
    ctx.lineTo(4, -8);
    ctx.lineTo(-24, -8);
    ctx.lineTo(-30, -5);
    ctx.lineTo(-30, 5);
    ctx.lineTo(-24, 8);
    ctx.lineTo(4, 8);
    ctx.closePath();
    ctx.fillStyle = '#0b1120';
    ctx.fill();
    ctx.stroke();

    // Bridge Windows (Luminous Cyan Glass)
    ctx.beginPath();
    ctx.moveTo(12, 0);
    ctx.lineTo(3, -6);
    ctx.lineTo(-6, -6);
    ctx.lineTo(-6, 6);
    ctx.lineTo(3, 6);
    ctx.closePath();
    ctx.fillStyle = 'rgba(56, 189, 248, 0.9)';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Helipad / Deck Markings at Stern
    ctx.beginPath();
    ctx.arc(-38, 0, 7, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(234, 42, 35, 0.8)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = 'bold 6px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('H', -38, 0.5);

    // Radar Mast & Flashing Beacon
    ctx.fillStyle = '#64748b';
    ctx.fillRect(-10, -2, 4, 4);

    if (Math.sin(time * 8 + c.x) > 0.2) {
      ctx.beginPath();
      ctx.arc(-8, 0, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ea2a23';
      ctx.shadowColor = '#ea2a23';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    ctx.restore();
  }

  // 3. Mega Luxury Yacht
  function drawYacht(ctx, y, time) {
    ctx.save();
    ctx.translate(y.x, y.y);
    ctx.rotate(y.angle);
    ctx.scale(y.scale, y.scale);

    // Sleek Streamlined Yacht Hull
    ctx.beginPath();
    ctx.moveTo(60, 0);
    ctx.quadraticCurveTo(30, -15, -48, -13);
    ctx.lineTo(-56, -9);
    ctx.lineTo(-58, 0);
    ctx.lineTo(-56, 9);
    ctx.quadraticCurveTo(30, 15, 60, 0);
    ctx.closePath();

    const yGrad = ctx.createLinearGradient(-58, 0, 60, 0);
    yGrad.addColorStop(0, '#0f172a');
    yGrad.addColorStop(0.5, '#1e293b');
    yGrad.addColorStop(1, '#f8fafc');

    ctx.fillStyle = yGrad;
    ctx.shadowColor = 'rgba(56, 189, 248, 0.3)';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Teak Wood Sun Deck
    ctx.beginPath();
    ctx.moveTo(35, 0);
    ctx.lineTo(15, -8);
    ctx.lineTo(-32, -8);
    ctx.lineTo(-32, 8);
    ctx.lineTo(15, 8);
    ctx.closePath();
    ctx.fillStyle = '#92400e'; // Teak
    ctx.fill();

    // Multi-tier Glass Cabin
    ctx.beginPath();
    ctx.moveTo(22, 0);
    ctx.lineTo(8, -6);
    ctx.lineTo(-24, -6);
    ctx.lineTo(-24, 6);
    ctx.lineTo(8, 6);
    ctx.closePath();
    ctx.fillStyle = 'rgba(56, 189, 248, 0.85)';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Underwater LED transom ribbon
    ctx.beginPath();
    ctx.moveTo(-56, -8);
    ctx.lineTo(-56, 8);
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  // ================= 6. MASTER ANIMATION LOOP =================
  let time = 0;

  function masterLoop(now) {
    time += 0.03;

    // --- INTRO CANVAS UPDATE & DRAW (Speedboats & Cruisers) ---
    if (introActive && introCtx) {
      const elapsed = now - introStartTime;
      const progress = Math.min(elapsed / INTRO_DURATION, 1.0);
      if (introProgressBar) {
        introProgressBar.style.width = (progress * 100) + '%';
      }

      introCtx.clearRect(0, 0, width, height);

      // Update and draw intro speedboats
      introBoats.forEach((ib) => {
        ib.x += Math.cos(ib.angle) * ib.speed;
        ib.y += Math.sin(ib.angle) * ib.speed;

        // V-Wake foam generation
        const wOff = 12 * ib.scale;
        const px = Math.cos(ib.angle + Math.PI / 2) * wOff;
        const py = Math.sin(ib.angle + Math.PI / 2) * wOff;
        
        // Port & starboard expanding wake trails
        addParticle(introParticles, ib.x - Math.cos(ib.angle) * 22 + px, ib.y - Math.sin(ib.angle) * 22 + py, -Math.cos(ib.angle) * 1.4 + px * 0.08, -Math.sin(ib.angle) * 1.4 + py * 0.08, 'rgba(255, 255, 255, ', 3.0, 0.012, 'wake');
        addParticle(introParticles, ib.x - Math.cos(ib.angle) * 22 - px, ib.y - Math.sin(ib.angle) * 22 - py, -Math.cos(ib.angle) * 1.4 - px * 0.08, -Math.sin(ib.angle) * 1.4 - py * 0.08, 'rgba(255, 255, 255, ', 3.0, 0.012, 'wake');
        
        // Stern hydro churn
        addParticle(introParticles, ib.x - Math.cos(ib.angle) * 28, ib.y - Math.sin(ib.angle) * 28, -Math.cos(ib.angle) * 2.2, -Math.sin(ib.angle) * 2.2, 'rgba(56, 189, 248, ', 4.2, 0.035, 'spray');

        drawSpeedboat(introCtx, ib, time);
      });

      // Update and draw intro naval cruiser
      introCruiser.x += Math.cos(introCruiser.angle) * -introCruiser.speed;
      introCruiser.y += Math.sin(time * 1.5) * 1.2;
      introCruiser.lightSweep = Math.sin(time * 2) * 0.45;
      
      // Heavy cruiser wake
      addParticle(introParticles, introCruiser.x + 40, introCruiser.y - 12, 1.2, -0.6, 'rgba(255, 255, 255, ', 4.5, 0.01, 'wake');
      addParticle(introParticles, introCruiser.x + 40, introCruiser.y + 12, 1.2, 0.6, 'rgba(255, 255, 255, ', 4.5, 0.01, 'wake');

      drawCruiser(introCtx, introCruiser, time);

      drawParticles(introCtx, introParticles);

      if (progress >= 1.0) {
        dismissIntro();
      }
    }

    // --- MAIN BACKGROUND CANVAS MARITIME PATROL ---
    bgCtx.clearRect(0, 0, width, height);

    // 1. Update Flagship Speedboat & Escorts
    const flagship = speedboats[0];
    let flagTargetX = width * 0.5 + Math.cos(time * 0.5) * (width * 0.44);
    let flagTargetY = height * 0.35 + Math.sin(time * 0.7) * (height * 0.28);
    if (mouse.active) {
      flagTargetX = mouse.x;
      flagTargetY = mouse.y - 50;
    }
    const fdx = flagTargetX - flagship.x;
    const fdy = flagTargetY - flagship.y;
    let fDiff = Math.atan2(fdy, fdx) - flagship.angle;
    while (fDiff < -Math.PI) fDiff += Math.PI * 2;
    while (fDiff > Math.PI) fDiff -= Math.PI * 2;
    flagship.angle += fDiff * 0.04;
    const flagSpeed = (mouse.active ? 5.8 : 4.8) + Math.sin(time * 1.2) * 0.6;
    flagship.x += Math.cos(flagship.angle) * flagSpeed;
    flagship.y += Math.sin(flagship.angle) * flagSpeed;

    speedboats.forEach((b) => {
      if (b.role === 'escort') {
        const perpX = Math.cos(flagship.angle + Math.PI / 2);
        const perpY = Math.sin(flagship.angle + Math.PI / 2);
        const behindX = Math.cos(flagship.angle);
        const behindY = Math.sin(flagship.angle);
        const targetX = flagship.x - behindX * Math.abs(b.offset.x) + perpX * b.offset.y;
        const targetY = flagship.y - behindY * Math.abs(b.offset.x) + perpY * b.offset.y;
        b.x += (targetX - b.x) * 0.07;
        b.y += (targetY - b.y) * 0.07;
        b.angle = flagship.angle;
      } else if (b.role === 'scout') {
        let sTargetX = width * 0.5 + Math.sin(time * 0.8) * (width * 0.48);
        let sTargetY = height * 0.2 + Math.cos(time * 0.9) * (height * 0.16);
        if (mouse.active) {
          sTargetX = mouse.x + Math.sin(time * 2.5) * 110;
          sTargetY = mouse.y - 100;
        }
        let sDiff = Math.atan2(sTargetY - b.y, sTargetX - b.x) - b.angle;
        while (sDiff < -Math.PI) sDiff += Math.PI * 2;
        while (sDiff > Math.PI) sDiff -= Math.PI * 2;
        b.angle += sDiff * 0.045;
        b.x += Math.cos(b.angle) * b.speed;
        b.y += Math.sin(b.angle) * b.speed;
      } else if (b.role === 'patrol') {
        let pTargetX = width * 0.5 + Math.cos(time * 0.35) * (width * 0.4);
        let pTargetY = height * 0.58 + Math.sin(time * 0.45) * (height * 0.2);
        let pDiff = Math.atan2(pTargetY - b.y, pTargetX - b.x) - b.angle;
        while (pDiff < -Math.PI) pDiff += Math.PI * 2;
        while (pDiff > Math.PI) pDiff -= Math.PI * 2;
        b.angle += pDiff * 0.03;
        b.x += Math.cos(b.angle) * b.speed;
        b.y += Math.sin(b.angle) * b.speed;
      }

      const margin = 200;
      if (b.x < -margin) b.x = width + margin;
      if (b.x > width + margin) b.x = -margin;
      if (b.y < -margin) b.y = height + margin;
      if (b.y > height + margin) b.y = -margin;

      // Dynamic V-Wake Spray & Foam Ripples
      const chineOff = 10 * b.scale;
      const px = Math.cos(b.angle + Math.PI / 2) * chineOff;
      const py = Math.sin(b.angle + Math.PI / 2) * chineOff;
      if (Math.random() < 0.8) {
        addParticle(bgParticles, b.x - Math.cos(b.angle) * 20 + px, b.y - Math.sin(b.angle) * 20 + py, -Math.cos(b.angle) * 1.2 + px * 0.05, -Math.sin(b.angle) * 1.2 + py * 0.05, 'rgba(230, 245, 255, ', 2.6 * b.scale, 0.012, 'wake');
        addParticle(bgParticles, b.x - Math.cos(b.angle) * 20 - px, b.y - Math.sin(b.angle) * 20 - py, -Math.cos(b.angle) * 1.2 - px * 0.05, -Math.sin(b.angle) * 1.2 - py * 0.05, 'rgba(230, 245, 255, ', 2.6 * b.scale, 0.012, 'wake');
      }
      addParticle(bgParticles, b.x - Math.cos(b.angle) * (26 * b.scale), b.y - Math.sin(b.angle) * (26 * b.scale), -Math.cos(b.angle) * 2.2, -Math.sin(b.angle) * 2.2, 'rgba(56, 189, 248, ', 3.8 * b.scale, 0.045, 'spray');
      
      drawSpeedboat(bgCtx, b, time);
    });

    // 2. Cruisers Patrol
    cruisers.forEach((c, idx) => {
      let cTargetX = width * 0.5 + Math.sin(time * 0.35 + idx * 1.6) * (width * 0.42);
      let cTargetY = height * (0.5 + idx * 0.12) + Math.cos(time * 0.45 + idx * 1.2) * (height * 0.18);
      if (mouse.active) {
        cTargetX = mouse.x + Math.sin(time * 1.8 + idx * 1.5) * (90 + idx * 40);
        cTargetY = mouse.y + 80 + idx * 45;
      }
      let cDiff = Math.atan2(cTargetY - c.y, cTargetX - c.x) - c.angle;
      while (cDiff < -Math.PI) cDiff += Math.PI * 2;
      while (cDiff > Math.PI) cDiff -= Math.PI * 2;
      c.angle += cDiff * 0.025;
      const cSpeed = (mouse.active ? 3.2 : 2.5) + Math.sin(time * 1.5 + idx) * 0.3;
      c.x += Math.cos(c.angle) * cSpeed;
      c.y += Math.sin(c.angle) * cSpeed;

      const cMargin = 200;
      if (c.x < -cMargin) c.x = width + cMargin;
      if (c.x > width + cMargin) c.x = -cMargin;
      if (c.y < -cMargin) c.y = height + cMargin;
      if (c.y > height + cMargin) c.y = -cMargin;

      c.lightSweep = Math.sin(time * 1.6 + idx) * 0.4;
      
      // Heavy V-Wake for cruiser
      const cOff = 14 * c.scale;
      const cpx = Math.cos(c.angle + Math.PI / 2) * cOff;
      const cpy = Math.sin(c.angle + Math.PI / 2) * cOff;
      if (Math.random() < 0.6) {
        addParticle(bgParticles, c.x - Math.cos(c.angle) * 45 + cpx, c.y - Math.sin(c.angle) * 45 + cpy, -Math.cos(c.angle) * 0.9 + cpx * 0.04, -Math.sin(c.angle) * 0.9 + cpy * 0.04, 'rgba(255, 255, 255, ', 3.8 * c.scale, 0.009, 'wake');
        addParticle(bgParticles, c.x - Math.cos(c.angle) * 45 - cpx, c.y - Math.sin(c.angle) * 45 - cpy, -Math.cos(c.angle) * 0.9 - cpx * 0.04, -Math.sin(c.angle) * 0.9 - cpy * 0.04, 'rgba(255, 255, 255, ', 3.8 * c.scale, 0.009, 'wake');
      }

      drawCruiser(bgCtx, c, time);
    });

    // 3. Mega Luxury Yachts
    yachts.forEach((y) => {
      y.x += Math.cos(y.angle) * y.speed;
      y.y += Math.sin(y.angle) * y.speed;
      const yMargin = 350;
      if (y.x < -yMargin) y.x = width + yMargin;
      if (y.x > width + yMargin) y.x = -yMargin;
      if (y.y < -yMargin) y.y = height + yMargin;
      if (y.y > height + yMargin) y.y = -yMargin;

      const yOff = 16 * y.scale;
      const pyx = Math.cos(y.angle + Math.PI / 2) * yOff;
      const pyy = Math.sin(y.angle + Math.PI / 2) * yOff;
      if (Math.random() < 0.75) {
        addParticle(bgParticles, y.x - Math.cos(y.angle) * 48 + pyx, y.y - Math.sin(y.angle) * 48 + pyy, -Math.cos(y.angle) * 0.7, -Math.sin(y.angle) * 0.7, 'rgba(220, 240, 255, ', 4.0 * y.scale, 0.008, 'wake');
        addParticle(bgParticles, y.x - Math.cos(y.angle) * 48 - pyx, y.y - Math.sin(y.angle) * 48 - pyy, -Math.cos(y.angle) * 0.7, -Math.sin(y.angle) * 0.7, 'rgba(220, 240, 255, ', 4.0 * y.scale, 0.008, 'wake');
      }

      drawYacht(bgCtx, y, time);
    });

    drawParticles(bgCtx, bgParticles);

    requestAnimationFrame(masterLoop);
  }

  requestAnimationFrame(masterLoop);
})();
