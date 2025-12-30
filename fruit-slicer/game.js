// Fruit Slicer - DOM-based with swipe mechanics
(function() {
'use strict';

var container = document.getElementById('fruitcontainer');
var playing = false;
var score = 0;
var lives = 3;
var combo = 0;
var lastSlice = 0;
var highScore = parseInt(localStorage.getItem('fs_hi')) || 0;
var spawnInterval = null;
var updateInterval = null;

var fruits = [];
var splats = [];
var fruitId = 0;

var fruitImages = [
  'Banana.png',
  'Orange.png',
  'GreenApple.png',
  'Watermelon.png',
];

var slicedImages = [
  'BananaSliced.png',
  'OrangeSliced.png',
  'GreenAppleSliced.png',
  'WatermelonSliced.png',
];

var juiceColors = ['#ffe135', '#ffa502', '#7ed321', '#ff6b6b'];

var bombImage = 'bomb.png';

// Swipe tracking
var isSlicing = false;
var lastX = 0, lastY = 0;
var sliceTrail = [];

document.getElementById('bestScore').textContent = highScore;
document.getElementById('startBtn').onclick = startGame;
document.getElementById('retryBtn').onclick = startGame;

// Swipe detection
container.ontouchstart = container.onmousedown = function(e) {
  if (e.target.tagName === 'BUTTON') return;
  e.preventDefault();
  isSlicing = true;
  var p = getPos(e);
  lastX = p.x;
  lastY = p.y;
  sliceTrail = [{x: p.x, y: p.y}];
  updateTrail();
};

container.ontouchmove = container.onmousemove = function(e) {
  if (!isSlicing || !playing) return;
  e.preventDefault();
  var p = getPos(e);
  
  // Check slice collision
  checkSliceCollision(lastX, lastY, p.x, p.y);
  
  lastX = p.x;
  lastY = p.y;
  sliceTrail.push({x: p.x, y: p.y});
  if (sliceTrail.length > 10) sliceTrail.shift();
  updateTrail();
};

container.ontouchend = container.onmouseup = container.onmouseleave = function() {
  isSlicing = false;
  sliceTrail = [];
  updateTrail();
};

function getPos(e) {
  if (e.touches && e.touches[0]) {
    return {x: e.touches[0].clientX, y: e.touches[0].clientY};
  }
  return {x: e.clientX, y: e.clientY};
}

function updateTrail() {
  var knife = document.getElementById('knife');
  if (!knife) {
    knife = document.createElement('img');
    knife.id = 'knife';
    knife.src = 'sword.png';
    knife.style.cssText = 'position:absolute;width:60px;height:60px;pointer-events:none;z-index:100;transform:translate(-50%,-50%) rotate(-45deg);display:none;';
    container.appendChild(knife);
  }
  
  if (isSlicing && sliceTrail.length > 0) {
    var last = sliceTrail[sliceTrail.length - 1];
    knife.style.left = last.x + 'px';
    knife.style.top = last.y + 'px';
    knife.style.display = 'block';
    
    // Rotate knife based on swipe direction
    if (sliceTrail.length >= 2) {
      var prev = sliceTrail[sliceTrail.length - 2];
      var angle = Math.atan2(last.y - prev.y, last.x - prev.x) * 180 / Math.PI;
      knife.style.transform = 'translate(-50%,-50%) rotate(' + (angle + 45) + 'deg)';
    }
  } else {
    knife.style.display = 'none';
  }
}

function startGame() {
  playing = true;
  score = 0;
  lives = 3;
  combo = 0;
  
  // Clear existing fruits
  fruits.forEach(function(f) {
    if (f.el && f.el.parentNode) f.el.parentNode.removeChild(f.el);
  });
  fruits = [];
  
  // Clear splats
  splats.forEach(function(s) {
    if (s.el && s.el.parentNode) s.el.parentNode.removeChild(s.el);
  });
  splats = [];
  
  document.getElementById('menu').classList.add('hidden');
  document.getElementById('gameOver').classList.add('hidden');
  document.getElementById('score').textContent = '0';
  updateLives();
  
  // Start spawning
  spawnInterval = setInterval(spawnFruit, 800);
  updateInterval = setInterval(updateFruits, 16);
}

function spawnFruit() {
  if (!playing) return;
  if (fruits.length >= 5) return;
  
  var isBomb = Math.random() < 0.1;
  var imgIndex = Math.floor(Math.random() * fruitImages.length);
  
  var el = document.createElement('img');
  el.className = 'fruit';
  el.src = isBomb ? bombImage : fruitImages[imgIndex];
  el.style.cssText = 'position:absolute;width:70px;height:70px;pointer-events:none;z-index:10;transition:none;';
  
  var W = container.offsetWidth;
  var H = container.offsetHeight;
  var x = 50 + Math.random() * (W - 100);
  
  el.style.left = x + 'px';
  el.style.top = (H + 40) + 'px';
  
  container.appendChild(el);
  
  var vx = (W/2 - x) * 0.01 + (Math.random() - 0.5) * 2;
  var vy = -(H * 0.025 + Math.random() * 5);
  
  fruits.push({
    id: fruitId++,
    el: el,
    x: x,
    y: H + 40,
    vx: vx,
    vy: vy,
    isBomb: isBomb,
    colorIndex: imgIndex,
    sliced: false
  });
}

function updateFruits() {
  if (!playing) return;
  
  var H = container.offsetHeight;
  
  for (var i = fruits.length - 1; i >= 0; i--) {
    var f = fruits[i];
    if (f.sliced) continue;
    
    f.vy += 0.5;
    f.x += f.vx;
    f.y += f.vy;
    
    f.el.style.left = f.x + 'px';
    f.el.style.top = f.y + 'px';
    
    // Fell off screen
    if (f.y > H + 50) {
      if (!f.isBomb) {
        lives--;
        combo = 0;
        updateLives();
        if (lives <= 0) endGame();
      }
      removeFruit(i);
    }
  }
  
  // Fade splats
  for (var j = splats.length - 1; j >= 0; j--) {
    var s = splats[j];
    s.alpha -= 0.02;
    if (s.alpha <= 0) {
      if (s.el && s.el.parentNode) s.el.parentNode.removeChild(s.el);
      splats.splice(j, 1);
    } else {
      s.el.style.opacity = s.alpha;
    }
  }
}

function removeFruit(index) {
  var f = fruits[index];
  if (f.el && f.el.parentNode) f.el.parentNode.removeChild(f.el);
  fruits.splice(index, 1);
}

function checkSliceCollision(x1, y1, x2, y2) {
  for (var i = fruits.length - 1; i >= 0; i--) {
    var f = fruits[i];
    if (f.sliced) continue;
    
    var cx = f.x + 35;
    var cy = f.y + 35;
    var r = 35;
    
    if (lineCircleHit(x1, y1, x2, y2, cx, cy, r)) {
      sliceFruit(i);
    }
  }
}

function lineCircleHit(x1, y1, x2, y2, cx, cy, r) {
  var dx = x2 - x1;
  var dy = y2 - y1;
  var fx = x1 - cx;
  var fy = y1 - cy;
  
  var a = dx*dx + dy*dy;
  if (a < 1) return false;
  
  var b = 2 * (fx*dx + fy*dy);
  var c = fx*fx + fy*fy - r*r;
  var d = b*b - 4*a*c;
  
  if (d < 0) return false;
  
  var sd = Math.sqrt(d);
  var t1 = (-b - sd) / (2*a);
  var t2 = (-b + sd) / (2*a);
  
  return (t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1);
}

function sliceFruit(index) {
  var f = fruits[index];
  f.sliced = true;
  
  if (f.isBomb) {
    endGame();
    return;
  }
  
  // Combo
  var now = Date.now();
  if (now - lastSlice < 500) {
    combo++;
    if (combo >= 3) showCombo();
  } else {
    combo = 1;
  }
  lastSlice = now;
  
  // Score
  var pts = Math.max(1, Math.floor(combo / 2));
  score += pts;
  document.getElementById('score').textContent = score;
  
  // Juice splat
  createSplat(f.x + 35, f.y + 35, juiceColors[f.colorIndex]);
  
  // Show sliced image and create two halves
  var slicedSrc = slicedImages[f.colorIndex];
  createSlicedHalf(f.x, f.y, slicedSrc, -1);
  createSlicedHalf(f.x, f.y, slicedSrc, 1);
  
  // Remove original fruit
  if (f.el && f.el.parentNode) f.el.parentNode.removeChild(f.el);
  fruits.splice(index, 1);
}

function createSlicedHalf(startX, startY, slicedSrc, dir) {
  var half = document.createElement('img');
  half.src = slicedSrc;
  half.style.cssText = 'position:absolute;width:50px;height:50px;pointer-events:none;z-index:10;';
  half.style.left = (startX + 10) + 'px';
  half.style.top = startY + 'px';
  
  container.appendChild(half);
  
  var vx = dir * (5 + Math.random() * 3);
  var vy = -6 - Math.random() * 4;
  var rotation = 0;
  var rotSpeed = dir * (15 + Math.random() * 10);
  var x = startX + 10;
  var y = startY;
  var alpha = 1;
  
  var animInterval = setInterval(function() {
    vy += 0.5;
    x += vx;
    y += vy;
    rotation += rotSpeed;
    alpha -= 0.025;
    
    half.style.left = x + 'px';
    half.style.top = y + 'px';
    half.style.transform = 'rotate(' + rotation + 'deg)';
    half.style.opacity = alpha;
    
    if (alpha <= 0 || y > container.offsetHeight + 100) {
      clearInterval(animInterval);
      if (half.parentNode) half.parentNode.removeChild(half);
    }
  }, 16);
}

function createSplat(x, y, color) {
  if (splats.length >= 6) return;
  
  var el = document.createElement('div');
  el.style.cssText = 'position:absolute;width:80px;height:80px;border-radius:50%;pointer-events:none;z-index:1;';
  el.style.left = (x - 40) + 'px';
  el.style.top = (y - 40) + 'px';
  el.style.background = 'radial-gradient(circle, ' + color + ' 0%, transparent 70%)';
  el.style.opacity = '0.7';
  
  container.appendChild(el);
  splats.push({el: el, alpha: 0.7});
}

function showCombo() {
  var el = document.getElementById('combo');
  el.textContent = combo + 'x COMBO!';
  el.classList.remove('show');
  void el.offsetWidth;
  el.classList.add('show');
  setTimeout(function() {
    el.classList.remove('show');
  }, 500);
}

function updateLives() {
  var el = document.getElementById('lives');
  el.innerHTML = '';
  for (var i = 0; i < 3; i++) {
    var img = document.createElement('img');
    img.src = 'https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/wrong.png';
    if (i >= lives) img.className = 'lost';
    el.appendChild(img);
  }
}

function endGame() {
  playing = false;
  clearInterval(spawnInterval);
  clearInterval(updateInterval);
  
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('fs_hi', highScore);
  }
  
  document.getElementById('finalScore').textContent = score;
  document.getElementById('bestScore').textContent = highScore;
  setTimeout(function() {
    document.getElementById('gameOver').classList.remove('hidden');
  }, 300);
}

})();
