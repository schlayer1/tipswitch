import React, { useEffect, useRef, useState } from 'react';

interface AutoScrollTextProps {
  text: string;
  className?: string;
  maxHeight?: string;
  speed?: number; // pixels per animation frame
  delay?: number; // initial pause in ms
  isActive?: boolean;
}

export const AutoScrollText: React.FC<AutoScrollTextProps> = ({
  text,
  className = '',
  maxHeight = 'max-h-[64px] sm:max-h-[76px]',
  speed = 0.35,
  delay = 2000,
  isActive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);
  const isInteractingRef = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !isActive) return;

    el.scrollTop = 0;
    const maxScroll = el.scrollHeight - el.clientHeight;

    if (maxScroll <= 3) {
      setCanScroll(false);
      return;
    }

    setCanScroll(true);

    let animId: number;
    let timerId: any;
    let direction = 1; // 1 = down, -1 = up

    const scrollLoop = () => {
      if (!el) return;

      if (isInteractingRef.current) {
        animId = requestAnimationFrame(scrollLoop);
        return;
      }

      const currentMax = el.scrollHeight - el.clientHeight;
      if (currentMax <= 3) return;

      if (direction === 1) {
        if (el.scrollTop < currentMax) {
          el.scrollTop += speed;
          animId = requestAnimationFrame(scrollLoop);
        } else {
          // Pause at the bottom so user finishes reading
          timerId = setTimeout(() => {
            direction = -1;
            animId = requestAnimationFrame(scrollLoop);
          }, 2400);
        }
      } else {
        if (el.scrollTop > 0) {
          el.scrollTop -= speed * 1.4; // smooth return glide
          animId = requestAnimationFrame(scrollLoop);
        } else {
          // Pause at the top
          timerId = setTimeout(() => {
            direction = 1;
            animId = requestAnimationFrame(scrollLoop);
          }, 2000);
        }
      }
    };

    // Initial reading delay before autoscroll begins
    timerId = setTimeout(() => {
      animId = requestAnimationFrame(scrollLoop);
    }, delay);

    return () => {
      clearTimeout(timerId);
      cancelAnimationFrame(animId);
      if (el) el.scrollTop = 0;
    };
  }, [text, isActive, speed, delay]);

  return (
    <div className="relative w-full">
      <div
        ref={containerRef}
        onPointerDown={(e) => {
          // Stop propagation so touching text never starts a card swipe/super-like
          e.stopPropagation();
        }}
        onTouchStart={(e) => {
          isInteractingRef.current = true;
          e.stopPropagation();
        }}
        onTouchEnd={() => {
          // Resume autoscroll 1.5s after user lifts finger
          setTimeout(() => {
            isInteractingRef.current = false;
          }, 1500);
        }}
        onMouseEnter={() => {
          isInteractingRef.current = true;
        }}
        onMouseLeave={() => {
          isInteractingRef.current = false;
        }}
        className={`overflow-y-auto no-scrollbar overscroll-contain transition-all ${maxHeight} ${className}`}
        style={{
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y',
        }}
      >
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          {text}
        </p>
      </div>

      {/* Subtle indicator hint if the text is long and autoscrolling */}
      {canScroll && (
        <div className="pointer-events-none absolute bottom-0 right-0 left-0 h-3 bg-gradient-to-t from-white/90 to-transparent" />
      )}
    </div>
  );
};
