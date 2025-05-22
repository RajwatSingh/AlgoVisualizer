const grid          = document.getElementById("grid");
const setStartBtn   = document.getElementById("set-start");
const setEndBtn     = document.getElementById("set-end");
const setWallBtn    = document.getElementById("set-wall");
const clearBtn      = document.getElementById("clear");
const bfsButton     = document.getElementById("start-bfs");


let mode = "wall"; 
let startCell = null;
let endCell = null;

for (let i = 0; i < 20 * 20; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  cell.dataset.index = i;
  grid.appendChild(cell);
}

setStartBtn.onclick = () => (mode = "start");
setEndBtn.onclick = () => (mode = "end");
setWallBtn.onclick = () => (mode = "wall");
clearBtn.onclick = () => {
  document.querySelectorAll(".cell").forEach(cell => {
    cell.className = "cell";
  });
  startCell = endCell = null
  mode = "wall";
};

grid.addEventListener("click", (e) => {
  const cell = e.target;
  if (!cell.classList.contains("cell")) return;

  if (mode === "start") {
    if (startCell) startCell.classList.remove("start");
    cell.classList.remove("end", "wall");
    cell.classList.add("start");
    startCell = cell;
  } else if (mode === "end") {
    if (endCell) endCell.classList.remove("end");
    cell.classList.remove("start", "wall");
    cell.classList.add("end");
    endCell = cell;
  } else {
    if (cell.classList.contains("wall")) {
      cell.classList.remove("wall");
    } else if (!cell.classList.contains("start") && !cell.classList.contains("end")) {
      cell.classList.add("wall");
    }
  }
});

bfsButton.onclick = () => {
    console.log("BFS button clicked");
    if(!startCell || !endCell) {
        alert("Please set start and end points.");
        return;
    }
    else{
        runBfs(startCell, endCell);
    }
}
const runBfs = (start, end) => {
    const rows = 20;
    const cols = 20;
    const directions = [
        [-1, 0], // up
        [1, 0],  // down
        [0, -1], // left
        [0, 1]   // right
    ];
    const isValid = (x, y) => {
        return x >= 0 && x < rows && y >= 0 && y < cols;
    };

    const queue = [start];
    const visited = new Set();
    const parent = new Map();

    const startIndex    = parseInt(start.dataset.index);
    const endIndex      = parseInt(end.dataset.index);

    const getRowsCol = (cell) => {
        const index = parseInt(cell.dataset.index);
        return [Math.floor(index / cols), index % cols];
    }
    const getCellFromIndex = (index) => {
        
        return document.querySelector(`.cell[data-index="${index}"]`);
    }
    const getIndexFromRowsCol = (row, col) => {
        return row * cols + col;
    }

    const [r,c] = getRowsCol(start);
    let found = false;

    const interval = setInterval(() => {
        if(found || queue.length === 0) {
            clearInterval(interval);
            if (found) drawPath(parent, end);
            return;
        }

        const current = queue.shift();
        const currentIndex = parseInt(current.dataset.index);
        const [row, col] = getRowsCol(current);

        for(let direction of directions){
            const newRow = row + direction[0];
            const newCol = col + direction[1];
            if(isValid(newRow, newCol)){
                const newIndex = getIndexFromRowsCol(newRow, newCol);
                const newCell = getCellFromIndex(newIndex);
                if(!visited.has(newIndex) && !newCell.classList.contains("wall")){
                    visited.add(newIndex);
                    parent.set(newCell, current);

                    if (newCell === end) {  
                        clearInterval(interval); 
                        found = true;
                        drawPath(parent, endCell);        
                        return;
                      }

                      if (!newCell.classList.contains("start")) {
                        newCell.classList.add("visited");
                      }
                    queue.push(newCell);
                }
            }
        }
    }, 20);

    const dfsButton = document.getElementById("start-dfs");
    console.log("dfsButton is", dfsButton);

    dfsButton.onclick = () => {
        console.log("DFS button clicked");
        if (!startCell || !endCell) {
            alert("Please set start and end points.");
            return;
        }
        runDfs(startCell, endCell);
    };
    
    const runDfs = (start, end) => {
        const rows = 20;
        const cols = 20;
    
        const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1]
        ];
    
        const isValid = (r, c) => r >= 0 && r < rows && c >= 0 && c < cols;
    
        const stack = [start];
        const visited = new Set();
        const parent = new Map();
    
        const getRowsCol = (cell) => {
            const index = parseInt(cell.dataset.index);
            return [Math.floor(index / cols), index % cols];
        };
    
        const getIndexFromRowsCol = (row, col) => row * cols + col;
    
        const getCellFromIndex = (index) =>
            document.querySelector(`.cell[data-index="${index}"]`);
    
        let found = false;
    
        const interval = setInterval(() => {
            if (found || stack.length === 0) {
                clearInterval(interval);
                if (found) drawPath(parent, end);
                return;
            }
    
            const current = stack.pop();
            const [row, col] = getRowsCol(current);
            const currIndex = parseInt(current.dataset.index);
    
            if (!visited.has(currIndex)) {
                visited.add(currIndex);
    
                if (current !== start && current !== end) {
                    current.classList.add("visited");
                }
    
                if (current === end) {
                    found = true;
                    return;
                }
    
                for (const [dr, dc] of directions) {
                    const nr = row + dr;
                    const nc = col + dc;
    
                    if (isValid(nr, nc)) {
                        const neighborIndex = getIndexFromRowsCol(nr, nc);
                        const neighbor = getCellFromIndex(neighborIndex);
    
                        if (
                            !visited.has(neighborIndex) &&
                            !neighbor.classList.contains("wall")
                        ) {
                            stack.push(neighbor);
                            parent.set(neighbor, current);
                        }
                    }
                }
            }
        }, 100);
    };

function drawPath(parent, end) {
    let curr = end;
    while (parent.has(curr)) {
        curr = parent.get(curr);
        if (curr.classList.contains("start")) break;
        curr.classList.remove("visited");
        curr.classList.add("path");
    }
}
}