const { app, BrowserWindow, ipcMain, net, protocol } = require('electron');
const { promises: fs } = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

protocol.registerSchemesAsPrivileged([{
  scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true }
}]);

let windowRef;
let writeQueue = Promise.resolve();

function progressFile() {
  return path.join(app.getPath('userData'), 'progress.v1.json');
}

function trusted(event) {
  const expected = 'app://bundle/index.html';
  if (event.sender !== windowRef?.webContents || event.senderFrame?.url !== expected) {
    throw new Error('Untrusted IPC sender');
  }
}

function validateSnapshot(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || value.formatVersion !== 1 ||
      !Array.isArray(value.completedLevelIds) || !value.completedLevelIds.every((id) => typeof id === 'string') ||
      !value.bestScores || typeof value.bestScores !== 'object' || Array.isArray(value.bestScores)) {
    throw new Error('Invalid progress payload');
  }
  const data = JSON.stringify(value);
  if (data.length > 16384) throw new Error('Progress payload is too large');
  return data;
}

function createWindow() {
  windowRef = new BrowserWindow({
    width: 1120, height: 800, minWidth: 760, minHeight: 620,
    title: 'Hiragana Aero',
    backgroundColor: '#c9f4ff',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });
  windowRef.loadURL('app://bundle/index.html');
  windowRef.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  windowRef.webContents.on('will-navigate', (event) => event.preventDefault());
}

app.whenReady().then(() => {
  const root = path.resolve(__dirname, '..');
  protocol.handle('app', (request) => {
    const url = new URL(request.url);
    if (url.host !== 'bundle' || url.search || url.hash) {
      return new Response('Not found', { status: 404 });
    }
    let relative;
    try {
      relative = decodeURIComponent(url.pathname).replace(/^\/+/, '');
    } catch {
      return new Response('Invalid path', { status: 400 });
    }
    const allowed = relative === 'index.html' || relative === 'shared/src/style.css' || relative.startsWith('dist/');
    const location = path.resolve(root, relative);
    const within = path.relative(root, location);
    if (!allowed || !within || within.startsWith('..') || path.isAbsolute(within)) {
      return new Response('Not found', { status: 404 });
    }
    return net.fetch(pathToFileURL(location).toString());
  });
  ipcMain.handle('progress:load', async (event) => {
    trusted(event);
    await writeQueue;
    try {
      return JSON.parse(await fs.readFile(progressFile(), 'utf8'));
    } catch (error) {
      if (error.code === 'ENOENT') return null;
      throw error;
    }
  });
  ipcMain.handle('progress:save', async (event, value) => {
    trusted(event);
    const payload = validateSnapshot(value);
    const save = async () => {
      const target = progressFile();
      await fs.mkdir(path.dirname(target), { recursive: true });
      const temporary = `${target}.tmp`;
      try {
        await fs.writeFile(temporary, payload, { encoding: 'utf8', mode: 0o600 });
        await fs.rename(temporary, target);
      } catch (error) {
        await fs.rm(temporary, { force: true }).catch(() => {});
        throw error;
      }
    };
    const pending = writeQueue.then(save);
    writeQueue = pending.catch(() => {});
    return pending;
  });
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
