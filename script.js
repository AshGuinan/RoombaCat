var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    width = 400,
    height = 500,
    ship_x = (width / 2), ship_y = 0, ship_w = 70, ship_h = 70,
    rightKey = false,
    leftKey = false,
    enemyTotal = 4,
    enemies = [],
    alive = false,
    frameIndex = 0,
    tickCount = 0,
    ticksPerFrame = 0,
    numberOfFrames = 3,
    lives = 3;

var dog = {
    x: 0,
    y : height/2,
    w : 54,
    h : 90,
    speed : 4,
    img : new Image()
};

var rCat = new Image();
rCat.src = 'assets/catsanddogs_Hiura_Flour.png';

function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

function isInside(pos, rect){
    return pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.heigth && pos.y > rect.y
}


var rect = {
    x:180,
    y:400,
    width:50,
    height:50
};

canvas.addEventListener('click', function(evt) {
    var mousePos = getMousePos(canvas, evt);

    if (isInside(mousePos,rect) && lives>0) {
        alive=true;
    }
    if (isInside(mousePos,rect) && lives<=0) {
        alive=true;
        lives = 3;
    }
}, false);

function startScreen(){
    var catPosX = 180;
    var catPosY = 180;
    var sec = 10;
    ctx.drawImage(rCat, 0, 0, ship_w, ship_h, catPosX, catPosY, ship_w, ship_h);
    ctx.font = "bold 36px Six Caps";
    ctx.fillStyle = 'black';
    ctx.fillText('THE ADVENTURES OF', 100, 300, 200);
    ctx.font = "bold 36px Bangers";
    ctx.fillStyle = 'black';
    ctx.fillText('ROOMBA CAT', 25, 400, 350);
    ctx.beginPath();
    ctx.rect(180, 400, 50, 50);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillStyle = 'rgba(225,225,225,0.5)';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000000';
    ctx.font = "bold 16px Arial";
    ctx.fillStyle = 'black';
    ctx.fillText('GO!', 190, 430, 45);
    ctx.stroke();
    ctx.closePath();
}

function createEnemies (){
    for (var i = 0; i < enemyTotal; i++) {
        dog.x += dog.w + Math.random() * (60 - 20) + 20;
        if ((dog.x + dog.w)>=width){
            dog.x = Math.random() * 10;
            dog.y = dog.y + 100;
            enemies.push({
                x: dog.x,
                y: dog.y,
                w: dog.w,
                h: dog.h,
                speed: dog.speed
            });
        } else {
            var q = width - dog.x;
            dog.x += dog.w + Math.random() * (q - 20) + 20;
            enemies.push({
                x: dog.x,
                y: dog.y,
                w: dog.w,
                h: dog.h,
                speed: dog.speed
            });
        }
    }
}

function clearCanvas() {
    ctx.clearRect(0,0,width,height);
}

function drawCat() {
    if (rightKey) ship_x += 5;
    else if (leftKey) ship_x -= 5;
    if (ship_x <= 0){
        ship_x = 0;
    }
    if ((ship_x + ship_w) >= width){
        ship_x = width - 70;
    }

    ctx.drawImage(rCat, frameIndex * ship_w, 0, ship_w, ship_h, ship_x, ship_y, ship_w, ship_h);
}

function updateDFrame() {

    tickCount += 1;

    if (tickCount > ticksPerFrame) {

        tickCount = 0;

        // If the current frame index is in range
        if (frameIndex < numberOfFrames - 1) {
            // Go to the next frame
            frameIndex += 1;
        } else {
            frameIndex = 0;
        }
    }
}

function updateCFrame() {

    tickCount += 1;

    if (tickCount > ticksPerFrame) {

        tickCount = 0;

        // If the current frame index is in range
        if (frameIndex < numberOfFrames - 1) {
            // Go to the next frame
            frameIndex += 1;
        } else {
            frameIndex = 0;
        }
    }
}
function drawEnemies() {
    for (var i = 0; i < enemies.length; i++) {
        dog.img.src = 'assets/dog.png';
        ctx.drawImage(dog.img, frameIndex * dog.w, 0, dog.w, dog.h, enemies[i].x, enemies[i].y,  dog.w, dog.h);
    }
}


function moveEnemies() {
    for (var i = 0; i < enemies.length; i++) {
        if (enemies[i].y <= height) {
            enemies[i].y += -enemies[i].speed;
        }
        if (enemies[i].y < -90) {
           enemies[i].y = height;
           enemies[i].x =  Math.random() * width;
        }
    }
}

function shipCollision() {
    var ship_xw = ship_x + ship_w,
        ship_yh = ship_y + ship_h;
    for (var i = 0; i < enemies.length; i++) {
        if(lives > 0){
            if (ship_x > enemies[i].x && ship_x < enemies[i].x + enemies[i].w && ship_y > enemies[i].y && ship_y < enemies[i].y + enemies[i].h) {
                enemies[i].y = height;
                enemies[i].x =  Math.random() * width;
                lives = lives -1;
                console.log(lives);
                console.log('Dead');
            }
            if (ship_xw < enemies[i].x + enemies[i].w && ship_xw > enemies[i].x && ship_y > enemies[i].y && ship_y < enemies[i].y + enemies[i].h) {
                enemies[i].y = height;
                enemies[i].x =  Math.random() * width;
                lives = lives -1;
                console.log(lives);
                console.log('Dead');
            }
            if (ship_yh > enemies[i].y && ship_yh < enemies[i].y + enemies[i].h && ship_x > enemies[i].x && ship_x < enemies[i].x + enemies[i].w) {
                enemies[i].y = height;
                enemies[i].x =  Math.random() * width;
                lives = lives -1;
                console.log(lives);
                console.log('Dead');
            }
            if (ship_yh > enemies[i].y && ship_yh < enemies[i].y + enemies[i].h && ship_xw < enemies[i].x + enemies[i].w && ship_xw > enemies[i].x) {
                enemies[i].y = height;
                enemies[i].x =  Math.random() * width;
                lives = lives -1;
                console.log(lives);
                console.log('Dead');
            }
        } else {
            alive = false;
        }
    }
}

function drawTrimmings() {
    for(var i =1; i <=lives; i++){
        var heart = new Image();
        heart.src = 'assets/heart_NicoleMarieProductions.png';
        ctx.drawImage(heart, (i*30), 450);
    }

}

function keyDown(e) {
    if (e.keyCode == 39) rightKey = true;
    else if (e.keyCode == 37) leftKey = true;
}

function keyUp(e) {
    if (e.keyCode == 39) rightKey = false;
    else if (e.keyCode == 37) leftKey = false;
    console.log(ship_x);
}

function scoreTotal() {
    if (lives <= 0) {
        ctx.font = "bold 36px Arial";
        ctx.fillText('GAME OVER!', 95, 300);
        ctx.beginPath();
        ctx.rect(180, 400, 60, 50);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillStyle = 'rgba(225,225,225,0.5)';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000000';
        ctx.font = "bold 16px Arial";
        ctx.fillStyle = 'black';
        ctx.fillText('Menu!', 190, 420, 45);
        ctx.stroke();
        ctx.closePath();
    }
}

function init() {
    createEnemies();
    setInterval(gameLoop, 25);
    setInterval(updateDFrame, 250);
    setInterval(updateCFrame, 2000);
    document.addEventListener('keydown', keyDown, false);
    document.addEventListener('keyup', keyUp, false);
}

function gameLoop() {
    clearCanvas();
    if(alive){
        drawCat();
        drawEnemies();
        moveEnemies();
        shipCollision();
        drawTrimmings();
    }
    if(!alive && lives>0){
        startScreen();
    }
    scoreTotal();
}

    window.onload = init;