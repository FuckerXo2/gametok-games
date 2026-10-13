// Lets developers hand over a game folder instead of a .zip: a dropped or picked folder is zipped
// in the browser and then uploaded exactly like a .zip they made themselves. Needs fflate (global).
(function () {
  const MAX_UNPACKED_BYTES = 400 * 1024 * 1024; // same cap the server applies when unzipping
  // Build-tool and OS clutter that never belongs in a hosted game.
  const SKIP = /(^|\/)(\.[^/]*|node_modules|__MACOSX|Thumbs\.db)(\/|$)/;
  // Already-compressed formats: store as-is (re-compressing wastes time for no gain).
  const STORED = /\.(png|jpe?g|gif|webp|avif|mp3|ogg|oga|m4a|aac|mp4|webm|woff2?|zip|gz|br|ktx2|basis|unityweb)$/i;

  function fileFromEntry(entry) {
    return new Promise((resolve, reject) => entry.file(resolve, reject));
  }
  function readBatch(reader) {
    return new Promise((resolve, reject) => reader.readEntries(resolve, reject));
  }
  async function walk(entry, out) {
    if (entry.isFile) {
      out.push({ path: entry.fullPath.replace(/^\//, ''), file: await fileFromEntry(entry) });
      return;
    }
    const reader = entry.createReader();
    // readEntries returns at most ~100 entries per call; keep reading until it's empty.
    for (let batch = await readBatch(reader); batch.length; batch = await readBatch(reader)) {
      for (const child of batch) await walk(child, out);
    }
  }

  // From a drop: { file } for a single dropped file, or { name, entries } for a dropped folder.
  async function fromDrop(dataTransfer) {
    const roots = [...(dataTransfer.items || [])]
      .map((item) => (item.webkitGetAsEntry ? item.webkitGetAsEntry() : null))
      .filter(Boolean);
    if (roots.length === 1 && roots[0].isFile) return { file: dataTransfer.files[0] };
    if (!roots.length) return dataTransfer.files[0] ? { file: dataTransfer.files[0] } : null;
    const entries = [];
    for (const root of roots) await walk(root, entries);
    return { name: roots.length === 1 ? roots[0].name : 'game', entries };
  }

  // From <input type="file" webkitdirectory>.
  function fromInput(fileList) {
    const files = [...fileList];
    const entries = files.map((file) => ({ path: file.webkitRelativePath || file.name, file }));
    const name = (entries[0] && entries[0].path.split('/')[0]) || 'game';
    return { name, entries };
  }

  // Zips a folder's files into a File named <folder>.zip. Throws a message meant for the developer.
  async function zip({ name, entries }, onProgress) {
    const kept = entries.filter((e) => !SKIP.test(e.path));
    if (!kept.some((e) => /(^|\/)index\.html?$/i.test(e.path))) {
      throw new Error('That folder has no index.html. Choose the folder your build makes (usually dist, build or public).');
    }
    const total = kept.reduce((n, e) => n + e.file.size, 0);
    if (total > MAX_UNPACKED_BYTES) {
      throw new Error(`That folder is ${Math.round(total / 1024 / 1024)} MB, over the ${MAX_UNPACKED_BYTES / 1024 / 1024} MB limit. Host the game yourself and use a link.`);
    }
    const data = {};
    let read = 0;
    for (const e of kept) {
      data[e.path] = [new Uint8Array(await e.file.arrayBuffer()), { level: STORED.test(e.path) ? 0 : 6 }];
      read += e.file.size;
      if (onProgress) onProgress(Math.round((read / Math.max(total, 1)) * 100));
    }
    const zipped = await new Promise((resolve, reject) =>
      window.fflate.zip(data, (err, out) => (err ? reject(err) : resolve(out))));
    return new File([zipped], `${name}.zip`, { type: 'application/zip' });
  }

  window.GameFolder = { fromDrop, fromInput, zip };
})();
