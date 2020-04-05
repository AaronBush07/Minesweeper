let canvasLength = 500;
let canvasWidth = 800;
let mines = 10;
let sqWidth = 5;
let sqLength = 8;
let sqSize = 100;

function setup() {
  // put setup code here
  createCanvas(canvasWidth, canvasLength);
  background(153);
}

function draw() {
  // put drawing code here
  //console.log(canvasLength);
  //console.log(canvasWidth);

  console.log(sqSize);
  for(let i = 0; i < canvasWidth; i = i + sqSize)
  {
	for(let k = 0; k < canvasLength; k = k + sqSize)
	{

    	square(i, k, sqSize);
 	//console.log(i, k, sqSize);
	}
  }
}