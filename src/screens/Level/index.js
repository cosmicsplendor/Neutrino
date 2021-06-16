import { Camera, Node } from "@lib"
import Timer from "@utils/Timer"
import SoundSprite from "@utils/Sound/SoundSprite"

import config from "@config"
import Level1 from "./levels/Level1"
import Player from "@entities/Player"
import soundSpriteId from "@assets/audio/sprite.mp3"
import soundMetaId from "@assets/audio/sprite.cson"

class LevelScreen extends Camera {
    background = "white"
    initialized = false
    constructor({ game }) {
        super({ id: "root", viewport: config.viewport })
        const { assetsCache } = game
        this.game = game
        this.addTimer = Timer.attachedTo(this)
        assetsCache.on("load", () => {
            const meta = assetsCache.get(soundMetaId)
            const soundResource = assetsCache.get(soundSpriteId)
            const soundSprite = new SoundSprite({ resource: soundResource, resourceId: soundSpriteId, meta })

            this.soundSprite = soundSprite
            this.music = soundSprite.create("music", { volume: 1, pan: -1 })
            this.explosionSound = soundSprite.createPool("explosion") 
            // this.music.play()
            this.player = new Player({ width: 80, height: 80, fill: "brown", id: "player", speed: 100, pos: { x: 300 } })
            this.player.explosionSFX = this.explosionSound
            this.setSubject(this.player)
        })
    }
    setLevel(level) {
        if (this.children && this.children[0]) {
            Node.cleanupRecursively(this.children[0])
        }
        this.children = [ level ]
    }
    onEnter() { 
        this.setLevel(new Level1({ player: this.player, assetsCache: this.game.assetsCache }))
    }
    onExit() {
        Node.cleanupRecursively(this)
        this.children.length = 0
    }
}

export default LevelScreen