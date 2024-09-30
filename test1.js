const calcComposite = entities => { // compute a rect that contains all the entities
  const composite = { ...entities[0] }
  for (let i = 1; i < entities.length; i++) {
    const ent = entities[i]
    const rEdgX = Math.max(composite.x + composite.w, ent.x + ent.w)
    const bEdgY = Math.max(composite.y + composite.h, ent.y + ent.h)

    composite.x = Math.min(composite.x, ent.x)
    composite.y = Math.min(composite.y, ent.y)
    composite.w = rEdgX - composite.x
    composite.h = bEdgY - composite.y
  }
  return composite
}

class TopPointer {
  record() {
  }
}
class BottomPointer {
  record() {

  }
}
class LeftPointer {
  record() {

  }
}
class BottomPointer {
  record() {
    
  }
}

const generateGrid = (rects) => {
  const compositeRect = calcComposite(rects)
  const _grid = Array(compositeRect.w * compositeRect.h).fill(0)
  rects.forEach(rect => {
    const x = rect.x - compositeRect.x
    const y = rect.y - compositeRect.y
    for (let i = x; i < x + rect.w; i++) {
      for (let j = y; j < y + rect.h; j++) {
        const index = compositeRect.w * j + i
        _grid[index] = 1
      }
    }
  })
  return Object.assign({
    get(i, j) {
      return _grid[compositeRect.w * j + i]
    }
  }, compositeRect)
}

const computeEdges = rects => {
  const grid = generateGrid(rects)
  for (let x = 0; x < grid.w; i++) {
    let ytop = 0, ybottom = grid.h - 1
    while (!grid.get(x, ytop)) {
      ytop++
    }
    while (!grid.get(x, ybottom)) {
      ybottom--
    }
    Pointer.recordTop(x, ytop)
    Pointer.recordBottom(x, ybottom)
  }
}

const rectangles = [
  { x: 0, y: 0, w: 2, h: 2 },
  { x: 2, y: 0, w: 2, h: 2 },
  { x: 1, y: 2, w: 2, h: 2 }
]

generateGrid(rectangles)