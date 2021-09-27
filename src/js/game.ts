"use strict";
import Minebox from "./mineBox";
export default class Game {
  public canvasPanelOffset: number;
  public mines: number;
  public sqX: number;
  public sqY: number;
  public sqSize: number; //Square size
  public mineBoxArray: Minebox[][];
  public miningArray: any[];
  public debug: boolean;
  public gameOver: boolean;
  public win: boolean;
  public openBoxes: number;
  public minesLeft: number;
  public flaggedBox: number;
  public timer: number;
  constructor(canvasPanelOffset, sqSize = 25) {
    /**Set properties */
    this.canvasPanelOffset = canvasPanelOffset;
    this.mines = 100;
    this.sqX = 20;
    this.sqY = 32;
    this.sqSize = sqSize; //Square size
    this.mineBoxArray = new Array(this.sqX);
    this.miningArray;
    this.debug = false;
    this.gameOver;
    this.win;
    this.openBoxes = 0;
    this.minesLeft = 0;
    this.flaggedBox = 100;
    this.timer = 0;
  }

  /*
  Helper function to scan adjacent blocks. Will either mark mines adjacent, 
  or count the number of flags nearby. 
  */
  scanAdjacent(x:number, y:number, scanType:string): void {
    for (
      let xMin:number = Math.max(x - 1, 0);
      xMin <= Math.min(this.sqX - 1, x + 1);
      xMin++
    ) {
      for (
        let yMin = Math.max(y - 1, 0);
        yMin <= Math.min(this.sqY - 1, y + 1);
        yMin++
      ) {
        const mBA: Minebox = this.mineBoxArray[xMin][yMin];
        if (xMin === x && yMin === y) continue;
        if (scanType === "mine") {
          if (mBA.mine) {
            /**Check if adj box is mined. Then increment minesAdj for the given box. */
            this.mineBoxArray[x][y].incrementMinesAdj();
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
  createGame(): void {
    this.gameOver = false;
    this.win = false;
    this.openBoxes = this.sqX * this.sqY;
    this.miningArray = [];
    let counter: number = 0;
    this.timer = 0;
    this.flaggedBox = 100;
    for (let i = 0; i < this.sqX; i++) {
      this.mineBoxArray[i] = new Array(this.sqY);
      for (let k = 0; k < this.sqY; k++) {
        this.mineBoxArray[i][k] = new Minebox(
          i * this.sqSize,
          k * this.sqSize,
          this.canvasPanelOffset,
          this.sqSize
        );
        this.miningArray.push([i, k]);
        counter++;
      }
    }
    /*
    Shuffle the mining array. Then populate with mines. 
    */
    this.miningArray = this.shuffleArray(this.miningArray);
    for (let i = 0; i < this.mines; i++) {
      let mineTuple: number[] = this.miningArray[i];
      this.mineBoxArray[mineTuple[0]][mineTuple[1]].mine = true;
    }
    this.minesLeft = this.mines;

    /*Calculate adjacent mines*/
    for (let i = 0; i < this.sqX; i++) {
      for (let k = 0; k < this.sqY; k++) {
        /*If no mines present in selected box*/
        if (this.mineBoxArray[i][k].mine === false) {
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
  shuffleArray(array: any[]): any[] {
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
  }

  checkForGameOver(): void {
    if (this.gameOver == true) {
      for (let i = 0; i < this.mines; i++) {
        let mine = this.miningArray[i];
        this.mineBoxArray[Number(mine[0])][Number(mine[1])].clicked();
      }
    } else if (this.openBoxes == this.minesLeft) {
      /**Number of Open Boxes matches the number of mines left = auto win. */
      this.win = true;
      this.flaggedBox = 0;
      //console.log(openBoxes, minesLeft);
    }
  }

  incrementTimer(): void {
    this.timer++;
  }

  flag(x, y): void {
    if (this.mineBoxArray[x][y].flagged) this.flaggedBox++;
    else this.flaggedBox--;
    this.mineBoxArray[x][y].flag();
  }

  incrementMinesLeft(): void {
    this.minesLeft++;
  }

  reduceMinesLeft(): void {
    this.minesLeft--;
  }

  incrementOpenBoxes(): void {
    this.openBoxes++;
  }

  reduceOpenBoxes(): void {
    this.openBoxes--;
  }

  explode(): void {
    this.gameOver = true;
  }
}
