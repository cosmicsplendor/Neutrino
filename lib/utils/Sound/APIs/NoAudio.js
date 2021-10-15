class NoSound {
    static loadResource = src => {
        return Promise.resolve(src)
    }
    static destroy() { }
    pause() { }
    resume() { }
    play() { }
}

export default NoSound