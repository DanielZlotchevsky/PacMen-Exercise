var pos = 0;
    
const pacArray1 = ['PacMan1.png', 'PacMan2.png'];
const pacArray2 = ['PacMan3.png', 'PacMan4.png'];
var direction = 0;
const pacMen = []; // This array holds all the pacmen


//Gives a random value for valocity that is either negative or positive within the scale
function setToRandomV(scale) {
    return {
        x: (Math.random() - .5) * scale * 2,
        y: (Math.random() - .5) * scale * 2
    }
}

//Gives a random X and Y value for the initial position
function setToRandomP(scale) {
    return {
        x: Math.random() * scale,
        y: Math.random() * scale
    }
}


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

/* Calculates the angle of velocity from the position and current velocity, 
returns an angle to rotate the image to match its movement vector */
function pacAngle(item) {
    let s1 = [item.position.x, item.position.y];
    let s2 = [item.position.x + item.velocity.x, item.position.y + item.velocity.y];
    var degrees = Math.atan((s2[1] - s1[1]) / (s2[0] - s1[0])) * 180 / Math.PI;
    return (degrees + 'deg') 
}

// Factory to make a PacMan at a random position with random velocity
function makePac() {
    let velocity = setToRandomV(20);
    let position = setToRandomP(window.innerHeight - 100);
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


/* Removes the 'Start Game' button to stop the infinite scaling 
velocity with multiple clicks, then runs the update() function. */
function removeButtonAndStart(){
    if (pacMen.length == 0) { window.alert('Please add a PacMan first!')         
    } else {
    var startButton = document.getElementById('startButton');
    startButton.parentNode.removeChild(startButton);
    update();
    }
}

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
    if (item.position.x + item.velocity.x + item.newimg.width > window.innerWidth ||
    item.position.x + item.velocity.x < 0) {
        item.velocity.x = -item.velocity.x;
        item.newimg.style.transform = `rotate(0deg)`;
        item.newimg.style.transform = `rotate(${pacAngle(item)})`;
    }
    if(item.position.y + item.velocity.y + item.newimg.height > window.innerHeight ||
    item.position.y + item.velocity.y < 0) {
        item.velocity.y = -item.velocity.y;
        item.newimg.style.transform = `rotate(0deg)`;
        item.newimg.style.transform = `rotate(${pacAngle(item)})`;
    }
}

//Create a PacMan and add it to the pacMen array
function makeOne() {
    pacMen.push(makePac()); // add a new PacMan
}