/*
Aaron Bush 
https://github.com/AaronBush07
2020
*/
"use strict";
import p5 from "p5";
import "../css/style.scss";
import Game from "./game";
import Minebox from "./mineBox";

/** All pixels should be a multiple of sqSize. */
const sqSize: number = 25;
const canvasPanelOffset: number = 2 * sqSize;
const canvasX: number = 20 * sqSize;
const canvasY: number = 32 * sqSize + canvasPanelOffset;

const flagSrc: string = "./flag-svgrepo-com";
const mineSrc: string = "./rg1024_sea_mine";
const shipSrc: string = "./noaa-MmblG0TlcS0-unsplash.jpg"; //Photo by NOAA on Unsplash

const smileSrc: string = "./slightly-smiling-face_1f642.png";
const winSrc: string = "./smiling-face-with-sunglasses_1f60e.png";
const loseSrc: string = "./shocked-face-with-exploding-head_1f92f.png";

let mineImg: p5.Image, shipImg: p5.Image, flagImg: p5.Image;
let smileImg: p5.Image, winImg: p5.Image, loseImg: p5.Image;

const debug = false;

const shipX = 640;
const shipY = 425;

const sketch = (p: p5) => {
  p.disableFriendlyErrors = true;
  //window.p = p;
  const mineSweeper = new Game(canvasPanelOffset, sqSize);

  let sketchTime;

  /**Load all images to be used */
  p.preload = (): void => {
    /**Firefox workaround.  */
    if (typeof InstallTrigger !== "undefined") {
      flagImg = p.loadImage(flagSrc + ".jpg");
      mineImg = p.loadImage(mineSrc + ".jpg");
    } else {
      flagImg = p.loadImage(flagSrc + ".svg");
      mineImg = p.loadImage(mineSrc + ".svg");
    }
    shipImg = p.loadImage(shipSrc);

    smileImg = p.loadImage(smileSrc);
    winImg = p.loadImage(winSrc);
    loseImg = p.loadImage(loseSrc);

    /**Resize the images for performance */
    flagImg.resize(sqSize, 0);
    mineImg.resize(sqSize, 0);
    smileImg.resize(canvasPanelOffset, 0);
    winImg.resize(canvasPanelOffset, 0);
    loseImg.resize(canvasPanelOffset, 0);
  };

  const display = (mineBox, win = false): void => {
    //console.log(mineBox.x, mineBox.y);
    if (mineBox.isOpen == false) {
      p.fill(p.color("white"));
      if (debug == true) {
        if (mineBox.mine === true) {
          p.fill(p.color("papayawhip"));
        } else if (mineBox.minesAdj == 0) {
          p.fill(p.color("gainsboro"));
        }
      }
    } else if (mineBox.mine) {
      if (mineBox.flagged) p.fill(p.color("white"));
      else p.fill(p.color("red"));
    } else {
      if (mineBox.minesAdj == 0) {
        p.fill(p.color("aquamarine"));
      } else {
        p.fill(p.color("lightgreen"));
      }
    }

    p.rectMode(p.CORNER);
    p.square(mineBox.x, mineBox.y, sqSize);

    if (mineBox.flagged == true) {
      //console.log("flagged");
      p.image(flagImg, mineBox.x, mineBox.y, sqSize, sqSize);
      //Game is over, mark wrongly placed mines.
      if (mineSweeper.gameOver && mineBox.mine == false) {
        //X to mark wrong mine.
        p.image(mineImg, mineBox.x, mineBox.y, sqSize, sqSize);
        p.fill(p.color("red"));
        p.beginShape(p.LINES);
        p.vertex(mineBox.x, mineBox.y);
        p.vertex(mineBox.x + sqSize, mineBox.y + sqSize);
        p.vertex(mineBox.x + sqSize, mineBox.y);
        p.vertex(mineBox.x, mineBox.y + sqSize);
        p.endShape();
      } else {
        p.image(flagImg, mineBox.x, mineBox.y, sqSize, sqSize);
      }
    } else if (mineBox.flagged == false && mineBox.mine) {
      if (mineBox.isOpen == true) {
        p.image(mineImg, mineBox.x, mineBox.y, sqSize, sqSize);
      } else if (win) {
        //auto flag when game is won.
        p.image(flagImg, mineBox.x, mineBox.y, sqSize, sqSize);
      }
    }
    p.strokeWeight(1);
  };

  /**Separating text from display has contributed to speedboost due to less calls to p.text methods which are resource heavy*/
  const displayText = (): void => {
    p.rectMode(p.RADIUS);
    p.textAlign(p.CENTER, p.CENTER);
    p.textStyle(p.BOLD);
    p.textSize(20);
    for (let i = 0; i < mineSweeper.sqX; i++) {
      for (let k = 0; k < mineSweeper.sqY; k++) {
        let mineBox = mineSweeper.mineBoxArray[i][k];
        if (mineBox.minesAdj > 0 && mineBox.isOpen == true) {
          switch (mineBox.minesAdj) {
            case 1:
              p.fill(p.color("blue"));
              break;
            case 2:
              p.fill(p.color("red"));
              break;
            case 3:
              p.fill(p.color("green"));
              break;
            case 4:
              p.fill(p.color("gold"));
              break;
            case 5:
              p.fill(p.color("magenta"));
              break;
            case 6:
              p.fill(p.color("sienna"));
              break;
            case 7:
              p.fill(p.color("pink"));
              break;
            case 8:
              p.fill(p.color("black"));
              break;
            default:
              p.fill(0, 102, 153);
          }
          p.text(
            String(mineBox.minesAdj),
            mineBox.x,
            mineBox.y,
            sqSize,
            sqSize
          );
        }
      }
    }
  };

  function gameTimer(): void {
    mineSweeper.incrementTimer();
    p.redraw();
    /**Redraw upon update */
  }

  function resetGame(): void {
    console.log("Game reset");
    p.noTint();
    clearInterval(sketchTime);
    sketchTime = setInterval(gameTimer, 1000);
    mineSweeper.createGame();
    p.redraw();
  }

  const dblClick = (): void => {
    //console.log("doubleClicked");
    mouseLogic(p.mouseX, p.mouseY, "CENTER");
  };

  p.setup = (): void => {
    // put setup code here
    let cnv = p.createCanvas(canvasX, canvasY);
    mineSweeper.createGame();
    //cnv.mousePressed();
    cnv.doubleClicked(dblClick);
    p.noLoop();
    sketchTime = setInterval(gameTimer, 1000);
  };

  p.keyTyped = (): void => {
    if (p.key === "r" || p.key === "R") {
      resetGame();
    }
    p.redraw();
  };

  /*Mouse pressed somewhere on canvas. Calculate the location based on mouse*/
  p.mousePressed = (): void => {
    let mButton: string;
    //console.log("Mouse Pressed");
    switch (p.mouseButton) {
      case p.LEFT:
        mButton = "LEFT";
        break;
      case p.RIGHT:
        mButton = "RIGHT";
        break;
      case p.CENTER:
        mButton = "CENTER";
        break;
    }
    mouseLogic(p.mouseX, p.mouseY, mButton);
  };

  p.mouseReleased = (): void => {
    let x:number = Math.floor(p.mouseX / sqSize);
    let y:number = Math.floor(p.mouseY / sqSize);
    //console.log("Mouse released at:", x, y);
  };

  function mouseLogic(mX: number, mY: number, mButton: string): void {
    if (mY < canvasPanelOffset && mY >= 0) {
      const xMin:number = canvasX / 2 - canvasPanelOffset / 2;
      const xMax:number = canvasX / 2 + canvasPanelOffset / 2;
      if (mX >= xMin && mX <= xMax) {
        /**Reset */
        resetGame();
      }
    } else {
      const x = Math.floor(mX / sqSize);
      const y = Math.floor((mY - canvasPanelOffset) / sqSize);
      //console.log(mX, mY, mY - canvasPanelOffset);
      if (x >= 0 && x < mineSweeper.sqX && y >= 0 && y < mineSweeper.sqY) {
        if (mineSweeper.gameOver === false && mineSweeper.win === false) {
          if (mButton == "LEFT") {
            propagateClick(x, y);
          } else if (mButton == "RIGHT") {
            //place flag on closed boxes.
            if (mineSweeper.mineBoxArray[x][y].isOpen === false) {
              mineSweeper.flag(x, y);
              if (mineSweeper.mineBoxArray[x][y].flagged) {
                mineSweeper.scanAdjacent(x, y, "flagAdd");
                if (mineSweeper.mineBoxArray[x][y].mine) {
                  mineSweeper.reduceMinesLeft();
                  mineSweeper.reduceOpenBoxes();
                }
              } else {
                mineSweeper.scanAdjacent(x, y, "flagRemove");
                if (mineSweeper.mineBoxArray[x][y].mine) {
                  mineSweeper.incrementMinesLeft();
                  mineSweeper.incrementOpenBoxes();
                }
              }
            }
          } else if (mButton == "CENTER") {
            //console.log("Middle button clicked", mineBoxArray[x][y].flagsAdj);
            if (mineSweeper.mineBoxArray[x][y].flagged == false) {
              propagateClick(x, y, true);
            }
          }

          mineSweeper.checkForGameOver();
          p.redraw();
        }
      }
    }
  }

  /*
  Recursive function to look for open spaces when they are clicked. 
  */
  function propagateClick(x: number, y: number, middle: boolean = false): void {
    const mBA: Minebox = mineSweeper.mineBoxArray[x][y];
    // console.log(mBA)
    if (
      (mBA.isOpen === false && mBA.flagged === false && middle === false) ||
      (middle && mBA.isOpen)
    ) {
      if (
        middle === false ||
        (middle === true && mBA.flagsAdj >= mBA.minesAdj)
      ) {
        mBA.clicked();
        if (middle === false) {
          mineSweeper.reduceOpenBoxes();
        }
        if (middle) {
          //console.log(mBA, "middle registered");
          null;
        }
      }
      if (
        (mBA.minesAdj === 0 && mBA.mine === false && middle === false) ||
        (middle && mBA.flagsAdj >= mBA.minesAdj && mBA.flagged === false)
      ) {
        for (let xMin = x - 1; xMin <= x + 1; xMin++) {
          if (xMin < 0 || xMin >= mineSweeper.sqX) continue;
          for (let yMin = y - 1; yMin <= y + 1; yMin++) {
            if (yMin < 0 || yMin >= mineSweeper.sqY) continue;
            if (xMin == x && yMin == y) continue;
            propagateClick(xMin, yMin, false);
          }
        }
      } else if (mBA.mine) {
        mineSweeper.explode();
      }
    }
  }

  const displayPanel = (): void => {
    p.rectMode(p.CORNER);
    p.strokeWeight(2);
    p.fill(p.color("white"));
    p.rect(0, 0, canvasX, canvasPanelOffset);
    p.rect(0, 0, sqSize * 4, canvasPanelOffset);
    p.rect(canvasX - sqSize * 4, 0, sqSize * 4, canvasPanelOffset);
    //console.log(canvasX - (sqSize * 4));
    p.rect(
      canvasX / 2 - canvasPanelOffset / 2,
      0,
      canvasPanelOffset,
      canvasPanelOffset
    );
    p.rectMode(p.RADIUS);
    p.image(
      mineSweeper.win ? winImg : mineSweeper.gameOver ? loseImg : smileImg,
      canvasX / 2 - canvasPanelOffset / 2,
      0,
      canvasPanelOffset,
      canvasPanelOffset
    );
    p.fill(p.color("red"));
    p.textAlign(p.CENTER, p.CENTER);
    p.textStyle(p.BOLD);
    p.textSize(30);
    p.text(
      Math.max(0, mineSweeper.flaggedBox),
      0,
      0,
      sqSize * 4,
      canvasPanelOffset
    );
    p.text(
      String(mineSweeper.timer).padStart(3, "0"),
      canvasX - sqSize * 4,
      0,
      sqSize * 4,
      canvasPanelOffset
    );
  };

  p.draw = (): void => {
    //console.log(sqSize);
    p.background(153);
    displayPanel();
    for (let i = 0; i < mineSweeper.sqX; i++) {
      for (let k = 0; k < mineSweeper.sqY; k++) {
        //console.log(i,k);
        display(mineSweeper.mineBoxArray[i][k], mineSweeper.win);
      }
    }
    displayText();
    if (mineSweeper.gameOver || mineSweeper.win) {
      /**Stop timer */
      clearInterval(sketchTime);
      p.tint(255, 100);
      p.image(
        shipImg,
        0,
        canvasPanelOffset,
        Math.min(shipX, canvasX),
        Math.min(shipY, canvasY) + canvasPanelOffset
      );
      p.textAlign(p.CENTER, p.CENTER);
      p.textStyle(p.BOLD);
      p.textSize(50);
      p.fill(p.color("black"));
      p.rectMode(p.RADIUS);
      p.text(
        mineSweeper.gameOver ? "Game Over" : "You Win!",
        0,
        canvasPanelOffset,
        Math.min(shipX, canvasX),
        Math.min(shipY / 2, canvasY) + canvasPanelOffset
      );
      p.textSize(30);
      p.text(
        "Press 'r' to restart",
        0,
        canvasPanelOffset + shipY / 2,
        Math.min(shipX, canvasX),
        Math.min(shipY / 2, canvasY) + canvasPanelOffset
      );
    }
  };

  //Disable right click menu
  document.oncontextmenu = function (event): boolean {
    event.preventDefault();
    return false;
  };
};

new p5(sketch);
