export default class {
    constructor() {
        this.sdk = window.CrazyGames.CrazySDK.getInstance()
    }
    playing = false
    ads = false
    setLoading() { }
    signalLoad() {
        return Promise.resolve()
    }
    setOnPause() { }
    setOnResume() { }
    playIntstAd() {
        return Promise.resolve()
    }
    playRva() {
        return Promise.resolve()
    }
    gameplayStart() { 
        if (this.playing) return
        this.playing = true
        this.sdk.gameplayStart()
    }
    gameplayStop() { 
        if (!this.playing) return
        this.playing = false
        this.sdk.gameplayStop()
    }
}