/*
Aaron Bush 
https://github.com/AaronBush07
2020
*/


const canvasX = 500;
const canvasY = 800;
const mines = 100;
const sqX = 20;
const sqY = 32;
const sqSize = 25;
let cnv;
var mineBoxArray = new Array(sqX);
let miningArray = [];
let debug = true;
let fr = 10;
let flagSrc = "../img/flag-svgrepo-com.svg";
let mineSrc = "../img/rg1024_sea_mine.svg";
let mineImg;
let flagImg;
let gameOver = false;
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
}

function createGame() {
	
	let counter = 0;
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
		console.log("Planting mine at: ", mine);
		mineBoxArray[int(mine[0])][int(mine[1])].mine = true;
	}

	/*Calculate adjacent mines*/
	for (let i = 0; i < sqX; i++) 
	{
		for (let k = 0; k < sqY; k++)
		{
			/*If no mines present in selected box*/
			if (mineBoxArray[i][k].mine == false) {
				for (let xMin = i-1; xMin <= i+1; xMin++)
				{
					if (xMin < 0 || xMin >= sqX) continue
					for (let yMin = k-1; yMin <= k+1; yMin++)
					{
						if (yMin < 0 || yMin >= sqY) continue
						if (xMin == i && yMin == k) continue
						//console.log(i, k, " Accessing ", xMin, yMin);
						if (mineBoxArray[xMin][yMin].mine)
						{
							mineBoxArray[i][k].incrementMinesAdj();
						}

					}
				}
			}
		}
	}

   return counter;
}

document.oncontextmenu = function(event) {
  event.preventDefault();
  return false;
}

function setup() {
  // put setup code here
  frameRate(fr);
  cnv = createCanvas(canvasX, canvasY);
  let counter = createGame();
  console.log("Mineboxes created: " + counter);
  cnv.mousePressed();
  
}

/*Mouse pressed somewhere on canvas. Calculate the location based on mouse*/
function mousePressed() {
  
  let x = Math.floor(mouseX / sqSize);
  let y = Math.floor(mouseY / sqSize);
  if ((x >= 0 && x < sqX) && (y >= 0 && y < sqY))
  {
  	  if (gameOver == false)
  	  {
		  if(mouseButton == LEFT)
		  {
			  //console.log("Mouse pressed at:", x, y);   
			propagateClick(x, y);
			if (gameOver == true)
			{
				for (let i = 0; i < mines; i++) 
				{
					let mine = str(miningArray[i]).split(" ");
					mineBoxArray[int(mine[0])][int(mine[1])].clicked();
				}
			}  

		  } 
		  if(mouseButton == RIGHT)
		  {
		  	 //place flag
		  	 mineBoxArray[x][y].flag();
		  }
	  }
  }
}

function mouseReleased() {
  let x = Math.floor(mouseX / sqSize);
  let y = Math.floor(mouseY / sqSize);
  //console.log("Mouse released at:", x, y);
}

/*
Recursive function to look for open spaces when they are clicked. 
*/
function propagateClick(x, y) {
	let mBA = mineBoxArray[x][y];
	if(mBA.isOpen == false && mBA.isFlagged == false)
    {
    	mBA.clicked();
	  	if (mBA.minesAdj == 0 && mBA.mine == false)
	  	{
	  		for (let xMin = x-1; xMin <= x+1; xMin++)
			{
				if (xMin < 0 || xMin >= sqX) continue
				for (let yMin = y-1; yMin <= y+1; yMin++)
				{
					if (yMin < 0 || yMin >= sqY) continue
					if (xMin == x && yMin == y) continue
					//console.log(i, k, " Accessing ", xMin, yMin);
					propagateClick(xMin,yMin);
				}
			}
	  		
	  	} else if (mBA.mine == true)
	  	{
	  		gameOver = true;
	  	}  
	}

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
  
}

