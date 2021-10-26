class SDK {
    constructor(strategy, onPause, onResume) {
        if (!strategy) return
        this.strat = strategy
        this.strat.onPause = onPause
        this.strat.onResume = onResume
    }
    setLoadProg(val) {
        if (!this.strat) return
        this.strat.setLoadProg(val)
    }
    signalLoad() {
        if (!this.strat) return
        this.strat.signalLoad()
    }
    playRva() {
        if (!this.strat) return Promise.reject()
        return this.strat.playRva()
    }
    playIntstAd() {
        if (!this.strat) return Promise.reject()
        return this.strat.playIntstAd()
    }
}

export default SDK