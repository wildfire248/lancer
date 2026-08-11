import {useEffect, useRef} from 'react';

import reactLogo from '../assets/react.svg';
import viteLogo from '../assets/vite.svg';
import './About.css';

function About(props: {show: boolean, setShow: (show: boolean) => void}) {
  let dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (props.show) {
      dialogRef?.current?.showModal();
    } else {
      dialogRef?.current?.close();
    }
  }, [props.show]);

  return (
    <>
      <dialog
        ref={dialogRef}
        className="about-dialog"
        onCancel={() => props.setShow(false)}
        onClick={() => props.setShow(false)}
      >
        <div className="about" onClick={(e) => e.stopPropagation()}>
          <h1>COMP/CON</h1>
          <p>Created by Wildfire</p>
          <p>Powered by React and Vite</p>
          <img src={reactLogo} alt="React logo" />
          <img src={viteLogo} alt="Vite logo" />
        </div>
      </dialog>
      <button className={'about-button'} onClick={() => props.setShow(true)}>About</button>
    </>
  );
}

export default About;