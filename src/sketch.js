const canvasX = 500;
const canvasY = 800;
const mines = 10;
const sqX = 5;
const sqY = 8;
const sqSize = 100;
let cnv;
var mineBoxArray = new Array(sqX);

function createGame() {
	let counter = 0;
	for (let i = 0; i < sqX; i++) 
	{
		mineBoxArray[i] = new Array(sqY);
		console.log(mineBoxArray[i]);
	}

	for (let i = 0; i < sqX; i++)
	{

		for (let k = 0; k < sqY; k++)
		{
			mineBoxArray[i][k] = new mineBox(i*sqSize, k*sqSize);
			counter++;
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

