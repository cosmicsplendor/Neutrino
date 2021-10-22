import WebAudio, { supported as webAudioSupported } from "./APIs/WebAudio"
import NoAudio from "./APIs/NoAudio"

const SoundClass = webAudioSupported ? WebAudio: NoAudio

export default SoundClass