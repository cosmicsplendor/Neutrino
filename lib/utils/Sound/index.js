import WebAudioAdapter from "./adapters/WebAudio"
import AudioAdapter from "./adapters/Audio"

const webAudioSupported = !!AudioContext

const SoundClass = webAudioSupported ? WebAudioAdapter: AudioAdapter

export default SoundClass