import Crate from "@entities/Crate"

import imgId from "@assets/images/texatlas.png"
import metaId from "@assets/images/atlasmeta.cson"

export default (x, y) => {
    return new Crate({
        imgId,
        metaId,
        frame: "crate",
        pos: { x, y }
    })
}