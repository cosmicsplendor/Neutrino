const execWFC = require("./helpers/execWFC");
const table = require("./adjacencyTable.js");
const createGrid = require("./helpers/createGrid");
const sanitizeGrid = require("./helpers/sanitizeGrid");

const generateTiles = (map, block) => {
  console.log(block)
  const grid = createGrid(block, Object.keys(table))
  execWFC(table, grid)
  sanitizeGrid(grid).forEach((row, j) => {
    row.forEach((cell, i) => {
      map.setTile(block.x + i, block.y + j, cell, "fg")
    })
  })

  return function undo() {
    // just undo the block tiles generation
  }
}

module.exports = generateTiles