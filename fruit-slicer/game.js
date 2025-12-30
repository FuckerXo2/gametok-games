// Fruit Slicer - Simple single-fruit version (like jQuery original)
var playing = false;
var score = 0;
var lives = 3;
var highScore = parseInt(localStorage.getItem('fs_hi')) || 0;
var action = null;
var fruit = document.getElementById('fruit');
var container = document.getElementById('fruitcontainer');

var fruits = [
  'https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/1.png',
  'https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/2.png',
  'https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/3.png',
  'https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/4.png',
  'https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/5.png',
];

document.getElementById('bestScore').textContent = highScore;

document.getElementById('startBtn').onclick = startGame;
document.getElementById('retryBtn').onclick = startGame;

// Slice on touch/mouse
fruit.ontouchstart = fruit.onmousedown = function(e) {
  e.preventDefault();
  if (!playing) return;
  
  score++;
  document.getElementById('score').textContent = score;
  
  // Hide fruit with animation
  fruit.style.transform = 'scale(0)';
  fruit.style.opacity = '0';
  
  clearInterval(action);
  
  setTimeout(function() {
    fruit.style.transform = 'scale(1)';
    fruit.style.opacity = '1';
    startAction();
  }, 300);
};

function startGame() {
  playing = true;
  score = 0;
  lives = 3;
  
  document.getElementById('menu').classList.add('hidden');
  document.getElementById('gameOver').classList.add('hidden');
  document.getElementById('score').textContent = '0';
  updateLives();
  
  startAction();
}

function startAction() {
  if (!playing) return;
  
  // Random fruit image
  fruit.src = fruits[Math.floor(Math.random() * fruits.length)];
  
  // Random X position
  var maxX = container.offsetWidth - 70;
  fruit.style.left = Math.floor(Math.random() * maxX) + 'px';
  fruit.style.top = '-70px';
  fruit.style.display = 'block';
  
  // Random speed
  var speed = 3 + Math.floor(Math.random() * 4);
  
  action = setInterval(function() {
    var top = fruit.offsetTop + speed;
    fruit.style.top = top + 'px';
    
    // Fruit fell off screen
    if (top > container.offsetHeight) {
      clearInterval(action);
      
      lives--;
      updateLives();
      
      if (lives <= 0) {
        endGame();
      } else {
        startAction();
      }
    }
  }, 16);
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
  clearInterval(action);
  fruit.style.display = 'none';
  
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('fs_hi', highScore);
  }
  
  document.getElementById('finalScore').textContent = score;
  document.getElementById('bestScore').textContent = highScore;
  document.getElementById('gameOver').classList.remove('hidden');
}
