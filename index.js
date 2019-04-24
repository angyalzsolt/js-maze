// Set up the canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Get the image
const img = new Image();
img.src = './mazes/img11.png';

// Contatiner for the application
const app = {};

// Set up the player
app.player = {
	x: 0,
	y: 0,
	width: 10,
	height: 10,
	color: '#324f91',
	draw: function(){
		ctx.drawImage(img, 0, 0);
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	},
	clear: function(){
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
	}
};


// Define the starting position for the player
// Need to find the white pixels(entries) on the borders(top)
app.findWayIn = ()=>{
	const imageData = ctx.getImageData(0,0,canvas.width,10);
	const data = imageData.data;
	for(let i=0;i<data.length;i+=4){
		if(data[i] === 255 && data[i+1] === 255 && data[i+2] === 255){
			let x = (i / 4) % canvas.width;
			let y = Math.floor((i / 4) / canvas.width);
			let cord ={'x': x, 'y': y};
			return cord;
		}
	}
}

// Define the end of the game
// Find a white pixel on the bottom border
app.findWayOut = ()=>{
	const imageData = ctx.getImageData(0,canvas.height-1,canvas.width,1);
	const data = imageData.data;
	for(let i=0;i<data.length;i+=4){
		if(data[i] === 255 && data[i+1] === 255 && data[i+2] === 255){
			let x = (i / 4) % canvas.width;
			let y = canvas.height-20;
			let cord ={'x': x, 'y': y, 'd': 0};
			return cord;
		}
	}
}

// Add strating coord to the player (totally useless fuction)
app.playerStartPos = ()=>{
	app.player.x = app.findWayIn().x+5;
	app.player.y = app.findWayIn().y+7;
};

// Check if the player finished the game, if did, reset to basic
app.playerEndPos = (endX,endY,currX,currY)=>{
	if(Math.abs(endX-currX) < 15 && Math.abs(endY-currY) < 15){
		app.resetGame();
		app.sendMsg('Congratulations, you made it!');
	}
};

// Boolean to check the player movement is allowed
let allowed = true;
// Save the previously pressed button to handle the controls
let prevKey;
// Check the walls
app.checkPath = (direction)=>{
	const pixel = ctx.getImageData(app.player.x-3, app.player.y-3, app.player.width+5, app.player.height+5);
	const data = pixel.data;
	if(data.some(x => x < 40)){
		console.log('You can not go to: '+direction);
		switch(direction){
			case 'right':
				app.player.clear();
				app.player.x -= step;
				app.player.draw();
				allowed = false;
				break;
			case 'left':
				app.player.clear();
				app.player.x += step;
				app.player.draw();
				allowed = false;
				break;
			case 'down':
				app.player.clear();
				app.player.y -= step;
				app.player.draw();
				allowed = false;
				break;
			case 'up':
				app.player.clear();
				app.player.y += step;
				app.player.draw();
				allowed = false;
				break;		
		}
	} else {
		allowed = true;
	}
};

// Define the movements
app.moveRight = ()=>{
	app.checkPath('right');
	if(allowed && prevKey === 100){
		setTimeout(function x(){
			app.player.clear();
			app.player.x += step;
			app.player.draw();	
			app.moveRight();
			app.playerEndPos(endX,endY,app.player.x,app.player.y);
	},20)
	}
	
};

app.moveLeft = ()=>{
	app.checkPath('left');
	if(allowed && prevKey === 97){
		setTimeout(function x(){
			app.player.clear();	
			app.player.x -= step;
			app.player.draw();
			app.moveLeft();
			app.playerEndPos(endX,endY,app.player.x,app.player.y);
	},20)
	}
};

app.moveDown = ()=>{
	app.checkPath('down');
	if(allowed && prevKey === 115){
		setTimeout(function x(){
			app.player.clear();
			app.player.y += step;
			app.player.draw();
			app.moveDown();
			app.playerEndPos(endX,endY,app.player.x,app.player.y);
	},20)
	}
};

app.moveUp = ()=>{
	app.checkPath('up');
	if(allowed && prevKey === 119){
		setTimeout(function x(){
			app.player.clear();
			app.player.y -= step;
			app.player.draw();
			app.moveUp();
			app.playerEndPos(endX,endY,app.player.x,app.player.y);
	},20)
	}
};

// Array for the border coordinates
let borderEl = [];
// Array for the road coordinates
let roadEl = [];
// Get the data from the image
app.getMaze = ()=>{
	borderEl = [];
	roadEl = [];
	let vY = 0;
	while(vY<=canvas.height){
		for(let i=0;i<canvas.width;i+=10){
			let d = ctx.getImageData(i,vY,10,10);
			let data = d.data;
			if(data.some(x => x < 40)){
				borderEl.push({'x': i, 'y':vY});
			} else {
				roadEl.push({'x':i,'y':vY,'d': 0});
			}
		};
		vY+=10;
	}
	console.log('border',borderEl);
	console.log('road', roadEl);
};

// Visualize the solution
function autoMove(solArray){
	for(let i=0;i<solArray.length;i++){
		setTimeout(function timerAuto(){
			app.player.x = solArray[i].x;
			app.player.y = solArray[i].y;
			app.player.draw();
		},i*50)
	}
};

// Send messages
app.sendMsg = (msg)=>{
	const msgEl = document.getElementById('messages');
	msgEl.innerHTML = msg;
}



// Start the game (define the controls)
// Define the step size
const step = 3;
app.startGame = ()=>{
	tsec = 0;
	sec = 0;
	min = 0;
	// // Set up the maze
	ctx.drawImage(img,0,0);
	img.style.display = 'none';
	// Set the start pos
	app.playerStartPos();
	// Set the end pos
	endX = app.findWayOut().x;
	endY = app.findWayOut().y;
	// Show the player
	app.player.draw();
	// Start the timer
	if(gameStyle === 'Regular'){
		timerStart();
	} else {
		counterX(10);
	}
	
	app.sendMsg('Good luck!');
	window.addEventListener('keypress',handler = (e)=>{
		if(e.charCode === 100){
			prevKey = 100;
			app.moveRight();
		} else if(e.charCode === 97){
			prevKey = 97;
			app.moveLeft();
		} else if(e.charCode === 115){
			prevKey = 115;
			app.moveDown();
		} else if(e.charCode === 119){
			prevKey = 119;
			app.moveUp();
		}
	})
};


// Reset the game
app.resetGame = ()=>{
	borderdEl = [];
	roadEl = [];
	clearInterval(timer);

	tsec = '00';
	sec = '00';
	min = 0;
	// target.innerHTML = min+':'+sec+':'+tsec;
	if(isStarted){
		window.removeEventListener('keypress', handler);
		isStarted = false;	
	};
	app.player.clear();
	app.sendMsg('Set up your game above');
}


// Array for the all possible routes
let way = [];
// Array for the actual solution
let rightPath = [];
app.solveMaze = ()=>{
	// Set the player position to the first element of the road array
	app.player.x = roadEl[0].x;
	app.player.y = roadEl[0].y;
	// Initialize the the list that contains all possible routes and distances, with the last element of the road array
	way.push(roadEl[roadEl.length-1]);
	// variable for the while loop
	let i=0;
	while(i<way.length){
		// if the array contains the the starting position, stop, the job is done
		if(way.findIndex(function(hey){ return hey.x === app.player.x && hey.y === app.player.y}) > -1){
			// alert('fuck you, all of you');
			break;
		}

		// Define the adjecent cells (4 neighbours);
		let top = {'x':way[i].x, 'y':way[i].y-10, 'd': way[i].d+1};
		let right = {'x':way[i].x+10, 'y':way[i].y, 'd': way[i].d+1};
		let bottom = {'x':way[i].x, 'y':way[i].y+10, 'd': way[i].d+1};
		let left = {'x':way[i].x-10, 'y':way[i].y, 'd': way[i].d+1};
		// Array for the aboves
		let adjCells = [top,right,bottom,left];
		
		// Container for the adj cells that satisfy the requirements
		let cellsToRemove = [];
		// Check the adjCells
		for(let u=0;u<adjCells.length;u++){
			// If there is an element in the main list with the same coordinate and a less than or equal counter, remove it 
			let reqOne = way.findIndex(function(g){ return g.x === adjCells[u].x && g.y === adjCells[u].y && g.d <= adjCells[u].d });
			if(reqOne > -1){
				let newCell = adjCells.findIndex(function(p){ return p.x === adjCells[u].x && p.y === adjCells[u].y});
				cellsToRemove.push(newCell);
			// If the cell cannot be found in the roadEl array, remove it	
			} else if(roadEl.findIndex(function(f){ return f.x === adjCells[u].x && f.y === adjCells[u].y}) === -1){
				cellsToRemove.push(u);
			}
		};
		// array for that represents the indecies of the adjCells array
		let range = [0,1,2,3];
		// remove the index from the range that is in in the cellsToRemove array
		while(cellsToRemove.length) {
    		range.splice(cellsToRemove.pop(), 1);
		}

		// Add the cells to the main array(those indexes that stayed in the range array)
		for(let k=0;k<range.length;k++){
			way.push(adjCells[range[k]])
		};

		// Incermenet the variable
		i++;
	}

	console.log('way',way)
	// Select from the main array the correct path, choose by ascending distances from the adjecent cells, add it to the rightPath array
	for(let z=way[way.length-1].d;z>0;z--){
		let preCell = rightPath.length > 0 ? rightPath[rightPath.length-1] : way[way.length-1];
		let solCell = way.findIndex((cell)=>{
			return cell.d === z && Math.abs(cell.x-preCell.x)< 11 && Math.abs(cell.y-preCell.y)< 11;
		});
		rightPath.push(way[solCell]);
	};
	console.log(rightPath);
	// rightPath.forEach((cell)=>{
	// 	ctx.fillStyle = 'yellow';
	// 	ctx.fillRect(cell.x,cell.y,9,9)
	// })
	if(rightPath){
		autoMove(rightPath);
	};
};





// Boolean to check if the eventListener is already added
let isStarted = false;
// Initialze the game
document.getElementById('startBtn').addEventListener('click', (e)=>{
	if(document.getElementById('mazeName').textContent.length > 0 && gameStyle.length > 0){
		document.getElementById('error-msg').innerHTML = '';
		document.getElementById('playeg').scrollIntoView();
		ctx.drawImage(img,0,0);
		img.style.display = 'none';
		// Analyze the maze
		app.getMaze();
		// Set the start pos
		app.playerStartPos();
		app.player.draw();
		counterStart(5);
		app.sendMsg('Prepare yourself');
		setTimeout(function(){
			// clearInterval(counter);
			app.startGame();
			isStarted = true;
			endX = app.findWayOut().x+7;
			endY = app.findWayOut().y+10;
			// ctx.fillRect(355,684,15,15)
		},5000)
	} else {
		document.getElementById('error-msg').innerHTML = 'Pleas select a maze down here, you dumb ass...';
	}
	
	
});

// Reset button
document.getElementById('reset-btn').addEventListener('click',(e)=>{
	app.resetGame();
	target.innerHTML = min+':'+sec+':'+tsec;
});

// Solution button
document.getElementById('solution').addEventListener('click', (e)=>{
	clearInterval(timer);
	tsec = '00';
	sec = '00';
	min = 0;
	way = [];
	rightPath = [];
	// target.innerHTML = min+':'+sec+':'+tsec;
	if(isStarted){
		window.removeEventListener('keypress', handler);
		isStarted = false;	
	};
	app.player.clear();
	app.sendMsg('Watch this...');
	app.solveMaze();
})


// Add the selected maze
const blocks = document.getElementsByClassName('maze-block');
for(let t=0;t<blocks.length;t++){
	document.getElementById(blocks[t].id).addEventListener('click', (e)=>{
		for(let block of blocks){
			block.classList.remove('selected');
		};
		blocks[t].classList.add('selected');
		document.getElementById('mazeName').innerHTML = blocks[t].children[1].textContent;
		img.src = './mazes/'+blocks[t].id;
	});
};


let gameStyle = '';
const tests = document.getElementsByClassName('timer-select');
for(let f=0;f<tests.length;f++){
	tests[f].addEventListener('click', (e)=>{
		for(let z of tests){
			z.classList.remove('active');
		};
		tests[f].classList.add('active');
		gameStyle = e.target.textContent;
	})
}




