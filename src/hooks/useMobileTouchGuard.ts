import { useEffect, type RefObject } from 'react';

/** Blocks iOS long-press callout & stray text selection on game UI */
export function useMobileTouchGuard(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const isInside = (target: EventTarget | null) =>
      target instanceof Node && root.contains(target);

    const preventContextMenu = (event: Event) => {
      if (isInside(event.target)) {
        event.preventDefault();
      }
    };

    const preventSelectStart = (event: Event) => {
      if (isInside(event.target)) {
        event.preventDefault();
      }
    };

    root.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('selectstart', preventSelectStart);

    return () => {
      root.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('selectstart', preventSelectStart);
    };
  }, [containerRef]);
}
