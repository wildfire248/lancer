import './App.css'
import About from './components/About.tsx';
import Typewriter from './components/Typewriter.tsx';
import {useRef, useState} from 'react';
import * as React from 'react';
import {parseDirPath, getFile, isFile, isDir} from './filesys.ts';

function App() {

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
    'No sensory bridge found // manual input mode enabled\n';
  const HELP_TEXT = '' +
    'GMS COMP/CON Unit Mk XI Rev 11.4.1c\n' +
    '5016.8.22 General Massive Systems // Please Operate Responsibly\n' +
    'These commands are defined internally. Type \'help\' to see this list.';

  const USERS: {[index: string]: string} = {
    'guest': '',
    'wildfire': '0463dd9d859a7c177723514ab89168fae8b3916a8fb449eb48dc572b4c27122606cc8ee5bf4135cdf0ad5e75b122ae886b41e9c2ffd992787378fc5902bafd71'
  }

  const [text, setText] = useState(CONSOLE_INIT);
  const [commandInput, setCommandInput] = useState('');
  const [pendingAnimations, setPendingAnimations] = useState(2);
  const [consoleSpeed, setConsoleSpeed] = useState(3);

  const consoleRef = useRef<HTMLDivElement>(null);
  const consoleInputRef = useRef<HTMLTextAreaElement>(null);
  const [showAboutDialog, setShowAboutDialog] = useState(false);

  let [user, setUser] = useState('guest');
  const host = 'localhost';
  const [cwd, setCwd] = useState('/home/guest');

  const [blocking, setBlocking] = useState(false);

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

  const COMMANDS: {[index: string]: (_: string[]) => Promise<number>} = {
    'about': async (_: string[]) => {
      setShowAboutDialog(true);
      return 0;
    },
    'cat': async (args: string[]) => {
      let path = parseDirPath(cwd, '.');
      if (args.length > 0) {
        path = parseDirPath(cwd, args[0]);
      }
      let file = getFile(path);
      if (isFile(file)) {
        setBlocking(true);
        const contents = await file([path]);
        // console.log(contents);
        if (contents.length > 0) {
          addText(contents);
        }
        setBlocking(false);
        setPendingAnimations(1);
        finishRunCommand();
      } else if (isDir(file)) {
        addText(`cat: ${args[0]}: Is a directory`);
      } else {
        addText(`cat: ${args[0]}: No such file or directory`);
      }
      return 1;
    },
    'cd': async (args: string[]) => {
      if (args.length === 0) {
        return 0;
      }
      let dirPath = parseDirPath(cwd, args[0]);
      let dir = getFile(dirPath);
      if (isDir(dir)) {
        setCwd(dirPath);
      } else if (isFile(dir)) {
        addText(`cd: ${args[0]}: Not a directory`);
      } else {
        addText(`cd: ${args[0]}: No such file or directory`);
      }
      return 0;
    },
    'clear': async (_: string[]) => {
      setConsoleSpeed(0);
      setText(_ => '');
      setPendingAnimations(1);
      return 0;
    },
    'echo': async (args: string[]) => {
      addText(args.join(' '));
      return 0;
    },
    'help': async (_: string[]) => {
      addText(HELP_TEXT);
      for (const command of Object.keys(COMMANDS)) {
        addText(command, '\t');
      }
      addText('');
      // todo args
      return 0;
    },
    'login': async (args: string[]) => {
      const ERROR_STRING = 'Invalid username or password. This incident will be reported.';
      const username = args[0];
      if (!(username in USERS)) {
        addText(ERROR_STRING);
        return 0;
      }
      if (USERS[username] === '') {
        setUser(username);
        user = username;
        return 0;
      }
      const pwd = args[1];
      crypto.subtle.digest('SHA-512', new TextEncoder().encode(pwd)).then(value => {
        const hashArray = Array.from(new Uint8Array(value));
        const hashHex = hashArray
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
        if (hashHex !== USERS[username]) {
          addText(ERROR_STRING);
        } else {
          setUser(username);
          user = username;
        }
        finishRunCommand();
      });
      return 1;
    },
    'logout': async (_: string[]) => {
      setUser('guest');
      user = 'guest';
      return 0;
    },
    'ls': async (args: string[]) => {
      let dirPath = parseDirPath(cwd, '.');
      if (args.length > 0) {
        dirPath = parseDirPath(cwd, args[0]);
      }
      let dir = getFile(dirPath);
      if (isDir(dir)) {
        const contents = Object.keys(dir.contents);
        for (const file of contents) {
          addText(file, '\t');
        }
        addText('');
      } else if (isFile(dir)) {
        addText(`ls: ${args[0]}: Not a directory`);
      } else {
        addText(`ls: ${args[0]}: No such file or directory`);
      }
      return 0;
    },
    'hash': async (args: string[]) => {
      const text = args.join(' ');
      const value = await crypto.subtle.digest('SHA-512', new TextEncoder().encode(text));
      const hashArray = Array.from(new Uint8Array(value));
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      addText(hashHex);
      finishRunCommand();
      return 0;
    }
  };

  async function runCommand() {
    setPendingAnimations(2);
    addText(getConsoleInputString() + commandInput);
    const command = splitCommand(commandInput);
    setCommandInput('');
    if (Object.keys(COMMANDS).includes(command[0])) {
      const returnValue = await COMMANDS[command[0]](command.slice(1));
      if (returnValue === 0) {
        finishRunCommand();
      } else {

      }
    } else {
      addText(`unknown command: ${command[0]}`);
    }
  }

  function finishRunCommand() {
    // addText(getConsoleInputString(), '');
  }

  async function handleKeyPress(e: React.KeyboardEvent) {
    if (pendingAnimations > 0) {
      return;
    }
    if (e.key === 'Control') {
      return;
    }
    if (e.ctrlKey) {
      return;
    }
    consoleInputRef?.current?.focus();
    if (e.key === 'Enter') {
      await runCommand();
    }
    // e.preventDefault();
  }

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (pendingAnimations > 0) {
      return;
    }
    setCommandInput(e.target.value);
  }

  function handleClick(_: React.MouseEvent) {
    // if (e.button === 0) { // LMB
    //   consoleInputRef?.current?.focus();
    // }
  }

  function handleAnimationEnd() {
    setConsoleSpeed(3);
    setPendingAnimations(prev => prev - 1);
    // setBlocking(false);
    consoleInputRef.current?.focus();
    // console.log(text);
  }

  function getConsoleInputString() {
    return `${user}@${host}:${cwd}$ `;
  }

  function allowInput() {
    return !blocking && !(pendingAnimations > 0);
  }

  return (
    <div id={'app'} onClick={handleClick} onKeyDown={handleKeyPress} tabIndex={0}>
      <header>
        <div className="top-bar">
          <p className="version">V.0.0.1</p>
        </div>
        <div className="title">
          <h1>COMP/CON</h1>
        </div>
      </header>
      <div className="buffer">
        <div className="title">
          <h1>COMP/CON</h1>
        </div>
      </div>
      <div className="console" ref={consoleRef}>
        <Typewriter text={text} speed={consoleSpeed} onAnimationType={() => consoleInputRef?.current?.scrollIntoView()} onAnimationEnd={handleAnimationEnd} />
        <div className={'console-input-container'}>
          {allowInput() ? <pre className={'console-input-pre'}>{getConsoleInputString()}</pre> : ''}
          <textarea ref={consoleInputRef} className={`console-input${allowInput() ? ' cursor' : ''}`} style={{'width': `min(80ch, calc(100% - ${getConsoleInputString().length}ch))`}} value={commandInput} onChange={handleInputChange} />
          {/*<p>{pendingAnimations}</p>*/}
          {/*<p>{blocking ? 'true' : 'false'}</p>*/}
        </div>
      </div>
      <div className="buffer-footer" />
      <footer>
        <div className="align-right">
          <About show={showAboutDialog} setShow={setShowAboutDialog}/>
        </div>
      </footer>
    </div>
  )
}

export default App;
