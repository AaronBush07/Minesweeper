const canvasX = 500;
const canvasY = 800;
const mines = 10;
const sqWidth = 5;
const sqLength = 8;
const sqSize = 100;
let cnv;
var mineBoxArray = new Array(sqWidth);

function createGame() {
	let counter = 0;
	for (let i = 0; i < sqWidth; i++) 
	{
		mineBoxArray[i] = new Array(sqLength);
		console.log(mineBoxArray[i]);
	}

	for (let i = 0; i < sqWidth; i++)
	{

		for (let k = 0; k < sqLength; k++)
		{
			mineBoxArray[i][k] = new mineBox(i*sqSize, k*sqSize);
			counter++;
		}
	}
	// for(let i = 0; i < canvasX; i = i + sqSize)
 //  	{
	// 	for(let k = 0; k < canvasY; k = k + sqSize)
	// 	{
	// 		/*Create new mineboxes.*/
	//     	mineBoxArray.push(new mineBox(i, k));
	// 	}
 //  }
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
  
}


function draw() {
  //console.log(sqSize);
  background(153);
  for (let i = 0; i < sqWidth; i++)
  {
  	for (let k = 0; k < sqLength; k++)
	{
		console.log(i,k);
		mineBoxArray[i][k].display();
	}
  }
  
}

class mineBox {
	/*
		state: 
			blank: 0;
			mined: 1;
			number: 2;
	*/
	constructor(x, y)
	{
		//initial state of the box. 
		this._x = x;
		this._y = y;
		this._state = 0;
		this._isOpen = false;
		this._minesAdj = 0;
		this._leftMouse = false;

	}

	display()
	{
		//console.log(this._x, this._y);
		if (this._leftMouse == false)
		{
			color("white");
			square(this._x, this._y, sqSize);
		}
		else
		{
			color("green");
			square(this._x, this._y, sqSize);
		}
		textAlign(LEFT, TOP);
		text(this._x + "," + this._y, this._x, this._y);
	}

	mousePressed()
	{
		console.log('Mouse pressed on ${this._x}, ${this._y}');
		this._leftMouse = true;
	}
	mouseReleased()
	{
		this._leftMouse = false;
	}
}