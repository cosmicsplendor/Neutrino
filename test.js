const factories = require("./scripts/helpers/factories")
const endTiles = {
    fg: {
        x: 0, y: 0,
        tiles: [
            ["wt_7", "en11", "empty", "empty"],
            ["wt_5", "dml17", "empty", "empty"],
            ["wt_5", "win1", "dml17", "empty"],
            ["wt_14", "empty", "wt_8", "wt_3"],
            ["em3", "empty", "wt_8", "em3"],
        ]
    },
    mg: {
        x: 0, y: 4,
        tiles: [
            ["bw7", "bw1", "bw5", "bw1"],
            ["bw1", "bw1", "bw1", "bw1"]
            ["bw10", "bw1", "bw1", "bw6"]
            ["empty", "bw1", "bw10", "bw1"]
            ["empty", "bw1", "empty", "bw1"]
            ["bw10", "bw1", "bw1", "bw1"]
            ["empty", "bw1", "bw1", "bw10"]
        ]
    },
    colRects: [
        { x: 0, y: 0, width: 1, height: 3},
        { x: 0, y: 3, width: 4, height: 1}
    ]
}