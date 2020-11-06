export default class Minebox {

  constructor(x, y, canvasPanelOffset, sqSize) {
    //initial state of the box. 
    this._x = x;
    this._y = y + canvasPanelOffset;
    this._flagged = false;
    this._flagsAdj = 0; //How many flagged boxes adjacent
    this._mine = false;
    this._isOpen = false;
    this._minesAdj = 0;
    this._leftMouse = false;
    this._sqSize = sqSize;

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

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
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
    if (this._isOpen == false) {
      this._flagged = !this._flagged;
    }
  }


}