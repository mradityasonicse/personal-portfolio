import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface TelemetryData {
  fps: number;
  cameraCoords: [number, number, number];
  entityCount: number;
  activePhase: string;
  isWarping: boolean;
}

export const CinematicThreeCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, & Renderer setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050811, 0.055);

    const camera = new THREE.PerspectiveCamera(
      52,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 8.8);

    const renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
      alpha: false,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 2. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0x0e172a, 1.8);
    scene.add(ambientLight);

    const coreLight = new THREE.PointLight(0x38bdf8, 3.5, 25);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    const rimLight = new THREE.DirectionalLight(0xf43f5e, 1.2);
    rimLight.position.set(5, 8, 4);
    scene.add(rimLight);

    const cyanLight = new THREE.DirectionalLight(0x34d399, 1.0);
    cyanLight.position.set(-6, -4, 5);
    scene.add(cyanLight);

    // 3. Holographic Quantum Reactor Core
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Inner Pulsating Nucleus
    const nucleusGeom = new THREE.SphereGeometry(0.7, 32, 32);
    const nucleusMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });
    const nucleus = new THREE.Mesh(nucleusGeom, nucleusMat);
    coreGroup.add(nucleus);

    // Wireframe Icosahedron
    const icosaGeom = new THREE.IcosahedronGeometry(1.2, 1);
    const icosaMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });
    const icosahedron = new THREE.Mesh(icosaGeom, icosaMat);
    coreGroup.add(icosahedron);

    // 3 Nested Gyroscopic Orbital Torus Rings
    const ring1Geom = new THREE.TorusGeometry(1.9, 0.025, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
    coreGroup.add(ring1);

    const ring2Geom = new THREE.TorusGeometry(2.3, 0.022, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
    const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
    ring2.rotation.x = Math.PI / 3;
    coreGroup.add(ring2);

    const ring3Geom = new THREE.TorusGeometry(2.7, 0.02, 16, 100);
    const ring3Mat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
    const ring3 = new THREE.Mesh(ring3Geom, ring3Mat);
    ring3.rotation.y = Math.PI / 4;
    coreGroup.add(ring3);

    // 4. Distributed Microservice Constellation (10 Satellites + Conduit Lasers)
    const microserviceCount = 10;
    const satellites: THREE.Mesh[] = [];
    const satelliteGroup = new THREE.Group();
    scene.add(satelliteGroup);

    const satGeom = new THREE.SphereGeometry(0.12, 16, 16);
    const satColors = [0x38bdf8, 0xf43f5e, 0x34d399, 0xa855f7, 0xfbbf24];

    for (let i = 0; i < microserviceCount; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: satColors[i % satColors.length],
      });
      const sat = new THREE.Mesh(satGeom, mat);
      sat.userData = {
        orbitRadius: 3.8 + (i % 3) * 0.9,
        orbitSpeed: 0.35 + (i * 0.08),
        orbitAngle: (i / microserviceCount) * Math.PI * 2,
        inclination: ((i % 4) - 1.5) * 0.45,
      };
      satelliteGroup.add(sat);
      satellites.push(sat);
    }

    // Laser Conduit Lines connecting satellites to core
    const conduitPositions = new Float32Array(microserviceCount * 2 * 3);
    const conduitColors = new Float32Array(microserviceCount * 2 * 3);
    const conduitGeom = new THREE.BufferGeometry();
    conduitGeom.setAttribute('position', new THREE.BufferAttribute(conduitPositions, 3));
    conduitGeom.setAttribute('color', new THREE.BufferAttribute(conduitColors, 3));

    const conduitMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const conduitLines = new THREE.LineSegments(conduitGeom, conduitMat);
    scene.add(conduitLines);

    // 5. Dynamic Particle Nebula (2,200 instances with vertex colors)
    const particleCount = 2200;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleOriginalPositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const palette = [
      new THREE.Color(0x38bdf8), // Cyan
      new THREE.Color(0x818cf8), // Indigo
      new THREE.Color(0x34d399), // Emerald
      new THREE.Color(0xf43f5e), // Rose
      new THREE.Color(0xc084fc), // Purple
      new THREE.Color(0xffffff), // Pure Starlight
    ];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = 2.0 + Math.random() * 18.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      particlePositions[i3] = x;
      particlePositions[i3 + 1] = y;
      particlePositions[i3 + 2] = z;

      particleOriginalPositions[i3] = x;
      particleOriginalPositions[i3 + 1] = y;
      particleOriginalPositions[i3 + 2] = z;

      const col = palette[Math.floor(Math.random() * palette.length)];
      particleColors[i3] = col.r;
      particleColors[i3 + 1] = col.g;
      particleColors[i3 + 2] = col.b;
    }

    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeom.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    // Particle Material with Soft Circular Point Texture
    const particleCanvas = document.createElement('canvas');
    particleCanvas.width = 32;
    particleCanvas.height = 32;
    const pCtx = particleCanvas.getContext('2d');
    if (pCtx) {
      const grad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.3, 'rgba(56, 189, 248, 0.8)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      pCtx.fillStyle = grad;
      pCtx.fillRect(0, 0, 32, 32);
    }
    const particleTex = new THREE.CanvasTexture(particleCanvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      map: particleTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // 6. Infinite Cyber Grid Floor
    const gridHelper = new THREE.GridHelper(80, 80, 0xf43f5e, 0x1e293b);
    gridHelper.position.y = -5.0;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.35;
    scene.add(gridHelper);

    // 7. Interactive State Variables
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 0;
    let targetCameraZ = 8.8;

    let warpSpeed = 1.0;
    let isWarping = false;
    let warpTimeout: ReturnType<typeof setTimeout> | null = null;

    // Mouse Parallax
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Scroll Camera Rails Sync
    const updateScrollCamera = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(Math.max(scrollY / docHeight, 0), 1) : 0;

      // 5 Camera Rail Waypoints:
      // Hero (0.0): (0, 0, 8.8)
      // Architecture (0.22): (3.2, -1.2, 6.4)
      // Projects (0.48): (-2.8, -3.2, 5.8)
      // Benchmarks (0.74): (2.4, -5.0, 7.2)
      // Terminal (1.0): (0, -7.5, 6.5)

      if (progress < 0.25) {
        const t = progress / 0.25;
        targetCameraX = THREE.MathUtils.lerp(0, 3.2, t);
        targetCameraY = THREE.MathUtils.lerp(0, -1.2, t);
        targetCameraZ = THREE.MathUtils.lerp(8.8, 6.4, t);
      } else if (progress < 0.50) {
        const t = (progress - 0.25) / 0.25;
        targetCameraX = THREE.MathUtils.lerp(3.2, -2.8, t);
        targetCameraY = THREE.MathUtils.lerp(-1.2, -3.2, t);
        targetCameraZ = THREE.MathUtils.lerp(6.4, 5.8, t);
      } else if (progress < 0.75) {
        const t = (progress - 0.50) / 0.25;
        targetCameraX = THREE.MathUtils.lerp(-2.8, 2.4, t);
        targetCameraY = THREE.MathUtils.lerp(-3.2, -5.0, t);
        targetCameraZ = THREE.MathUtils.lerp(5.8, 7.2, t);
      } else {
        const t = (progress - 0.75) / 0.25;
        targetCameraX = THREE.MathUtils.lerp(2.4, 0, t);
        targetCameraY = THREE.MathUtils.lerp(-5.0, -7.5, t);
        targetCameraZ = THREE.MathUtils.lerp(7.2, 6.5, t);
      }
    };
    window.addEventListener('scroll', updateScrollCamera, { passive: true });
    updateScrollCamera();

    // Hyperdrive Warp Trigger Listener
    const onWarpSurge = () => {
      isWarping = true;
      warpSpeed = 16.0;
      if (warpTimeout) clearTimeout(warpTimeout);
      warpTimeout = setTimeout(() => {
        isWarping = false;
      }, 1400);
    };
    window.addEventListener('trigger-warp-surge', onWarpSurge);

    // Resize Handler
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize, { passive: true });

    // 8. Animation & Telemetry Render Loop
    let lastTime = performance.now();
    let frameCount = 0;
    let currentFps = 60;
    let lastTelemetryDispatch = 0;

    let reqId: number;

    const animate = (time: number) => {
      reqId = requestAnimationFrame(animate);

      const delta = (time - lastTime) * 0.001;
      lastTime = time;

      frameCount++;
      if (time - lastTelemetryDispatch > 500) {
        currentFps = Math.round((frameCount * 1000) / (time - lastTelemetryDispatch));
        frameCount = 0;
        lastTelemetryDispatch = time;

        let activePhase = 'QUANTUM CORE';
        const scrollProgress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1);
        if (scrollProgress > 0.8) activePhase = 'ROOT SHELL';
        else if (scrollProgress > 0.6) activePhase = 'P99 BENCHMARK';
        else if (scrollProgress > 0.35) activePhase = 'MICROSERVICE BENTO';
        else if (scrollProgress > 0.15) activePhase = 'TOPOLOGY MESH';

        window.dispatchEvent(
          new CustomEvent<TelemetryData>('cinematic-telemetry', {
            detail: {
              fps: currentFps,
              cameraCoords: [
                parseFloat(camera.position.x.toFixed(2)),
                parseFloat(camera.position.y.toFixed(2)),
                parseFloat(camera.position.z.toFixed(2)),
              ],
              entityCount: 1 + 3 + microserviceCount + particleCount,
              activePhase,
              isWarping,
            },
          })
        );
      }

      // Smooth camera interpolation towards scroll rail & mouse parallax
      camera.position.x += (targetCameraX + mouseX * 0.8 - camera.position.x) * 0.045;
      camera.position.y += (targetCameraY - mouseY * 0.6 - camera.position.y) * 0.045;
      camera.position.z += (targetCameraZ - camera.position.z) * 0.045;

      camera.lookAt(coreGroup.position.x, coreGroup.position.y - 0.4, coreGroup.position.z);

      // Core Gyroscopic Rotations
      const spinMult = isWarping ? 4.5 : 1.0;
      nucleus.rotation.y += delta * 0.6 * spinMult;
      icosahedron.rotation.x += delta * 0.4 * spinMult;
      icosahedron.rotation.y -= delta * 0.5 * spinMult;

      ring1.rotation.z += delta * 0.8 * spinMult;
      ring2.rotation.y += delta * 0.7 * spinMult;
      ring3.rotation.x += delta * 0.6 * spinMult;

      // Nucleus Pulsing Math
      const pulse = 1.0 + Math.sin(time * 0.0035) * 0.08;
      nucleus.scale.set(pulse, pulse, pulse);

      // Satellite Orbits & Laser Conduit Updates
      const posAttr = conduitGeom.attributes.position as THREE.BufferAttribute;
      const colAttr = conduitGeom.attributes.color as THREE.BufferAttribute;
      const positionsArray = posAttr.array as Float32Array;
      const colorsArray = colAttr.array as Float32Array;

      satellites.forEach((sat, idx) => {
        const u = sat.userData;
        u.orbitAngle += delta * u.orbitSpeed * spinMult;

        const sx = Math.cos(u.orbitAngle) * u.orbitRadius;
        const sy = Math.sin(u.orbitAngle * 1.5) * u.inclination * 1.8;
        const sz = Math.sin(u.orbitAngle) * u.orbitRadius;

        sat.position.set(sx, sy, sz);

        // Update Laser conduit line segment from core (0,0,0) to satellite
        const pIdx = idx * 6;
        positionsArray[pIdx] = coreGroup.position.x;
        positionsArray[pIdx + 1] = coreGroup.position.y;
        positionsArray[pIdx + 2] = coreGroup.position.z;

        positionsArray[pIdx + 3] = sx;
        positionsArray[pIdx + 4] = sy;
        positionsArray[pIdx + 5] = sz;

        // Laser color pulse
        const cVal = 0.5 + Math.sin(time * 0.006 + idx) * 0.5;
        colorsArray[pIdx] = 0.2;
        colorsArray[pIdx + 1] = 0.7 * cVal;
        colorsArray[pIdx + 2] = 0.95;

        colorsArray[pIdx + 3] = 0.95;
        colorsArray[pIdx + 4] = 0.25 * cVal;
        colorsArray[pIdx + 5] = 0.4;
      });
      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;

      // Dynamic Particle Wave Turbulence & Warp Surge
      const pPositions = particleGeom.attributes.position.array as Float32Array;
      const speedDecay = isWarping ? 0.98 : 0.92;
      warpSpeed = Math.max(1.0, warpSpeed * speedDecay);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        if (isWarping || warpSpeed > 1.2) {
          // Hyperdrive stretch along Z-axis toward camera
          pPositions[i3 + 2] += warpSpeed * delta * 25.0;
          if (pPositions[i3 + 2] > 18.0) {
            pPositions[i3 + 2] = -25.0;
          }
        } else {
          // Organic sinusoidal drift math
          const ox = particleOriginalPositions[i3];
          const oy = particleOriginalPositions[i3 + 1];
          const oz = particleOriginalPositions[i3 + 2];

          pPositions[i3] = ox + Math.sin(time * 0.001 + oz * 0.5) * 0.35;
          pPositions[i3 + 1] = oy + Math.cos(time * 0.0012 + ox * 0.5) * 0.35;
          pPositions[i3 + 2] = oz + Math.sin(time * 0.0008 + oy * 0.5) * 0.25;
        }
      }
      particleGeom.attributes.position.needsUpdate = true;

      // Infinite Cyber Grid drift along Z-axis
      gridHelper.position.z = (time * 0.0018 * warpSpeed) % 2.0;

      renderer.render(scene, camera);
    };

    reqId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', updateScrollCamera);
      window.removeEventListener('trigger-warp-surge', onWarpSurge);
      window.removeEventListener('resize', onResize);
      if (warpTimeout) clearTimeout(warpTimeout);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ background: '#050811' }}
    />
  );
};
