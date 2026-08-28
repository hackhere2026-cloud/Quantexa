/**
 * QUANTEXA — Master Cinematic Canvas & Frame Sequence Engine
 * Handles 40-frame sequence interpolation, 3D particles, volumetric lighting,
 * procedural electricity, interactive holographic HUD, and title assembly.
 */

class FrameSequenceLoader {
  constructor(totalFrames = 40, basePath = 'ezgif-842ed9b6c6fdac7d-png-split/') {
    this.totalFrames = totalFrames;
    this.basePath = basePath;
    this.frames = [];
    this.loadedCount = 0;
    this.isLoaded = false;
    this.onProgressCallback = null;
    this.onCompleteCallback = null;
  }

  load(onProgress, onComplete) {
    this.onProgressCallback = onProgress;
    this.onCompleteCallback = onComplete;

    for (let i = 1; i <= this.totalFrames; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      const src = `${this.basePath}ezgif-frame-${frameNum}.png`;
      
      img.onload = () => {
        this.loadedCount++;
        const percent = Math.floor((this.loadedCount / this.totalFrames) * 100);
        if (this.onProgressCallback) {
          this.onProgressCallback(percent, this.loadedCount, this.totalFrames);
        }
        if (this.loadedCount === this.totalFrames) {
          this.isLoaded = true;
          if (this.onCompleteCallback) {
            this.onCompleteCallback(this.frames);
          }
        }
      };

      img.onerror = () => {
        console.warn(`Failed to load frame ${src}, retrying...`);
        // Fallback placeholder image or silent recover
        this.loadedCount++;
        if (this.loadedCount === this.totalFrames) {
          this.isLoaded = true;
          if (this.onCompleteCallback) this.onCompleteCallback(this.frames);
        }
      };

      img.src = src;
      this.frames.push(img);
    }
  }
}

class CinematicCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    
    // Offscreen canvas for typography scanning
    this.scanCanvas = document.createElement('canvas');
    this.scanCtx = this.scanCanvas.getContext('2d', { willReadFrequently: true });
    
    this.width = 0;
    this.height = 0;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.resize();

    // Frame sequence storage
    this.frameLoader = new FrameSequenceLoader(40);
    this.frames = [];
    this.framesLoaded = false;

    // Camera & Motion properties
    this.camera = {
      x: 0,
      y: 0,
      z: 0,
      zoom: 1.0,
      shake: 0,
      rotX: 0,
      rotY: 0
    };

    // Parallax Mouse tracking
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      this.mouse.targetY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    });

    // Particle system (500 neural energy particles)
    this.maxParticles = 500;
    this.particles = [];
    
    // Electricity arcs pool
    this.lightningArcs = [];
    
    // Pulse Shockwaves pool
    this.shockwaves = [];

    // Scanned typography targets
    this.targets = {
      quantexa: [],
      nextEra: []
    };

    // Holographic HUD animation parameters
    this.hudAngle = 0;
    this.scanlineY = 0;

    this.initialized = false;
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(this.dpr, this.dpr);
  }

  // Scan text characters into 3D vectors
  scanTypography(text, fontSize, targetArray, scale = 1.8) {
    const w = 1200;
    const h = 400;
    this.scanCanvas.width = w;
    this.scanCanvas.height = h;
    
    this.scanCtx.fillStyle = '#000000';
    this.scanCtx.fillRect(0, 0, w, h);
    
    this.scanCtx.fillStyle = '#FFFFFF';
    this.scanCtx.font = `900 ${fontSize}px 'Syne', 'Montserrat', sans-serif`;
    this.scanCtx.textAlign = 'center';
    this.scanCtx.textBaseline = 'middle';
    
    this.scanCtx.fillText(text, w / 2, h / 2);
    
    const imgData = this.scanCtx.getImageData(0, 0, w, h);
    const data = imgData.data;
    
    const step = 4;
    targetArray.length = 0;
    
    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        const index = (y * w + x) * 4;
        if (data[index] > 128) {
          targetArray.push({
            x: (x - w / 2) * scale,
            y: (y - h / 2) * scale,
            z: (Math.random() - 0.5) * 40
          });
        }
      }
    }
  }

  init(onProgress, onComplete) {
    // 1. Scan QUANTEXA and Subtitle text target coordinates
    this.scanTypography("QUANTEXA", 150, this.targets.quantexa, 2.0);
    this.scanTypography("CODE THE NEXT ERA", 70, this.targets.nextEra, 1.6);

    // 2. Initialize Particles (Floating space & neural energy)
    this.particles = [];
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push({
        x: (Math.random() - 0.5) * 1800,
        y: (Math.random() - 0.5) * 1200,
        z: Math.random() * 800 + 50,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        vz: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2.5 + 0.5,
        baseAlpha: Math.random() * 0.7 + 0.3,
        color: i % 3 === 0 ? '#D4A843' : (i % 3 === 1 ? '#E8832A' : '#ffffff')
      });
    }

    // 3. Load 40 PNG sequential frames
    this.frameLoader.load(onProgress, (loadedFrames) => {
      this.frames = loadedFrames;
      this.framesLoaded = true;
      this.initialized = true;
      if (onComplete) onComplete();
    });
  }

  // 3D Perspective Projection
  project(x, y, z) {
    const fov = 400;
    const rz = z + 400 - this.camera.z;
    if (rz <= 1) return null;

    const scale = fov / rz;
    const sx = this.width / 2 + (x + this.camera.x) * scale;
    const sy = this.height / 2 + (y + this.camera.y) * scale;

    return { x: sx, y: sy, scale: scale, depth: rz };
  }

  // Trigger pulse shockwave & camera shake
  triggerPulse(x = this.width / 2, y = this.height / 2, intensity = 20) {
    this.camera.shake = intensity;
    this.shockwaves.push({
      x: x,
      y: y,
      radius: 10,
      maxRadius: Math.max(this.width, this.height) * 0.6,
      alpha: 1.0,
      speed: 18
    });
  }

  // Generate procedural lightning electricity
  generateElectricityArc() {
    if (Math.random() > 0.35) return;
    
    const cx = this.width / 2;
    const cy = this.height / 2;
    const startAngle = Math.random() * Math.PI * 2;
    const dist = 100 + Math.random() * 180;
    const startX = cx + Math.cos(startAngle) * dist;
    const startY = cy + Math.sin(startAngle) * dist;
    
    const endX = startX + (Math.random() - 0.5) * 200;
    const endY = startY + (Math.random() - 0.5) * 200;
    
    this.lightningArcs.push({
      startX, startY, endX, endY,
      life: 1.0,
      color: Math.random() > 0.5 ? '#D4A843' : '#E8832A'
    });
  }

  // MAIN RENDER METHOD (progress: 0.0 to 1.0 representing the sequence)
  render(progress, timeSec = 0) {
    const w = this.width;
    const h = this.height;

    // Smooth Mouse Parallax
    this.mouse.x += (this.mouse.targetX * 25 - this.mouse.x) * 0.08;
    this.mouse.y += (this.mouse.targetY * 25 - this.mouse.y) * 0.08;
    
    // Camera Breathing & Motion
    const breathe = Math.sin(timeSec * 1.5) * 4;
    this.camera.x = this.mouse.x;
    this.camera.y = this.mouse.y + breathe;
    
    // Apply Shake decay
    if (this.camera.shake > 0.1) {
      this.camera.x += (Math.random() - 0.5) * this.camera.shake;
      this.camera.y += (Math.random() - 0.5) * this.camera.shake;
      this.camera.shake *= 0.9;
    }

    // 1. Clear background: Deep Black with Volumetric Fog Gradient
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, w, h);

    // Volumetric Background Lighting Cones
    const bgGrad = this.ctx.createRadialGradient(
      w / 2 + this.mouse.x * 2, h / 2 + this.mouse.y * 2, 50,
      w / 2, h / 2, Math.max(w, h) * 0.75
    );
    bgGrad.addColorStop(0, 'rgba(212, 168, 67, 0.18)');
    bgGrad.addColorStop(0.4, 'rgba(240, 199, 85, 0.06)');
    bgGrad.addColorStop(1, 'rgba(0, 0, 0, 1)');
    this.ctx.fillStyle = bgGrad;
    this.ctx.fillRect(0, 0, w, h);

    // 2. Draw 40-Frame Sequence with Optical Flow / Cross-Dissolve Frame Interpolation
    if (this.framesLoaded && this.frames.length > 0) {
      this.renderFrameSequence(progress);
    }

    // 3. Volumetric Fog & Anamorphic Light Rays
    this.renderVolumetricRays(timeSec);

    // 4. Procedural Electricity Arcs
    this.renderElectricityArcs();

    // 5. Neural Particle Swarm
    this.renderParticles(progress, timeSec);

    // 6. Interactive Holographic Sci-Fi HUD Overlay
    this.renderHolographicHUD(progress, timeSec);

    // 7. Pulse Shockwaves
    this.renderShockwaves();

    // 8. Completed Transformation (Frame 40+ Title Assembly)
    if (progress >= 0.95) {
      this.renderTitleAssembly((progress - 0.95) / 0.05, timeSec);
    }
  }

  // Optical-Flow / Interpolated Frame Sequence Renderer
  renderFrameSequence(progress) {
    const total = this.frames.length;
    if (total === 0) return;

    // Calculate fractional frame index (0.0 to 39.0)
    const exactFrame = progress * (total - 1);
    const f1 = Math.floor(exactFrame);
    const f2 = Math.min(total - 1, f1 + 1);
    const blend = exactFrame - f1; // 0.0 to 1.0 blend factor

    const img1 = this.frames[f1];
    const img2 = this.frames[f2];

    if (!img1 || !img1.complete) return;

    const w = this.width;
    const h = this.height;

    // Calculate Aspect Cover / Fit dimensions
    const imgAspect = img1.width / img1.height;
    const screenAspect = w / h;

    let renderW, renderH, renderX, renderY;

    if (screenAspect > imgAspect) {
      renderW = w * 1.05; // Slightly oversized for camera movement margin
      renderH = renderW / imgAspect;
    } else {
      renderH = h * 1.05;
      renderW = renderH * imgAspect;
    }

    renderX = (w - renderW) / 2 + this.camera.x;
    renderY = (h - renderH) / 2 + this.camera.y;

    // Slow Camera Dolly In zoom factor
    const zoomScale = 1.0 + progress * 0.08;
    const finalW = renderW * zoomScale;
    const finalH = renderH * zoomScale;
    const finalX = renderX - (finalW - renderW) / 2;
    const finalY = renderY - (finalH - renderH) / 2;

    this.ctx.save();

    // Draw Frame 1
    this.ctx.globalAlpha = 1.0 - blend;
    this.ctx.drawImage(img1, finalX, finalY, finalW, finalH);

    // Draw Frame 2 cross-fade blend
    if (img2 && img2.complete && blend > 0.001) {
      this.ctx.globalAlpha = blend;
      this.ctx.drawImage(img2, finalX, finalY, finalW, finalH);
    }

    this.ctx.restore();
  }

  // Volumetric Light Rays & Bloom
  renderVolumetricRays(timeSec) {
    const w = this.width;
    const h = this.height;
    this.ctx.save();
    this.ctx.globalCompositeOperation = 'screen';

    const rayAngle = Math.sin(timeSec * 0.5) * 0.1;
    const grad = this.ctx.createLinearGradient(w * 0.3, 0, w * 0.7, h);
    grad.addColorStop(0, 'rgba(240, 199, 85, 0.08)');
    grad.addColorStop(0.5, 'rgba(212, 168, 67, 0.03)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    this.ctx.fillStyle = grad;
    this.ctx.beginPath();
    this.ctx.moveTo(w * 0.2, 0);
    this.ctx.lineTo(w * 0.8, 0);
    this.ctx.lineTo(w * 0.9, h);
    this.ctx.lineTo(w * 0.1, h);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.restore();
  }

  // Electricity Arcs
  renderElectricityArcs() {
    this.generateElectricityArc();

    for (let i = this.lightningArcs.length - 1; i >= 0; i--) {
      const arc = this.lightningArcs[i];
      arc.life -= 0.1;

      if (arc.life <= 0) {
        this.lightningArcs.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.strokeStyle = arc.color;
      this.ctx.globalAlpha = arc.life;
      this.ctx.lineWidth = 1.5;
      this.ctx.shadowColor = arc.color;
      this.ctx.shadowBlur = 10;

      // Draw jagged lightning line
      this.ctx.beginPath();
      this.ctx.moveTo(arc.startX, arc.startY);

      const segments = 5;
      let currX = arc.startX;
      let currY = arc.startY;

      for (let j = 1; j <= segments; j++) {
        const t = j / segments;
        const targetX = arc.startX + (arc.endX - arc.startX) * t;
        const targetY = arc.startY + (arc.endY - arc.startY) * t;
        
        const offset = (Math.random() - 0.5) * 30 * arc.life;
        const nextX = targetX + offset;
        const nextY = targetY + offset;

        this.ctx.lineTo(nextX, nextY);
        currX = nextX;
        currY = nextY;
      }

      this.ctx.stroke();
      this.ctx.restore();
    }
  }

  // Neural Particle Swarm
  renderParticles(progress, timeSec) {
    let currentTargets = null;
    let targetBlend = 0.0;

    // At completion (progress > 0.95), particles form QUANTEXA title
    if (progress >= 0.95) {
      currentTargets = this.targets.quantexa;
      targetBlend = Math.min(1.0, (progress - 0.95) / 0.04);
    }

    this.ctx.save();

    for (let i = 0; i < this.maxParticles; i++) {
      const p = this.particles[i];

      if (currentTargets && i < currentTargets.length) {
        const target = currentTargets[i];
        const proj = this.project(target.x, target.y, target.z);

        if (proj) {
          p.x += (proj.x - p.x) * 0.1 * targetBlend;
          p.y += (proj.y - p.y) * 0.1 * targetBlend;
          p.color = '#D4A843';
        }
      } else {
        // Free orbital floating motion
        p.x += p.vx + Math.sin(timeSec + i) * 0.3;
        p.y += p.vy + Math.cos(timeSec + i) * 0.3;

        if (p.x < 0) p.x = this.width;
        if (p.x > this.width) p.x = 0;
        if (p.y < 0) p.y = this.height;
        if (p.y > this.height) p.y = 0;
      }

      // Draw particle
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.baseAlpha;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();

      // Connect nearby particles with subtle energy lines
      if (i % 8 === 0) {
        for (let j = i + 1; j < Math.min(i + 15, this.maxParticles); j++) {
          const p2 = this.particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 90) {
            this.ctx.strokeStyle = 'rgba(240, 199, 85, 0.12)';
            this.ctx.lineWidth = 0.5;
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.stroke();
          }
        }
      }
    }

    this.ctx.restore();
  }

  // Sci-Fi Holographic HUD Overlay
  renderHolographicHUD(progress, timeSec) {
    const w = this.width;
    const h = this.height;
    const cx = w / 2;
    const cy = h / 2;

    this.ctx.save();
    this.hudAngle += 0.008;

    // Central Targeting Reticle
    const radius = 180 + Math.sin(timeSec * 2) * 8;
    this.ctx.strokeStyle = 'rgba(240, 199, 85, 0.25)';
    this.ctx.lineWidth = 1;

    // Reticle Outer Ring
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    this.ctx.stroke();

    // Rotating HUD Tick Marks
    const ticks = 8;
    for (let i = 0; i < ticks; i++) {
      const angle = (i / ticks) * Math.PI * 2 + this.hudAngle;
      const x1 = cx + Math.cos(angle) * (radius - 10);
      const y1 = cy + Math.sin(angle) * (radius - 10);
      const x2 = cx + Math.cos(angle) * (radius + 10);
      const y2 = cy + Math.sin(angle) * (radius + 10);

      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
    }

    // Telemetry Text
    this.ctx.font = '10px "Space Mono", "Montserrat", monospace';
    this.ctx.fillStyle = 'rgba(240, 199, 85, 0.7)';
    
    const frameIndex = Math.floor(progress * 39) + 1;
    const frameStr = String(frameIndex).padStart(2, '0');
    
    this.ctx.fillText(`SYS.ID // QTX-2026`, cx - radius - 120, cy - radius);
    this.ctx.fillText(`TRANSFORMATION :: ${Math.floor(progress * 100)}%`, cx + radius + 20, cy - radius);
    this.ctx.fillText(`FRAME [${frameStr}/40]`, cx + radius + 20, cy - radius + 18);
    this.ctx.fillText(`NEURAL_SYNC :: 99.8% [ACTIVE]`, cx - radius - 120, cy + radius + 20);

    // Scanning Laser Line
    this.scanlineY = (this.scanlineY + 2.5) % h;
    this.ctx.strokeStyle = 'rgba(240, 199, 85, 0.15)';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.scanlineY);
    this.ctx.lineTo(w, this.scanlineY);
    this.ctx.stroke();

    this.ctx.restore();
  }

  // Shockwaves
  renderShockwaves() {
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const wave = this.shockwaves[i];
      wave.radius += wave.speed;
      wave.alpha = 1.0 - (wave.radius / wave.maxRadius);

      if (wave.alpha <= 0) {
        this.shockwaves.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.strokeStyle = `rgba(240, 199, 85, ${wave.alpha * 0.6})`;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.restore();
    }
  }

  // Title Assembly (Frame 40 Completion)
  renderTitleAssembly(completionFactor, timeSec) {
    const w = this.width;
    const h = this.height;
    this.ctx.save();
    
    const alpha = Math.min(1.0, completionFactor);
    this.ctx.globalAlpha = alpha;

    // Glowing Radial Backdrop behind letters
    const grad = this.ctx.createRadialGradient(w/2, h/2, 20, w/2, h/2, 350);
    grad.addColorStop(0, 'rgba(240, 199, 85, 0.25)');
    grad.addColorStop(0.6, 'rgba(212, 168, 67, 0.08)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, w, h);

    this.ctx.restore();
  }
}

window.CinematicCanvas = CinematicCanvas;
