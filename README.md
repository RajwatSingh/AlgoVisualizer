# 🔍 Search Algorithm Visualizer

A dynamic, interactive pathfinding visualizer built with HTML, CSS, and JavaScript. This project demonstrates how various graph traversal algorithms work (BFS, DFS, Dijkstra) on a grid-based maze, with support for weighted terrain like **sand** and **swamp**.

---

## 📦 Features

- ✅ Grid-based pathfinding with real-time animation
- ✅ Interactive UI: click to place start, end, walls, sand, and swamp
- ✅ Implements:
  - Breadth-First Search (BFS)
  - Depth-First Search (DFS)
  - Dijkstra’s Algorithm (supports weighted tiles)
- ✅ Visual feedback:
  - Visited nodes (`blue`)
  - Final path (`yellow`)
  - Obstacles and weighted terrain (sand, swamp)

---

## 📁 Project Structure
├── index.html        # Main HTML UI
├── style.css         # Styling (grid, colors, buttons)
├── script.js         # Grid logic, algorithms, interactions
├── README.md         # Documentation (you’re here)

---

## 🚀 How to Run

1. Clone or download this repo.
2. Open `index.html` in a browser (no server needed).
3. Start building your path:
   - Click **Set Start** and click a cell.
   - Click **Set End** and click another cell.
   - Draw **walls**, **sand**, or **swamp** by toggling tools and clicking on the grid.
4. Click one of the algorithms to visualize the path.

---

## 🧠 How It Works

### Algorithms

| Algorithm | Uses        | Guarantees Shortest Path | Handles Weights | Visualization Type      |
|----------|-------------|---------------------------|------------------|--------------------------|
| BFS      | Queue (FIFO)| ✅ Yes (in unweighted grid) | ❌ No           | Expands outward evenly   |
| DFS      | Stack (LIFO)| ❌ No                      | ❌ No           | Goes deep then backtracks|
| Dijkstra | Min Heap    | ✅ Yes                     | ✅ Yes          | Favors cheaper terrain   |

### Tile Types

| Type      | Class     | Cost     |
|-----------|-----------|----------|
| Empty     | `.cell`   | 1        |
| Wall      | `.wall`   | ∞ (blocked) |
| Sand      | `.sand`   | 10       |
| Swamp     | `.swamp`  | 20       |
| Start     | `.start`  | 0        |
| End       | `.end`    | 0        |

### Path Colors

- `.visited`: blue cells explored during search
- `.path`: final path (yellow)

---

## 🎨 Customize

You can easily extend this by:

- Adding diagonal movement support
- Tuning animation speed (`setInterval` delays)
- Adding more terrain types with custom costs
- Adding A* Search Algorithm
- Making the grid resizable

---

## 🧪 Known Limitations

- No drag-to-paint support yet (clicking only)
- Walls overwrite any terrain without confirmation
- Pathfinding stops when the shortest path is found (no exploration beyond that)

---

## 💡 Inspiration

Inspired by popular visualizers like:

- [Pathfinding Visualizer by Clement Mihailescu](https://github.com/clementmihailescu/Pathfinding-Visualizer)
- Grid-based search teaching tools

---

## 🤝 Contributing

Pull requests and improvements are welcome! Ideas include:

- Adding diagonal movement
- Maze generators
- Export grid as image or JSON

Enjoy visualizing graphs! 🧠📊