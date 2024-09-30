const computeEdges = rects => {
    const grid = generateGrid(rects);
    const compositeRect = calcComposite(rects);
    const width = compositeRect.w;
    const height = compositeRect.h;
    const edges = [];
    let x = 0;
    let y = -1;
    let dx = 1;
    let dy = 0;
  
    let currentEdge = [];
    let visited = new Set();
  
    while (true) {
      const index = y * width + x;
  
      // Check for visited cell
      if (visited.has(index)) {
        if (currentEdge.length > 0) {
          edges.push(currentEdge);
        }
        break; // Exit if we've looped back around
      }
      visited.add(index);
  
      if (index < 0 || index >= grid.length || grid[index] === 0) {
        if (currentEdge.length > 0) {
          edges.push(currentEdge);
        }
        currentEdge = [];
  
        // Crucial Change:  Detect when we're completely surrounded
        if (dx === 1 && x >= width-1 || dx === -1 && x <= 0 || dy === 1 && y >= height-1 || dy === -1 && y <=0) {
            break;
        }
        
        // Change direction only if we are not stuck
        if (dx === 1) {
          dx = 0;
          dy = 1;
        } else if (dx === 0 && dy === 1) {
          dx = -1;
          dy = 0;
        } else if (dx === -1 && dy === 0) {
          dx = 0;
          dy = -1;
        } else if (dx === 0 && dy === -1) {
          dx = 1;
          dy = 0;
        }
  
        x += dx;
        y += dy;
      } else {
        currentEdge.push({ x: x + compositeRect.x, y: y + compositeRect.y });
        x += dx;
        y += dy;
      }
    }
  
    return edges;
  };