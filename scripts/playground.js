const { CompositeBlock: CB, World, Block: B} = require("./utils/index")
const map = new World(60, 20, {
    bg: "#132b27",
    mob_bg: "#132b27",
    pxbg: "#0a1614",
    tint: "0.025, -0.025, -0.0125, 0",
})

CB.create(1, 8)
CB.registerMap(map)
const leftBound = CB.create(1, 8)
    .add(new Block(2, 3), "right-end")
    .stackOnto(map.floor, "top-start")
    .addToMap()
const b1 = CB.create(3, 3).stackOnto(leftBound, "right-end", 8)
const b2 = CB.create(8, 3).add(new Block(2, 2), "bottom-end").stackOnto(b1, "top-start")

map.addCompositeBlock(leftBound)
map.addBlock(b1)
map.addCompositeBlock(b2)
// map.spawnPoints.push({ name: "player", coords: calcStacked(leftBound, undefined, "right-start")})
map.printAsciiScaled()
// map.exportMap("testlevel")