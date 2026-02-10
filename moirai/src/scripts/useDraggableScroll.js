// Bu custom hook, verdiğin elemente "sürükleme" yeteneği kazandırır.
import { useState } from 'react';

export const useDraggableScroll = (ref) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - ref.current.offsetLeft);
    setScrollLeft(ref.current.scrollLeft);
    ref.current.style.cursor = 'grabbing'; // İmleç "tutan el" olur
    ref.current.style.userSelect = 'none'; // Sürüklerken yazıların seçilmesini engelle
  };

  const onMouseLeave = () => {
    setIsDragging(false);
    if(ref.current) {
        ref.current.style.cursor = 'grab';
        ref.current.style.removeProperty('user-select');
    }
  };

  const onMouseUp = () => {
    setIsDragging(false);
    if(ref.current) {
        ref.current.style.cursor = 'grab';
        ref.current.style.removeProperty('user-select');
    }
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX) * 2; // *2 hızı artırır (daha seri kayar)
    ref.current.scrollLeft = scrollLeft - walk;
  };

  return {
    onMouseDown,
    onMouseLeave,
    onMouseUp,
    onMouseMove
  };
};