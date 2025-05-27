// === DOM ELEMENTS ===
const grid = document.getElementById("grid");
const setStartBtn = document.getElementById("set-start");
const setEndBtn = document.getElementById("set-end");
const setWallBtn = document.getElementById("set-wall");
const clearBtn = document.getElementById("clear");
const bfsButton = document.getElementById("start-bfs");
const dfsButton = document.getElementById("start-dfs");
const dijkstraButton = document.getElementById("start-dijkstra");
const sandButton = document.getElementById("set-sand");
const swampButton = document.getElementById("set-swamp");

// === COSTS ===
const sandCost = 10;
const swampCost = 20;
const wallCost = Infinity;
const cellCost = 1;

// === STATE ===
let mode = "wall";
let startCell = null;
let endCell = null;

// === GRID SETUP ===
for (let i = 0; i < 20 * 20; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  cell.dataset.index = i;
  cell.dataset.cost = cellCost;
  grid.appendChild(cell);
}

// === MODE BUTTONS ===
setStartBtn.onclick = () => (mode = "start");
setEndBtn.onclick = () => (mode = "end");
setWallBtn.onclick = () => (mode = "wall");
sandButton.onclick = () => (mode = "sand");
swampButton.onclick = () => (mode = "swamp");

clearBtn.onclick = () => {
  document.querySelectorAll(".cell").forEach(cell => {
    cell.className = "cell";
    cell.dataset.cost = cellCost;
  });
  startCell = endCell = null;
  mode = "wall";
};

// === GRID INTERACTIONS ===
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
  } else if (mode === "wall") {
    cell.classList.remove("sand", "swamp", "start", "end");
    cell.classList.add("wall");
    cell.dataset.cost = wallCost;
  } else if (mode === "sand") {
    cell.classList.remove("wall", "swamp", "start", "end");
    cell.classList.add("sand");
    cell.dataset.cost = sandCost;
  } else if (mode === "swamp") {
    cell.classList.remove("wall", "sand", "start", "end");
    cell.classList.add("swamp");
    cell.dataset.cost = swampCost;
  }
});

// === HELPER FUNCTIONS ===
const rows = 20;
const cols = 20;
const directions = [ [-1, 0], [1, 0], [0, -1], [0, 1] ];
const isValid = (r, c) => r >= 0 && r < rows && c >= 0 && c < cols;
const getRowsCol = (cell) => {
  const index = parseInt(cell.dataset.index);
  return [Math.floor(index / cols), index % cols];
};
const getIndexFromRowsCol = (row, col) => row * cols + col;
const getCellFromIndex = (index) =>
  document.querySelector(`.cell[data-index="${index}"]`);

// === BFS ===
bfsButton.onclick = () => {
  if (!startCell || !endCell) return alert("Set start and end nodes.");
  runBfs(startCell, endCell);
};

function runBfs(start, end) {
  const queue = [start];
  const visited = new Set();
  const parent = new Map();

  const interval = setInterval(() => {
    if (queue.length === 0) return clearInterval(interval);
    const current = queue.shift();
    if (current === end) {
      clearInterval(interval);
      drawPath(parent, end);
      return;
    }

    const [row, col] = getRowsCol(current);
    for (const [dr, dc] of directions) {
      const nr = row + dr;
      const nc = col + dc;
      if (isValid(nr, nc)) {
        const neighbor = getCellFromIndex(getIndexFromRowsCol(nr, nc));
        if (!visited.has(neighbor) && !neighbor.classList.contains("wall")) {
          visited.add(neighbor);
          queue.push(neighbor);
          parent.set(neighbor, current);
          if (!neighbor.classList.contains("start") && !neighbor.classList.contains("end")) {
            neighbor.classList.add("visited");
          }
        }
      }
    }
  }, 20);
}

// === DFS ===
dfsButton.onclick = () => {
  if (!startCell || !endCell) return alert("Set start and end nodes.");
  runDfs(startCell, endCell);
};

function runDfs(start, end) {
  const stack = [start];
  const visited = new Set();
  const parent = new Map();

  const interval = setInterval(() => {
    if (stack.length === 0) return clearInterval(interval);
    const current = stack.pop();
    if (visited.has(current)) return;
    visited.add(current);

    if (current === end) {
      clearInterval(interval);
      drawPath(parent, end);
      return;
    }

    const [row, col] = getRowsCol(current);
    for (const [dr, dc] of directions) {
      const nr = row + dr;
      const nc = col + dc;
      if (isValid(nr, nc)) {
        const neighbor = getCellFromIndex(getIndexFromRowsCol(nr, nc));
        if (!visited.has(neighbor) && !neighbor.classList.contains("wall")) {
          stack.push(neighbor);
          parent.set(neighbor, current);
          if (!neighbor.classList.contains("start") && !neighbor.classList.contains("end")) {
            neighbor.classList.add("visited");
          }
        }
      }
    }
  }, 50);
}

// === Dijkstra ===
dijkstraButton.onclick = () => {
  if (!startCell || !endCell) return alert("Set start and end nodes.");
  runDijkstra(startCell, endCell);
};

function runDijkstra(start, end) {
  const pq = new MinHeap();
  const parent = new Map();
  const costSoFar = new Map();
  const visited = new Set();

  pq.insert(start, 0);
  costSoFar.set(start, 0);

  const interval = setInterval(() => {
    if (pq.isEmpty()) return clearInterval(interval);

    const { node: current, priority } = pq.extractMin();
    if (visited.has(current)) return;
    visited.add(current);

    if (current === end) {
      clearInterval(interval);
      drawPath(parent, end);
      return;
    }

    const [row, col] = getRowsCol(current);
    for (const [dr, dc] of directions) {
      const nr = row + dr;
      const nc = col + dc;
      if (isValid(nr, nc)) {
        const neighbor = getCellFromIndex(getIndexFromRowsCol(nr, nc));
        if (neighbor.classList.contains("wall")) continue;

        const moveCost = parseInt(neighbor.dataset.cost);
        const newCost = costSoFar.get(current) + moveCost;

        if (!costSoFar.has(neighbor) || newCost < costSoFar.get(neighbor)) {
          costSoFar.set(neighbor, newCost);
          pq.insert(neighbor, newCost);
          parent.set(neighbor, current);
          if (!neighbor.classList.contains("start") && !neighbor.classList.contains("end")) {
            neighbor.classList.add("visited");
          }
        }
      }
    }
  }, 30);
}

// === PATH DRAWING ===
function drawPath(parent, end) {
  let curr = end;
  while (parent.has(curr)) {
    curr = parent.get(curr);
    if (curr.classList.contains("start")) break;
    curr.classList.remove("visited");
    curr.classList.add("path");
  }
}

// === MIN HEAP ===
class MinHeap {
  constructor() {
    this.heap = [];
  }
  insert(node, priority) {
    this.heap.push({ node, priority });
    this._bubbleUp(this.heap.length - 1);
  }
  extractMin() {
    if (this.heap.length === 0) return null;
    const min = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._bubbleDown(0);
    }
    return min;
  }
  _bubbleUp(i) {
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (this.heap[i].priority >= this.heap[p].priority) break;
      [this.heap[i], this.heap[p]] = [this.heap[p], this.heap[i]];
      i = p;
    }
  }
  _bubbleDown(i) {
    const l = this.heap.length;
    while (true) {
      let left = 2 * i + 1;
      let right = 2 * i + 2;
      let smallest = i;
      if (left < l && this.heap[left].priority < this.heap[smallest].priority) smallest = left;
      if (right < l && this.heap[right].priority < this.heap[smallest].priority) smallest = right;
      if (smallest === i) break;
      [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
      i = smallest;
    }
  }
  isEmpty() {
    return this.heap.length === 0;
  }
}