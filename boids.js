
let boids = [];
let N = 1000;
let distanceFlock = 5;
let maxSpeed = 2;

class Vector {

    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    sum(vector) {
        let x = this.x + vector.x;
        let y = this.y + vector.y;

        return new Vector(x, y);
    }

    sub(vector) {
        let x = this.x - vector.x;
        let y = this.y - vector.y;

        return new Vector(x, y);
    }

    mul(scalar) {
        let x = this.x * scalar;
        let y = this.y * scalar;

        return new Vector(x, y);
    }

    div(scalar) {
        let x = this.x / scalar;
        let y = this.y / scalar;

        return new Vector(x, y);
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}


class Boid {

    constructor() {
        let x = window.innerWidth * Math.random();
        let y = window.innerHeight * Math.random();

        this.position = new Vector(x, y);

        let vx = Math.random() * (Math.random() > 0.5 ? 1 : -1) / 100;
        let vy = Math.random() * (Math.random() > 0.5 ? 1 : -1) / 100;

        this.velocity = new Vector(vx, vy);
    }

    move(v) {
        this.position = this.position.sum(v);
    }

    moveRandom() {
        let dx = Math.random() * (Math.random() > 0.5 ? 1 : -1);
        let dy = Math.random() * (Math.random() > 0.5 ? 1 : -1);
        let rv = new Vector(dx, dy);

        this.move(rv);
    }
}


function createBoids() {
    for (let i = 0; i < N; i++) {
        boids.push(new Boid());
    }
    /*let b = new Boid();
    b.position = new Vector(100, 100);
    b.velocity = new Vector(-1, -1);

    let a = new Boid();
    a.position = new Vector(200, 500);
    a.velocity = new Vector(-1, 1);
    boids.push(b);
    boids.push(a);*/
}


function setup() {
    createBoids();
	createCanvas(window.innerWidth, window.innerHeight);
	stroke(255);     // Set line drawing color to white
    strokeWeight(3)
	background(0);
}


function drawBoids() {
    boids.forEach((b, i) => {
        console.log("Boid " + i + " x:" + b.position.x + " y:" + b.position.y)
        point(b.position.x, b.position.y);
    })
}


function rule1CenterMass(boid) {
    let pc = new Vector();

    boids.forEach(b => {
        if (b != boid) {
            pc = pc.sum(b.position)
        }
    })

    
    pc = pc.div(N - 1);
    pc = pc.sub(boid.position).div(100);

    return pc;
}


function rule2KeepDistance(boid) {
    let c = new Vector();
    boids.forEach(b => {
        if (b == boid) return;
         
        let distance = boid.position.sub(b.position);

        if (distance.magnitude() < distanceFlock) {
            c = c.sub(distance);
        }
    })

    return c;
}


function rule3MatchVelocity(boid) {
    let v = new Vector();

    boids.forEach(b => {
        if (b == boid) return;

        v = v.sum(b.velocity);
    })

    v = v.div(N-1);
    v = v.sub(boid.velocity);
    v = v.div(8);

    return v;
}

function moveBoids() {
    boids.forEach(b => {
        let v1 = rule1CenterMass(b);
        let v2 = rule2KeepDistance(b);
        let v3 = rule3MatchVelocity(b);

        b.velocity = b.velocity.sum(v1).sum(v2).sum(v3);
        b.velocity = limitSpeed(b.velocity);

        boundPosition(b);
        b.position = b.position.sum(b.velocity);
    });
}

function limitSpeed(velocity) {
    let speed = velocity.magnitude();
    
    if (speed < maxSpeed) {
        return velocity;
    }

    return velocity.div(speed).mul(maxSpeed);
}

function boundPosition(boid) {
    let position = boid.position;
    let velocity = boid.velocity;

    let maxXReached = position.x >= window.innerWidth && velocity.x > 0;
    let minXReached = position.x <= 0 && velocity.x < 0;

    if (maxXReached || minXReached) {
        velocity.x = velocity.x * -1;
    }

    let maxYReached = position.y >= window.innerHeight && velocity.y > 0;
    let minYReached = position.y <= 0 && velocity.y < 0;

    if (maxYReached || minYReached) {
        velocity.y = velocity.y * -1;
    }
}

function draw() {
    background(0);
    moveBoids();
    drawBoids();
}