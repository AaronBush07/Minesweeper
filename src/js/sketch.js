/*
Aaron Bush 
https://github.com/AaronBush07
2020
*/
"use strict"
import p5 from 'p5';
import '../css/style.scss';
import Game from './game.js';

let canvasPanelOffset = 50;
const canvasX = 500;
const canvasY = 800 + canvasPanelOffset;

const flagSrc = "./img/flag-svgrepo-com.svg";
const mineSrc = "./img/rg1024_sea_mine.svg";
const shipSrc = "./img/noaa-MmblG0TlcS0-unsplash.jpg"; //Photo by NOAA on Unsplash

let mineImg;
let shipImg;
let flagImg;

const debug = false;

const shipX = 640;
const shipY = 425;

const sqSize = 25;

const sketch = p => {
  window.p = p;
  const mineSweeper = new Game(p, canvasPanelOffset, sqSize);

  function display(mineBox, win=false) {
    //console.log(mineBox.x, mineBox.y);
    if (mineBox.isOpen == false) {
      p.fill(p.color("white"));
      if (debug == true) {
        if (mineBox.mine == true) {
          p.fill(p.color("papayawhip"));
        }
        else if (mineBox.minesAdj == 0) {
          p.fill(p.color("gainsboro"));
        }
      }
    }
    else if (mineBox.mine == true) {
      if (mineBox.flagged)
        p.fill(p.color("white"));
      else
        p.fill(p.color("red"));
    }
    else {
      if (mineBox.minesAdj == 0) {
        p.fill(p.color("aquamarine"));
      }
      else {
        p.fill(p.color("lightgreen"));
      }
    }

    p.rectMode(p.CORNER);
    p.square(mineBox.x, mineBox.y, sqSize);

    if (mineBox.isFlagged == true) {
      console.log("flagged");
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
      }
      else {
        p.image(flagImg, mineBox.x, mineBox.y, sqSize, sqSize);
      }

    } else if (mineBox.isFlagged == false && mineBox.mine == true) {
      if (mineBox.isOpen == true) {
        p.image(mineImg, mineBox.x, mineBox.y, sqSize, sqSize);
      }
      else if (win) {
        //auto flag when game is won.
        p.image(flagImg, mineBox.x, mineBox.y, sqSize, sqSize);
      }
    }
    p.rectMode(p.RADIUS);
    if (mineBox.minesAdj > 0 && mineBox.isOpen == true) {
      switch (mineBox.minesAdj) {
        case 1: p.fill(p.color("blue"));
          break;
        case 2: p.fill(p.color("red"));
          break;
        case 3: p.fill(p.color("green"));
          break;
        case 4: p.fill(p.color("gold"));
          break;
        case 5: p.fill(p.color("magenta"));
          break;
        case 6: p.fill(p.color("sienna"));
          break;
        case 7: p.fill(p.color("pink"));
          break;
        case 8: p.fill(p.color("black"));
          break;
        default: p.fill(0, 102, 153);
      }

      p.textAlign(p.CENTER, p.CENTER);
      p.textStyle(p.BOLD);
      p.textSize(20);
      p.text(String(mineBox.minesAdj), mineBox.x, mineBox.y, sqSize, sqSize);
    }
    p.strokeWeight(1);
  }

  p.preload = () => {
    flagImg = p.loadImage(flagSrc);
    mineImg = p.loadImage(mineSrc);
    shipImg = p.loadImage(shipSrc);
  }

  p.setup = () => {
    // put setup code here
    let cnv = p.createCanvas(canvasX, canvasY);
    //cnv.parent('sketch');
    mineSweeper.createGame();
    cnv.mousePressed();
    cnv.doubleClicked(p.dblClick);
    p.noLoop();
  }

  p.keyTyped = () => {
    if (p.key === 'r' || p.key === 'R') {
      console.log("Game reset");
      p.noTint();
      mineSweeper.createGame();
    }
    p.redraw();
  }

  p.dblClick = () => {
    console.log("doubleClicked");
    mouseLogic(x, y, 'CENTER');
  }

  /*Mouse pressed somewhere on canvas. Calculate the location based on mouse*/
  p.mousePressed = () => {
    let mButton;
    switch (p.mouseButton) {
      case p.LEFT: mButton = 'LEFT'; break;
      case p.RIGHT: mButton = 'RIGHT'; break;
      case p.CENTER: mButton = 'CENTER'; break;
    }
    mouseLogic(p.mouseX, p.mouseY, mButton);
  }

  p.mouseReleased = () => {
    let x = Math.floor(p.mouseX / sqSize);
    let y = Math.floor(p.mouseY / sqSize);
    //console.log("Mouse released at:", x, y);
  }

  function mouseLogic(mX, mY, mButton) {
    let x = Math.floor(mX / sqSize);
    let y = Math.floor((mY - canvasPanelOffset) / sqSize);
    //console.log(mouseX, mouseY, mouseY-canvasPanelOffset)
    if ((x >= 0 && x < mineSweeper.sqX) && (y >= 0 && y < mineSweeper.sqY)) {
      if (mineSweeper.gameOver == false && mineSweeper.win == false) {
        if (mButton == 'LEFT') {
          propagateClick(x, y);
        }
        else if (mButton == 'RIGHT') {
          //place flag
          mineSweeper.mineBoxArray[x][y].flag();
          if (mineSweeper.mineBoxArray[x][y].isFlagged) {
            mineSweeper.scanAdjacent(x, y, "flagAdd");
            if (mineSweeper.mineBoxArray[x][y].mine) {
              mineSweeper.reduceMinesLeft();
              mineSweeper.reduceOpenBoxes();
            }
          }
          else {
            mineSweeper.scanAdjacent(x, y, "flagRemove");
            if (mineSweeper.mineBoxArray[x][y].mine) {
              mineSweeper.incrementMinesLeft();
              mineSweeper.incrementOpenBoxes();
            }
          }
        }
        else if (mButton == 'CENTER') {
          //console.log("Middle button clicked", mineBoxArray[x][y].flagsAdj);
          if (mineSweeper.mineBoxArray[x][y].isFlagged == false) {
            propagateClick(x, y, true);
          }
        }

        mineSweeper.checkForGameOver();
        p.redraw();
      }
    }
  }

  /*
  Recursive function to look for open spaces when they are clicked. 
  */
  function propagateClick(x, y, middle = false) {
    const mBA = mineSweeper.mineBoxArray[x][y];
    if ((mBA.isOpen == false && mBA.isFlagged == false && middle == false) || (middle && mBA.isOpen)) {
      if (middle == false || middle == true && mBA.flagsAdj >= mBA.minesAdj) {
        mBA.clicked();
        if (middle == false) {
          mineSweeper.reduceOpenBoxes();
        }
        if (middle) {
          console.log(mBA, "middle registered");
        }

      }
      if ((mBA.minesAdj == 0 && mBA.mine == false && middle == false) ||
        (middle && mBA.flagsAdj >= mBA.minesAdj && mBA.isFlagged == false)) {
        for (let xMin = x - 1; xMin <= x + 1; xMin++) {
          if (xMin < 0 || xMin >= mineSweeper.sqX) continue
          for (let yMin = y - 1; yMin <= y + 1; yMin++) {
            if (yMin < 0 || yMin >= mineSweeper.sqY) continue
            if (xMin == x && yMin == y) continue
            propagateClick(xMin, yMin, false);
          }
        }

      }
      else if (mBA.mine) {
        mineSweeper.explode();
      }
    }
    //console.log(minesLeft, openBoxes);
  }

  function displayPanel() {
    p.strokeWeight(2);
    p.fill(p.color("white"));
    p.rect(0, 0, canvasX, canvasPanelOffset);
  }

  p.draw = () => {
    //console.log(sqSize);
    p.background(153);
    displayPanel();
    for (let i = 0; i < mineSweeper.sqX; i++) {
      for (let k = 0; k < mineSweeper.sqY; k++) {
        //console.log(i,k);
        display(mineSweeper.mineBoxArray[i][k], mineSweeper.win);
      }
    }
    if (mineSweeper.gameOver) {
      p.tint(255, 100);
      p.image(shipImg, 0, canvasPanelOffset, Math.min(shipX, canvasX), Math.min(shipY, canvasY) + canvasPanelOffset);
      p.textAlign(p.CENTER, p.CENTER);
      p.textStyle(p.BOLD);
      p.textSize(50);
      p.fill(p.color("black"));
      p.rectMode(p.RADIUS);
      p.text("Game Over", 0, canvasPanelOffset, Math.min(shipX, canvasX), Math.min(shipY, canvasY) + canvasPanelOffset);
    } else if (mineSweeper.win) {
      p.tint(255, 100);
      p.image(shipImg, 0, canvasPanelOffset, Math.min(shipX, canvasX), Math.min(shipY, canvasY) + canvasPanelOffset);
      p.textAlign(p.CENTER, p.CENTER);
      p.textStyle(p.BOLD);
      p.textSize(50);
      p.fill(p.color("black"));
      p.rectMode(p.RADIUS);
      p.text("You Win", 0, canvasPanelOffset, Math.min(shipX, canvasX), Math.min(shipY, canvasY) + canvasPanelOffset);
    }
  }

  //Disable right click menu
  document.oncontextmenu = function (event) {
    event.preventDefault();
    return false;
  }

};

new p5(sketch);



