import { useEffect, useState } from 'react';

const TOUCH_MEDIA = '(hover: none) and (pointer: coarse)';

/** True on phones/tablets where touch is the primary input */
export function useTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia(TOUCH_MEDIA).matches
      : false,
  );

  useEffect(() => {
    const mq = window.matchMedia(TOUCH_MEDIA);
    const update = () => setIsTouch(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return isTouch;
}
