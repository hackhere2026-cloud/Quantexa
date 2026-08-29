"use client";

import React, { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxLife: number;
  life: number;
  color: string;
  wavePhase: number;
  waveFreq: number;
  waveAmp: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

export default function QuantumCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isTouchActive, setIsTouchActive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = { x: -1000, y: -1000 };
    let smoothMouse = { x: -1000, y: -1000 };
    let lastMouse = { x: -1000, y: -1000 };

    const particles: Particle[] = [];
    const ripples: Ripple[] = [];
    let orbitAngle = 0;

    const colors = [
      "#D4A843", // Gold
      "#F0C755", // Light Gold
      "#FFD700", // Quantum Amber
      "#FFF5C0", // Super Radiance
      "#FFFFFF", // Spark Core
    ];

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const spawnParticles = (x: number, y: number, dx: number, dy: number, isTouch = false) => {
      const dist = Math.hypot(dx, dy);
      const count = isTouch
        ? Math.min(Math.floor(dist * 0.5) + 2, 10)
        : Math.min(Math.floor(dist * 0.4) + 1, 8);

      for (let i = 0; i < count; i++) {
        const life = Math.random() * 25 + 20;

        particles.push({
          x: x + (Math.random() - 0.5) * 8,
          y: y + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * 1.5 + dx * 0.08,
          vy: (Math.random() - 0.5) * 1.5 + dy * 0.08,
          size: Math.random() * (isTouch ? 3.5 : 3) + 1,
          alpha: 1,
          maxLife: life,
          life: life,
          color: colors[Math.floor(Math.random() * colors.length)],
          wavePhase: Math.random() * Math.PI * 2,
          waveFreq: Math.random() * 0.15 + 0.05,
          waveAmp: Math.random() * 1.5 + 0.5,
        });
      }
    };

    const triggerBurst = (x: number, y: number) => {
      ripples.push({
        x,
        y,
        radius: 4,
        maxRadius: 45,
        alpha: 1,
        color: "#F0C755",
      });
      ripples.push({
        x,
        y,
        radius: 2,
        maxRadius: 30,
        alpha: 0.8,
        color: "#D4A843",
      });

      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2 + Math.random() * 0.2;
        const speed = Math.random() * 4 + 2;
        const life = Math.random() * 30 + 20;

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 4 + 1.5,
          alpha: 1,
          maxLife: life,
          life: life,
          color: colors[Math.floor(Math.random() * colors.length)],
          wavePhase: Math.random() * Math.PI * 2,
          waveFreq: 0.1,
          waveAmp: 1,
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      if (lastMouse.x > -500) {
        const dx = mouse.x - lastMouse.x;
        const dy = mouse.y - lastMouse.y;
        spawnParticles(mouse.x, mouse.y, dx, dy, false);
      }

      lastMouse.x = mouse.x;
      lastMouse.y = mouse.y;

      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.tagName === "INPUT" ||
          target.closest("button") ||
          target.closest("a") ||
          target.getAttribute("role") === "button" ||
          target.classList.contains("group"))
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        mouse.x = touch.clientX;
        mouse.y = touch.clientY;
        setIsTouchActive(true);

        if (lastMouse.x > -500) {
          const dx = mouse.x - lastMouse.x;
          const dy = mouse.y - lastMouse.y;
          spawnParticles(mouse.x, mouse.y, dx, dy, true);
        }

        lastMouse.x = mouse.x;
        lastMouse.y = mouse.y;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        mouse.x = touch.clientX;
        mouse.y = touch.clientY;
        smoothMouse.x = touch.clientX;
        smoothMouse.y = touch.clientY;
        lastMouse.x = touch.clientX;
        lastMouse.y = touch.clientY;
        setIsTouchActive(true);
        triggerBurst(touch.clientX, touch.clientY);
      }
    };

    const handleTouchEnd = () => {
      setIsTouchActive(false);
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      triggerBurst(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (smoothMouse.x < -500) {
        smoothMouse.x = mouse.x;
        smoothMouse.y = mouse.y;
      } else {
        smoothMouse.x += (mouse.x - smoothMouse.x) * 0.22;
        smoothMouse.y += (mouse.y - smoothMouse.y) * 0.22;
      }

      // 1. Draw Quantum Interference Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += (r.maxRadius - r.radius) * 0.15;
        r.alpha -= 0.03;

        if (r.alpha <= 0) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = r.color;
        ctx.globalAlpha = Math.max(0, r.alpha);
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.restore();
      }

      // 2. Render & Update Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= 1;
        p.alpha = Math.max(0, p.life / p.maxLife);

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        p.wavePhase += p.waveFreq;
        const waveX = Math.cos(p.wavePhase) * p.waveAmp;
        const waveY = Math.sin(p.wavePhase) * p.waveAmp;

        p.x += p.vx + waveX;
        p.y += p.vy + waveY;
        p.vx *= 0.96;
        p.vy *= 0.96;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.2, p.size * p.alpha), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = "#D4A843";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }

      // 3. Draw Quantum Reticle HUD (if active on screen)
      if (mouse.x > 0 && mouse.y > 0) {
        orbitAngle += isHovered ? 0.08 : 0.03;
        const targetRadius = isClicking || isTouchActive ? 14 : isHovered ? 26 : 18;
        const coreSize = isHovered ? 4 : 3;

        ctx.save();
        ctx.translate(smoothMouse.x, smoothMouse.y);

        // Core Quantum Point
        ctx.beginPath();
        ctx.arc(0, 0, coreSize, 0, Math.PI * 2);
        ctx.fillStyle = "#FFF5C0";
        ctx.shadowColor = "#F0C755";
        ctx.shadowBlur = 12;
        ctx.fill();

        // Outer Rotating Quantum Ring
        ctx.beginPath();
        ctx.arc(0, 0, targetRadius, 0, Math.PI * 2);
        ctx.strokeStyle = isHovered ? "#F0C755" : "rgba(212, 168, 67, 0.65)";
        ctx.lineWidth = isHovered ? 1.8 : 1.2;
        ctx.setLineDash(isHovered ? [6, 3] : [4, 6]);
        ctx.stroke();

        // Orbiting Quantum Qubits
        const numElectrons = 3;
        for (let e = 0; e < numElectrons; e++) {
          const eAngle = orbitAngle + (e * (Math.PI * 2)) / numElectrons;
          const orbitDist = targetRadius + (isHovered ? 8 : 4);
          const ex = Math.cos(eAngle) * orbitDist;
          const ey = Math.sin(eAngle) * orbitDist;

          ctx.beginPath();
          ctx.arc(ex, ey, isHovered ? 2.2 : 1.5, 0, Math.PI * 2);
          ctx.fillStyle = e % 2 === 0 ? "#F0C755" : "#FFFFFF";
          ctx.shadowColor = "#D4A843";
          ctx.shadowBlur = 10;
          ctx.fill();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[999999]"
      style={{ background: "transparent" }}
    />
  );
}
