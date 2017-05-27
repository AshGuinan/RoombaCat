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
    total = 0,
    lives = 3,
    gameOver = false,
    audio,
    impact,
    meow,
    loadCredits = false;

//Dog, cat, battery objects
var dog = {
    x: 0,
    y : height/2,
    w : 54,
    h : 90,
    speed : 6,
    img : new Image()
};
var cat = {
    x: 200,
    y : 0,
    w : 90,
    h : 90,
    img : new Image()
};

var battery = {
    x: 200,
    y : 200,
    w : 40,
    h : 25,
    speed : 4,
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
//Function to check whether a point is inside a button
function isInside(pos, rect){
    return pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.height && pos.y > rect.y
}

//The clickable buttons
var go_Button = {
    x:180,
    y:400,
    width:50,
    height:50
};

var off_Button = {
    x:20,
    y:20,
    width:20,
    height:20
};

var on_Button = {
    x:50,
    y:20,
    width:20,
    height:20
};

var back_Button = {
    x:75,
    y:15,
    width:30,
    height:50
};

var credit_Button = {
    x:180,
    y:440,
    width:60,
    height:30
};

//Listen for click events on the canvas
canvas.addEventListener('click', function(evt) {
    var mousePos = getMousePos(canvas, evt);

    //If inside the 'go' button, and lives are present, start the game
    if (isInside(mousePos,go_Button) && lives>0) {
        alive=true;
        startTime = Date.now();
    }
    //If inside the 'go' button, and lives are not present,
    // refill lives and return to main menu
    if (isInside(mousePos,go_Button) && lives<=0) {
        alive=false;
        lives = 3;
        total = 0;
        startTime = Date.now();
    }
    //If inside 'off' button, turn music off
    if (isInside(mousePos,off_Button)) {
        audio.pause();
        console.log('pause');
    }
    //If inside 'on' button, turn music on
    if (isInside(mousePos,on_Button)) {
        audio.play();
        console.log('play');
    }
    //If inside 'credits' button, show credits
    if (isInside(mousePos,credit_Button)) {
        loadCredits = true;
    }

    //move to credits function!
    if (isInside(mousePos,back_Button)) {
        // Clear the canvas after credits - doesn't fix the diplay problem, but might help with similar things
        // ctx.clearRect(0, 0, canvas.width, canvas.height);
        loadCredits = false;
        gameOver = false;
    }
}, false);

//Draw sound on/off buttons on canvas
function audioButtons(){
    ctx.beginPath();
    ctx.rect(off_Button.x, off_Button.y, off_Button.height, off_Button.width);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillStyle = 'rgba(225,225,225,0.5)';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000000';
    ctx.font = "bold 16px Arial";
    ctx.fillStyle = 'black';
    ctx.fillText('Music: ', 30, 15, 35);
    ctx.font = "bold 16px Arial";
    ctx.fillStyle = 'black';
    ctx.fillText('Off', 22, 35, 15);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.rect(on_Button.x, on_Button.y, on_Button.height, on_Button.width);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillStyle = 'rgba(225,225,225,0.5)';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000000';
    ctx.font = "bold 16px Arial";
    ctx.fillStyle = 'black';
    ctx.fillText('On', 52, 35, 15);
    ctx.stroke();
    ctx.closePath();
}

//Draw start screen, including buttons and cat
function startScreen(){
    var catPosX = 165;
    var catPosY = 180;
    var sec = 10;
    ctx.drawImage(rCat, 0, 0, cat.w, cat.h, catPosX, catPosY, cat.w, cat.h);
    ctx.font = "bold 30px Bangers";
    ctx.fillStyle = 'black';
    ctx.fillText('THE ADVENTURES OF', 110, 300, 200);
    ctx.font = "bold 42px Bangers";
    ctx.fillStyle = 'black';
    ctx.fillText('ROOMBA CAT', 115, 350, 350);
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
    loadCredits = false;
}

//Create enemies
function createEnemies (){
    for (var i = 0; i < enemyTotal; i++) {
        //Place the location of the dogs
        dog.x += dog.w + Math.random() * (60 - 20) + 20;
        if (20 >(dog.x + dog.w)>=(width-50)){
            dog.x = Math.random() * 10;
            dog.y += Math.random() * (175 - 100) + 175;
            //Push dogs into array
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
//Draw dogs on canvas
function drawEnemies() {
    for (var i = 0; i < enemies.length; i++) {
        dog.img.src = 'assets/dog.png';
        ctx.drawImage(dog.img, frameIndex * dog.w, 0, dog.w, dog.h, enemies[i].x, enemies[i].y,  dog.w, dog.h);
    }
}

//Move dog sprites up the canvas
function moveEnemies() {
    for (var i = 0; i < enemies.length; i++) {
        if (enemies[i].y <= height) {
            enemies[i].y -= enemies[i].speed + (total/5);
        }
        if (enemies[i].y < -90) {
            enemies[i].y = height;
            enemies[i].x =  Math.random() * width;
        }
    }
    //Scoring
    currentTime = Date.now();
}

//Create, draw and move batteries on screen
function drawLives() {
        battery.img.src = 'assets/battery.png';
        ctx.drawImage(battery.img, 0, 0,battery.w, battery.h, battery.x, battery.y,  battery.w, battery.h);
        if (battery.y <= height) {
            battery.y -= battery.speed;
        }
        if  (battery.y < -90){
            battery.y = height;
            battery.x = Math.random() * width;
        }
}
//Clear canvas for next game loop
function clearCanvas() {
    ctx.clearRect(0,0,width,height);
}

//Move and draw cat on canvas
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

//Update dog animation
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

//Update cat animation
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

//Collision detection
function shipCollision() {
    for (var i = 0; i < enemies.length; i++) {
        if(lives > 0){
            //If cat collides with dog, lose life, play bark and continue
            if (cat.x < enemies[i].x + enemies[i].w && cat.x + cat.w > enemies[i].x && cat.y < enemies[i].y + enemies[i].h && cat.h + cat.y > enemies[i].y) {
                enemies[i].y = height;
                enemies[i].x =  Math.random() * width;
                lives = lives -1;
                impact= new Audio('assets/Dog Woof-SoundBible.mp3');
                impact.addEventListener('canplaythrough', function() {
                    this.play();
                }, false);

            }
        } else {
            //Game over, make cat meow
            alive = false;
            meow = new Audio('assets/Cat_3.wav');
            meow.addEventListener('canplaythrough', function() {
                this.play();
            }, false);
        }
    }
}
//Collision detection - if cat collides with battery, add life.
function collectLife() {
    if(lives > 0) {
        if (cat.x < battery.x + battery.w && cat.x + cat.w > battery.x && cat.y < battery.y + battery.h && cat.h + cat.y > battery.y) {
            battery.y = height;
            battery.x = Math.random() * width;
            if (lives <= 5){
                lives = lives + 1;
            } else {
                lives = 5;
            }
        }
    }
}

//Draw lives remaining and current score
function drawTrimmings() {
    for(var i =1; i <=lives; i++){
        var heart = new Image();
        heart.src = 'assets/heart_NicoleMarieProductions.png';
        ctx.drawImage(heart, (i*30), 450);
    }
    total = Math.floor((currentTime - startTime)/1000);
    ctx.font = "bold 16px Arial";
    ctx.fillStyle = 'black';
    ctx.fillText(total, 300, 475);

}

//Key presses
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

//Store highscore in local storage
//Draw game over screen
function scoreTotal() {
    var highscore = localStorage.getItem("highscore");
    if (lives <= 0) {
        if(highscore === null){
            localStorage.setItem("highscore", total );
        }else{
            if (total > highscore) {
                localStorage.setItem("highscore", total );
            }
        }
        gameOver = true;
        loadCredits = false;

        ctx.textAlign = 'start';
        ctx.font = "bold 36px Bangers";
        ctx.fillText('GAME OVER!', 130, 300);
        ctx.fillText('Score: '+ total, 145, 340);
        ctx.fillText('High Score: '+ highscore, 115, 370);
        ctx.beginPath();
        ctx.rect(180, 400, 60, 30);
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
        ctx.beginPath();
        ctx.rect(180, 440, 60, 30);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillStyle = 'rgba(225,225,225,0.5)';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000000';
        ctx.font = "bold 16px Arial";
        ctx.fillStyle = 'black';
        ctx.fillText('Credits', 185, 460, 48);
        ctx.stroke();
        ctx.closePath();
    }
}

//Draw credits screen
function creditScreen(){
    console.log('show credits.');
    audio.pause();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.font = "bold 20px Bangers";

    ctx.beginPath();
    ctx.rect(back_Button.x, back_Button.y, back_Button.height, back_Button.width);
    ctx.fillText('Back', 95, 37);
    ctx.font = "bold 16px Arial";
    ctx.fillStyle = '#FFFFFF';
    ctx.fillStyle = 'rgba(225,225,225,0.5)';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000000';
    ctx.font = "bold 16px Arial";
    ctx.fillStyle = 'black';
    ctx.fillText('On', 52, 35, 15);
    ctx.stroke();
    ctx.closePath();

    console.log('show credits text.');

    ctx.fillStyle = 'white';
    ctx.fillText('Credits', 200, 80);
    ctx.fillText('Music/Sound Effects: ', 200, 110);
    ctx.font = "16px Arial";
    ctx.fillText('Cat Song & Cat SFX -- Dan Knoflicek', 200, 130);
    ctx.font = "bold 16px Arial";
    ctx.fillText('Available at: ', 200, 150);
    ctx.font = "16px Arial";
    ctx.fillText('http://opengameart.org/users/macro', 200, 170);
    ctx.font = "20px Bangers";
    ctx.fillText('Sprites ', 200, 200);
    ctx.fillText('Monty the Dogs: ', 200, 230);
    ctx.font = "16px Arial";
    ctx.fillText('Hiura Flour', 200, 250);
    ctx.font = "20px Bangers";
    ctx.fillText('Mac, the Roomba Cat: ', 200, 280);
    ctx.font = "16px Arial";
    ctx.fillText('Based on content by Hiura Flour', 200, 300);
    ctx.font = "bold 16px Arial";
    ctx.fillText('Spritesheet available at: ', 200, 320);
    ctx.font = "16px Arial";
    ctx.fillText('https://grandmadebslittlebits.wordpress.com/', 200, 340, 290);
    ctx.fillText('Heart Sprite by NicoleMarieProductions', 200, 370, 290);
    ctx.font = "20px Bangers";
    ctx.fillText('Background: ', 200, 390);
    ctx.font = "16px Arial";
    ctx.fillText('Tiziana', 200, 410);
    ctx.font = "bold 16px Arial";
    ctx.fillText('Available at: ', 200, 430);
    ctx.font = "16px Arial";
    ctx.fillText('http://opengameart.org/content/terracottabeige-stone-tile-floor-256px', 200, 450, 320);
    ctx.font = "20px Bangers";
    ctx.fillText('Battery Sprite & Game Code : Aisling Guinan', 200, 470);
    ctx.font = "10px Bangers";
    ctx.fillText('4BCT -- 13364696 -- 2016', 200, 490);
}

function init() {
    createEnemies();
    setInterval(gameLoop, 25);
    setInterval(updateDFrame, 250 + (total/5));
    setInterval(updateCFrame, 2000);
    document.addEventListener('keydown', keyDown, false);
    document.addEventListener('keyup', keyUp, false);
    audio = new Audio('assets/Cat_Song_Dan_Knoflicek.wav');
    audio.addEventListener('canplaythrough', function() {
        this.play();
        this.loop = true;
    }, false);
}

function gameLoop() {
    clearCanvas();
    audioButtons();
    if(alive){
        drawCat();
        drawEnemies();
        moveEnemies();
        drawLives();
        collectLife();
        shipCollision();
        drawTrimmings();
    }
    if(!alive && lives>0 && loadCredits==false){
        startScreen();
    }
    if(!alive && loadCredits==true){
        creditScreen();
    }
    if(loadCredits==false){
        scoreTotal();
    }
}

    window.onload = init;