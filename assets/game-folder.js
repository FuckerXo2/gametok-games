// Gets a game to GameTok from whatever the developer has: a folder (dropped or chosen), a .zip,
// or a single .html. Every file is uploaded straight to storage with its own signed URL, so there
// is no size limit and nothing is zipped. A .zip is unpacked here first. Needs fflate (global)
// only for .zip files.
(function () {
  // Build-tool and OS clutter that never belongs in a hosted game.
  const SKIP = /(^|\/)(\.[^/]*|node_modules|__MACOSX|Thumbs\.db)(\/|$)/;
  const PARALLEL = 6;

  const fileFromEntry = (entry) => new Promise((resolve, reject) => entry.file(resolve, reject));
  const readBatch = (reader) => new Promise((resolve, reject) => reader.readEntries(resolve, reject));
  async function walk(entry, out) {
    if (entry.isFile) {
      const file = await fileFromEntry(entry);
      out.push({ path: entry.fullPath.replace(/^\//, ''), size: file.size, blob: file });
      return;
    }
    const reader = entry.createReader();
    // readEntries returns at most ~100 entries per call; keep reading until it's empty.
    for (let batch = await readBatch(reader); batch.length; batch = await readBatch(reader)) {
      for (const child of batch) await walk(child, out);
    }
  }

  // A game is { name, kind: 'folder' | 'zip' | 'html', entries: [{ path, size, blob | read() }] }.
  function finish(name, kind, entries) {
    const kept = entries.filter((e) => !SKIP.test(e.path));
    if (!kept.some((e) => /(^|\/)index\.html?$/i.test(e.path))) {
      throw new Error(kind === 'zip'
        ? 'That zip has no index.html. Zip the folder your build makes (usually dist or build).'
        : 'That folder has no index.html. Choose the folder your build makes (usually dist or build).');
    }
    return { name, kind, entries: kept, bytes: kept.reduce((n, e) => n + e.size, 0) };
  }

  async function fromFile(file) {
    if (/\.html?$/i.test(file.name)) return finish(file.name, 'html', [{ path: 'index.html', size: file.size, blob: file }]);
    if (!/\.zip$/i.test(file.name)) throw new Error('Choose your game folder, a .zip of it, or one .html file.');
    const buffer = new Uint8Array(await file.arrayBuffer());
    const listed = [];
    try {
      // List without unpacking; each file is unpacked only when it's uploaded.
      window.fflate.unzipSync(buffer, { filter: (f) => { if (!f.name.endsWith('/')) listed.push({ name: f.name, size: f.originalSize }); return false; } });
    } catch (e) {
      throw new Error('That file isn\'t a readable .zip.');
    }
    const entries = listed.map(({ name, size }) => ({
      path: name.replace(/\\/g, '/'),
      size,
      read: () => new Blob([window.fflate.unzipSync(buffer, { filter: (f) => f.name === name })[name]]),
    }));
    return finish(file.name.replace(/\.zip$/i, ''), 'zip', entries);
  }

  // From a drop: a dropped folder, or a single dropped file (.zip / .html).
  async function fromDrop(dataTransfer) {
    const roots = [...(dataTransfer.items || [])]
      .map((item) => (item.webkitGetAsEntry ? item.webkitGetAsEntry() : null))
      .filter(Boolean);
    if (!roots.length || (roots.length === 1 && roots[0].isFile)) {
      if (!dataTransfer.files[0]) return null;
      return fromFile(dataTransfer.files[0]);
    }
    const entries = [];
    for (const root of roots) await walk(root, entries);
    return finish(roots.length === 1 ? roots[0].name : 'game', 'folder', entries);
  }

  // From <input type="file" webkitdirectory>.
  function fromFolderInput(fileList) {
    const entries = [...fileList].map((file) => ({ path: file.webkitRelativePath || file.name, size: file.size, blob: file }));
    return finish((entries[0] && entries[0].path.split('/')[0]) || 'game', 'folder', entries);
  }

  function put(url, contentType, blob, onBytes) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', url);
      xhr.setRequestHeader('Content-Type', contentType);
      let sent = 0;
      xhr.upload.onprogress = (e) => { onBytes(e.loaded - sent); sent = e.loaded; };
      xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed (HTTP ${xhr.status}). Try again.`)));
      xhr.onerror = () => reject(new Error('Upload failed: check your connection and try again.'));
      xhr.send(blob);
    });
  }

  // Uploads every file and returns the hosted game ({ url, files, bytes }).
  // request(path, body) must POST JSON to the GameTok API with the developer's auth and return
  // the parsed response (throwing on errors). onProgress gets 0–100.
  async function upload(game, request, onProgress) {
    const byPath = new Map(game.entries.map((e) => [e.path, e]));
    const slot = await request('/developer/uploads/files/start', { files: game.entries.map(({ path, size }) => ({ path, size })) });
    const total = slot.files.reduce((n, f) => n + (byPath.get(f.path)?.size || 0), 0) || 1;
    let done = 0;
    const queue = [...slot.files];
    const worker = async () => {
      for (let f = queue.shift(); f; f = queue.shift()) {
        const entry = byPath.get(f.path);
        const blob = entry.blob || entry.read();
        await put(f.url, f.contentType, blob, (n) => { done += n; onProgress(Math.min(99, Math.round((done / total) * 100))); });
      }
    };
    await Promise.all(Array.from({ length: PARALLEL }, worker));
    return request(`/developer/uploads/files/${slot.uploadId}/finish`, {});
  }

  window.GameFolder = { fromDrop, fromFolderInput, fromFile, upload };
})();
