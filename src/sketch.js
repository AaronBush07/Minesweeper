const canvasX = 500;
const canvasY = 800;
const mines = 10;
const sqWidth = 5;
const sqLength = 8;
const sqSize = 100;
var mineBoxArray = [];

function setup() {
  // put setup code here
  createCanvas(canvasX, canvasY);
  background(153);
  createGame();
  
}

function createGame() {
	for(let i = 0; i < canvasX; i = i + sqSize)
  	{
		for(let k = 0; k < canvasY; k = k + sqSize)
		{

	    	mineBoxArray.push(new mineBox(i, k));
	 	//console.log(i, k, sqSize);
		}
  }
}

function draw() {
  //console.log(sqSize);
  for (let i = 0; i < mineBoxArray.length; i++)
  {
  	mineBoxArray[i].display();
  }
  
}

class mineBox {
	constructor(x, y)
	{
		//initial state of the box. 
		this._x = x;
		this._y = y;
	}

	display()
	{
		//console.log(this._x, this._y);
		square(this._x, this._y, sqSize);
	}
}