import { useRef, useEffect, RefObject } from 'react';

type SwipeDirection = 'left' | 'right' | 'up' | 'down';

interface UseSwipeGestureProps {
  onSwipe?: (direction: SwipeDirection) => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  preventDefault?: boolean;
}

export function useSwipeGesture<T extends HTMLElement = HTMLDivElement>({
  onSwipe,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  preventDefault = false
}: UseSwipeGestureProps = {}): RefObject<T> {
  const elementRef = useRef<T>(null);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    let startX: number;
    let startY: number;
    let startTime: number;
    
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = Date.now();
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      if (!startX || !startY) return;
      
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const timeElapsed = Date.now() - startTime;
      
      // Verificar se o gesto foi rápido o suficiente (menos de 300ms)
      const isQuickSwipe = timeElapsed < 300;
      
      // Determinar a direção do swipe com base na maior distância
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Movimento horizontal
        if (Math.abs(deltaX) > threshold) {
          if (deltaX > 0) {
            // Swipe para a direita
            if (onSwipeRight) onSwipeRight();
            if (onSwipe) onSwipe('right');
            if (preventDefault && isQuickSwipe) e.preventDefault();
          } else {
            // Swipe para a esquerda
            if (onSwipeLeft) onSwipeLeft();
            if (onSwipe) onSwipe('left');
            if (preventDefault && isQuickSwipe) e.preventDefault();
          }
        }
      } else {
        // Movimento vertical
        if (Math.abs(deltaY) > threshold) {
          if (deltaY > 0) {
            // Swipe para baixo
            if (onSwipeDown) onSwipeDown();
            if (onSwipe) onSwipe('down');
            if (preventDefault && isQuickSwipe) e.preventDefault();
          } else {
            // Swipe para cima
            if (onSwipeUp) onSwipeUp();
            if (onSwipe) onSwipe('up');
            if (preventDefault && isQuickSwipe) e.preventDefault();
          }
        }
      }
    };
    
    // Adicionar event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: !preventDefault });
    element.addEventListener('touchend', handleTouchEnd);
    
    // Limpar event listeners
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipe, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold, preventDefault]);
  
  return elementRef;
}