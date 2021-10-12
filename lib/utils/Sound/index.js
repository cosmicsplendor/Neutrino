import WebAudio from "./APIs/WebAudio"
import NoAudio from "./APIs/NoAudio"

const webAudioSupported =  !!AudioContext

const SoundClass = webAudioSupported ? WebAudio: NoAudio

export default SoundClass