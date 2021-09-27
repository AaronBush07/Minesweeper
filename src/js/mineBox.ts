"use strict";

export default class Minebox {
  public x: number;
  public y: number;
  public flagged: boolean;
  public flagsAdj: number; //How many flagged boxes adjacent
  public mine: boolean;
  public isOpen: boolean;
  public minesAdj: number;
  public leftMouse: boolean;
  public sqSize: number;
  constructor(x:number, y:number, canvasPanelOffset:number, sqSize:number) {
    //initial state of the box.
    this.x = x;
    this.y = y + canvasPanelOffset;
    this.flagged = false;
    this.flagsAdj = 0; //How many flagged boxes adjacent
    this.mine = false;
    this.isOpen = false;
    this.minesAdj = 0;
    this.leftMouse = false;
    this.sqSize = sqSize;
  }

  clicked(): void {
    //console.log("Hey I was clicked");
    this.isOpen = true;
  }

  public incrementMinesAdj(): void {
    this.minesAdj++;
  }

  public reduceFlagAdj(): void {
    this.flagsAdj--;
  }

  public incrementFlagAdj(): void {
    this.flagsAdj++;
  }

  public flag(): void {
    if (this.isOpen === false) {
      this.flagged = !this.flagged;
    }
  }
}
