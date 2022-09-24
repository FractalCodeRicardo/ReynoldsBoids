
let boids = [];
let N = 2;
let distanceFlock = 100;

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
        let x = window.innerWidth / 2;
        let y = window.innerHeight / 2;

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
    for (let i = 0; i <= N; i++) {
        boids.push(new Boid());
    }
}


function setup() {
    createBoids();
	createCanvas(window.innerWidth, window.innerHeight);
	stroke(255);     // Set line drawing color to white
    strokeWeight(3)
	background(0);
}


function drawBoids() {
    boids.forEach(b => {
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
        b.position = b.position.sum(b.velocity);
    });
}

function draw() {
    background(0);
    moveBoids();
    drawBoids();
}