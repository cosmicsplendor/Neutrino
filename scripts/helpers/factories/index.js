const groupMap = require("../../utils/groupMap.json")
const sawBlades = () => {
    return {
        fields: ['toX', 'toY', 'speed' ], // Based on SawBlade constructor
        create: (params) => {
            const { x, y, toX, toY } = params
            return {
                ...params,
                // these should come in relative grid space
                toX: x + Number.parseFloat(toX) * 48,
                toY: y + Number.parseFloat(toY) * 48
            }
        }
    }
}
const factories = Object.freeze({
    player: {
        fields: [], // No specific props inferred from the original code
        create: (params) => {
            // Perform transformation
            return params
        }
    },
    gate: {
        create: (params) => {
            // Perform transformation
            return params
        }
    },
    checkpoint: {
        create: (params) => {
            return params
        }
    },
    orb: {
        fields: [], // No specific props required
        create: (params) => {
            return params
        }
    },
    wind: {
        fields: [], // No specific props required
        create: (params) => {
            return params
        }
    },
    fire: {
        fields: [], // Based on player usage
        create: (params) => {
            // Perform transformation
            return params
        }
    },
    magnet: {
        fields: ['frame'], // Based on Magnet constructor
        create: (params) => {
            // Perform transformation
            return params
        }
    },
    ball: {
        fields: ['seq', ], // Inferred from Ball constructor and props.seq
        create: (params) => {
            // Perform transformation
            return params
        }
    },
    sb1: sawBlades(),
    sb2: sawBlades(),
    sb3: sawBlades(),
    sb4: sawBlades(),
    sb5: sawBlades(),
    sb6: sawBlades(),
    lcr1: {
        fields: ['luck', 'dmg', 'temp', ], // Based on Crate constructor
        create: (params) => {
            // Perform transformation
            return { ...params, groupId: "crates" }
        }
    },
    vlhd: {
        fields: ['toX', 'toY', 'speed', 'num', 'period', 'delay', 'on', ], // Inferred from Laser constructor
        create: (params) => {
            // Perform transformation
            return params
        }
    },
    hlhd: {
        fields: ['toX', 'toY', 'speed', 'num', 'period', 'delay', 'on', ], // Same as vlhd but different type
        create: (params) => {
            // Perform transformation
            return params
        }
    },
    bus: {
        fields: ['toX', 'toY', 'period'], // Based on Bus constructor
        create: (params) => {
            // Perform transformation
            return params
        }
    },
    magnet: {
        dims: (atlas) => {
            this.studWidth = atlas.stud.rotation === 90 ? atlas.stud.height: atlas.stud.width
            const { width, height, rotation } = atlas.magnet
            this.width =(rotation ? height: width)
            return {
                width:  this.width + this.studWidth * 2,
                height: rotation ? width: height
            }
        },
        create: (params) => {
            const { x, y } = params
            return [
                { name: "magnet", x: x + this.studWidth, y, groupId: "magnets" },
                { name: "stud", x, y },
                { name: "stud", x: x + this.width + this.studWidth, y }
            ]
        }
    },
    default: {
        fields: [],
        create: params => {
            const groupId = groupMap[params.name]
            if (groupId) params.groupId = groupId
            return params
        }
    }
}
)

module.exports = factories