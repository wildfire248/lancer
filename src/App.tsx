import './App.css'
import About from './components/About.tsx';
import Typewriter from './components/Typewriter.tsx';
import {useRef, useState} from 'react';
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
const HELP_TEXT = '' +
  'GMS COMP/CON Unit Mk XI Rev 11.4.1c\n' +
  '5016.8.22 General Massive Systems // Please Operate Responsibly\n' +
  'These commands are defined internally. Type \'help\' to see this list.\n' +
  'about\tclear\thelp';

function App() {
  const [text, setText] = useState(CONSOLE_INIT);
  const [commandInput, setCommandInput] = useState('');
  const [allowKeyPress, setAllowKeyPress] = useState(false);
  const [consoleSpeed, setConsoleSpeed] = useState(5);

  const consoleRef = useRef<HTMLDivElement>(null);
  const consoleEndRef = useRef<HTMLDivElement>(null);
  const [showAboutDialog, setShowAboutDialog] = useState(false);

  function addText(newText: string, end: string = '\n'): void {
    setText(prevText => prevText + newText + end);
  }

  function splitCommand(commandString: string): string[] {
    const parts = [];
    let currentPart = '';
    let inSingleQuotes = false;
    let inDoubleQuotes = false;
    for (let char of commandString) {
      if (char === '"') {
        if (inSingleQuotes) {
          currentPart += char;
        } else {
          inDoubleQuotes = !inDoubleQuotes;
        }
      } else if (char === "'") {
        if (inDoubleQuotes) {
          currentPart += char;
        } else {
          inSingleQuotes = !inSingleQuotes;
        }
      } else if (char === ' ') {
        if (!inSingleQuotes && !inDoubleQuotes) {
          parts.push(currentPart);
          currentPart = '';
        } else {
          currentPart += char;
        }
      } else {
        currentPart += char;
      }
    }
    parts.push(currentPart);
    return parts;
  }

  const COMMANDS: {[index: string]: (_: string[]) => void} = {
    'about': (_: string[]) => {
      setShowAboutDialog(true);
    },
    'clear': (_: string[]) => {
      setConsoleSpeed(0.1);
      setText(_ => '')
    },
    'help': (_: string[]) => {
      addText(HELP_TEXT);
      // todo args
    }
  };

  function runCommand() {
    addText(commandInput);
    const command = splitCommand(commandInput);
    if (Object.keys(COMMANDS).includes(command[0])) {
      COMMANDS[command[0]](command.slice(1));
    } else {
      addText(`unknown command: ${command[0]}`);
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (!allowKeyPress) {
      return;
    }
    if (e.key === 'Enter') {
      setAllowKeyPress(false);
      runCommand();
      setCommandInput('');
      addText(CONSOLE_INPUT, '');
    } else if (e.key === 'Backspace') {
      setCommandInput(commandInput.slice(0, commandInput.length - 1));
    } else if (CHARACTERS.test(e.key)) {
      setCommandInput(commandInput + e.key);
    } else {
      console.log('key', e);
    }
    // e.preventDefault();
  }

  function handleAnimationEnd() {
    setAllowKeyPress(true);
    setConsoleSpeed(5);
  }

  return (
    <div id={'app'} onKeyDown={handleKeyPress} tabIndex={0}>
      <header>
        <div className="top-bar">
          <p className="version">V.0.0.1</p>
        </div>
        <div className="title">
          <h1>COMP/CON</h1>
        </div>
      </header>
      <div className="buffer" />
      <div className="console" ref={consoleRef}>
        <Typewriter text={text + commandInput} speed={consoleSpeed} onAnimationType={() => consoleEndRef?.current?.scrollIntoView()} onAnimationEnd={handleAnimationEnd} />
        <div ref={consoleEndRef} />
      </div>
      <div className="buffer" />
      <footer>
        <div className="align-right">
          <About show={showAboutDialog} setShow={setShowAboutDialog}/>
        </div>
      </footer>
    </div>
  )
}

export default App;
