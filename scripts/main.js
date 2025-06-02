function renderBackground(path) {
    context.strokeStyle = '#ffffff';
    context.lineWidth = 2;
    context.beginPath();

    for (points of path) {
        context.moveTo(points[0], canvas.height - points[1]);
        context.lineTo(points[2], canvas.height - points[3]);
        context.stroke();
    }
}

function renderPlatform(path) {
    context.fillStyle = 'white';
    context.fillRect(
        (canvas.width/2)-(platformSize/2), 
        canvas.height - platformHeight, 
        platformSize, 
        platformSize/20
    );
}

async function pause(ms) {
    loop.stop()
    await new Promise(resolve => setTimeout(resolve, ms));
    loop.start()
}

function launchRocket() {
    mf = parseInt(dquery("#paramRocketWeight").value)
    ve = parseInt(dquery("#paramRocketExhaustSpeed").value)
    dv = parseInt(dquery("#paramRocketVelocity").value)

    mass = mf * Math.E ** (dv/ve)
    fuelmass = mass-mf
    launch = true
}

function calculateVariables() {
    const mf = parseInt(dquery("#paramRocketWeight").value)
    const ve = parseInt(dquery("#paramRocketExhaustSpeed").value)
    const dv = parseInt(dquery("#paramRocketVelocity").value)
    const m0 = mf * Math.E ** (dv/ve)
    const fuel = m0-mf
    dquery("#statRocketWeight").innerHTML = (Math.round(m0 * 10) / 10).toLocaleString()
    dquery("#statRocketFuelWeight").innerHTML = (Math.round(fuel * 10) / 10).toLocaleString()
}

// display from actual variables used to render
function updateVariables() {
    dquery("#statRocketWeight").innerHTML = (Math.round(mass * 10) / 10).toLocaleString()
    dquery("#statRocketFuelWeight").innerHTML = (Math.round(fuelmass * 10) / 10).toLocaleString()
    dquery("#statRocketVelocity").innerHTML = (Math.round((velocity) * 1000) / 1000) * 100
}

function initListeners() {
    calculateVariables()
    const paramRocketWeight = dquery("#paramRocketWeight")
    const paramRocketExhaustSpeed = dquery("#paramRocketExhaustSpeed")
    paramRocketWeight.oninput = function() {calculateVariables()}
    paramRocketExhaustSpeed.oninput = function() {calculateVariables()}
}

var context, canvas
var platformHeight
var loop

// rocket parameters
var launch = false
var velocity = 0
var mass = 0
var fuelmass = 0
var ve = 0
var mf = 0
const g = 9.81
const dt = 1/60 // how fast it updates
const desiredAcceleration = 10

const platformSize = 200
const rocket = createRocketSprite()
window.onload = function() {
    initListeners()
    canvas = kontra.init().canvas;
    context = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 500;
    const backgroundPath = generateBackgroundPath()

    platformHeight = Math.max(backgroundPath[3][1], backgroundPath[4][1])+1
    rocket.x = canvas.width/2
    rocket.y = canvas.height-platformHeight - rocket.height - 2

    loop = kontra.GameLoop({
        render() {
            if (launch && fuelmass > 0) {
                const thrust = mass * (desiredAcceleration + g)
                const fuelBurnRate = thrust / ve
                const acceleration = (thrust / mass) - g

                velocity += acceleration * dt
                velocity = Math.max(velocity, 0)

                rocket.y -= velocity * dt * 10 // pixels per meter multiplier

                fuelmass = Math.max(fuelmass - fuelBurnRate * dt, 0)
                mass = mf + fuelmass
                updateVariables()
                createSmoke(rocket.x + rocket.width / 2, rocket.y + rocket.height + 10)
            }
            context.clearRect(0, 0, canvas.width, canvas.height);
            renderBackground(backgroundPath)
            renderPlatform(backgroundPath)
            rocket.render()
            particles.forEach(p => {
                p.update()
                p.render()
            })
        }
    })

    loop.start()
}