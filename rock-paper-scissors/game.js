// Rock Paper Scissors Game
const choices = {
  rock: '🪨',
  paper: '📄',
  scissors: '✂️'
};

let playerScore = 0;
let cpuScore = 0;
let streak = 0;
let isPlaying = false;

const playerChoiceEl = document.getElementById('playerChoice');
const cpuChoiceEl = document.getElementById('cpuChoice');
const playerScoreEl = document.getElementById('playerScore');
const cpuScoreEl = document.getElementById('cpuScore');
const messageEl = document.getElementById('message');
const streakEl = document.getElementById('streak');
const choiceBtns = document.querySelectorAll('.choice-btn');

// Determine winner
function getWinner(player, cpu) {
  if (player === cpu) return 'draw';
  if (
    (player === 'rock' && cpu === 'scissors') ||
    (player === 'paper' && cpu === 'rock') ||
    (player === 'scissors' && cpu === 'paper')
  ) {
    return 'win';
  }
  return 'lose';
}

// CPU makes a choice
function getCpuChoice() {
  const options = ['rock', 'paper', 'scissors'];
  return options[Math.floor(Math.random() * 3)];
}

// Play round
function playRound(playerChoice) {
  if (isPlaying) return;
  isPlaying = true;

  // Disable buttons
  choiceBtns.forEach(btn => btn.classList.add('disabled'));

  // Show player choice immediately
  playerChoiceEl.textContent = choices[playerChoice];
  playerChoiceEl.classList.add('shake');
  
  // CPU "thinking" animation
  cpuChoiceEl.textContent = '🤔';
  cpuChoiceEl.classList.add('shake');
  messageEl.textContent = 'CPU is choosing...';
  messageEl.className = 'message';

  // Reveal after delay
  setTimeout(() => {
    playerChoiceEl.classList.remove('shake');
    cpuChoiceEl.classList.remove('shake');

    const cpuChoice = getCpuChoice();
    cpuChoiceEl.textContent = choices[cpuChoice];

    const result = getWinner(playerChoice, cpuChoice);

    if (result === 'win') {
      playerScore++;
      streak++;
      messageEl.textContent = 'You Win! 🎉';
      messageEl.className = 'message win';
    } else if (result === 'lose') {
      cpuScore++;
      streak = 0;
      messageEl.textContent = 'You Lose! 😢';
      messageEl.className = 'message lose';
    } else {
      messageEl.textContent = "It's a Draw! 🤝";
      messageEl.className = 'message draw';
    }

    playerScoreEl.textContent = playerScore;
    cpuScoreEl.textContent = cpuScore;
    streakEl.textContent = streak;

    // Send score to parent
    const totalScore = playerScore * 10 + streak * 5;
    if (window.parent !== window) {
      window.parent.postMessage(JSON.stringify({
        type: 'score',
        score: totalScore
      }), '*');
    }

    // Re-enable buttons
    setTimeout(() => {
      isPlaying = false;
      choiceBtns.forEach(btn => btn.classList.remove('disabled'));
    }, 500);

  }, 800);
}

// Event listeners
choiceBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const choice = btn.dataset.choice;
    playRound(choice);
  });

  // Touch support
  btn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const choice = btn.dataset.choice;
    playRound(choice);
  });
});

// Prevent zoom on double tap
document.addEventListener('touchend', (e) => {
  e.preventDefault();
}, { passive: false });

// Expose startGame globally
window.startGame = function() {
  playerScore = 0;
  cpuScore = 0;
  streak = 0;
  playerScoreEl.textContent = '0';
  cpuScoreEl.textContent = '0';
  streakEl.textContent = '0';
  messageEl.textContent = 'Choose your move!';
  messageEl.className = 'message';
  playerChoiceEl.textContent = '❓';
  cpuChoiceEl.textContent = '❓';
};

// Draw idle preview
function drawIdlePreview() {
  // Animate the choice displays
  const emojis = ['🪨', '📄', '✂️'];
  let emojiIndex = 0;
  let animTime = 0;
  
  function animateIdle() {
    if (isPlaying) return;
    
    animTime++;
    
    // Cycle through emojis every 40 frames
    if (animTime % 40 === 0) {
      emojiIndex = (emojiIndex + 1) % emojis.length;
      playerChoiceEl.textContent = emojis[emojiIndex];
      cpuChoiceEl.textContent = emojis[(emojiIndex + 1) % emojis.length];
    }
    
    // Pulse effect on buttons
    const scale = 1 + Math.sin(animTime * 0.05) * 0.03;
    choiceBtns.forEach(btn => {
      btn.style.transform = `scale(${scale})`;
    });
    
    requestAnimationFrame(animateIdle);
  }
  animateIdle();
}

// Initialize preview on load
document.addEventListener('DOMContentLoaded', drawIdlePreview);