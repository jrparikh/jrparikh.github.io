var system;

function setup() {
  createCanvas(720, 400);
  system = new ParticleSystem(createVector(width/2, 350));
}

function draw() {
  background(51);

  var dx = map(mouseX,0,width,-0.001,0.001);
  var wind = createVector(dx,0);
  system.applyForce(wind);
  system.addParticle();
  system.run();
}

// A simple Particle class
var Particle = function(position) {
  var vx = randomGaussian() * 0.3;
  var vy = randomGaussian() * 0.3 - 1.0;

  this.acceleration = createVector();
  this.velocity = createVector(vx,vy);
  this.position = position.copy();
  this.lifespan = 255;
};

Particle.prototype.run = function() {
  this.update();
  this.display();
};

// Method to update position
Particle.prototype.update = function(){
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.lifespan -= 2.5;
};

// Method to display
Particle.prototype.display = function() {
  stroke(255,this.lifespan/1.5,0, this.lifespan);
  strokeWeight(2);
  fill(255,this.lifespan/1.5,0, this.lifespan);
  ellipse(this.position.x, this.position.y, 12, 12);
};

// Is the particle still useful?
Particle.prototype.isDead = function(){
  return this.lifespan < 0;
};

Particle.prototype.applyForce = function(f) {
    this.acceleration.add(f);
};
var ParticleSystem = function(position) {
  this.origin = position.copy();
  this.particles = [];
};

ParticleSystem.prototype.addParticle = function() {
  this.particles.push(new Particle(this.origin));
};

ParticleSystem.prototype.applyForce = function(dir) {
    var len = this.particles.length;
    for(var i = 0; i < len; ++i){
        this.particles[i].applyForce(dir);
    }
};

ParticleSystem.prototype.run = function() {
  for (var i = this.particles.length-1; i >= 0; i--) {
    var p = this.particles[i];
    p.run();
    if (p.isDead()) {
      this.particles.splice(i, 1);
    }
  }
};
