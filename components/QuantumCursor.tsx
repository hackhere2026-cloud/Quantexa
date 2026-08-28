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
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check for touch / mobile device
    if (typeof window !== "undefined") {
      if (window.matchMedia("(pointer: coarse)").matches) {
        setIsTouchDevice(true);
        return;
      }
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates
    let mouse = { x: width / 2, y: height / 2 };
    let smoothMouse = { x: width / 2, y: height / 2 };
    let lastMouse = { x: width / 2, y: height / 2 };

    const particles: Particle[] = [];
    const ripples: Ripple[] = [];
    let orbitAngle = 0;

    // Palette of Quantum Energy colors
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

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // Spawn trail particles based on mouse velocity
      const dx = mouse.x - lastMouse.x;
      const dy = mouse.y - lastMouse.y;
      const dist = Math.hypot(dx, dy);

      // Spawn particles proportionate to movement speed
      const count = Math.min(Math.floor(dist * 0.4) + 1, 8);
      for (let i = 0; i < count; i++) {
        const speed = Math.random() * 1.5 + 0.5;
        const angle = Math.random() * Math.PI * 2;
        const life = Math.random() * 25 + 25;

        particles.push({
          x: mouse.x + (Math.random() - 0.5) * 6,
          y: mouse.y + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 1.2 + (dx * 0.08),
          vy: (Math.random() - 0.5) * 1.2 + (dy * 0.08),
          size: Math.random() * 3 + 1,
          alpha: 1,
          maxLife: life,
          life: life,
          color: colors[Math.floor(Math.random() * colors.length)],
          wavePhase: Math.random() * Math.PI * 2,
          waveFreq: Math.random() * 0.15 + 0.05,
          waveAmp: Math.random() * 1.5 + 0.5,
        });
      }

      lastMouse.x = mouse.x;
      lastMouse.y = mouse.y;

      // Check hover interactive elements
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.tagName === "INPUT" ||
          target.closest("button") ||
          target.closest("a") ||
          target.getAttribute("role") === "button" ||
          target.classList.contains("group") ||
          target.getAttribute("data-hover") === "true")
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);

      // Trigger quantum wave collapse ripple
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 4,
        maxRadius: 45,
        alpha: 1,
        color: "#F0C755",
      });
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 2,
        maxRadius: 30,
        alpha: 0.8,
        color: "#D4A843",
      });

      // Explosion of quantum sparks
      for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * Math.PI * 2 + Math.random() * 0.2;
        const speed = Math.random() * 4 + 2;
        const life = Math.random() * 30 + 20;

        particles.push({
          x: e.clientX,
          y: e.clientY,
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

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Lerp mouse position for smooth HUD reticle
      smoothMouse.x += (mouse.x - smoothMouse.x) * 0.2;
      smoothMouse.y += (mouse.y - smoothMouse.y) * 0.2;

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

      // 2. Render & Update Particles (Probability Wave Motion)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= 1;
        p.alpha = Math.max(0, p.life / p.maxLife);

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Quantum Wave Oscillations
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

      // 3. Draw Quantum Reticle HUD & Orbital Qubits
      orbitAngle += isHovered ? 0.08 : 0.03;
      const targetRadius = isClicking ? 14 : isHovered ? 26 : 18;
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

      // Outer Rotating Quantum Orbit Ring (Dashed HUD)
      ctx.beginPath();
      ctx.arc(0, 0, targetRadius, 0, Math.PI * 2);
      ctx.strokeStyle = isHovered ? "#F0C755" : "rgba(212, 168, 67, 0.55)";
      ctx.lineWidth = isHovered ? 1.8 : 1.2;
      ctx.setLineDash(isHovered ? [6, 3] : [4, 6]);
      ctx.stroke();

      // Draw Corner Bracket Crosshairs when Hovered
      if (isHovered) {
        const bSize = 6;
        const bOffset = targetRadius + 4;
        ctx.strokeStyle = "#FFD700";
        ctx.lineWidth = 1.5;

        // Top-Left Corner
        ctx.beginPath();
        ctx.moveTo(-bOffset, -bOffset + bSize);
        ctx.lineTo(-bOffset, -bOffset);
        ctx.lineTo(-bOffset + bSize, -bOffset);
        ctx.stroke();

        // Top-Right Corner
        ctx.beginPath();
        ctx.moveTo(bOffset - bSize, -bOffset);
        ctx.lineTo(bOffset, -bOffset);
        ctx.lineTo(bOffset, -bOffset + bSize);
        ctx.stroke();

        // Bottom-Left Corner
        ctx.beginPath();
        ctx.moveTo(-bOffset, bOffset - bSize);
        ctx.lineTo(-bOffset, bOffset);
        ctx.lineTo(-bOffset + bSize, bOffset);
        ctx.stroke();

        // Bottom-Right Corner
        ctx.beginPath();
        ctx.moveTo(bOffset - bSize, bOffset);
        ctx.lineTo(bOffset, bOffset);
        ctx.lineTo(bOffset, bOffset - bSize);
        ctx.stroke();
      }

      // 4. Orbiting Quantum Electrons / Sub-particles
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

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[999999]"
      style={{ background: "transparent" }}
    />
  );
}
