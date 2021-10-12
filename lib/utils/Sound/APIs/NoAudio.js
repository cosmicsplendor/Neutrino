class NoSound {
    static loadResource = src => {
        return Promise.resolve(src)
    }
    pause() { }
    resume() { }
    play() { }
}

export default NoSound