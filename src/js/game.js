import Minebox from './mineBox.js'

export default class Game {
  constructor(canvasPanelOffset, sqSize = 25) {
    /**Set properties */
    this._canvasPanelOffset = canvasPanelOffset;
    this._mines = 100;
    this._sqX = 20;
    this._sqY = 32;
    this._sqSize = 25; //Square size
    this._mineBoxArray = new Array(this._sqX);
    this._miningArray;
    this._debug = false;
    this._gameOver;
    this._win;
    this._openBoxes = 0;
    this._minesLeft = 0;
    this._flaggedBox = 100;
  }

  /*
  Helper function to scan adjacent blocks. Will either mark mines adjacent, 
  or count the number of flags nearby. 
  */
  scanAdjacent(x, y, scanType) {
    for (let xMin = x - 1; xMin <= x + 1; xMin++) {
      if (xMin < 0 || xMin >= this._sqX) continue
      for (let yMin = y - 1; yMin <= y + 1; yMin++) {
        if (yMin < 0 || yMin >= this._sqY) continue
        if (xMin == x && yMin == y) continue
        if (scanType == "mine") {
          if (this._mineBoxArray[xMin][yMin].mine) {
            this._mineBoxArray[x][y].incrementMinesAdj();
          }
        } else if (scanType == "flagRemove") {
          this._mineBoxArray[xMin][yMin].reduceFlagAdj();
        } else if (scanType == "flagAdd") {
          this._mineBoxArray[xMin][yMin].incrementFlagAdj();
          //console.log("Flags added", xMin,yMin,mineBoxArray[x][y].flagsAdj);
        }
      }
    }
  }

  /**Create and reset a game */
  createGame() {
    this._gameOver = false;
    this._win = false;
    this._openBoxes = this._sqX * this._sqY;
    this._miningArray = [];
    let counter = 0;
    for (let i = 0; i < this._sqX; i++) {
      this._mineBoxArray[i] = new Array(this._sqY);
      for (let k = 0; k < this._sqY; k++) {
        this._mineBoxArray[i][k] = new Minebox(i * this._sqSize, k * this._sqSize, this._canvasPanelOffset, this._sqSize);
        this._miningArray.push(i + " " + k);
        counter++;
      }
    }
    /*
    Shuffle the mining array. Then populate with mines. 
    */
    this._miningArray = this.shuffleArray(this._miningArray);
    for (let i = 0; i < this._mines; i++) {
      let mine = String(this._miningArray[i]).split(" ");
      this._mineBoxArray[Number(mine[0])][Number(mine[1])].mine = true;
    }
    this._minesLeft = this._mines;

    /*Calculate adjacent mines*/
    for (let i = 0; i < this._sqX; i++) {
      for (let k = 0; k < this._sqY; k++) {
        /*If no mines present in selected box*/
        if (this._mineBoxArray[i][k].mine == false) {
          this.scanAdjacent(i, k, "mine");
        }
      }
    }

    console.log("Mineboxes created: " + counter);
  }

  /**
 * Randomly shuffle an array
 * https://stackoverflow.com/a/2450976/1293256
 * @param  {Array} array The array to shuffle
 * @return {String}      The first item in the shuffled array
 */
  shuffleArray(array) {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;

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

  checkForGameOver() {
    if (this._gameOver == true) {
      for (let i = 0; i < this._mines; i++) {
        let mine = String(this._miningArray[i]).split(" ");
        this._mineBoxArray[Number(mine[0])][Number(mine[1])].clicked();
      }
    } else if (this._openBoxes == this._minesLeft) {
      win = true;
      //console.log(openBoxes, minesLeft);
    }
  }

  flag(x, y) {
    if (this._mineBoxArray[x][y].isFlagged)
      this._flaggedBox++;
    else
      this._flaggedBox--;
    this._mineBoxArray[x][y].flag();
  }

  get flaggedBox() {
    return this._flaggedBox;
  }
  get minesLeft() {
    return this._minesLeft;
  }

  incrementMinesLeft() {
    this._minesLeft++;
  }

  reduceMinesLeft() {
    this._minesLeft--;
  }

  get openBoxes() {
    return this._openBoxes;
  }

  incrementOpenBoxes() {
    this._openBoxes++;
  }

  reduceOpenBoxes() {
    this._openBoxes--;
  }

  set win(win) {
    this._win = win;
  }

  explode() {
    this._gameOver = true;
  }

  get gameOver() {
    return this._gameOver
  }

  get sqSize() {
    return this._sqSize;
  }

  get sqX() {
    return this._sqX;
  }

  get win() {
    return this._win;
  }

  get sqY() {
    return this._sqY;
  }

  get mineBoxArray() {
    return this._mineBoxArray;
  }
}