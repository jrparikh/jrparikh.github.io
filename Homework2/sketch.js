var t = 45;
var time;
var wait = 1000;
var tick = false;

var seed = [7, 9, 11];
var plant;
var leaf = 0;
var leafTwo = 0;

var randHeight = [];
var randHeightTwo = [];
var randWindowHeight = [];
var randWindowHeightTwo = [];
var randWindowHeightThree = [];
var randWindowHeightFour = [];

var rando = [];
var rand = [15, 0, -15];
var q;
var c;

var camera_x = 0;
var camera_z = 0;

function setup() {
	plant = random(seed);
	leaf = int(plant - 1)/2;
	leafTwo = int(plant - 3)/2;
	console.log(seed);
	console.log(plant);
	q = random(rand);
	console.log(leaf);
  createCanvas(windowWidth, windowHeight, WEBGL);
  for (var h = 0; h < plant; h++){
  	randHeight.push(random(450, 900));
  	randHeightTwo.push(random(450, 900));
  	randWindowHeight.push(random(100, randHeight[h] - 750));
  	randWindowHeightTwo.push(random(100, randHeight[h] - 750));
  	randWindowHeightThree.push(random(100, randHeightTwo[h] - 750));
  	randWindowHeightFour.push(random(100, randHeightTwo[h] - 750));
  	rando.push(random(-50, -100));
  }
/*  for (var i = 0; i < 4; i++){
  	rando.push(random(50, 200));
  }*/
  time = millis();
}

function draw() {
	background(0, 0, 25);
	//camera(mouseX, height/2, (height/2) / tan(PI/6), width/2, height/2, 0, 0, 1, 0);
	/*if(millis() - time >= wait){
    	tick = !tick;//if it is, do something
    	time = millis();//also update the stored time
  	}*/
  	//sun
  	push();
	if(mouseIsPressed){
		c = color(200,200,50);
		fill(c);
		ellipse(-200,-400, 100, 100);
	}
	pop();
    	//Left set of buildings
		for (var z = -leaf; z <= leaf; z++) {
			if(z!= 0){
				push();
				c = color(47, 47, 47);
				fill(c);
				createBox(-150, 0, -150 * z, 55, 70, randHeight[z + leaf], 90);
				pop();

				push();
				//fill(0,255,0);
				if(mouseIsPressed){
					c = color(0,0,0);
				}else{
					c = color(255, 255, 102);
				}	
				fill(c);
				createWindow(10, 10, 0, -104, randWindowHeight[z + leaf] + rando[leaf], -150 * z, 55);
				pop();

				push();
				if(mouseIsPressed){
					c = color(0,0,0);
				}else{
					c = color(255, 255, 102);
				}	
				fill(c);
				createWindow(10, 10, 0, -104, randWindowHeightTwo[z + leaf] + rando[leaf], -125 * z, 55);
				pop();

				push();
				if(mouseIsPressed){
					c = color(0,0,0);
				}else{
					c = color(255, 255, 102);
				}	
				fill(c);
				createWindow(10, 10, 0, -104, randWindowHeightThree[z + leaf] + rando[leaf], -125 * z, 55);
				pop();
			}
		}

		//Right set of buildings
		for (var x = -leafTwo; x <= leafTwo; x++) {
			if(x != 0){
				push();
				c = color(47, 47, 47);
				fill(c);
				createBox(150, 0, -150 * x, 55, 70, randHeightTwo[x + leafTwo], 90);
				pop();

				push();
				if(mouseIsPressed){
					c = color(0,0,0);
				}else{
					c = color(255, 255, 102);
				}	
				fill(c);
				createWindow(10, 10, 0, 104, randWindowHeightTwo[x + leafTwo] + rando[leafTwo], -150 * x - 25, 55);
				pop();

				push();
				if(mouseIsPressed){
					c = color(0,0,0);
				}else{
					c = color(255, 255, 102);
				}	
				fill(c);
				createWindow(10, 10, 0, 104, randWindowHeightThree[x + leafTwo] + rando[leafTwo], -150 * x, 55);
				pop();

				push();
				if(mouseIsPressed){
					c = color(0,0,0);
				}else{
					c = color(255, 255, 102);
				}				
				fill(c);
				createWindow(10, 10, 0, 104, randWindowHeightFour[x + leafTwo] + rando[leafTwo], -150 * x, 55);
				pop();
			}
		}

		//sideways spawning of buildings
		for(var i = -leaf; i <= leaf; i++){
			push();
			c = color(47, 47, 47);
			fill(c);
			createBox(150 * i, 0, -150, 55, 70, randHeight[i + leaf], 70);
			pop();

			push();

			if(mouseIsPressed){
				c = color(0,0,0);
			}else{
				c = color(255, 255, 102);
			}
			fill(c);
			createWindow(10, 10, 0, 150 * i, randWindowHeight[i + leaf] + rando[leaf], -100, 0);
			pop();

			push();
			if(mouseIsPressed){
				c = color(0,0,0);
			}else{
				c = color(255, 255, 102);
			}
			fill(c);
			createWindow(10, 10, 0, 150 * i, randWindowHeightTwo[i + leaf] + rando[leaf], -100, 0);
			pop();

			push();
			if(mouseIsPressed){
				c = color(0,0,0);
			}else{
				c = color(255, 255, 102);
			}
			fill(c);
			createWindow(10, 10, 0, 150 * i, randWindowHeightThree[i + leaf] + rando[leaf], -100, 0);
			pop();

			push();
			if(mouseIsPressed){
				c = color(0,0,0);
			}else{
				c = color(255, 255, 102);
			}
			fill(c);
			createWindow(10, 10, 0, 150 * i, randWindowHeightFour[i + leaf] + rando[leaf], -100, 0);
			pop();
		}

	

    push();	
    if(mouseIsPressed){
			c = color(0,0,50);
	}else{
			c = color(0, 0, 25);
	}	
    fill(c);
    translate(0, 150, 0);
    rotateX(HALF_PI);
  	box(2000, 2000, 0);
  	pop();

  	//road
  	push();	
    c = color(47, 47, 47);
    fill(c);
    translate(0 + camera_x, 149, 250 + camera_z);
    rotateX(HALF_PI);
  	box(100, 550, 0);
  	pop();

  	//road
  	push();	
    c = color(47, 47, 47);
    fill(c);
    translate(0 + camera_x, 149, 250 + camera_z);
    rotateX(HALF_PI);
  	box(100, 550 * ((plant - 1)/ 2), 0);
  	pop();

  	push();	
    if(mouseIsPressed){
			c = color(0,0,50);
	}else{
			c = color(0, 0, 25);
	}
    fill(c);
    translate(0, -200, -3000);
  	box(8000, 4000, 0);
  	pop();
}

function createBox(Tx, Ty, Tz, r, x, y, z){
	translate(Tx + camera_x, Ty, Tz + camera_z);
	rotateY(r);
	box(x, y, z);
}

function createWindow(Wx, Wy, Wz, WtranX, WtranY, WtranZ, rotation){
	noStroke();
	translate(q+WtranX + camera_x, WtranY, WtranZ + camera_z);
	rotateY(rotation);
	box(Wx, Wy, Wz);
}


//move with transate function
function keyPressed()
{
    if (keyCode == DOWN_ARROW)
    {
        //if (houseY - yTileCount > camera_y)
          camera_z -= 10;
    }
    if (keyCode == UP_ARROW)
    {
        //if (camera_y > 0)
          camera_z += 10;
    }
    if (keyCode == RIGHT_ARROW)
    {
        //if (houseX - xTileCount > camera_x)
          camera_x -= 10;
    }
    if (keyCode == LEFT_ARROW)
    {
        //if (camera_x > 0)
          camera_x += 10;
    }
}