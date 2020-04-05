/*
Aaron Bush 
https://github.com/AaronBush07
2020
*/


const canvasX = 500;
const canvasY = 800;
const mines = 10;
const sqX = 5;
const sqY = 8;
const sqSize = 100;
let cnv;
var mineBoxArray = new Array(sqX);
let miningArray = [];

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
	console.dir(miningArray);
	miningArray = shuffle(miningArray);
	console.dir(miningArray);
	for (let i = 0; i < mines; i++)
	{
		let mine = str(miningArray[i]).split(" ");
		console.log(mine);
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
						console.log(i, k, " Accessing ", xMin, yMin);
						if (mineBoxArray[xMin][yMin].mine)
						{
							console.log("Mine found");
							//console.log(mineBoxArray[i][k]);
							mineBoxArray[i][k].incrementMinesAdj();
							//console.log(mineBoxArray[i][k]);
						}

					}
				}
			}
		}
	}

   return counter;
}


function setup() {
  // put setup code here
  cnv = createCanvas(canvasX, canvasY);
  let counter = createGame();
  console.log("Mineboxes created: " + counter);
  cnv.mousePressed();
}

/*Mouse pressed somewhere on canvas. Calculate the location based on mouse*/
function mousePressed() {
  let x = Math.floor(mouseX / sqSize);
  let y = Math.floor(mouseY / sqSize);
  console.log("Mouse pressed at:", x, y); 
  if ((x >= 0 && x < sqX) && (y >= 0 && y < sqY))
  {
  	mineBoxArray[x][y].clicked();
  } 
}

function mouseReleased() {
  let x = Math.floor(mouseX / sqSize);
  let y = Math.floor(mouseY / sqSize);
  console.log("Mouse released at:", x, y);
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

