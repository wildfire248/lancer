import {Random, type SeedOrRNG} from 'random';

export type User = string;
export type File = (args: string[]) => Promise<string>;
export type Directory = {
  permissions?: User[];
  contents: {[key: string]: File|Directory}
};

export function splitDirPath(dir: string): string[] {
  return dir.split('/').filter(dir => dir.length > 0);
}

export function parseDirPath(cwd: string, path: string): string {
  const cwdParts = splitDirPath(cwd);
  const pathParts = splitDirPath(path);
  let newPath: string[] = [];
  if (!path.startsWith('/')) {
    newPath = newPath.concat(cwdParts);
  }
  for (let part of pathParts) {
    if (part === '' || part === '.') {
      // no-op
    } else if (part === '..') {
      newPath.pop();
    } else {
      newPath.push(part);
    }
  }
  return `/${newPath.join('/')}`;
}

export function isDir(file: Directory|File|undefined): file is Directory {
  return file !== undefined && typeof file !== 'function';
}

export function isFile(file: Directory|File|undefined): file is File {
  return file !== undefined && typeof file === 'function';
}

export function getFile(path: string): File|Directory|undefined {
  let fileSys: Directory|File|undefined = FILE_SYSTEM;
  const parts = splitDirPath(path);
  for (let part of parts) {
    if (isDir(fileSys)) {
      fileSys = fileSys.contents[part] as File|Directory;
    } else {
      return undefined;
    }
  }
  return fileSys;
}

function text(text: string): (args: string[]) => Promise<string> {
  return async (_: string[]) => {
    return text;
  }
}

function bin(size: number, seed?: SeedOrRNG): (args: string[]) => Promise<string> {
  return async (_: string[]) => {
    const rng = new Random(seed);
    let text = '';
    for (let i = 0; i < size; i++) {
      const char = rng.int(0, 255);
      text += String.fromCharCode(char);
    }
    return text;
  }
}

const startTime = Date.now();

async function fileProcUptime(_: string[]): Promise<string> {
  const uptime = (Date.now() - startTime) / 1000;
  return `${uptime.toFixed(2)}`;
}

async function fetchFile(args: string[]): Promise<string> {
  if (args.length === 0) {
    return '';
  }
  const path = args[0];
  const parts = splitDirPath(path);
  const url = `filesys/${parts.join('/')}`;
  const response = await fetch(url);
  return await response.text();
}

export const FILE_SYSTEM: Directory = {
  contents: {
    'bin': {
      contents: {
        'about': bin(512, '/bin/about'),
        'cat': bin(512, '/bin/cat'),
        'hash': bin(512, '/bin/hash'),
        'ls': bin(512, '/bin/ls'),
      }
    },
    'boot': {
      contents: {
        'kernel': bin(1024, '/boot/kernel'),
        'initrd': bin(1024, '/boot/initrd'),
      }
    },
    'dev': {
      contents: {
        'null': text(''),
        'zero': text(' '.repeat(1024)),
        'random': bin(1024),
        'stdin': text(''),
        'stderr': text(''),
        'stdout': text(''),
        'tty': text(''),
        'sda': bin(2048, '/dev/sda'),
      }
    },
    'etc': {
      contents: {}
    },
    'home': {
      contents: {}
    },
    'lib': {
      contents: {
        'libc.so': bin(1024, '/lib/libc.so'),
        'libm.so': bin(1024, '/lib/libm.so'),
      }
    },
    'proc': {
      contents: {
        'cpuinfo': fetchFile,
        'meminfo': fetchFile,
        'uptime': fileProcUptime,
        // todo random process folders
      }
    },
    'sys': {
      contents: {
        'devices': {
          contents: {}
        },
        'kernel': {
          contents: {}
        }
      }
    },
    'usr': {
      contents: {
        'bin': {
          contents: {}
        },
        'lib': {
          contents: {}
        },
        'share': {
          contents: {}
        },
      }
    },
    'var': {
      contents: {
        'log': {
          contents: {
            'syslog': fetchFile,
          }
        }
      }
    }
  }
}