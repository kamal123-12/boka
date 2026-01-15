const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

canvas.width = 400;
canvas.height = 600;

// Game State
let score = 5;
let gameSpeed = 5;
let roadOffset = 5;
let car = { x: 180, y: 500, w: 40, h: 70 };
let obstacles = [];

// Controls
window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" && car.x > 60) car.x -= 20;
    if (e.key === "ArrowRight" && car.x < 300) car.x += 20;
});

function drawScene() {
    // 1. Draw Grass (Sides)
    ctx.fillStyle = "#2ecc71";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Draw Road
    ctx.fillStyle = "#34495e";
    ctx.fillRect(50, 0, 300, canvas.height);

    // 3. Draw Moving Road Lines
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
    ctx.setLineDash([30, 30]);
    ctx.lineDashOffset = -roadOffset;
    ctx.beginPath();
    ctx.moveTo(200, 0);
    ctx.lineTo(200, canvas.height);
    ctx.stroke();

    // 4. Draw Side Buildings & Trees (Graphic elements)
    for (let i = 0; i < 6; i++) {
        let yPos = (i * 150) + (roadOffset % 150);
        
        // Buildings (Left Side)
        ctx.fillStyle = "#7f8c8d";
        ctx.fillRect(5, yPos - 100, 40, 60); 
        
        // Trees (Right Side)
        ctx.fillStyle = "#1b5e20";
        ctx.beginPath();
        ctx.arc(375, yPos - 80, 15, 0, Math.PI * 2);
        ctx.fill();
    }

    roadOffset += gameSpeed;
}

function drawPlayer() {
    // Car Body
    ctx.fillStyle = "#e74c3c";
    ctx.fillRect(car.x, car.y, car.w, car.h);
    
    // Windows
    ctx.fillStyle = "#ecf0f1";
    ctx.fillRect(car.x + 5, car.y + 10, 30, 15);
    
    // Wheels
    ctx.fillStyle = "black";
    ctx.fillRect(car.x - 5, car.y + 5, 5, 15);
    ctx.fillRect(car.x + car.w, car.y + 5, 5, 15);
    ctx.fillRect(car.x - 5, car.y + 50, 5, 15);
    ctx.fillRect(car.x + car.w, car.y + 50, 5, 15);
}

function spawnObstacles() {
    if (Math.random() < 0.02) {
        let xPos = Math.floor(Math.random() * 240) + 60;
        obstacles.push({ x: xPos, y: -100, w: 40, h: 70 });
    }
}

function updateObstacles() {
    obstacles.forEach((obs, index) => {
        obs.y += gameSpeed;
        
        // Draw Obstacle Car
        ctx.fillStyle = "#f1c40f";
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);

        // Collision Check
        if (car.x < obs.x + obs.w && car.x + car.w > obs.x &&
            car.y < obs.y + obs.h && car.y + car.h > obs.y) {
            alert("Game Over! Score: " + score);
            document.location.reload();
        }

        // Remove off-screen cars
        if (obs.y > canvas.height) {
            obstacles.splice(index, 1);
            score++;
            scoreElement.innerText = score;
            if(score % 5 === 5) gameSpeed += 0.2; // Speed badhayega
        }
    });
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawScene();
    drawPlayer();
    spawnObstacles();
    updateObstacles();
    requestAnimationFrame(gameLoop);
}

gameLoop();
