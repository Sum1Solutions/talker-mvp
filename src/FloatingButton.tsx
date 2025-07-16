import { useState, useEffect, useRef } from 'react';

interface Props {
  onClick: () => void;
  disabled?: boolean;
  text?: string;
}

export default function FloatingButton({ onClick, disabled = false, text = '🔊 Speak' }: Props) {
  const [position, setPosition] = useState(() => {
    try {
      const saved = localStorage.getItem('floatingButtonPosition');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // Ignore parsing errors
    }
    
    // Default position (bottom right corner above keyboard)
    return { x: window.innerWidth - 180, y: window.innerHeight - 280 };
  });
  
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<number | null>(null);
  
  // Handle window resize to keep button in bounds
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev: {x: number, y: number}) => {
        const newX = Math.min(prev.x, window.innerWidth - 120);
        const newY = Math.min(prev.y, window.innerHeight - 60);
        return { x: Math.max(0, newX), y: Math.max(0, newY) };
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Left click only
    
    e.preventDefault();
    e.stopPropagation();
    
    const buttonRect = buttonRef.current?.getBoundingClientRect();
    if (!buttonRect) return;
    
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - buttonRect.left,
      y: e.clientY - buttonRect.top
    };
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const touch = e.touches[0];
    const buttonRect = buttonRef.current?.getBoundingClientRect();
    if (!buttonRect) return;
    
    setIsDragging(true);
    dragStartPos.current = {
      x: touch.clientX - buttonRect.left,
      y: touch.clientY - buttonRect.top
    };
  };
  
  useEffect(() => {
    if (!isDragging) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const newX = e.clientX - dragStartPos.current.x;
      const newY = e.clientY - dragStartPos.current.y;
      
      // Ensure button stays in viewport
      const adjustedX = Math.max(0, Math.min(newX, window.innerWidth - 120));
      const adjustedY = Math.max(0, Math.min(newY, window.innerHeight - 60));
      
      setPosition({ x: adjustedX, y: adjustedY });
      
      // Throttle localStorage updates
      if (saveTimeoutRef.current === null) {
        saveTimeoutRef.current = window.setTimeout(() => {
          localStorage.setItem('floatingButtonPosition', JSON.stringify({ x: adjustedX, y: adjustedY }));
          saveTimeoutRef.current = null;
        }, 100);
      }
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const newX = touch.clientX - dragStartPos.current.x;
      const newY = touch.clientY - dragStartPos.current.y;
      
      // Ensure button stays in viewport
      const adjustedX = Math.max(0, Math.min(newX, window.innerWidth - 120));
      const adjustedY = Math.max(0, Math.min(newY, window.innerHeight - 60));
      
      setPosition({ x: adjustedX, y: adjustedY });
      
      // Throttle localStorage updates
      if (saveTimeoutRef.current === null) {
        saveTimeoutRef.current = window.setTimeout(() => {
          localStorage.setItem('floatingButtonPosition', JSON.stringify({ x: adjustedX, y: adjustedY }));
          saveTimeoutRef.current = null;
        }, 100);
      }
    };
    
    const handleEnd = () => {
      setIsDragging(false);
    };
    
    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchend', handleEnd);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
      
      // Clear any pending timeout
      if (saveTimeoutRef.current !== null) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
    };
  }, [isDragging]);
  
  const handleClick = () => {
    if (!isDragging && !disabled) {
      onClick();
    }
  };
  
  return (
    <div 
      ref={buttonRef}
      className="floating-button"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: disabled ? 0.7 : 1
      }}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <span className="drag-handle">↕</span> {text}
    </div>
  );
}
