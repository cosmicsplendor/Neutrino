const execWFC = require("./helpers/execWFC");
const table = require("./adjacencyTable.js");
const createGrid = require("./helpers/createGrid");
const sanitizeGrid = require("./helpers/sanitizeGrid");

const generateTiles = (map, block) => {
  const grid = createGrid(block, Object.keys(table))
  execWFC(table, grid)
  const doneTiles = []
  sanitizeGrid(grid).forEach((row, j) => {
    row.forEach((cell, i) => {
      const x = block.x + i
      const y = block.y + j
      if (cell === "empty") return
      map.setTile(x, y, cell, "fg")
      doneTiles.push({ x, y, cell })
    })
  })

  return function undo() {
    doneTiles.forEach(tile => {
      map.setTile(tile.x, tile.y, null)
    })
  }
}

module.exports = generateTiles