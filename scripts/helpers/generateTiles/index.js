const execWFC = require("./helpers/execWFC");
const table = require("./adjacencyTable.js");
const createGrid = require("./helpers/createGrid")

const generateTiles = block => {
  const grid =  createGrid(block, Object.keys(table))
  return execWFC(table, grid)
}

module.exports = generateTiles