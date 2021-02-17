var player;
var orbs = [];
var playerSize = 30;
var orbSize = 20;
var createMode = false;
var createStage = 0;

function startGame() {
    player = new component(playerSize, playerSize, "green", 10, 120);
    gameArea.start();
}

var gameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y) {
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.moveSpeed = 2;
    this.draw = function() {
        ctx = gameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.edgeDetect();
    }
    this.edgeDetect = function() {
        var bottom = gameArea.canvas.height - this.height;
        var right = gameArea.canvas.width - this.width;
        if (this.y > bottom) {
            this.y = bottom;
        }
        if (this.y < 0) {
            this.y = 0;
        }
        if (this.x > right) {
            this.x = right;
        }
        if (this.x < 0) {
            this.x = 0;
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function randomPos(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

function updateGameArea() {
    // Check if player collides with an orb
    for (i = 0; i < orbs.length; i += 1) {
        if (player.crashWith(orbs[i])) {
            console.log('hit an orb', orbs);
            return
        } 
    }
    // Check if orbs are correctly done
    // TODO - just reset?

    // Clear and redraw
    gameArea.clear();
    gameArea.frameNo += 1;
    if (gameArea.frameNo === 1 && !createMode) {
        objects = get_objects()
        npc1 = objects[0]
        npc2 = objects[1]
        orbs = [objects[2], objects[3], objects[4], objects[5]];
    }
    // Move player
    player.newPos();
    // Draw lines between each player
    ctx = gameArea.context;
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(npc1.x+playerSize/2, npc1.y+playerSize/2);
    ctx.lineTo(npc2.x+playerSize/2, npc2.y+playerSize/2);
    ctx.lineTo(player.x+playerSize/2, player.y+playerSize/2);
    ctx.lineTo(npc1.x+playerSize/2, npc1.y+playerSize/2);
    ctx.stroke();
    // Draw each orb
    for (i = 0; i < orbs.length; i += 1) {
        orbs[i].draw();
    }
    // Draw player
    player.draw();

    // Draw NPCs
    npc1.draw();
    npc2.draw();
}

function get_objects() {
    gameCase = gameCases[randomPos(0, gameCases.length-1)]
    npc1 = new component(playerSize, playerSize, "blue", gameCase[0], gameCase[1]);
    npc2 = new component(playerSize, playerSize, "blue", gameCase[2], gameCase[3]);
    orb1 = new component(orbSize, orbSize, "red", gameCase[4], gameCase[5]);
    orb2 = new component(orbSize, orbSize, "red", gameCase[6], gameCase[7]);
    orb3 = new component(orbSize, orbSize, "red", gameCase[8], gameCase[9]);
    orb4 = new component(orbSize, orbSize, "red", gameCase[10], gameCase[11]);
    return [npc1, npc2, orb1, orb2, orb3, orb4]
}

function lerp(x, y, a) {
    return x * (1 - a) + y * a;
}

function everyinterval(n) {
    if ((gameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function processKeyDown(e) {
    if (e.repeat) {
        return
    }
    switch(e.code) {
        case "ArrowDown":
            player.speedY += player.moveSpeed;
            e.preventDefault();
            break;
        case "ArrowUp":
            player.speedY -= player.moveSpeed;
            e.preventDefault();
            break;
        case "ArrowRight":
            player.speedX += player.moveSpeed;
            e.preventDefault();
            break;
        case "ArrowLeft":
            player.speedX -= player.moveSpeed;
            e.preventDefault();
            break;
        case "Space":
            createMode = true;
            createStage = 0;
            orbs = []
            npc1 = new component(playerSize, playerSize, "blue", 0, 0);
            npc2 = new component(playerSize, playerSize, "blue", 0, 0);
            e.preventDefault();
            break;
    }
}

function processKeyUp(e) {
    switch(e.code) {
        case "ArrowDown":
            player.speedY -= player.moveSpeed;
            e.preventDefault();
            break;
        case "ArrowUp":
            player.speedY += player.moveSpeed;
            e.preventDefault();
            break;
        case "ArrowRight":
            player.speedX -= player.moveSpeed;
            e.preventDefault();
            break;
        case "ArrowLeft":
            player.speedX += player.moveSpeed;
            e.preventDefault();
            break;
    }
}

function processClick(e) {
    if (createMode) {
        switch(createStage){
            case 0:
                // npc1
                npc1 = new component(playerSize, playerSize, "blue", e.clientX-playerSize/2, e.clientY-playerSize/2);
                break;
            case 1:
                // npc2
                npc2 = new component(playerSize, playerSize, "blue", e.clientX-playerSize/2, e.clientY-playerSize/2);
                break;
            case 2:
                // orb1
                orbs.push(new component(orbSize, orbSize, "red", e.clientX-playerSize/2, e.clientY-playerSize/2));
                break;
            case 3:
                // orb2
                orbs.push(new component(orbSize, orbSize, "red", e.clientX-playerSize/2, e.clientY-playerSize/2));
                break;
            case 4:
                // orb3
                orbs.push(new component(orbSize, orbSize, "red", e.clientX-playerSize/2, e.clientY-playerSize/2));
                break;
            case 5:
                // orb4
                orbs.push(new component(orbSize, orbSize, "red", e.clientX-playerSize/2, e.clientY-playerSize/2));
                break;
            case 6:
                // reset + print in format for gameCases
                createStage = -1;

                console.log('done')
                console.log(String([npc1.x, npc1.y, npc2.x, npc2.y, orbs[0].x, orbs[0].y, orbs[1].x, orbs[1].y, orbs[2].x, orbs[2].y, orbs[3].x, orbs[3].y]))
                
                orbs = [];
                npc1 = new component(playerSize, playerSize, "blue", 0, 0);
                npc2 = new component(playerSize, playerSize, "blue", 0, 0);
                break;
        }
        createStage += 1;
    }
}

document.addEventListener('keydown', processKeyDown);
document.addEventListener('keyup', processKeyUp);
gameArea.canvas.addEventListener('click', processClick, false);
window.onblur = function() {
    player.speedY = 0;
    player.speedX = 0;
}

// Format: [npc1x, npc1y, npc2x, npc2y, orb1x, orb1y, orb2x, orb2y, orb3x, orb3y, orb4x, orb4y]
gameCases = [
    [219,37,386,78,261,50,348,70,219,162,271,182],
    [60,147,148,54,92,164,124,81,207,168,176,190],
    [185,34,341,34,219,36,293,36,230,101,293,102],
    [332,228,413,175,366,96,400,93,340,198,373,206],
    [56,178,194,232,101,198,165,222,129,115,205,80],
    [368,41,433,138,390,72,413,108,296,192,369,177],
    [20,99,65,10,43,57,91,38,137,124,76,130],
    [170,224,266,227,201,227,234,229,192,154,242,148],
]