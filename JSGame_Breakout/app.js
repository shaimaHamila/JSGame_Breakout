const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.height = 500;
canvas.width = 600;

// Paddel
let rightPressed = false;
let leftPressed = false;

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(e){
    if(e.key ==  "Right" || e.key == "ArrowRight"){
        rightPressed = true;
    }else if(e.key == "Left" || e.key == "ArrowLeft"){
        leftPressed = true;
    }
}

function keyUpHandler(e){
    if(e.key ==  "Right" || e.key == "ArrowRight"){
        rightPressed = false;
    }else if(e.key == "Left" || e.key == "ArrowLeft"){
        leftPressed = false;
    }
}

function movePaddle(){
    if(rightPressed){
        paddle.x += 7;
        if(paddle.x + paddle.width >= canvas.width){
            paddle.x = canvas.width - paddle.width;
        }
    }
    else if(leftPressed){
        paddle.x -= 7;
        if(paddle.x < 0){
            paddle.x = 0;
        }
    }
}

// Sound

var sound1 = new Audio("mixkit-arcade-retro-changing-tab-206.wav");
var sound2 = new Audio("mixkit-arcade-mechanical-bling-210.wav");
var sound3 = new Audio("mixkit-arcade-retro-scoring-counter-273.wav");
// var soundOff = document.querySelector("#soundOff");
// var soundOn = document.querySelector("#soundOn");
// var playsound = true;
// soundOff.addEventListener('click', playSound(sound1));
// soundOn.addEventListener('click', playSound(sound2));

// function playSound(mySound){
//         mySound.play();
// }


// var collisionSound = new Audio("mixkit-arcade-retro-changing-tab-206.wav");
// var loserSound = new Audio("mixkit-arcade-mechanical-bling-210.wav");
// var levelSound = new Audio("mixkit-arcade-retro-scoring-counter-273.wav");



// Score
const scoreDisplay = document.querySelector(".high-score")
const reset = document.querySelector(".reset") 
let highScore = parseInt(localStorage.getItem("highScore"));

let score = 0;

function drawScore(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#230c33";
    ctx.fillText("Score: " + score, 8, 20);
}

if(isNaN(highScore)){
    highScore = 0;
}
scoreDisplay.innerHTML = `High Score: ${highScore}`;

reset.addEventListener('click', ()=>{
    localStorage.setItem("highScore", "0");
    score = 0;
    scoreDisplay.innerHTML = "High Score: 0";
    
})




//Speed
let speed = 4;

// Ball object
let ball ={
    x: canvas.width / 2,
    y: canvas.height - 50,
    dx: speed,
    dy: -speed + 1,
    radius: 7,
    draw: function(){
        ctx.beginPath();
        ctx.fillStyle = "#230c33";
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    } 
};


//Paddle object
let paddle = {
    height: 10,
    width: 76,
    x: canvas.width / 2 - 76 / 2,
    draw: function(){
        ctx.beginPath();
        ctx.rect(this.x, canvas.height - this.height, this.width, this.height);
        ctx.fillStyle = "#230c33";
        ctx.closePath();
        ctx.fill();
    }
};



// Drow Function: play()
function play(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ball.draw();
    paddle.draw();
    drawBricks();
    movePaddle();
    collisionDetection();
    levelUp();
    drawScore();


    ball.x += ball.dx;
    ball.y += ball.dy;

    if(ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0 ){
        ball.dx *= -1;
    }
    if(ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0 ){
        ball.dy *= -1;
    }

    //Reset score

    /*localStorage is a property that allows JavaScript sites 
    and apps to save key/value pairs in a web browser 
    with no expiration date. This means the data stored 
    in the browser will persist even after the browser 
    window is closed. */

    if(ball.y + ball.radius > canvas.height){
        if(score > parseInt(localStorage.getItem("highScore"))){
            localStorage.setItem("highScore", score.toString());
            scoreDisplay.innerHTML = `High Score: ${score}`;
        }

        score = 0;
        generateBricks();
        ball.dx = speed;
        ball.dy = -speed + 1;
        //playSound(sound2);
        sound1.pause();
        sound2.currentTime = 0;
        sound2.play();
    }



    //Bounce of paddle
    if(ball.x >= paddle.x &&
        ball.x <= paddle.x + paddle.width &&
        ball.y + ball.radius >= canvas.height - paddle.height){
            ball.dy *= -1;
        }

    requestAnimationFrame(play);
}



//Bricks
 let brickRowCount = 3;
 let brickColumCount = 6;
 let brickWidth = 70;
 let brickHeight = 20;
 let brickPadding = 20;
 let brickOffsetTop = 30;
 let brickOffsetLeft = 35;

 let bricks = [];

 function generateBricks(){
     for(let c = 0; c < brickColumCount; c++){
        bricks[c] = [];
        for( let r = 0; r < brickRowCount; r++){
            bricks[c][r] = { x: 0, y: 0, status: 1};
        }
     }
 }

 function drawBricks(){
     for(let c = 0; c < brickColumCount; c++){
         for(let r = 0; r < brickRowCount; r++){
             if(bricks[c][r].status == 1){
                let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#230c33";
                ctx.fill();
                ctx.closePath;
                }
         }
     }
 }


//Collision Detection

function collisionDetection(){
    for(let c = 0; c < brickColumCount; c++){
        for(let r = 0; r < brickRowCount; r++){
            let b = bricks[c][r];
            if(b.status == 1){
                if(ball.x >= b.x &&
                    ball.x <= b.x + brickWidth &&
                    ball.y >= b.y &&
                    ball.y <= b.y + brickHeight){
                        ball.dy *= -1;
                        b.status = 0;
                        score++
                        
                            //playSound(sound1);
                            sound1.pause();
                            sound1.currentTime = 0;
                            sound1.play();
                           

                        
                    }
            }
        }
    }
}
//sound.play();

//Level up
let gameLevelUp = true;

function levelUp(){
    if(score % 18 == 0 && score != 0){
        if(ball.y > canvas.height / 2){
            
            generateBricks();
            sound3.currentTime = 0;
            sound3.play();

        }
        if(gameLevelUp){
            if(ball.dy > 0){
                ball.dy += 1;
                gameLevelUp = false;
            }else if(ball.dy < 0){
                ball.dy -= 1;
                gameLevelUp = false;
            }
        }
        if(score % 18 != 0){
            gameLevelUp = true;
        }

    }
}





generateBricks();
play();