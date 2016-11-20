var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    width = 400,
    height = 500,
    rightKey = false,
    leftKey = false,
    upKey = false,
    downKey = false,
    enemyTotal = 4,
    enemies = [],
    alive = false,
    frameIndex = 0,
    tickCount = 0,
    ticksPerFrame = 0,
    numberOfFrames = 3,
    startTime,
    currentTime,
    total,
    lives = 3,
    gameOver = false,
    audio;

var dog = {
    x: 0,
    y : height/2,
    w : 54,
    h : 90,
    speed : 5,
    img : new Image()
};
var cat = {
    x: 200,
    y : 0,
    w : 90,
    h : 90,
    img : new Image()
};
var rCat = new Image();
rCat.src = 'assets/catsanddogs_Hiura_Flour.png';

//Function to get the mouse position
function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}
//Function to check whether a point is inside a rectangle
function isInside(pos, rect){
    return pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.heigth && pos.y > rect.y
}

//The rectangle should have x,y,width,height properties
var rect = {
    x:180,
    y:400,
    width:50,
    heigth:50
};

canvas.addEventListener('click', function(evt) {
    var mousePos = getMousePos(canvas, evt);

    if (isInside(mousePos,rect) & lives>0) {
        alive=true;
        startTime = Date.now();
        //audio.pause();
    }
    if (isInside(mousePos,rect) & lives<=0) {
        alive=true;
        lives = 3;
    }
}, false);

function startScreen(){
    var catPosX = 180;
    var catPosY = 180;
    var sec = 10;
    // audio = new Audio('assets/BrandonMorris_LoadingScreenLoop.wav');
    // audio.play();
    ctx.drawImage(rCat, 0, 0, cat.w, cat.h, catPosX, catPosY, cat.w, cat.h);
    ctx.font = "bold 36px Six Caps";
    ctx.fillStyle = 'black';
    ctx.fillText('THE ADVENTURES OF', 25, 300, 200);
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
    if (rightKey) cat.x += 5;
    else if (leftKey) cat.x -= 5;
    if (upKey) cat.y -=5;
    else if (downKey) cat.y +=5;
    if (cat.x <= 0){
        cat.x = 0;
    }
    if(cat.y <=0){
        cat.y = 0;
    }

    if(cat.y >=80){
        cat.y = 80;
    }
    if ((cat.x + cat.w) >= width){
        cat.x = width - 90;
    }
    ctx.drawImage(rCat, frameIndex * cat.w, 0, cat.w, cat.h, cat.x, cat.y, cat.w, cat.h);
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

function drawFurniture() {
    for (var i = 0; i < 3; i++) {
        var furniture = new Image();
        var fWidth = 100, fHeight = 85, fX, fY = height;
        fY+=100;
        fX = Math.random() * 350;
        furniture.src = 'assets/Big_furniture.png';
        ctx.drawImage(furniture, fWidth, 0, fWidth, fHeight, fX, fY, fWidth, fHeight);
        console.log('Furniture!');
    }
    //console.log(enemies.length);
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
    currentTime = Date.now();
}

function shipCollision() {
    var cat_xw = cat.x + cat.w,
        cat_yh = cat.y + cat.h;
    for (var i = 0; i < enemies.length; i++) {
        if(lives > 0){
            if (cat.x < enemies[i].x + enemies[i].w && cat.x + cat.w > enemies[i].x && cat.y < enemies[i].y + enemies[i].h && cat.h + cat.y > enemies[i].y) {
                enemies[i].y = height;
                enemies[i].x =  Math.random() * width;
                lives = lives -1;
                console.log("###" + i + ": " + enemies[i].y);
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
    total = Math.floor((currentTime - startTime)/1000);
    //console.log(total);
}

function keyDown(e) {
    if (e.keyCode == 39) rightKey = true;
    else if (e.keyCode == 37) leftKey = true;
    else if (e.keyCode == 38) upKey = true;
    else if (e.keyCode == 40) downKey = true;
}

function keyUp(e) {
    if (e.keyCode == 39) rightKey = false;
    else if (e.keyCode == 37) leftKey = false;
    else if (e.keyCode == 38) upKey = false;
    else if (e.keyCode == 40) downKey = false;
}

function scoreTotal() {
    if (lives <= 0) {
        gameOver = true;
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
        drawFurniture();
        shipCollision();
        drawTrimmings();
    }
    if(!alive && lives>0){
        startScreen();
    }
    scoreTotal();
}

    window.onload = init;