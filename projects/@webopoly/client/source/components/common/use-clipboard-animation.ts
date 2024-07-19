import { useEffect, useState } from 'react';

export const useClipboardAnimation = () => {
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (animation) {
      timeout = setTimeout(() => {
        setAnimation(false);
      }, 1000);
    }

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [animation]);

  return { animation, setAnimation };
};
