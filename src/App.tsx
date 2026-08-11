import './App.css'
import About from './components/About.tsx';
import Typewriter from './components/Typewriter.tsx';
import {useState} from 'react';
import * as React from 'react';

const CHARACTERS = /^[A-Za-z0-9 `~!@#$%^&*(),<.>/?;:'"\[{\]}\\|_-]$/;
const CONSOLE_INPUT = '~ ';
const CONSOLE_INIT = '' +
  'COMPANION/CONCIERGE UNIT INITIALIZING\n' +
  'GMS COMP/CON Unit Mk XI Rev 11.4.1c\n' +
  '5016.8.22 General Massive Systems // Please Operate Responsibly\n' +
  'Initializing semantic manifold . . . done\n' +
  'Initializing logic gradients . . . done\n' +
  '  1.0255EB FREE (3.6EB TOTAL)\n' +
  'KERNEL supported CPUs:\n' +
  '  GMS MISSISSIPPI Series (MkII+)\n' +
  '  IPS-N Carronade v9.1+\n' +
  '  SSC Premier IV-XIV\n' +
  '  HA DOMINANCE line/all\n' +
  '  [WN UNKNOWN UNKNOWN UNKNOWN UNKNOWN UNKNOWN UNKN]\n' +
  'Policy Zone: 16::DISCORDANT SECTOR\n' +
  'Demand map ICRS at 3c0001000-23c0001000.\n' +
  'Heap//PSIM at 23c0002000-43c0002000.\n' +
  'Thread "Idle": pointer: 0x23c0002010, stack: 0x6440000\n' +
  'Thread "Main": pointer: 0x23c0002f70, stack: 0x6460000\n' +
  '****** VDOMAIN for frame//integrator ******\n' +
  'backend at /local/domain/0/backend/gms/\n' +
  'Failed to read /local/domain/0/ssc/fs_sync.\n' +
  'Failed to read /local/domain/0/gms/dummy_plug.\n' +
  'Failed to read /local/domain/0/gms/manual_controls.\n' +
  'WARNING: FRAME NOT PRESENT OR INVALID\n' +
  '******************************************\n' +
  'Initializing gms-cc-subsys v_int\n' +
  'Initializing gms-cc-subsys tests\n' +
  'Initializing gms-cc-subsys omninet_cls\n' +
  'Initializing gms-cc-subsys events\n' +
  'Hierarchical RCU implementation.\n' +
  'RCU subjective-clock acceleration is DISABLED.\n' +
  'Establishing encrypted link (52::BARYON EXCLUSION) . . . done\n' +
  'AM-LI in unprivileged domain disabled\n' +
  'No sensory bridge found // manual input mode enabled\n' +
  CONSOLE_INPUT;

function App() {
  const [text, setText] = useState(CONSOLE_INIT);
  const [command, setCommand] = useState('');
  const [allowKeyPress, setAllowKeyPress] = useState(false);

  function runCommand() {
    console.log(command);
    setAllowKeyPress(false);
    setText(text + `\nran command: ${command}\n${CONSOLE_INPUT}`);
    setCommand('');
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (!allowKeyPress) {
      return;
    }
    if (e.key === 'Enter') {
      runCommand();
    } else if (e.key === 'Backspace') {
      setText(text.slice(0, text.length - 1));
      setCommand(command.slice(0, command.length - 1));
    } else if (CHARACTERS.test(e.key)) {
      setText(text + e.key);
      setCommand(command + e.key);
    } else {
      console.log('key', e);
    }
    // e.preventDefault();
  }

  return (
    <div onKeyDown={handleKeyPress} tabIndex={0}>
      <header>
        <div className="top-bar">
          <p className="version">V.0.0.1</p>
        </div>
        <div className="title">
          <h1>COMP/CON</h1>
        </div>
      </header>
      <div className="buffer"></div>
      <div className="console">
        <Typewriter text={text} speed={5} onAnimationEnd={() => setAllowKeyPress(true)} />
      </div>
      <footer>
        <div className="align-right">
          <About/>
        </div>
      </footer>
    </div>
  )
}

export default App;
