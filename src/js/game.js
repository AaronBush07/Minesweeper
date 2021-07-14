"use strict";
import Minebox from './mineBox.js'
export default class Game {
  constructor(canvasPanelOffset, sqSize = 25) {
    /**Set properties */
    this._canvasPanelOffset = canvasPanelOffset;
    this._mines = 100;
    this._sqX = 20;
    this._sqY = 32;
    this._sqSize = sqSize; //Square size
    this._mineBoxArray = new Array(this._sqX);
    this._miningArray;
    this._debug = false;
    this._gameOver;
    this._win;
    this._openBoxes = 0;
    this._minesLeft = 0;
    this._flaggedBox = 100;
    this._timer = 0;
  }

  /*
  Helper function to scan adjacent blocks. Will either mark mines adjacent, 
  or count the number of flags nearby. 
  */
  scanAdjacent(x, y, scanType) {
    for (let xMin = Math.max(x - 1, 0); xMin <= Math.min(this._sqX - 1, x + 1); xMin++) {
      for (let yMin = Math.max(y - 1, 0); yMin <= Math.min(this._sqY - 1, y + 1); yMin++) {
        let mBA = this._mineBoxArray[xMin][yMin];
        if (xMin == x && yMin == y) continue
        if (scanType == "mine") {
          if (mBA.isMined) {
            /**Check if adj box is mined. Then increment minesAdj for the given box. */
            this._mineBoxArray[x][y].incrementMinesAdj();
          }
        } else if (scanType == "flagRemove") {
          mBA.reduceFlagAdj();
        } else if (scanType == "flagAdd") {
          mBA.incrementFlagAdj();
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
    this._timer = 0;
    this._flaggedBox = 100;
    for (let i = 0; i < this._sqX; i++) {
      this._mineBoxArray[i] = new Array(this._sqY);
      for (let k = 0; k < this._sqY; k++) {
        this._mineBoxArray[i][k] = new Minebox(i * this._sqSize, k * this._sqSize, this._canvasPanelOffset, this._sqSize);
        this._miningArray.push([i, k]);
        counter++;
      }
    }
    /*
    Shuffle the mining array. Then populate with mines. 
    */
    this._miningArray = this.shuffleArray(this._miningArray);
    for (let i = 0; i < this._mines; i++) {
      let mine = this._miningArray[i];
      this._mineBoxArray[Number(mine[0])][Number(mine[1])].mine = true;
    }
    this._minesLeft = this._mines;

    /*Calculate adjacent mines*/
    for (let i = 0; i < this._sqX; i++) {
      for (let k = 0; k < this._sqY; k++) {
        /*If no mines present in selected box*/
        if (this._mineBoxArray[i][k].isMined == false) {
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
        let mine = this._miningArray[i];
        this._mineBoxArray[Number(mine[0])][Number(mine[1])].clicked();
      }
    } else if (this._openBoxes == this._minesLeft) {
      /**Number of Open Boxes matches the number of mines left = auto win. */
      this._win = true;
      this._flaggedBox = 0;
      //console.log(openBoxes, minesLeft);
    }
  }

  incrementTimer() {
    this._timer++;
  }

  get timer() {
    return this._timer;
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