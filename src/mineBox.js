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
		this._flagged = false;
		this._mine = false;
		this._isOpen = false;
		this._minesAdj = 0;
		this._leftMouse = false;

	}

	display()
	{
		//console.log(this._x, this._y);
		if (this._isOpen == false)
		{
			fill(color("white"));
			if (debug == true)
			{
				if (this._mine == true)
				{
					fill(color("papayawhip"));
				}
				else if (this._minesAdj == 0)
				{
					fill(color("gainsboro"));
				}
			}
		}
		else if (this._mine == true)
		{
			fill(color("red"));
		}
		else
		{
			if (this._minesAdj == 0) {
			  fill(color("darkseagreen"));
			}
			else {
				fill(color("lightgreen"));
			}
		}
		rectMode(CORNER);
		square(this._x, this._y, sqSize);
		if(this._flagged == true && this._isOpen == false) {
			image(flagImg, this._x, this._y, sqSize, sqSize);
		}
		rectMode(RADIUS);
		if(this._minesAdj > 0 && this._isOpen == true) {
			switch(this._minesAdj) {
				case 1: fill(color("blue"));
						break;
				case 2: fill(color("red"));
						break;
				case 3: fill(color("green"));
						break;
				case 4: fill(color("gold"));
						break;
				case 5: fill(color("magenta"));
						break;
				case 6: fill(color("sienna"));
						break;
				case 7: fill(color("pink"));
						break;
				case 8: fill(color("black"));
						break;
				default: fill(0, 102, 153);
			}
			
			textAlign(CENTER, CENTER);
			textStyle(BOLD);
			textSize(20);
			text(str(this._minesAdj), this._x, this._y, sqSize, sqSize);
		}
		strokeWeight(1);
		//let debugText = this._x + "," + this._y + " " + str(this._mine) + " M:" + this._minesAdj;
		//let debugText = str(this._mine) + " M:" + this._minesAdj;
		//text(debugText, this._x, this._y);
	}

	clicked() {
		console.log("Hey I was clicked");
		this._isOpen = true;
	}

	set mine(value) {
		this._mine = value;
	}

	set minesAdj(value) {
		this._minesAdj = value;
	}

	incrementMinesAdj() {
		this._minesAdj++;
	}

	get minesAdj() {
		return this._minesAdj;
	}

	get isOpen() {
		return this._isOpen;
	}

	get mine() {
		return this._mine;
	}

	get isFlagged() {
		return this._flagged;
	}

	flag() {
		if (this._isOpen == false)
		{
			this._flagged = !this._flagged;
		}
	}


}