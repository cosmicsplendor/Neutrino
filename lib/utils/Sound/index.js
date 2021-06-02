import WebAudio from "./APIs/WebAudio"
import HTML5Audio from "./APIs/HTML5Audio"

const webAudioSupported = !!AudioContext

const SoundClass = webAudioSupported ? WebAudio: HTML5Audio

export default SoundClass