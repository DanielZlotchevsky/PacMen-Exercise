var pos = 0;
var direction = 0;

const pacArray1 = ['PacMan1.png', 'PacMan2.png'];
const pacArray2 = ['PacMan3.png', 'PacMan4.png'];
const fruitArray = ['Apple.png', 'Orange.png', 'Cherry.png', 'StrawBerry.png']

const pacMen = []; // This array holds all the pacmen
const fruit = [];

let score = 0;
let timer = 0;

let container = document.querySelector('.container');

var clientWidth = document.getElementById('container').clientWidth;
var clientHeight = document.getElementById('container').clientHeight;
let winWidth = window.innerWidth;
let winHeight = window.innerHeight;

let marginLeft = (winWidth - clientWidth) / 2;
let marginRight = winWidth - marginLeft;
let marginTop = (winHeight - clientHeight) / 2;
let marginBottom = winHeight - marginTop;

let scoreLabel = document.getElementById('Score');
scoreLabel.innerText = `Score: ${score}`;

/*-----------------------------------------------------Random Number Generation----------------------------------------------------------------*/
//Gives a random value for valocity that is either negative or positive within the scale
function setToRandomV(scale) {
    return {
        x: (Math.random() - .5) * scale * 2,
        y: (Math.random() - .5) * scale * 2
    }
}


// Creates a random X & Y postition within the container
function setToRandomPos(minX, maxX, minY, maxY) {
    let maxx = maxX - 100;
    let maxy = maxY - 100;
    return {
        x: Math.floor(Math.random() * (maxx - minX + 1) + minX),
        y: Math.floor(Math.random() * (maxy - minY + 1) + minY)
    }
}

/*-----------------------------------------------------Image PNG control / Animation----------------------------------------------------------------*/

//Cycles through the image arrays to animate pacmans mouth movements
function pacCycle(array, item) {
    
    if (item.cycleTimer % 2 == 0) {
        item.cycleTimer += 1;
        return array[0];
    }
    if (item.cycleTimer % 2 != 0) {
        item.cycleTimer += 1;
        return array[1];
    }
}

function fruitCycle(array, item) {
    if (item.fruitClock == 0) {
        item.fruitClock += 1;
        return array[0];
        
    }
    if (item.fruitClock == 1) {
        item.fruitClock += 1;
        return array[1];
    }
    if (item.fruitClock == 2) {
        item.fruitClock += 1;
        return array[2];
    }
    if (item.fruitClock == 3) {
        item.fruitClock = 0;
        return array[3];
    }
}

/* Calculates the angle of velocity from the position and current velocity, 
returns an angle to rotate the image to match its movement vector */
function pacAngle(item) {
    let s1 = [item.position.x, item.position.y];
    let s2 = [item.position.x + item.velocity.x, item.position.y + item.velocity.y];
    var degrees = Math.atan((s2[1] - s1[1]) / (s2[0] - s1[0])) * 180 / Math.PI;
    return (degrees + 'deg') 
}



/*-----------------------------------------------------PacMan Generation / Creation----------------------------------------------------------------*/

// Factory to make a PacMan at a random position with random velocity
function makePac() {
    let velocity = setToRandomV(20);
    let position = setToRandomPos(marginLeft, marginRight, marginTop, marginBottom);
    var cycleTimer = 0; //used to determin pacCycle function
    // Add image to div id = game
    let game = document.getElementById('game');
    let newimg = document.createElement('img');
    newimg.style.position = 'absolute';
    newimg.style.transform = 'rotate(0deg)';
    newimg.src = 'PacMan1.png';
    newimg.width = 100;
    newimg.style.left = position.x;
    newimg.style.top = position.y;
    game.appendChild(newimg);
    
    
    // return details in an object
    return {
        position,
        velocity,
        newimg,
        cycleTimer
    }
}

//Create a PacMan and add it to the pacMen array
function makeOne() {
    pacMen.push(makePac()); // add a new PacMan
}

/*-----------------------------------------------------PacMan Movement / Collision control----------------------------------------------------------------*/


//loop over pacmen array and move each one and move image in DOM
function update() {
    pacMen.forEach((item) => {
        item.newimg.style.transform = `rotate(${pacAngle(item)})`;
        checkCollisions(item)
        item.position.x += item.velocity.x;
        item.position.y += item.velocity.y;
        if (Math.sign(item.velocity.x) == 1) var monch = pacArray1;            
        if (Math.sign(item.velocity.x) == -1) var monch = pacArray2;        
        item.newimg.src = pacCycle(monch, item);    

        item.newimg.style.left = item.position.x;
        item.newimg.style.top = item.position.y;
    })
    
    setTimeout(update, 100);
    
}


/*changes direction of movement upon hitting a wall, as well as then 
matching image and image rotation to fit the new velocity vector */
function checkCollisions(item) {
    if (item.position.x + item.velocity.x + item.newimg.width > marginRight ||
    item.position.x + item.velocity.x < marginLeft) {
        item.velocity.x = -item.velocity.x;
        item.newimg.style.transform = `rotate(0deg)`;
        item.newimg.style.transform = `rotate(${pacAngle(item)})`;
    }
    if(item.position.y + item.velocity.y + item.newimg.height > marginBottom ||
    item.position.y + item.velocity.y < marginTop) {
        item.velocity.y = -item.velocity.y;
        item.newimg.style.transform = `rotate(0deg)`;
        item.newimg.style.transform = `rotate(${pacAngle(item)})`;
    }
    if (fruit[0].newFruit.style.left < item.position.x + item.velocity.x + item.newimg.width < (fruit[0].newFruit.style.left + 50) ||
        fruit[0].newFruit.style.top < item.position.y + item.velocity.y + item.newimg.height < (fruit[0].newFruit.style.top + 50)) {
        console.log(test)
        }
}


/*------------------------------------------------------------HTML DOM control------------------------------------------------------------------------*/


/* Removes the 'Start Game' button to stop the infinite scaling 
velocity with multiple clicks, then runs the update() function. */
function removeButtonAndStart(){
    var startButton = document.getElementById('startButton');
    startButton.parentNode.removeChild(startButton);
    pacmanMakeTimer();
    scoreKeep();
    makeOneFruit();
    updateFruit();
    updateFruitImg();
    update();
}


/*------------------------------------------------------------Fruits------------------------------------------------------------------------*/

function makeOneFruit() {
    fruit.push(makeFruit()); // add a new Fruit
}

function makeFruit () {
    let position = setToRandomPos(marginLeft, marginRight, marginTop, marginBottom);
    let game = document.getElementById('game');
    let newFruit = document.createElement('img');
    newFruit.style.position = 'absolute';
    newFruit.src = 'Apple.png';
    newFruit.width = 50;
    var fruitClock = 0;
    newFruit.style.left = '900px';
    newFruit.style.top = '250px';
    game.appendChild(newFruit);


    return {
        newFruit,
        fruitClock
    }
}

function updateFruitImg() {
    fruit.forEach((item) => {      
        item.newFruit.src = fruitCycle(fruitArray, item);    
    })
    
    setTimeout(updateFruitImg, 500);
}

function updateFruit() {
    fruit.forEach((item) => {
        checkCollisionsFruit(item) //must change           
    })
    
    setTimeout(updateFruit, 100);
}

function checkCollisionsFruit(item) {
    newFunction();

        function newFunction() {
            pacMen.forEach((pac) => {
                if (Number(item.newFruit.style.left) < Number(pac.position.x + pac.velocity.x + pac.newimg.width) < Number(item.newFruit.style.left) + 100 ||
                    Number(item.newFruit.style.top) < Number(pac.position.y + pac.velocity.y + pac.newimg.height) < Number(item.newFruit.style.top) + 100) {
                    console.log(test)
                        clearTimeout(update);
                    clearTimeout(scoreKeep);
                    window.alert(`CONGRATS!! Your score is: ${score}`);
                }
            });
        }
}

function scoreKeep() {
    let multiplier = 1 + (0.1 * pacMen.length);
    score = (score + timer * multiplier);
    timer += 1;
    setTimeout(scoreKeep, 1000)
    return score;
}

function pacmanMakeTimer() {
    if (pacMen.length < 30) {
    makeOne()
    setTimeout(pacmanMakeTimer, 2000)
    } else {return}
}

document.onkeydown = checkKey;

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode === 38) {
        console.log('up');
        // up arrow
        fruit.forEach((item) => {
            item.newFruit.style.top = (Number(item.newFruit.style.top) - 10) + 'px';
        });
    }
    else if (e.keyCode === 40) {
        console.log('down');
        // down arrow
        fruit.forEach((item) => {
            item.newFruit.style.top = (Number(item.newFruit.style.top) + 10) + 'px';
        });
    }
    else if (e.keyCode === 37) {
        console.log('left');
       // left arrow
       fruit.forEach((item) => {
        item.newFruit.style.left = (Number(item.newFruit.style.left) - 10) + 'px';
    });
    }
    else if (e.keyCode === 39) {
        console.log('right');
       // right arrow
       fruit.forEach((item) => {
        item.newFruit.style.left = (Number(item.newFruit.style.left) + 10) + 'px';
    });
    }

}

/*
function mouseTrack(){
    document.body.addEventListener("mousemove", (event) => {

        // ClientX and ClientY return the position of clients cursor from top left of the screen
        var x = (event.clientX - 25) + 'px';
        var y = (event.clientY - 25) + 'px';
        

        while ( marginLeft < x < marginRight && marginTop < y < marginBottom ) {
            fruit.forEach((item) => {
                item.newFruit.style.left = x;
                item.newFruit.style.top = y;
            });
        };
    });
};
*/