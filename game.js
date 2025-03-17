document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const holes = document.querySelectorAll('.hole');
    const robots = document.querySelectorAll('.robot');
    const scoreDisplay = document.getElementById('score');
    const timeDisplay = document.getElementById('time');
    const startButton = document.getElementById('start-button');
    
    // Game variables
    let score = 0;
    let timeLeft = 30;
    let gameInterval;
    let popUpInterval;
    let isPlaying = false;
    let lastHole;
    
    // Key mapping
    const keyMap = {
        'KeyQ': 'hole-q',
        'KeyW': 'hole-w',
        'KeyE': 'hole-e',
        'KeyA': 'hole-a',
        'KeyS': 'hole-s',
        'KeyD': 'hole-d'
    };
    
    // Initialize game
    function initGame() {
        score = 0;
        timeLeft = 30;
        isPlaying = true;
        scoreDisplay.textContent = score;
        timeDisplay.textContent = timeLeft;
        startButton.textContent = 'Game in Progress';
        startButton.disabled = true;
        
        // Start game intervals
        gameInterval = setInterval(countdown, 1000);
        popUpInterval = setInterval(popRobot, getRandomTime(600, 1200));
        
        // Hide all robots initially
        robots.forEach(robot => {
            robot.classList.remove('up');
            robot.classList.remove('whacked');
        });
    }
    
    // Countdown timer
    function countdown() {
        timeLeft--;
        timeDisplay.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            endGame();
        }
    }
    
    // End game
    function endGame() {
        clearInterval(gameInterval);
        clearInterval(popUpInterval);
        isPlaying = false;
        startButton.textContent = 'Start Game';
        startButton.disabled = false;
        
        // Hide all robots
        robots.forEach(robot => {
            robot.classList.remove('up');
        });
        
        // Show final score alert
        setTimeout(() => {
            alert(`Game Over! Your final score is ${score}`);
        }, 100);
    }
    
    // Get random time for robot to pop up
    function getRandomTime(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    
    // Get random hole
    function getRandomHole() {
        const index = Math.floor(Math.random() * holes.length);
        const hole = holes[index];
        
        // Avoid same hole twice in a row
        if (hole === lastHole) {
            return getRandomHole();
        }
        
        lastHole = hole;
        return hole;
    }
    
    // Pop robot up from a random hole
    function popRobot() {
        if (!isPlaying) return;
        
        const time = getRandomTime(600, 1200);
        const hole = getRandomHole();
        const robot = hole.querySelector('.robot');
        const keyHint = hole.querySelector('.key-hint');
        
        // Add active classes
        hole.classList.add('active-hole');
        keyHint.classList.add('active-key');
        robot.classList.add('up');
        
        // Set timeout to hide robot
        setTimeout(() => {
            robot.classList.remove('up');
            robot.classList.remove('whacked');
            hole.classList.remove('active-hole');
            keyHint.classList.remove('active-key');
            
            if (isPlaying) {
                popUpInterval = setTimeout(popRobot, getRandomTime(600, 1200));
            }
        }, time);
    }
    
    // Handle keyboard input
    function handleKeyPress(e) {
        if (!isPlaying) return;
        
        const keyCode = e.code;
        if (keyMap[keyCode]) {
            const holeId = keyMap[keyCode];
            const hole = document.getElementById(holeId);
            const robot = hole.querySelector('.robot');
            
            // Check if robot is up and not already whacked
            if (robot.classList.contains('up') && !robot.classList.contains('whacked')) {
                robot.classList.add('whacked');
                score++;
                scoreDisplay.textContent = score;
                
                // Add difficulty as score increases
                if (score % 10 === 0 && timeLeft < 25) {
                    timeLeft += 5;
                    timeDisplay.textContent = timeLeft;
                }
            }
        }
    }
    
    // Event listeners
    startButton.addEventListener('click', initGame);
    document.addEventListener('keydown', handleKeyPress);
    
    // Visual feedback for key presses
    document.addEventListener('keydown', (e) => {
        const keyCode = e.code;
        if (keyMap[keyCode]) {
            const holeId = keyMap[keyCode];
            const hole = document.getElementById(holeId);
            hole.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                hole.style.transform = 'scale(1)';
            }, 100);
        }
    });
}); 