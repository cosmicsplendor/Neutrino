export default class {
    constructor() {
        this.sdk = window.CrazyGames.CrazySDK.getInstance()
    }
    ads = false
    setLoading() {
    }
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
    gameplayStart() { this.sdk.gameplayStart() }
    gameplayStop() { this.sdk.gameplayStop() }
}