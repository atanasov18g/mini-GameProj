const gameStart = document.querySelector(".game-start");
const gameScore = document.querySelector(".game-score");
const gameArea = document.querySelector(".game-area");
const gameOver = document.querySelector(".game-over");
const points = document.querySelector(".points");

gameStart.addEventListener("click", onStartGame);
document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);

const keys = {};
const player = {
    x: 55,
    y: 425,
    width: 0,
    height: 0,
    lastFireBall: 0
};
const game = {
    speed: 2,
    moveSpeed: 3.5,
    fireBallSpeed: 4,
    fireBallInterval: 700,
    cloudSpeed: 0.8,
    cloudInterval: 2650,
    bugInterval: 2100,
    bugBonusPoints: 350,
};

const scene = {
    points: 0,
    lastCloud: 0,
    lastBug: 0,
    isActive: true,
}

function onStartGame(event) {
    gameStart.style.display = "none";

    const wizard = document.createElement("div");

    wizard.classList.add("wizard");
    wizard.style.top = player.y + "px";
    wizard.style.left = player.x + "px";


    gameArea.appendChild(wizard);
    player.height = wizard.offsetHeight;
    player.width = wizard.offsetWidth;
    window.requestAnimationFrame(startedTheGame)
}

function startedTheGame(timestamp) {
    const wizard = document.querySelector(".wizard");
    const fireBalls = document.querySelectorAll(".fire-ball");
    const clouds = document.querySelectorAll(".cloud");
    const bugs = document.querySelectorAll(".bug");

    let gameAreaWidth = gameArea.offsetWidth;
    let gameAreaHeight = gameArea.offsetHeight;
    let wizardWidth = player.width + player.x;
    let wizardHeight = player.height + player.y;
    let inAir = player.y + player.height < gameAreaHeight;


    if (timestamp - scene.lastCloud > game.cloudInterval + 20000 * Math.random()) {
        scene.lastCloud = timestamp;
        addCloud();
    }

    if (timestamp - scene.lastBug > game.bugInterval + 20000 * Math.random()) {
        scene.lastBug = timestamp;
        addBug();
    }

    fireBalls.forEach(fireBall => {
        fireBall.x += game.speed * game.fireBallSpeed;
        fireBall.style.left = fireBall.x + "px";
        if (fireBall.x + fireBall.offsetWidth > gameAreaWidth) {
            fireBall.remove();
        }
        
    })

    clouds.forEach(cloud => {
        cloud.x -= game.speed * game.cloudSpeed;
        cloud.style.left = cloud.x + "px";
        if (cloud.x < 0) {
            cloud.remove();
        }
    })

    bugs.forEach(bug => {
        bug.x -= game.speed * 2;
        bug.style.left = bug.x + "px";
        if (bug.x + bug.offsetWidth <= 0) {
            bug.remove();
        }

        if (collision(wizard, bug)) {
            gameIsOver();
        }

        fireBalls.forEach(fireball => {
            if(collision(fireball, bug)){
                scene.points += game.bugBonusPoints;
                bug.remove();
                fireball.remove();
            }
        })
        
    })

    if (inAir) {
        player.y += game.speed;
    }

    if (keys.Space && timestamp - player.lastFireBall > game.fireBallInterval) {
        wizard.classList.add("wizard-fire");
        addFireBall();
        player.lastFireBall = timestamp;
    } else {
        wizard.classList.remove("wizard-fire");
    }

    if (keys.ArrowUp && player.y > 0) {
        player.y -= game.speed * game.moveSpeed
    }
    if (keys.ArrowDown && gameAreaHeight > wizardHeight) {
        player.y += game.speed * game.moveSpeed
    }

    if (keys.ArrowLeft && player.x > 0) {
        player.x -= game.speed * game.moveSpeed
    }

    if (keys.ArrowRight && gameAreaWidth > wizardWidth) {
        player.x += game.speed * game.moveSpeed
    }
    wizard.style.top = player.y + "px";
    wizard.style.left = player.x + "px";
    points.textContent = scene.points + " pts.";
    if (scene.isActive) {
        window.requestAnimationFrame(startedTheGame);
    }

}

function addFireBall() {
    let fireBall = document.createElement("div");
    fireBall.classList.add("fire-ball");
    fireBall.style.top = (player.y + 40) + "px";
    fireBall.x = player.x + player.width
    fireBall.style.left = fireBall.x + "px";
    gameArea.appendChild(fireBall);
}


function addCloud() {
    let cloud = document.createElement("div");
    cloud.classList.add("cloud");
    gameArea.appendChild(cloud);
    cloud.x = gameArea.offsetWidth - 200;
    cloud.style.left = cloud.x + "px";
    cloud.style.top = (gameArea.offsetHeight - 400) * Math.random() + "px";

}

function addBug() {
    let bug = document.createElement("div");
    bug.classList.add("bug");
    gameArea.appendChild(bug);
    bug.x = (gameArea.offsetWidth - 130)
    bug.style.left = bug.x + "px"
    bug.style.top = (gameArea.offsetHeight - 165) * Math.random() + "px";


}

function collision(elementA, elementB) {
    let elARect = elementA.getBoundingClientRect();
    let elBRect = elementB.getBoundingClientRect();
    return !(elARect.top > elBRect.bottom ||
        elARect.bottom < elBRect.top ||
        elARect.right < elBRect.left ||
        elARect.left > elBRect.right)
}


function gameIsOver() {
    scene.isActive = false;
    gameOver.classList.remove("hide");
}

function onKeyDown(event) {
    console.log(event.code);
    keys[event.code] = true;
}
function onKeyUp(event) {
    console.log(event.code);
    keys[event.code] = false;
}
