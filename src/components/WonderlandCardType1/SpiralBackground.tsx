import React, { useRef, useEffect } from "react";

export interface SpiralBackgroundProps {
  isActive?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
  spiralDensity?: number;
  distortionFactor?: number;
  animationSpeed?: number;
  spiralLayers?: number;
  tendrilCount?: number;
  particleCount?: number;
  particleColor?: string;
  backgroundColorDefault?: string;
  backgroundColorActive?: string;
  style?: React.CSSProperties;
}

const DEFAULT_OVERLAY = "rgba(255,255,255,1)";
const DEFAULT_OVERLAY_OPACITY = 0.02;

const SpiralBackground: React.FC<SpiralBackgroundProps> = ({
  isActive = false,
  overlayColor = DEFAULT_OVERLAY,
  overlayOpacity = DEFAULT_OVERLAY_OPACITY,
  spiralDensity = 8,
  distortionFactor = 0.9,
  animationSpeed = 0.5,
  spiralLayers = 3,
  tendrilCount = 3,
  particleCount = 600,
  particleColor = "rgba(255,255,255,0.17)",
  backgroundColorDefault = "rgba(0,0,0,0.052)",
  backgroundColorActive = "rgba(21,1,25,1)",
  style = {},
}) => {
  const spiralRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = spiralRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      if (!canvas) return;
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    let time = 0;
    let mouseX = (canvas.offsetWidth || 0) / 2;
    let mouseY = (canvas.offsetHeight || 0) / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let vx = 0,
      vy = 0;
    const spring = 0.3,
      friction = 0.8;

    const handleMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseX =
        (e.clientX - rect.left) * (canvas.offsetWidth / rect.width);
      mouseY =
        (e.clientY - rect.top) * (canvas.offsetHeight / rect.height);
    };

    const handleLeave = () => {
      if (!canvas) return;
      mouseX = canvas.offsetWidth / 2;
      mouseY = canvas.offsetHeight / 2;
    };

    canvas.addEventListener("mousemove", handleMove);
    canvas.addEventListener("mouseleave", handleLeave);

    let frameId: number;

    const animate = () => {
      if (!canvas || !ctx) return;
      time += 0.01 * animationSpeed;
      ctx.fillStyle = isActive
        ? backgroundColorActive!
        : backgroundColorDefault!;
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Smooth cursor in active mode
      if (isActive) {
        vx += (mouseX - cursorX) * spring;
        vy += (mouseY - cursorY) * spring;
        vx *= friction;
        vy *= friction;
        cursorX += vx;
        cursorY += vy;
      } else {
        cursorX = mouseX;
        cursorY = mouseY;
      }

      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      const centerX = width / 2;
      const centerY = height / 2;
      const normX = (cursorX - centerX) / (width / 2);
      const normY = (cursorY - centerY) / (height / 2);

      // Base spiral: always rotates, thickness depends on isActive
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = isActive ? 2.2 : 1; // inactive: 1, active: 1.5
      const maxRadius = Math.min(width, height) * 0.4;
      for (let angle = 0; angle < Math.PI * 10; angle += 0.1) {
        const radius = (angle / (Math.PI * 10)) * maxRadius;
        const x =
          centerX +
          Math.cos(angle + time) * radius * (1 + normX * 0.2);
        const y =
          centerY +
          Math.sin(angle + time) * radius * (1 + normY * 0.2);
        if (angle === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Fancy stuff for active
      if (isActive) {
        // Spiral layers, all 1.5× thicker
        for (let layer = 0; layer < spiralLayers; layer++) {
          const r =
            Math.min(width, height) * 0.4 * (0.6 + layer * 0.2);
          const d = spiralDensity * (0.8 + layer * 0.1);
          const rotation = time * 0.1 + (layer * Math.PI) / 4;
          const alpha = 0.2 - layer * 0.05;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
          ctx.lineWidth = 1.5 * 1.5; // always 1.5 times the normal: normal=1, active=1.5, so layer=2.25
          for (let a = 0; a < Math.PI * 2 * d; a += 0.05) {
            const progress = a / (Math.PI * 2 * d);
            const currentRadius = progress * r;
            const baseDist =
              distortionFactor *
              (1 + Math.sqrt(normX * normX + normY * normY) * 0.5);
            const warpedAngle =
              a +
              Math.sin(a * 3 + time * 0.2) * baseDist * 0.1 +
              Math.cos(a * 2 + time * 0.1) * baseDist * 0.05;
            const warpedRadius =
              currentRadius *
              (1 + Math.sin(a * 5 + time * 0.3) * baseDist * 0.03);
            const x =
              centerX +
              Math.cos(warpedAngle + rotation) * warpedRadius;
            const y =
              centerY +
              Math.sin(warpedAngle + rotation) * warpedRadius;
            if (a === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }

        // Tendrils, all 1.5× thicker
        for (let i = 0; i < tendrilCount; i++) {
          const baseAngle =
            (i / tendrilCount) * Math.PI * 2 + time * 0.2;
          const len =
            Math.min(width, height) *
            0.4 *
            (0.4 + Math.sin(time * 0.3 + i) * 0.25);
          ctx.save();
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255,255,255,${
            0.21 + Math.sin(time + i) * 0.13
          })`;
          ctx.lineWidth =
            (1 + Math.sin(time * 0.5 + i * 2) * 0.5) * 1.5; // 1.5× thicker
          let x = centerX,
            y = centerY;
          ctx.moveTo(x, y);
          for (let j = 0; j < len; j += 3) {
            const baseDist =
              distortionFactor *
              (1 + Math.sqrt(normX * normX + normY * normY) * 0.5);
            const distortion = j * 0.02 * baseDist;
            const angle =
              baseAngle +
              Math.sin(j * 0.1 + time * 0.5) * distortion +
              Math.cos(j * 0.05 + time * 0.3) * distortion;
            x += Math.cos(angle) * 3;
            y += Math.sin(angle) * 3;
            ctx.lineTo(x, y);
          }
          ctx.stroke();
          ctx.restore();
        }

        // Overlay
        if (overlayColor && overlayOpacity > 0) {
          ctx.save();
          ctx.globalAlpha = overlayOpacity;
          ctx.fillStyle = overlayColor;
          ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
          ctx.globalAlpha = 1;
          ctx.restore();
        }
      }

      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (canvas) {
        canvas.removeEventListener("mousemove", handleMove);
        canvas.removeEventListener("mouseleave", handleLeave);
      }
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameId);
    };
  }, [
    isActive,
    overlayColor,
    overlayOpacity,
    spiralDensity,
    distortionFactor,
    animationSpeed,
    spiralLayers,
    tendrilCount,
    backgroundColorDefault,
    backgroundColorActive,
  ]);

  useEffect(() => {
    const canvas = particlesRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const particles: {
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
    }[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * (canvas.width || 1),
        y: Math.random() * (canvas.height || 1),
        size: Math.random() * 2 + 0.1,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      });
    }
    let frameId: number;
    const animateParticles = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x += canvas.width;
        if (p.x > canvas.width) p.x -= canvas.width;
        if (p.y < 0) p.y += canvas.height;
        if (p.y > canvas.height) p.y -= canvas.height;
        ctx.beginPath();
        ctx.fillStyle = particleColor;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      frameId = requestAnimationFrame(animateParticles);
    };
    animateParticles();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameId);
    };
  }, [particleCount, particleColor]);

  const brightness = isActive ? 1 : 0.5;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        ...style,
      }}
    >
      <canvas
        ref={spiralRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          filter: `brightness(${brightness})`,
          zIndex: 1,
        }}
      />
      <canvas
        ref={particlesRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      />
    </div>
  );
};

export default SpiralBackground;
