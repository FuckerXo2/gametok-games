// Fruit Slicer - Ultra Lightweight for WebView
(function() {
'use strict';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d', { alpha: false }); // Opaque canvas = faster

let W, H;
let gameState = 'menu';
let score = 0, lives = 3, combo = 0;
let highScore = parseInt(localStorage.getItem('fs_hi')) || 0;
let lastSlice = 0;
let spawnTimer = 0;

// Simple arrays - no objects with many properties
let fruitX = [], fruitY = [], fruitVX = [], fruitVY = [];
let fruitType = [], fruitSliced = [];
let splatX = [], splatY = [], splatA = [], splatC = [];

let sliceX = [], sliceY = [];
let touching = false;
let lastX = 0, lastY = 0;

// Preload images
const imgs = [];
const imgSrcs = [
  'https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/1.png',
  'https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/2.png',
  'https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/3.png',
  'https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/4.png',
  'https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/5.png',
];
const colors = ['#ff6b6b','#ffa502','#ffd32a','#ff4757','#8e44ad'];
let bombImg = null;

function loadImages() {
  imgSrcs.forEach((src, i) => {
    const img = new Image();
    img.src = src;
    imgs[i] = img;
  });
  bombImg = new Image();
  bombImg.src = 'https://raw.githubusercontent.com/nicholasadamou/fruit-ninja/master/images/bomb.png';
}

function resize() {
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;
}

function init() {
  loadImages();
  resize();
  window.onresize = resize;
  
  // Touch/mouse
  canvas.ontouchstart = canvas.onmousedown = (e) => {
    e.preventDefault();
    touching = true;
    const p = getPos(e);
    lastX = p.x; lastY = p.y;
    sliceX = [p.x]; sliceY = [p.y];
  };
  canvas.ontouchmove = canvas.onmousemove = (e) => {
    if (!touching) return;
    e.preventDefault();
    const p = getPos(e);
    if (gameState === 'playing') checkSlice(lastX, lastY, p.x, p.y);
    lastX = p.x; lastY = p.y;
    sliceX.push(p.x); sliceY.push(p.y);
    if (sliceX.length > 8) { sliceX.shift(); sliceY.shift(); }
  };
  canvas.ontouchend = canvas.onmouseup = canvas.onmouseleave = () => { touching = false; };
  
  document.getElementById('startBtn').onclick = start;
  document.getElementById('retryBtn').onclick = start;
  
  document.getElementById('bestScore').textContent = highScore;
  updateLives();
  
  loop();
}

function getPos(e) {
  if (e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  return { x: e.clientX, y: e.clientY };
}

function start() {
  gameState = 'playing';
  score = 0; lives = 3; combo = 0; spawnTimer = 0;
  fruitX = []; fruitY = []; fruitVX = []; fruitVY = [];
  fruitType = []; fruitSliced = [];
  splatX = []; splatY = []; splatA = []; splatC = [];
  document.getElementById('menu').classList.add('hidden');
  document.getElementById('gameOver').classList.add('hidden');
  document.getElementById('score').textContent = '0';
  updateLives();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

function update() {
  if (gameState !== 'playing') return;
  
  // Spawn (max 5 fruits)
  spawnTimer--;
  if (spawnTimer <= 0 && fruitX.length < 5) {
    spawn();
    spawnTimer = 50 + Math.random() * 30;
  }
  
  // Update fruits
  for (let i = fruitX.length - 1; i >= 0; i--) {
    fruitVY[i] += 0.4;
    fruitX[i] += fruitVX[i];
    fruitY[i] += fruitVY[i];
    
    if (fruitY[i] > H + 50) {
      if (!fruitSliced[i] && fruitType[i] >= 0) {
        lives--;
        combo = 0;
        updateLives();
        if (lives <= 0) endGame();
      }
      removeFruit(i);
    }
  }
  
  // Fade splats
  for (let i = splatA.length - 1; i >= 0; i--) {
    splatA[i] -= 0.02;
    if (splatA[i] <= 0) {
      splatX.splice(i, 1); splatY.splice(i, 1);
      splatA.splice(i, 1); splatC.splice(i, 1);
    }
  }
}

function spawn() {
  const x = 50 + Math.random() * (W - 100);
  const isBomb = Math.random() < 0.1;
  
  fruitX.push(x);
  fruitY.push(H + 40);
  fruitVX.push((W/2 - x) * 0.008 + (Math.random() - 0.5) * 2);
  fruitVY.push(-(H * 0.022 + Math.random() * 4));
  fruitType.push(isBomb ? -1 : Math.floor(Math.random() * 5));
  fruitSliced.push(false);
}

function removeFruit(i) {
  fruitX.splice(i, 1); fruitY.splice(i, 1);
  fruitVX.splice(i, 1); fruitVY.splice(i, 1);
  fruitType.splice(i, 1); fruitSliced.splice(i, 1);
}

function checkSlice(x1, y1, x2, y2) {
  for (let i = 0; i < fruitX.length; i++) {
    if (fruitSliced[i]) continue;
    if (lineHit(x1, y1, x2, y2, fruitX[i], fruitY[i], 35)) {
      slice(i);
    }
  }
}

function lineHit(x1, y1, x2, y2, cx, cy, r) {
  const dx = x2 - x1, dy = y2 - y1;
  const fx = x1 - cx, fy = y1 - cy;
  const a = dx*dx + dy*dy;
  const b = 2*(fx*dx + fy*dy);
  const c = fx*fx + fy*fy - r*r;
  const d = b*b - 4*a*c;
  if (d < 0) return false;
  const sd = Math.sqrt(d);
  const t1 = (-b - sd) / (2*a);
  const t2 = (-b + sd) / (2*a);
  return (t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1);
}

function slice(i) {
  fruitSliced[i] = true;
  
  if (fruitType[i] < 0) {
    // Bomb
    endGame();
    return;
  }
  
  // Combo
  const now = Date.now();
  if (now - lastSlice < 400) {
    combo++;
    if (combo >= 3) showCombo();
  } else {
    combo = 1;
  }
  lastSlice = now;
  
  score += Math.max(1, Math.floor(combo / 2));
  document.getElementById('score').textContent = score;
  
  // Splat (max 4)
  if (splatX.length < 4) {
    splatX.push(fruitX[i]);
    splatY.push(fruitY[i]);
    splatA.push(0.5);
    splatC.push(colors[fruitType[i]]);
  }
  
  // Remove immediately
  removeFruit(i);
}

function showCombo() {
  const el = document.getElementById('combo');
  el.textContent = combo + 'x COMBO!';
  el.classList.remove('show');
  void el.offsetWidth;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 400);
}

function updateLives() {
  const el = document.getElementById('lives');
  el.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    const img = document.createElement('img');
    img.src = 'https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/wrong.png';
    if (i >= lives) img.className = 'lost';
    el.appendChild(img);
  }
}

function endGame() {
  gameState = 'over';
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('fs_hi', highScore);
  }
  document.getElementById('finalScore').textContent = score;
  document.getElementById('bestScore').textContent = highScore;
  setTimeout(() => document.getElementById('gameOver').classList.remove('hidden'), 200);
}

function draw() {
  // Wood background
  ctx.fillStyle = '#5d4037';
  ctx.fillRect(0, 0, W, H);
  
  // Splats
  for (let i = 0; i < splatX.length; i++) {
    ctx.globalAlpha = splatA[i];
    ctx.fillStyle = splatC[i];
    ctx.beginPath();
    ctx.arc(splatX[i], splatY[i], 50, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  
  // Slice trail
  if (touching && sliceX.length > 1) {
    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(sliceX[0], sliceY[0]);
    for (let i = 1; i < sliceX.length; i++) {
      ctx.lineTo(sliceX[i], sliceY[i]);
    }
    ctx.stroke();
  }
  
  // Fruits
  for (let i = 0; i < fruitX.length; i++) {
    if (fruitSliced[i]) continue;
    const img = fruitType[i] < 0 ? bombImg : imgs[fruitType[i]];
    if (img && img.complete) {
      ctx.drawImage(img, fruitX[i] - 35, fruitY[i] - 35, 70, 70);
    }
  }
  
  // Fade trail
  if (!touching && sliceX.length > 0) {
    sliceX.shift(); sliceY.shift();
  }
}

init();
})();
