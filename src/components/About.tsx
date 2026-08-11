import {useEffect, useRef, useState} from 'react';

import reactLogo from '../assets/react.svg';
import viteLogo from '../assets/vite.svg';
import './About.css';

function About() {
  let [open, setOpen] = useState(false);
  let dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) {
      dialogRef?.current?.showModal();
    } else {
      dialogRef?.current?.close();
    }
  }, [open]);

  return (
    <>
      <dialog
        ref={dialogRef}
        className="about-dialog"
        onCancel={() => setOpen(false)}
        onClick={() => setOpen(false)}
      >
        <div className="about" onClick={(e) => e.stopPropagation()}>
          <h1>COMP/CON</h1>
          <p>Created by Wildfire</p>
          <p>Powered by React and Vite</p>
          <img src={reactLogo} alt="React logo" />
          <img src={viteLogo} alt="Vite logo" />
        </div>
      </dialog>
      <button className={'about-button'} onClick={() => setOpen(true)}>About</button>
    </>
  );
}

export default About;