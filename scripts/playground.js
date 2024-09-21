const { CompositeBlock: CB, Map, Block: B} = require("./utils/index")
const map = new Map(60, 20, {
    bg: "#132b27",
    mob_bg: "#132b27",
    pxbg: "#0a1614",
    tint: "0.025, -0.025, -0.0125, 0",
})

CB.registerMap(map)
const leftBound = CB.create(1, 8)
    .add(new B(2, 3), "right-end")
    .stackOnto(map.floor, "top-start")
    .addToMap()
const b1 = CB.create(3, 3).stackOnto(leftBound, "right-end", 8).addToMap()
const b2 = CB.create(8, 3).add(new B(2, 2), "bottom-end").stackOnto(b1, "top-start").addToMap()

// map.spawnPoints.push({ name: "player", coords: calcStacked(leftBound, undefined, "right-start")})
map.printAsciiScaled()
// map.exportMap("testlevel")