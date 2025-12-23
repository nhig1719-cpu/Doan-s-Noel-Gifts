
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export const Snowfall: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { x: number; y: number; r: number; d: number; speed: number; o: number }[] = [];
    const mp = 100;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      for (let i = 0; i < mp; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 4 + 1,
          d: Math.random() * mp,
          speed: Math.random() * 0.7 + 0.3,
          o: Math.random() * 0.6 + 0.2
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < mp; i++) {
        const p = particles[i];
        ctx.fillStyle = `rgba(255, 255, 255, ${p.o})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      update();
      animationFrameId = requestAnimationFrame(draw);
    };

    const update = () => {
      for (let i = 0; i < mp; i++) {
        const p = particles[i];
        p.y += p.speed;
        p.x += Math.sin(p.d) * 0.4;
        if (p.y > canvas.height) {
          particles[i] = { ...p, x: Math.random() * canvas.width, y: -10 };
        }
      }
    };

    draw();
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />;
};

export const SantaSleigh: React.FC = () => {
  return (
    <motion.div
      className="fixed z-20 text-6xl pointer-events-none select-none"
      initial={{ left: '-20%', top: '15%', opacity: 0 }}
      animate={{ 
        left: '120%', 
        top: ['15%', '10%', '15%'],
        opacity: [0, 1, 1, 0]
      }}
      transition={{ 
        duration: 15, 
        repeat: Infinity, 
        ease: "linear",
        delay: 5 
      }}
    >
      🎅🦌🦌🦌
    </motion.div>
  );
};

export const ChristmasDecorations: React.FC = () => {
  const floatingEmojis = ['⛄', '🦌', '🔔', '🍪', '🎁', '⭐', '🍭', '🧸'];
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Pine Arch Simulation */}
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-green-900/40 to-transparent flex justify-between px-10 items-start opacity-60">
        <div className="text-7xl -rotate-12 translate-y-[-10px]">🎄</div>
        <div className="flex gap-4 mt-2">
           {[...Array(8)].map((_, i) => (
             <motion.div 
               key={i} 
               animate={{ opacity: [0.4, 1, 0.4] }} 
               transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
               className={`w-3 h-3 rounded-full ${['bg-red-500', 'bg-yellow-400', 'bg-blue-400', 'bg-green-400'][i % 4]} shadow-[0_0_10px_white]`} 
             />
           ))}
        </div>
        <div className="text-7xl rotate-12 translate-y-[-10px]">🎄</div>
      </div>

      {floatingEmojis.map((emoji, i) => (
        <motion.div
          key={i}
          className="absolute text-5xl opacity-20 select-none"
          initial={{ x: `${Math.random() * 100}%`, y: '110vh' }}
          animate={{
            y: ['110vh', '-20vh'],
            x: [`${Math.random() * 80 + 10}%`, `${Math.random() * 80 + 10}%`],
            rotate: [0, 360],
          }}
          transition={{
            duration: Math.random() * 15 + 20,
            repeat: Infinity,
            ease: "linear",
            delay: i * 4
          }}
        >
          {emoji}
        </motion.div>
      ))}

      {/* Love Hearts Background */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`heart-${i}`}
          className="absolute text-pink-500/10 text-6xl"
          style={{ left: `${Math.random() * 95}%`, top: `${Math.random() * 95}%` }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.2, 0.05], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, delay: i }}
        >
          ❤️
        </motion.div>
      ))}
    </div>
  );
};

export const SparkleCursorTrail: React.FC = () => {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.style.left = `${e.pageX}px`;
      sparkle.style.top = `${e.pageY}px`;
      sparkle.style.backgroundColor = ['#FFD700', '#FF69B4', '#FFFFFF', '#FF0000'][Math.floor(Math.random() * 4)];
      document.body.appendChild(sparkle);

      const animation = sparkle.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${(Math.random() - 0.5) * 100}px, ${(Math.random() - 0.5) * 100}px) scale(0)`, opacity: 0 }
      ], {
        duration: 1000,
        easing: 'ease-out'
      });

      animation.onfinish = () => sparkle.remove();
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return null;
};
