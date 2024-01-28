let grid;
let cols;
let rows;
let pxWidth = 5;
let squareSize = 3;
let xSize = 800;
let ySize = 700;
let hueValue = 1;

function make2DArray(cols, rows){
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++){
    arr[i] = new Array(rows);
    for (let j = 0; j < arr[i].length; j++){
      arr[i][j] = 0;
    }
  }
  
  return arr;
}
function spawnSquareSandGrains(squareSideSize, x, y){
  let centerShift = floor(squareSideSize / 2);
  for (let i = 0; i < squareSideSize; i++){
    let xGrain = x - centerShift + i;
    for (let j = 0; j < squareSideSize; j++){
      let yGrain = y - centerShift + j;
      if (xGrain >= 0 && xGrain < cols && yGrain >= 0 && yGrain < rows){
        grid[xGrain][yGrain] = hueValue;
      }
    }
  }
}

function canFallDown(i, j, grid){
  let isBottonRow = j === (rows - 1);
    
  if (isBottonRow){
    return false;
  }

  let below = grid[i][j + 1];
  if (below > 0){
    return false;
  }
        
  return true;
}
function canTumbleSideways(direction, i, j, grid){
  let sideCol = i + 1 * direction;
  
  if (j + 1 >= rows){
    return false;
  }
  
  if (direction > 0 && sideCol < cols){
    return grid[i + 1][j] === 0 && grid[i + 1][j + 1] === 0;
  }
  
  if (direction < 0 && sideCol >= 0){
    return grid[i - 1][j] === 0 && grid[i -1][j + 1] === 0;
  }
  
  return false;
}

function fallDown(state, i, j, grid){
  grid[i][j] = 0;
  grid[i][j + 1] = state;
}
function tumbleSideways(state, direction, i, j, grid){
  if (canTumbleSideways(direction, i, j, grid)){
    grid[i][j] = 0;
    grid[i + 1 * direction][j] = state;
  }
}

function mouseDragged(){
  
  let col = floor(mouseX / pxWidth);
  let row = floor(mouseY / pxWidth);
  
  if (col >= 0 && col < cols 
      && row >= 0 && row < rows){
    spawnSquareSandGrains(squareSize, col, row);
  }
}
function setup() {
  createCanvas(xSize, ySize);
  colorMode(HSB, 360, 255, 255);
  
  cols = width / pxWidth;
  rows = height / pxWidth;
  grid = make2DArray(cols, rows);
}
function draw() {
  background(0);
  
  for (let i = 0; i < cols; i++){
    for (let j = 0; j < rows; j++){
      noStroke();
      let state = grid[i][j];
      if(state > 0){
       fill(state, 255, 255);
        let x = i * pxWidth;
        let y = j * pxWidth;
        square(x,y,pxWidth); 
      }
    }
  }
  
  let nextGrid = make2DArray(cols, rows);
  for (let i = 0; i < cols; i++){
    for (let j = 0; j < rows; j++){
      let state = grid[i][j];
      if (state > 1){
        
        if (canFallDown(i, j, grid)){
          fallDown(state, i, j, nextGrid);
          continue;
        }
        
        let direction = random(1) < 0.5 ? 1 : -1;
        
        if (canTumbleSideways(direction, i, j, grid)){
          tumbleSideways(state, direction, i, j, nextGrid);
        }
        else if (canTumbleSideways(-direction, i, j, grid)){
          tumbleSideways(state, -direction, i, j, nextGrid);
        }
        else{
          nextGrid[i][j] = state;
        }
      }
    }
  }
  
  grid = nextGrid;
  hueValue++;
  if (hueValue > 360){
    hueValue = 1;
  }
}
