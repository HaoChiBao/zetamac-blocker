import React, { useRef, useEffect } from 'react';
import './Carousel.css';

interface CarouselProps {
  children: React.ReactNode;
}

export const Carousel: React.FC<CarouselProps> = ({ children }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      const onWheel = (e: WheelEvent) => {
        if (e.deltaY === 0) return;
        e.preventDefault();
        el.scrollTo({
          left: el.scrollLeft + e.deltaY,
          behavior: 'smooth'
        });
      };
      el.addEventListener('wheel', onWheel);
      return () => el.removeEventListener('wheel', onWheel);
    }
  }, []);

  // Auto-rotation
  useEffect(() => {
    const el = scrollRef.current;
    let animationFrameId: number;

    const scroll = () => {
      if (el) {
        // Slower speed: 0.5 pixels per frame
        el.scrollLeft += 0.5; 
        
        // Infinite loop logic
        // We assume children are duplicated. 
        // When we scroll past the first set (halfway), reset to 0.
        // We use a small buffer to ensure smoothness.
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="carousel-container" ref={scrollRef}>
      <div className="carousel-track">
        {children}
        {/* Duplicate children for infinite loop effect */}
        {children}
      </div>
    </div>
  );
};
