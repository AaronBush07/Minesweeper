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
			square(this._x, this._y, sqSize);
		}
		else
		{
			fill(color("lightgreen"));
			square(this._x, this._y, sqSize);
		}
		fill(color("black"));
		textAlign(LEFT, TOP);
		let debugText = this._x + "," + this._y + " " + str(this._mine) + " M:" + this._minesAdj;
		text(debugText, this._x, this._y);
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
		return _minesAdj;
	}

	get mine() {
		return this._mine;
	}


}