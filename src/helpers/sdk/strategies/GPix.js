export default class {
    setLoading(val) {
        GamePix.loading(val)
    }
    signalLoad() {
        GamePix.loaded()
    }
    setOnPause(fn) {
        GamePix.pause = fn()
    }
    setOnResume(fn) {
        GamePix.resume = fn()
    }
    playIntstAd() {
        return new Promise((resolve, reject) => {
            GamePix.interstitialAd().then(res => {
                if (res.success) {
                    resolve()
                }
                reject(res)
            }).catch(reject)
        })
    }
    playRva() {
        return new Promise((resolve, reject) => {
            GamePix.rewardAd().then(res => {
                if (res.success) {
                    resolve()
                }
                reject(res)
            }).catch(reject)
        })
    }
}