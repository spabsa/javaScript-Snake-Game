//declare global variables
const canvas = document.querySelector('#canvas');
const score = document.querySelector('.score');
const gameOver = document.querySelector('.game-over');

//set canvas context
const ctx = canvas.getContext('2d');

//put canvas dimensions into variables
const cvsW = canvas.width;
const cvsH = canvas.height;

//load audio files
let eat = new Audio();
let dead = new Audio();
eat.src = 'audio/eat.mp3';
dead.src = 'audio/dead.mp3';

//create snake unit
const unit = 16;

//create points variable 
let points = 0;

//create snake and set starting position
let snake = [{
	x : cvsW/2,
	y : cvsH/2
}]

//create food object and set its position somewhere on board
let food = {
	//Math.floor(Math.random()*cvsW + 1)---number from 1 to 784
	//Math.floor(Math.random()*cvsW/unit + 1)---number from 1 to 79
	//Math.floor(Math.random()*cvsW/unit + 1)*unit---number from 1 to 784(but it's a multiple of unit)
	//Math.floor(Math.random()*(cvsW/unit - 1)+1)*unit---same as above but -1 keeps food inside canvas
	x : Math.floor(Math.random()*(cvsW/unit - 1)+1)*unit-unit/2,
	y : Math.floor(Math.random()*(cvsH/unit - 1)+1)*unit-unit/2
}

//create a variable to store the direction of the snake
let direction;

//create boolean to check if snake head has moved one unit before changing direction
let canTurn = true;

//add event to read users input then change direction
document.addEventListener('keydown', (e) => {
	if(e.keyCode == 37 && direction != 'right' && canTurn) {
		canTurn = false;
		direction = 'left';
	}
	else if (e.keyCode == 38 && direction != 'down' && canTurn) {
		canTurn = false;
		direction = 'up';
	}
	else if (e.keyCode == 39 && direction != 'left' && canTurn) {
		canTurn = false;
		direction = 'right';
	}
	else if (e.keyCode == 40 && direction != 'up' && canTurn) {
		canTurn = false;
		direction = 'down';
	}
})

function draw() {
	//clear canvas and redraw snake 
	ctx.clearRect(0, 0, cvsW, cvsH);
	//loop through every snake unit and draw it to the canvas
	for(let i = 0; i < snake.length; i++) {
		ctx.fillStyle = 'limegreen';
		ctx.fillRect(snake[i].x-unit/2, snake[i].y-unit/2, unit, unit);
	}
	//wait the 65ms then make canturn equal true
	canTurn = true;
	
	//draw food
	ctx.fillStyle = 'red';
	ctx.fillRect(food.x-unit/2, food.y-unit/2, unit, unit);

	//grab heads position
	let headX = snake[0].x;
	let headY = snake[0].y;

	//move snakes head position in chosen direction
	if(direction == 'left') headX -= unit;
	else if(direction == 'right') headX += unit;
	else if(direction == 'up') headY -= unit;
	else if(direction == 'down') headY += unit;

	//create new snake unit and store the newly positioned head
	let newHead = {x : headX, y :headY}

	//check to see if snake has hit a wall or itself
	if(headX < 0 || headX > cvsW || headY < 0 || headY > cvsH || collision(headX, headY)) {
		dead.play();
		//stop the interval
		clearInterval(runGame);
		canvas.style.animationName = 'animate';
		setTimeout(function() {gameOver.style.opacity = '1';}, 150);
	}

	//check to see if snakes eaten food
	if(headX === food.x && headY === food.y) {
		eat.play();
		//increase score
		points++;
		score.innerText = points;
		//get new food unit
		getFood();
		//create 3 new units
		for(let i = 3; i > 0; i--) {
			//add those units --without this code snake will not grow 
			snake.unshift(newHead);
		}
	} else {
		//remove tail --without this code snake will keep growing
		snake.pop();
	}
	//add new head position --without this code snake will not move
	snake.unshift(newHead);
}

//put the ddraw function in an interval to repeat every 65ms
//store that interval in a variable to be called upon later
let runGame = setInterval(draw, 65);

//function to check if snake has hit itself
function collision(x, y) {
	for(let i = 1; i < snake.length; i++) {
		//loop through every snake unit except the head to see if the head shares the same position
		if(x == snake[i].x && y == snake[i].y) return true;
	}
	return false;
}

function getFood() {
	//generate random food position
	food = {
		x : Math.floor(Math.random()*(cvsW/unit - 1)+1)*unit-unit/2,
		y : Math.floor(Math.random()*(cvsH/unit - 1)+1)*unit-unit/2
	}
	//loop through snake to see if food generates inside snake
	for(let i = 0; i < snake.length; i++) {
		//if so call the function again
		if(food.x == snake[i].x && food.y == snake[i].y) return getFood();
	} 
	//else return new random point
	return food;
}

