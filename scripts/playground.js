const { CompositeBlock: CB, Map, Block: B} = require("./utils/index")

const map = new Map(60, 20, {
    bg: "#132b27",
    mob_bg: "#132b27",
    pxbg: "#0a1614",
    tint: "0.025, -0.025, -0.0125, 0",
    floorHeight: 2
})
const _ = undefined
const leftBound = CB.create(1, 8)
    .add(B.new(2, 3), "right-end")
    .stackOnto(map.floor, "top-start")
    .addToMap()

const b1 = CB.create(3, 3).stackOnto(leftBound, "right-end", 8).addToMap()

const b3 = CB.create(9, 2)
    .add(B.new(4, 3), "top", p => p)
    .add(B.new(4, 4), "bottom-end", p => p)
    .stackOnto(b1, "right-end", 2, 0).addToMap()

// map.spawnPoints.push({ name: "player", coords: calcStacked(leftBound, undefined, "right-start")})
// map.printAsciiScaled()
map.printAscii()
// map.exportMap("testlevel")