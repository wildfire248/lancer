import {useEffect, useState} from 'react';

import './Typewriter.css';

function useTypewriter(text: string, speed: number = 50,
                       onAnimationType?: () => void, onAnimationEnd?: () => void): [string, boolean] {
  const [displayText, setDisplayText] = useState('');
  const [displayLength, setDisplayLength] = useState(0);
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    if (displayText !== text) {
      setShowCursor(false);
      if (speed > 0) {
        for (let i = 0; i < Math.max(displayText.length, text.length); i++) {
          if (displayText.charAt(i) !== text.charAt(i)) {
            if (displayLength > i) {
              const timer = setTimeout(() => {setDisplayLength(displayLength - 1); onAnimationType?.()}, speed);
              return () => clearTimeout(timer);
            } else {
              setDisplayText(text);
            }
          }
        }
      } else {
        setDisplayText(text);
      }
    }
    if (displayLength != displayText.length) {
      setShowCursor(false);
      if (speed > 0) {
        const timer = setTimeout(() => {setDisplayLength(displayLength + 1); onAnimationType?.()}, speed);
        return () => clearTimeout(timer);
      } else {
        setDisplayLength(displayText.length);
      }
    }
    setShowCursor(true);
    onAnimationEnd?.();
  }, [text, speed, displayText, displayLength]);

  // console.log(displayText.slice(0, displayLength));

  return [displayText.slice(0, displayLength), showCursor];
}

interface Props {
  text: string;
  speed?: number;
  onAnimationType?: () => void;
  onAnimationEnd?: () => void;
}

function Typewriter(props: Props) {
  const [displayText, showCursor] = useTypewriter(props.text, props.speed, props.onAnimationType, props.onAnimationEnd);

  return (
    <pre className={`typewriter${showCursor ? ' cursor' : ''}`}>{displayText}</pre>
  )

}

export default Typewriter;