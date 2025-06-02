function generateBackgroundPath() {
    points = []
    for (let i=0; i<8; i++) {
        points.push([
            i*100,
            (i == 0) ? random.randint(10, 70) : points[points.length-1][3],
            (i+1)*100,
            (i == 3) ? 50 : (i == 2 || i == 4) ? random.randint(38, 42) : random.randint(10, 70)
        ])
    }
    return points
}

function triangle(context, p1, p2, p3) {
    context.beginPath();
    context.lineWidth = 2
    context.moveTo(p1[0], p1[1]);
    context.lineTo(p2[0], p2[1]);
    context.lineTo(p3[0], p3[1]);
    context.closePath();
    context.fill();
}

function createRocketSprite() {
    return kontra.Sprite({
        x: 0,
        y: 0,
        width: 5,
        height: 40,
        anchor: { x: 0, y: 0 },
        render() {
            this.context.fillStyle = 'white';
            this.context.lineWidth = 2
            this.context.fillRect(0, 0, 5, 40);
            triangle(this.context, [-3, 41], [0, 40-10], [0, 41])
            triangle(this.context, [8, 41], [5, 40-10], [5, 41])
            triangle(this.context, [0, 0], [2.5, -10], [5, 0])
        }
    });
}

const particles = []

function createSmoke(x, y) {
    for (let i = 0; i < 3; i++) {
        particles.push(kontra.Sprite({
            x: x + (Math.random() - 0.5) * 10,
            y: y,
            dx: (Math.random() - 0.5) * 0.5,
            dy: Math.random() * -0.5 - 0.5,
            radius: Math.random() * 2 + 2,
            opacity: 1,
            update() {
                this.x += this.dx
                this.y += this.dy
                this.opacity -= 0.02
                if (this.opacity <= 0) {
                    const index = particles.indexOf(this)
                    if (index > -1) particles.splice(index, 1)
                }
            },
            render() {
                context.globalAlpha = this.opacity
                context.fillStyle = 'gray'
                context.beginPath()
                context.arc(0, 0, this.radius, 0, Math.PI * 2)
                context.fill()
                context.globalAlpha = 1
            }
        }))
    }
}