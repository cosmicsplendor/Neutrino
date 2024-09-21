const map = new World(60, 20, {
    bg: "#132b27",
    mob_bg: "#132b27",
    pxbg: "#0a1614",
    tint: "0.025, -0.025, -0.0125, 0",
})

const compositeBlock = initialBlock => new CompositeBlock(initialBlock)

const leftBound = compositeBlock(new Block(1, 8)).add(new Block(2, 3), "right-end").stack(map.floor, "top-start")
const b1 = compositeBlock(new Block(3, 3)).stack(leftBound, "right-end", 8)
const b2 = compositeBlock(new Block(8, 3)).add(new Block(2, 2), "bottom-end").stack(b1, "top-start")

map.addCompositeBlock(leftBound)
map.addBlock(b1)
map.addCompositeBlock(b2)
// map.spawnPoints.push({ name: "player", coords: calcStacked(leftBound, undefined, "right-start")})
map.printAsciiScaled()
// map.exportMap("testlevel")