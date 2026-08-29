"use client";

import { useState, useRef, MouseEvent, ReactNode } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
}

interface CodropsParticleButtonProps {
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  href?: string;
  className?: string;
  target?: string;
  rel?: string;
}

export default function CodropsParticleButton({
  children,
  onClick,
  href,
  className = "",
  target,
  rel,
}: CodropsParticleButtonProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);

  const createParticles = (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const colors = ["#FFF5C0", "#F0C755", "#D4A843", "#FFD700"];
    const newParticles: Particle[] = Array.from({ length: 16 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 16 + (Math.random() - 0.5);
      const speed = Math.random() * 4 + 2;
      return {
        id: Date.now() + i,
        x: clickX,
        y: clickY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
      };
    });

    setParticles((prev) => [...prev, ...newParticles]);

    // Animate and clear particles
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.includes(p)));
    }, 600);
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    createParticles(e);
    if (onClick) onClick(e);
  };

  const content = (
    <motion.span
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className="relative z-10 flex items-center justify-center gap-2 w-full h-full"
    >
      {children}
    </motion.span>
  );

  return (
    <div className="relative inline-block overflow-visible">
      {/* Particle Canvas / Emitter Layer */}
      <div className="pointer-events-none absolute inset-0 overflow-visible z-30">
        {particles.map((p) => (
          <motion.span
            key={p.id}
            initial={{ x: p.x, y: p.y, opacity: 1, scale: 1 }}
            animate={{
              x: p.x + p.vx * 15,
              y: p.y + p.vy * 15,
              opacity: 0,
              scale: 0.2,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              position: "absolute",
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: p.color,
              boxShadow: `0 0 10px ${p.color}`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>

      {href ? (
        <a
          ref={buttonRef as any}
          href={href}
          target={target}
          rel={rel}
          onClick={handleClick as any}
          className={`relative overflow-hidden group ${className}`}
        >
          {content}
        </a>
      ) : (
        <button
          ref={buttonRef as any}
          onClick={handleClick as any}
          className={`relative overflow-hidden group ${className}`}
        >
          {content}
        </button>
      )}
    </div>
  );
}
