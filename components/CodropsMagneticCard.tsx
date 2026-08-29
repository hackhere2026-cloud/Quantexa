"use client";

import { useState, useRef, MouseEvent, ReactNode } from "react";
import { motion } from "framer-motion";

interface CodropsMagneticCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  tiltIntensity?: number;
}

export default function CodropsMagneticCard({
  children,
  className = "",
  glowColor = "rgba(212, 168, 67, 0.4)",
  tiltIntensity = 12,
}: CodropsMagneticCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate normalized position -1 to +1
    const normX = (mouseX / width) * 2 - 1;
    const normY = (mouseY / height) * 2 - 1;

    setTransform({
      rotateX: -normY * tiltIntensity,
      rotateY: normX * tiltIntensity,
    });

    setSpotlight({
      x: (mouseX / width) * 100,
      y: (mouseY / height) * 100,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0 });
    setSpotlight((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: transform.rotateX,
        rotateY: transform.rotateY,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      style={{ perspective: 1000, transformStyle: "preserve-3d" }}
      className={`relative group transition-shadow duration-300 ${className}`}
    >
      {/* Dynamic Mouse-Tracking Optical Gold Lens Flare */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        style={{
          background: `radial-gradient(400px circle at ${spotlight.x}% ${spotlight.y}%, ${glowColor}, transparent 70%)`,
        }}
      />

      {/* Reactive HUD Corner Reticles */}
      <div className="pointer-events-none absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-amber-500/30 group-hover:border-amber-400 group-hover:w-4 group-hover:h-4 transition-all duration-300 z-20" />
      <div className="pointer-events-none absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-amber-500/30 group-hover:border-amber-400 group-hover:w-4 group-hover:h-4 transition-all duration-300 z-20" />
      <div className="pointer-events-none absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-amber-500/30 group-hover:border-amber-400 group-hover:w-4 group-hover:h-4 transition-all duration-300 z-20" />
      <div className="pointer-events-none absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-amber-500/30 group-hover:border-amber-400 group-hover:w-4 group-hover:h-4 transition-all duration-300 z-20" />

      {/* Card Inner Content */}
      <div className="relative z-0 h-full">{children}</div>
    </motion.div>
  );
}
