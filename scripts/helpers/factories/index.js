const groupMap = require("../../utils/groupMap.json")
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
        fields: ['player'], // Based on player usage
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
        fields: ['seq', 'player'], // Inferred from Ball constructor and props.seq
        create: (params) => {
            // Perform transformation
            return params
        }
    },
    sb1: {
        fields: ['toX', 'toY', 'speed', 'player'], // Based on SawBlade constructor
        create: (params) => {
            // Perform transformation
            return params
        }
    },
    sb2: {
        fields: ['toX', 'toY', 'speed', 'player'], // Same as sb1
        create: (params) => {
            // Perform transformation
            return params
        }
    },
    sb3: {
        fields: ['toX', 'toY', 'speed', 'player'], // Same as sb1
        create: (params) => {
            // Perform transformation
            return params
        }
    },
    sb4: {
        fields: ['toX', 'toY', 'speed', 'player'], // Same as sb1
        create: (params) => {
            // Perform transformation
            return params
        }
    },
    sb5: {
        fields: ['toX', 'toY', 'speed', 'player'], // Same as sb1
        create: (params) => {
            // Perform transformation
            return params
        }
    },
    sb6: {
        fields: ['toX', 'toY', 'speed', 'player'], // Same as sb1
        create: (params) => {
            // Perform transformation
            return params
        }
    },
    lcr1: {
        fields: ['luck', 'dmg', 'temp', 'player'], // Based on Crate constructor
        create: (params) => {
            // Perform transformation
            return { ...params, groupId: "crates" }
        }
    },
    vlhd: {
        fields: ['toX', 'toY', 'speed', 'num', 'period', 'delay', 'on', 'player'], // Inferred from Laser constructor
        create: (params) => {
            // Perform transformation
            return params
        }
    },
    hlhd: {
        fields: ['toX', 'toY', 'speed', 'num', 'period', 'delay', 'on', 'player'], // Same as vlhd but different type
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