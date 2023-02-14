let spriteSheet;
let chronoSheet;

let walkingAnimation;
let walkingAnimation2;
let chronoAnimation;

let spriteSheetFilenames = ["Green Bugger.png","Blue Bugger.png","Orange Bugger.png","Green Bugger.png","Green Bugger.png",];
let spriteSheets = [];
let animations = [];
let hammer;
let num = 0;

const GameState = {
  Start: "Start",
  Playing: "Playing",
  GameOver: "GameOver"
};

let game = { score: 0, maxScore: 0, maxTime: 30, elapsedTime: 0, totalSprites: 15, state: GameState.Start, targetSprite: 0};

function preload() {
  for(let i=0; i < spriteSheetFilenames.length; i++) {
    spriteSheets[i] = loadImage("assets/" + spriteSheetFilenames[i]);
  }
}

function setup() {
  createCanvas(400, 400);
  imageMode(CENTER);
  angleMode(DEGREES);

  reset();
}

function reset() {
  game.elapsedTime = 0;
  game.score = 0;
  game.totalSprites = random(10,30);
  num = 0;
  animations = [];
  while(num < 20) {
    animations[num] = new WalkingAnimation(random(spriteSheets),16,16,random(50,350),random(50,350),3,random(0.5,1),6,random([0,1]));
    num++;
  }
  hammer = new HammerThing(0,0,50,14);
}

function draw() {
  switch(game.state) {
    case GameState.Playing:
      background(200);
      if(deltaTime % 5 == 0){
        animations[num] = new WalkingAnimation(random(spriteSheets),16,16,random(50,350),random(50,350),3,random(0.5,1),6,random([0,1]));
        num++;
        animations[num] = new WalkingAnimation(random(spriteSheets),16,16,random(50,350),random(50,350),3,random(0.5,1),6,random([0,1]));
        num++;
      }
      for(let i=0; i < animations.length; i++) {
        animations[i].draw();
      }
      hammer.draw();
      fill(0);
      textSize(40);
      text(game.score,20,40);
      let currentTime = game.maxTime - game.elapsedTime;
      text(ceil(currentTime), 300,40);
      game.elapsedTime += deltaTime / 1000;

      if (currentTime < 0)
        game.state = GameState.GameOver;
      break;
    case GameState.GameOver:
      game.maxScore = max(game.score,game.maxScore);

      background(0);
      fill(255);
      textSize(40);
      textAlign(CENTER);
      text("Game Over!",200,200);
      textSize(35);
      text("Score: " + game.score,200,270);
      text("Max Score: " + game.maxScore,200,320);
      break;
    case GameState.Start:
      background(0);
      fill(255);
      textSize(50);
      textAlign(CENTER);
      text("Hammer Bugs",200,200);
      textSize(30);
      text("Press a key to begin",200,300);
      textSize(20);
      text("The hammer follows the mouse.",200,350);
      break;
  }
  
}

function keyPressed() {
  switch(game.state) {
    case GameState.Start:
      game.state = GameState.Playing;
      break;
    case GameState.GameOver:
      reset();
      game.state = GameState.Playing;
      break;
  }
}

function mousePressed() {
  switch(game.state) {
    case GameState.Playing:
      for (let i=0; i < animations.length; i++) {
        let contains = animations[i].contains(hammer.x,hammer.y);
        if (contains) {
          if (animations[i].moving != 0) {
            animations[i].stop();
            if (animations[i].spritesheet === spriteSheets[2]){
              if(frameCount % 4 == 0){
                hammer.x = 400;
                hammer.y = 400;
              }else if(frameCount % 4 == 1){
                hammer.x = 400;
                hammer.y = 0;
              }else if(frameCount % 4 == 2){
                hammer.x = 0;
                hammer.y= 400;
              }else if(frameCount % 4 == 3){
                hammer.x = 0;
                hammer.y = 0;
              } 
              game.score += 3;
            }
            else if(animations[i].spritesheet === spriteSheets[1]){
               
              game.score += 1;
              animations[num] = new WalkingAnimation(spriteSheets[0],16,16,animations[i].dx + random(-40,40), animations[i].dy + random(-25,25),3,random(0.5,1),6,random([0,1]));
              num++;
              animations[num] = new WalkingAnimation(spriteSheets[0],16,16,animations[i].dx + random(-40,40), animations[i].dy + random(-25,25),3,random(0.5,1),6,random([0,1]));
              num++;
              animations[num] = new WalkingAnimation(spriteSheets[0],16,16,animations[i].dx + random(-40,40), animations[i].dy + random(-25,25),3,random(0.5,1),6,random([0,1]));
              num++;
            }
            else{
              game.score += 1;
            }
          }
          
        }
      }
      break;
    // case GameState.GameOver:
    //   reset();
    //   game.state = GameState.Playing;
    //   break;
  }
  
}

class WalkingAnimation {
  constructor(spritesheet, sw, sh, dx, dy, animationLength, speed, framerate, vertical = false, offsetX = 0, offsetY = 0) {
    this.spritesheet = spritesheet;
    this.sw = sw;
    this.sh = sh;
    this.dx = dx;
    this.dy = dy;
    this.u = 0;
    this.v = 0;
    this.animationLength = animationLength;
    this.currentFrame = 0;
    this.moving = 1;
    this.xDirection = 1;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.speed = speed;
    this.framerate = framerate*speed;
    this.vertical = vertical;
  }

  draw() {

    // if (this.moving != 0)
    //   this.u = this.currentFrame % this.animationLength;
    // else
    //   this.u = 0;
    
    this.u = (this.moving != 0) ? this.currentFrame % this.animationLength : this.u;
    push();
    translate(this.dx,this.dy);
    if (this.vertical)
      rotate(90);
    else{
      rotate(180);
    }
    scale(1,this.xDirection);
    

    //rect(-26,-35,50,70);

    image(this.spritesheet,0,0,this.sw,this.sh,this.u*this.sw+this.offsetX,this.v*this.sh+this.offsetY,this.sw,this.sh);
    pop();
    let proportionalFramerate = round(frameRate() / this.framerate);
    if (frameCount % proportionalFramerate == 0) {
      this.currentFrame++;
    }
  
    if (!this.vertical) {
      this.dy += this.moving*this.speed;
      this.move(this.dy,this.sw / 4,height - this.sw / 4);
    }
    else {
      this.dx += this.moving*this.speed;
      this.move(this.dx,this.sw / 4,width - this.sw / 4);
    }

    
  }

  move(position,lowerBounds,upperBounds) {
    if (position > upperBounds) {
      this.moveLeft();
    } else if (position < lowerBounds) {
      this.moveRight();
    }
  }

  moveRight() {
    this.moving = 1;
    this.xDirection = 1;
    this.v = 0;
  }

  moveLeft() {
    this.moving = -1;
    this.xDirection = -1;
    this.v = 0;
  }

  keyPressed(right, left) {
    if (keyCode === right) {
      
      this.currentFrame = 1;
    } else if (keyCode === left) {

      this.currentFrame = 1;
    }
  }

  keyReleased(right,left) {
    if (keyCode === right || keyCode === left) {
      this.moving = 0;
    }
  }

  contains(x,y) {
    //rect(-26,-35,50,70);
    let insideX = x >= this.dx - 26 && x <= this.dx + 25;
    let insideY = y >= this.dy - 35 && y <= this.dy + 35;
    return insideX && insideY;
  }

  stop() {
    this.moving = 0;
    this.u = 0;
    this.v = 1;
  }
}

class HammerThing {
  constructor(x,y,diameter, speed){
    this.x = x;
    this.y = y;
    this.diameter = diameter;
    this.speed = speed;
  }
  draw(){
    fill(150,150,50);
    push();
    //translate();
    circle(this.x,this.y,this.diameter);
    pop();
    this.y = (this.y*this.speed + mouseY)/(this.speed+1);
    this.x = (this.x*this.speed + mouseX)/(this.speed+1);
  
    
}
}