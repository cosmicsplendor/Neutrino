import WebAudio from "./strategies/WebAudio"
import HTML5Audio from "./strategies/HTML5Audio"

const webAudioSupported = !!AudioContext

const SoundClass = webAudioSupported ? WebAudio: HTML5Audio

export default SoundClass