/*
Aaron Bush 
https://github.com/AaronBush07
2020
*/


/*
Global variables. 
*/
let canvasX = 500;
let canvasY = 800;
let mines = 100;
let sqX = 20;
let sqY = 32;
let sqSize = 25; //Square size
let cnv;
let mineBoxArray = new Array(sqX); 
let miningArray = [];
let debug = false;
let fr = 10; //Framerate
let flagSrc = "../img/flag-svgrepo-com.svg";
let mineSrc = "../img/rg1024_sea_mine.svg";
let shipSrc = "../img/noaa-MmblG0TlcS0-unsplash.jpg"; //Photo by NOAA on Unsplash
let shipX = 640;
let shipY = 425;
let mineImg;
let shipImg;
let flagImg;
let gameOver;
let win;
let openBoxes = 0;
let minesLeft = 0;
/**
 * Randomly shuffle an array
 * https://stackoverflow.com/a/2450976/1293256
 * @param  {Array} array The array to shuffle
 * @return {String}      The first item in the shuffled array
 */
var shuffle = function (array) {

	var currentIndex = array.length;
	var temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;

};

function preload() {
  flagImg = loadImage(flagSrc);
  mineImg = loadImage(mineSrc);
  shipImg = loadImage(shipSrc);
}

function createGame() {
	gameOver = false;
	win = false;
	openBoxes = sqX * sqY;
	let counter = 0;
	noTint();
	for (let i = 0; i < sqX; i++) 
	{
		mineBoxArray[i] = new Array(sqY);
		for (let k = 0; k < sqY; k++)
		{
			mineBoxArray[i][k] = new mineBox(i*sqSize, k*sqSize);
			miningArray.push(i + " " + k);
			counter++;
		}
	}
	/*
	Shuffle the mining array. Then populate with mines. 
	*/
	//console.dir(miningArray);
	miningArray = shuffle(miningArray);
	//console.dir(miningArray);
	for (let i = 0; i < mines; i++)
	{
		let mine = str(miningArray[i]).split(" ");
		//console.log("Planting mine at: ", mine);
		mineBoxArray[int(mine[0])][int(mine[1])].mine = true;
	}
	minesLeft = mines;

	/*Calculate adjacent mines*/
	for (let i = 0; i < sqX; i++) 
	{
		for (let k = 0; k < sqY; k++)
		{
			/*If no mines present in selected box*/
			if (mineBoxArray[i][k].mine == false) {
				scanAdjacent(i, k, "mine");
			}
		}
	}

   return counter;
}

document.oncontextmenu = function(event) {
  event.preventDefault();
  return false;
}

function scanAdjacent(x, y, scanType) {
	for (let xMin = x-1; xMin <= x+1; xMin++)
	{
		if (xMin < 0 || xMin >= sqX) continue
		for (let yMin = y-1; yMin <= y+1; yMin++)
		{
			if (yMin < 0 || yMin >= sqY) continue
			if (xMin == x && yMin == y) continue
			if (scanType == "mine")
			{
				if (mineBoxArray[xMin][yMin].mine)
				{
					mineBoxArray[x][y].incrementMinesAdj();
				}
			} else if (scanType == "flagRemove") {
				mineBoxArray[xMin][yMin].reduceFlagAdj();
			} else if (scanType == "flagAdd") {
				mineBoxArray[xMin][yMin].incrementFlagAdj();
				//console.log("Flags added", xMin,yMin,mineBoxArray[x][y].flagsAdj);
			}
		}
	}
}

function setup() {
  // put setup code here
  frameRate(fr);

  cnv = createCanvas(canvasX, canvasY);
  let counter = createGame();
  console.log("Mineboxes created: " + counter);
  cnv.mousePressed();
  noLoop();
  
}

function keyTyped() {
	loop();
	if (key === 'r' || key === 'R') {
		console.log("Game reset");
		let counter = createGame();
  		console.log("Mineboxes created: " + counter);
	}
	noLoop();
}

/*Mouse pressed somewhere on canvas. Calculate the location based on mouse*/
function mousePressed() {
  loop();
  let x = Math.floor(mouseX / sqSize);
  let y = Math.floor(mouseY / sqSize);
  if ((x >= 0 && x < sqX) && (y >= 0 && y < sqY))
  {
  	  if (gameOver == false && win == false)
  	  {
		  if(mouseButton == LEFT)
		  {
			propagateClick(x, y);  

		  } else 
		  if(mouseButton == RIGHT)
		  {
		  	 //place flag
		  	 mineBoxArray[x][y].flag();
		  	 if (mineBoxArray[x][y].isFlagged) 
		  	 {
		  	 	scanAdjacent(x,y,"flagAdd");
		  	 	if (mineBoxArray[x][y].mine)
		  	 	{
		  	 		minesLeft--;
		  	 		openBoxes--;
		  	 	}
		  	 	
		  	 }
		  	 else
		  	 {
		  	 	scanAdjacent(x,y,"flagRemove");
		  	 	if (mineBoxArray[x][y].mine)
		  	 	{
		  	 		minesLeft++;
		  	 		openBoxes++;
		  	 	}
		  	 	
		  	 }
		  }
		  else if (mouseButton == CENTER)
		  {
		  	
		  	//console.log("Middle button clicked", mineBoxArray[x][y].flagsAdj);
		  	if (mineBoxArray[x][y].isFlagged == false) 
		  	{
		  	  propagateClick(x, y, true)
		  	}
		  }

		  if (gameOver == true)
			{
				for (let i = 0; i < mines; i++) 
				{
					let mine = str(miningArray[i]).split(" ");
					mineBoxArray[int(mine[0])][int(mine[1])].clicked();
				}
			} else if (openBoxes == minesLeft)
			{
				win = true;
				//console.log(openBoxes, minesLeft);
			}
	  }
  }
}

function mouseReleased() {
  let x = Math.floor(mouseX / sqSize);
  let y = Math.floor(mouseY / sqSize);
  //console.log("Mouse released at:", x, y);
  noLoop();
}

/*
Recursive function to look for open spaces when they are clicked. 
*/
function propagateClick(x, y, middle=false) {
	let mBA = mineBoxArray[x][y];
	if((mBA.isOpen == false && mBA.isFlagged == false) || middle) 
    {
    	if (middle == false || middle == true && mBA.flagsAdj >= mBA.minesAdj)
    	{
			mBA.clicked();
			if (middle == false)
			{ 
				openBoxes--;
			}
    		
    	}
	  	if ((mBA.minesAdj == 0 && mBA.mine == false && middle == false) || 
	  		(middle && mBA.flagsAdj >= mBA.minesAdj && mBA.isFlagged == false))
	  	{
	  		for (let xMin = x-1; xMin <= x+1; xMin++)
			{
				if (xMin < 0 || xMin >= sqX) continue
				for (let yMin = y-1; yMin <= y+1; yMin++)
				{
					if (yMin < 0 || yMin >= sqY) continue
					if (xMin == x && yMin == y) continue
					propagateClick(xMin,yMin, false);
				}
			}
	  		
	  	} 
	  	else if (mBA.mine)
	  	{
	  		gameOver = true;
	  	}  
	}
	//console.log(minesLeft, openBoxes);
}


function draw() {
  //console.log(sqSize);
  background(153);
  for (let i = 0; i < sqX; i++)
  {
  	for (let k = 0; k < sqY; k++)
	{
		//console.log(i,k);
		mineBoxArray[i][k].display();
	}
  }
  if (gameOver) {
  	tint(255, 100);
  	image(shipImg, 0,0, min(shipX, canvasX), min(shipY,canvasY));
  	textAlign(CENTER, CENTER);
	textStyle(BOLD);
	textSize(50);
	fill(color("black"));
	rectMode(RADIUS);
	text("Game Over", 0,0, min(shipX, canvasX), min(shipY,canvasY));
  } else if (win) {
  	tint(255, 100);
  	image(shipImg, 0,0, min(shipX, canvasX), min(shipY,canvasY));
  	textAlign(CENTER, CENTER);
	textStyle(BOLD);
	textSize(50);
	fill(color("black"));
	rectMode(RADIUS);
	text("You Win", 0,0, min(shipX, canvasX), min(shipY,canvasY));
  }
  
}

