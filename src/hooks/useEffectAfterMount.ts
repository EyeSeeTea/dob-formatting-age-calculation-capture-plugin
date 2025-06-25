import { useEffect, useRef } from "react";

export function useEffectAfterMount(callback: () => void, deps: any[]) {
  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    callback();
  }, deps);
}
