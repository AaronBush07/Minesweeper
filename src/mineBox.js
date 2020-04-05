class mineBox {
	
	constructor(x, y)
	{
		//initial state of the box. 
		this._x = x;
		this._y = y;
		this._flagged = false;
		this._flagsAdj = 0; //How many flagged boxes adjacent
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
			if(this._flagged)
				fill(color("white"));
			else 
				fill(color("red"));
		}
		else
		{
			if (this._minesAdj == 0) {
			  fill(color("aquamarine"));
			}
			else {
				fill(color("lightgreen"));
			}
		}
		rectMode(CORNER);
		square(this._x, this._y, sqSize);
		if(this._flagged == true) {
			image(flagImg, this._x, this._y, sqSize, sqSize);
		} else if (this._flagged == false && this._isOpen == true && this._mine == true)
		{
			image(mineImg, this._x, this._y, sqSize, sqSize);
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
	}

	clicked() {
		//console.log("Hey I was clicked");
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

	reduceFlagAdj() {
		this._flagsAdj--;
	}

	incrementFlagAdj() {
		this._flagsAdj++;
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

	get flagsAdj() {
		return this._flagsAdj;
	}

	flag() {
		if (this._isOpen == false)
		{
			this._flagged = !this._flagged;
		}
	}


}